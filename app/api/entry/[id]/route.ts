import { NextResponse } from 'next/server';
import { getUserFromClerkID } from '@/utils/auth';
import { prisma } from '@/utils/db';

interface Params {
  id: string;
}

export const DELETE = async (
  request: Request,
  { params }: { params: Promise<Params> },
): Promise<NextResponse> => {
  const user = await getUserFromClerkID();
  if (!user)
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  await prisma.entry.delete({
    where: {
      userId_id: {
        id: (await params).id,
        userId: user.id,
      },
    },
  });

  return NextResponse.json({ data: { id: (await params).id } });
};
