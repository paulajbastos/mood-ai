import { getUserFromClerkID } from '@/utils/auth';
import { prisma } from '@/utils/db';

import Editor from '@/components/Editor';

const getEntry = async (id: string) => {
  const user = await getUserFromClerkID();
  if (!user) return;

  const entry = await prisma.journalEntry.findUnique({
    where: {
      userId_id: {
        userId: user.id,
        id,
      },
    },
    include: {
      analysis: true,
    },
  });

  return entry;
};

interface Params {
  id: string;
}

const JournalEditorPage = async ({ params }: { params: Promise<Params> }) => {
  const resolvedParams = await params; // Await the promise
  const entry = await getEntry(resolvedParams.id);

  return (
    <div className="w-full h-full">
      <Editor entry={entry} />
    </div>
  );
};

export default JournalEditorPage;
