'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Surah } from '@/lib/api';
import { Search } from 'lucide-react';
import { useState } from 'react';

interface Props {
  surahs: Surah[];
  isOpen: boolean;
  onClose: () => void;
}

export default function SurahListSidebar({ surahs, isOpen, onClose }: Props) {
  const pathname = usePathname();
  const [search, setSearch] = useState('');

  const filteredSurahs = surahs.filter(s => 
    s.nameEnglish.toLowerCase().includes(search.toLowerCase()) || 
    s.nameTranslation.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar Container */}
      <div className={`
        fixed lg:static top-0 left-0 h-screen w-[320px] bg-[var(--surface)] border-r border-[var(--border)]
        transform transition-transform duration-300 z-50 flex flex-col shrink-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-4 border-b border-[var(--border)] shrink-0 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 bg-gray-100 dark:bg-[#2A2A2A] p-1 rounded-lg w-full">
              <button className="flex-1 py-1.5 px-3 rounded-md bg-white dark:bg-[#3A3A3A] shadow-sm text-sm font-semibold text-center">Surah</button>
              <button className="flex-1 py-1.5 px-3 rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-sm font-medium text-center">Juz</button>
              <button className="flex-1 py-1.5 px-3 rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-sm font-medium text-center">Page</button>
            </div>
            <button className="lg:hidden p-2 ml-2 text-gray-500" onClick={onClose}>✕</button>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by Surah Name" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-gray-50 dark:bg-[#2A2A2A] border border-transparent focus:border-brand-500 focus:bg-[var(--surface)] focus:outline-none rounded-lg py-2 pl-10 pr-4 text-sm text-[var(--foreground)] transition-colors"
            />
          </div>
        </div>
        
        <div className="overflow-y-auto flex-1 scrollbar-thin p-3 space-y-1">
          {filteredSurahs.map((surah) => {
            const isActive = pathname === `/surah/${surah.id}`;
            return (
              <Link 
                key={surah.id} 
                href={`/surah/${surah.id}`}
                onClick={() => onClose()}
                className={`
                  flex items-center justify-between p-3 rounded-lg border border-transparent transition-all relative overflow-hidden group
                  ${isActive ? 'bg-brand-50 dark:bg-[#2A2A2A]' : 'hover:bg-gray-50 dark:hover:bg-[#2A2A2A]'}
                `}
              >
                {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-500 rounded-r-md"></div>}
                <div className="flex items-center gap-4 pl-1">
                  <div className="relative w-10 h-10 flex items-center justify-center shrink-0">
                    <div className="absolute inset-0 bg-gray-100 dark:bg-[#3A3A3A] group-hover:bg-brand-500 transition-colors transform rotate-45 rounded flex items-center justify-center"></div>
                    <span className="relative z-10 text-xs font-bold text-[var(--foreground)] group-hover:text-white transition-colors">{surah.id}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-[15px] text-[var(--foreground)]">{surah.nameEnglish}</h3>
                    <p className="text-[11px] text-gray-500 font-medium">{surah.nameTranslation}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-amiri text-lg font-bold text-[var(--foreground)]" dir="rtl">{surah.nameArabic}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">{surah.numberOfAyahs} Ayahs</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
