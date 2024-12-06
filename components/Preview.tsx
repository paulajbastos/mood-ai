'use client';

import { useRef } from 'react';
import { useRouter } from 'next/navigation';
import MDEditor from '@uiw/react-md-editor';

import { deleteEntry, unescapeMarkdown } from '@/utils/api';

import { TEntryAnalysisProps, TEntryProps } from '@/types/prisma';

const Preview = ({ entry }: TEntryProps) => {
  const ref = useRef<string>(unescapeMarkdown(entry.content));
  const currentEntry = useRef<TEntryAnalysisProps>(entry);
  const router = useRouter();

  const handleDelete = async () => {
    await deleteEntry(entry.id);
    router.push('/entry');
  };

  return (
    <div className="w-full h-full flex-gap-0 relative">
      <div className="col-span-4 ">
        <div className="">
          <ul role="list" className="divide-y divide-gray-200">
            <li className="py-4 px-8 flex items-center justify-between">
              <div className="text-xl font-semibold">Project</div>
              <div className="text-xl">
                {currentEntry.current.analysis?.projectName}
              </div>
            </li>
            <li className="py-4 px-8 flex items-center justify-between">
              <div className="text-xl font-semibold">Type</div>
              <div className="flex text-xl items-center gap-2">
                <div
                  style={{ background: currentEntry.current.analysis?.color }}
                  className="w-[16px] h-[16px] rounded-full"
                ></div>
                {currentEntry.current.analysis?.type}
              </div>
            </li>
            <li className="py-4 px-8 flex items-center justify-between">
              <div className="text-xl font-semibold w-1/3">Subject</div>
              <div className="text-xl">
                {currentEntry.current.analysis?.subject}
              </div>
            </li>
            <li className="py-4 px-8 flex items-center justify-between">
              <button
                onClick={handleDelete}
                type="button"
                className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
              >
                Delete
              </button>
            </li>

            <li className="py-4 px-8 flex items-center justify-between">
              <button
                onClick={() => router.push(`/entry/edit/${entry.id}`)}
                type="button"
                className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
              >
                Edit
              </button>
            </li>
          </ul>
        </div>

        <MDEditor.Markdown
          source={ref.current}
          style={{ whiteSpace: 'pre-wrap' }}
        />
      </div>
    </div>
  );
};

export default Preview;
