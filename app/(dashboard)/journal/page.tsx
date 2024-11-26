// import EntryCard from '@/components/EntryCard';
// import NewEntry from '@/components/NewEntry';
// import Question from '@/components/Question';
// import { qa } from '@/util/ai';
import { JSX } from 'react';
import EntryCard from '@/components/EntryCard';
import NewEntry from '@/components/NewEntry';
import { getUserFromClerkID } from '@/utils/auth';
import { prisma } from '@/utils/db';
import Link from 'next/link';

const getEntries = async () => {
  const user = await getUserFromClerkID();
  const data = await prisma.journalEntry.findMany({
    where: {
      userId: user?.id,
    },
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      analysis: true,
    },
  });
  return data;
};

const JournalPage = async (): Promise<JSX.Element | null> => {
  // const JournalPage = async () => {
  const entries = await getEntries();
  // console.log('entries', entries);

  return (
    <div className="px-6 py-8 bg-zinc-100/50 h-full">
      <h1 className="text-4xl mb-12">Journals</h1>
      <div className="my-8">{/* <Question /> */}</div>
      <div className="grid grid-cols-3 gap-4">
        <NewEntry />
        {entries.map((entry) => (
          <div key={entry.id}>
            <Link href={`/journal/${entry.id}`}>
              <EntryCard entry={entry} />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JournalPage;
