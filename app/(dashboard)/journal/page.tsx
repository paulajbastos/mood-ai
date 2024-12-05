import Link from 'next/link';

import { getUserFromClerkID } from '@/utils/auth';
import { prisma } from '@/utils/db';

import EntryCard from '@/components/EntryCard';
import NewEntry from '@/components/NewEntry';
import Question from '@/components/Question';

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

const JournalPage = async () => {
  const entries = await getEntries();

  return (
    <div className="px-6 py-8 bg-zinc-100/50">
      <h1 className="text-4xl mb-12">Post-its</h1>
      <div className="my-8">
        <Question />
      </div>
      <div className="mb-[20px]">
        <NewEntry />
      </div>
      <div className="">
        {entries.map((entry) => (
          <div key={entry.id} className="mb-[20px]">
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
