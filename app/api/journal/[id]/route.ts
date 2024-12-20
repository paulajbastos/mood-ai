import { NextResponse } from 'next/server';

import { analyze } from '@/utils/ai';
import { getUserFromClerkID } from '@/utils/auth';
import { prisma } from '@/utils/db';

interface Params {
  id: string;
}

export const DELETE = async (
  request: Request,
  { params }: { params: Params },
) => {
  const user = await getUserFromClerkID();
  if (!user) return;
  await prisma.journalEntry.delete({
    where: {
      userId_id: {
        id: params.id,
        userId: user.id,
      },
    },
  });

  return NextResponse.json({ data: { id: params.id } });
};

// PATCH is similar to PUT, but the request contains only the data to be updated, not the complete resource.
export const PATCH = async (
  request: Request,
  { params }: { params: Params },
) => {
  const { updates } = await request.json();
  const user = await getUserFromClerkID();
  if (!user) return;

  const entry = await prisma.journalEntry.update({
    where: {
      userId_id: {
        id: params.id,
        userId: user?.id,
      },
    },
    data: updates,
  });

  if (!entry) return null;

  const analysis = await analyze(entry.content);

  const savedAnalysis = await prisma.entryAnalysis.upsert({
    where: {
      entryId: entry.id,
    },
    update: { ...analysis },
    create: {
      entryId: entry.id,
      userId: user.id,
      mood: analysis?.mood || '',
      subject: analysis?.subject || '',
      negative: analysis?.negative || false,
      summary: analysis?.summary || '',
      color: analysis?.color || '',
      sentimentScore: analysis?.sentimentScore || 0,
    },
  });

  return NextResponse.json({ data: { ...entry, analysis: savedAnalysis } });
};
