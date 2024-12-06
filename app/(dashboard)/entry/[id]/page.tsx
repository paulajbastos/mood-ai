import { getUserFromClerkID } from '@/utils/auth';
import { prisma } from '@/utils/db';

import Preview from '@/components/Preview';

const getEntry = async (id: string) => {
  const user = await getUserFromClerkID();
  if (!user) return;

  const entry = await prisma.entry.findUnique({
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

const EntryEditorPage = async ({ params }: { params: Promise<Params> }) => {
  const resolvedParams = await params; // Await the promise
  const entry = await getEntry(resolvedParams.id);

  return (
    <div className="w-full h-full">
      <Preview entry={entry} />
    </div>
  );
};

export default EntryEditorPage;
