import Editor from '@/components/Editor';
import { getUserFromClerkID } from '@/utils/auth';
import { prisma } from '@/utils/db';

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

const JournalEditorPage = async ({ params }: { params: Params }) => {
  const entry = await getEntry(params.id);

  console.log('entry', entry);

  return (
    <div className="w-full h-full">
      {params.id}
      <Editor entry={entry} />
    </div>
  );
};

export default JournalEditorPage;
