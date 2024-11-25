import { getUserFromClerkID } from '@/utils/auth';
import { prisma } from '@/utils/db';
import { NextResponse } from 'next/server';

interface Params {
  id: string;
}
// PATCH is similar to PUT, but the request contains only the data to be updated, not the complete resource.
export const PATCH = async (
  request: Request,
  { params }: { params: Params }
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

  // const analysis = await analyzeEntry(entry);
  // const savedAnalysis = await prisma.entryAnalysis.upsert({
  //   where: {
  //     entryId: entry.id,
  //   },
  //   update: { ...analysis },
  //   create: {
  //     entryId: entry?.id,
  //     userId: user?.id,
  //     ...analysis,
  //   },
  // });

  // update(['/journal']);

  return NextResponse.json({ data: { ...entry } });
  //, analysis: savedAnalysis
};