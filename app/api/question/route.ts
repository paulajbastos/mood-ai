import { NextResponse } from 'next/server';

import { qa } from '@/utils/ai';
import { getUserFromClerkID } from '@/utils/auth';
import { prisma } from '@/utils/db';

export const POST = async (request: Request) => {
  const { question } = await request.json();
  const user = await getUserFromClerkID();
  if (!user) return;

  const entries = await prisma.journalEntry.findMany({
    where: {
      userId: user.id,
    },
    select: {
      content: true,
      createdAt: true,
    },
  });

  const answer = await qa(question, entries);
  return NextResponse.json({ data: answer });
};
