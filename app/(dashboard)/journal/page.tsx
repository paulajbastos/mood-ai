// import EntryCard from '@/components/EntryCard';
// import NewEntry from '@/components/NewEntry';
// import Question from '@/components/Question';
// import { qa } from '@/util/ai';
import EntryCard from '@/components/EntryCard';
import NewEntry from '@/components/NewEntry';
import { analyze } from '@/utils/ai';
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

  console.log(
    await analyze(
      `Today was a really good day. I finally was able to grab that pair of shoes I have been' dying to get`
    )
  );

  // await analyze(
  //   `I'm going to give you an journal entry and I want you to analyze for a few things: i want the mood, the summary, what the subject is, and a color representing the mood. You need to respond back with a formatted JSON list like so: { "mood": "", "summary": "", "subject": "", "color": "", "negative": ""}.

  //   Entry:
  //   Today was a really good day. I finally was able to grab that pair of shoes I have been' dying to get`
  // );
  return data;
};

const JournalPage = async () => {
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
