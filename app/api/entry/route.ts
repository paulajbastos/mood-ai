import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';

import { getUserFromClerkID } from '@/utils/auth';
import { prisma } from '@/utils/db';

export const POST = async () => {
  const user = await getUserFromClerkID();

  if (!user) return;

  const entry = await prisma.entry.create({
    data: {
      userId: user.id,
      content: 'Write your content here',
      analysis: {
        create: {
          mood: 'Neutral',
          subject: 'None',
          negative: false,
          summary: 'None',
          sentimentScore: 0,
          color: '#0101fe',
          userId: user.id,
        },
      },
    },
  });

  revalidatePath('/entry');

  return NextResponse.json({ data: entry });
};
