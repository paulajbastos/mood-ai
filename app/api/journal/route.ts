// import { update } from '@/utils/actions';
// import { analyze } from '@/utils/ai';
import { getUserFromClerkID } from '@/utils/auth';
import { prisma } from '@/utils/db';
import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';

// export const POST = async (request: Request) => {
export const POST = async () => {
  // const data = await request.json();
  const user = await getUserFromClerkID();

  console.log('user', user);

  if (!user) return;

  const entry = await prisma.journalEntry.create({
    data: {
      // content: data.content,
      userId: user.id,
      content: 'Write your content here',
      // user: {
      //   connect: {
      //     id: user?.id,
      //   },
      // },
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

  // update(['/journal']);
  revalidatePath('/journal');

  return NextResponse.json({ data: entry });
};
