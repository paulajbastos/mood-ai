import { TEntryProps } from '@/types/prisma';

const EntryCard = ({ entry }: TEntryProps) => {
  const date = new Date(entry.createdAt).toDateString();
  return (
    <div className="divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow">
      <div className="px-4 py-5 sm:px-6">{date}</div>
      <div className="flex px-4 py-4 sm:px-6 items-center gap-2">
        <div
          style={{ background: entry.analysis?.color }}
          className="w-[16px] h-[16px] rounded-full"
        ></div>
        {entry.analysis?.type}
      </div>
      <div className="px-4 py-5 sm:p-6">{entry.analysis?.summary}</div>
    </div>
  );
};

export default EntryCard;
