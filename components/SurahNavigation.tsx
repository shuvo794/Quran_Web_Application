import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
  currentId: number;
}

export default function SurahNavigation({ currentId }: Props) {
  const prevId = currentId > 1 ? currentId - 1 : null;
  const nextId = currentId < 114 ? currentId + 1 : null;

  return (
    <div className="flex justify-center mt-16 mb-8">
      <div className="flex bg-gray-100 dark:bg-[#1F1F1F] rounded-full p-1 border border-[var(--border)] overflow-hidden">
        {prevId ? (
          <Link 
            href={`/surah/${prevId}`}
            className="flex items-center gap-2 px-6 py-2.5 rounded-full hover:bg-white dark:hover:bg-[#2A2A2A] text-gray-500 dark:text-gray-400 hover:text-brand-500 transition-all font-semibold"
          >
            <ChevronLeft size={20} />
            Previous
          </Link>
        ) : (
          <div className="flex items-center gap-2 px-6 py-2.5 text-gray-300 dark:text-gray-600 cursor-not-allowed font-semibold">
            <ChevronLeft size={20} />
            Previous
          </div>
        )}
        
        <div className="w-px bg-[var(--border)] my-2"></div>

        {nextId ? (
          <Link 
            href={`/surah/${nextId}`}
            className="flex items-center gap-2 px-6 py-2.5 rounded-full hover:bg-white dark:hover:bg-[#2A2A2A] text-gray-500 dark:text-gray-400 hover:text-brand-500 transition-all font-semibold"
          >
            Next
            <ChevronRight size={20} />
          </Link>
        ) : (
          <div className="flex items-center gap-2 px-6 py-2.5 text-gray-300 dark:text-gray-600 cursor-not-allowed font-semibold">
            Next
            <ChevronRight size={20} />
          </div>
        )}
      </div>
    </div>
  );
}
