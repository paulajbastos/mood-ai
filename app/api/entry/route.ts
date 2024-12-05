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
          type: 'Typescript',
          projectName: 'WorkAndCo',
          subject: 'None',
          summary: 'None',
          color: '#0101fe',
          userId: user.id,
        },
      },
    },
  });

  revalidatePath('/entry');

  return NextResponse.json({ data: entry });
};
