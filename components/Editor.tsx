'use client';
import { updateEntry } from '@/utils/api';
import { useState } from 'react';
import Spinner from './Spinner';
import { useRouter } from 'next/navigation';
import { Prisma } from '@prisma/client';
import { prisma } from '@/utils/db';

type PostCreateBody = Prisma.Args<
  (typeof prisma.journalEntry)[],
  'update'
>['data'];

const Editor = ({ entry }: PostCreateBody) => {
  const [text, setText] = useState(entry.content);
  const [currentEntry, setEntry] = useState(entry);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  const saveDataToServer = async () => {
    console.log(`Saving: ${text}`);
    setIsSaving(true);
    const { data } = await updateEntry(entry.id, { content: text });
    setEntry(data);
    setIsSaving(false);
    console.log(`Saved: ${text}`);
  };

  return (
    <div className="w-full h-full grid grid-cols-3 gap-0 relative">
      <div className="absolute left-0 top-0 p-2">
        {isSaving ? (
          <Spinner />
        ) : (
          <div className="w-[16px] h-[16px] rounded-full bg-green-500"></div>
        )}
      </div>
      <div className="col-span-2">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full text-xl p-8"
        />
        <div
          className="cursor-pointer overflow-hidden rounded-lg bg-white shadow"
          onClick={saveDataToServer}
        >
          <div className="px-4 py-5 sm:p-6">
            <span className="text-3xl">Save</span>
          </div>
        </div>
      </div>
      {/* <div className="border-l border-black/5">
        <div
          style={{ background: currentEntry.analysis.color }}
          className="h-[100px] bg-blue-600 text-white p-8"
        >
          <h2 className="text-2xl bg-white/25 text-black">Analysis</h2>
        </div>
      </div> */}
    </div>
  );
};

export default Editor;
