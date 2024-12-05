import { Prisma } from '@prisma/client';

import { prisma } from '@/utils/db';

export type TEntryProps = Prisma.Args<
  (typeof prisma.entry)[],
  'update' | 'delete' | 'findMany'
>['data'];

export type TEntryAnalysisProps = Prisma.Args<
  (typeof prisma.entryAnalysis)[],
  'update' | 'delete' | 'findMany'
>['data'];
