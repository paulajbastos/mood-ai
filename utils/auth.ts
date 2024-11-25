// import type { User } from '@clerk/nextjs/api';
import { prisma } from './db';
import { currentUser } from '@clerk/nextjs/server';

export const getUserFromClerkID = async (select = { id: true }) => {
  const user = await currentUser();

  await await prisma.user.findUniqueOrThrow({
    where: {
      clerkId: user?.id,
    },
    select,
  });

  //   const user = await currentUser();

  // const user = await prisma.user.findUniqueOrThrow({
  //   where: {
  //     clerkId: userId as string,
  //   },
  //   select,
  // });

  return user;
};
