import { Prisma } from '@prisma/client';

import { prisma } from '@/utils/db';

export type TJournalEntryProps = Prisma.Args<
  (typeof prisma.journalEntry)[],
  'update' | 'delete' | 'findMany'
>['data'];
