'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Surah } from '@/lib/api';
import { Search } from 'lucide-react';
import { useState, useMemo, useDeferredValue, memo } from 'react';

const JUZ_SURAH_MAPPING = [[1,2],[2],[2,3],[3,4],[4],[4,5],[5,6],[6,7],[7,8],[8,9],[9,10,11],[11,12],[12,13,14,15],[15,16,17],[17,18],[18,19,20,21],[21,22,23],[23,24,25],[25,26,27],[27,28,29],[29,30,31,32,33],[33,34,35,36],[36,37,38,39],[39,40,41],[41,42,43,44,45,46],[46,47,48,49,50,51],[51,52,53,54,55,56,57,58],[58,59,60,61,62,63,64,65,66,67],[67,68,69,70,71,72,73,74,75,76,77,78],[78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114]];

// Memoized Card Components
const SurahCard = memo(({ surah, isActive, onClick }: { surah: Surah; isActive: boolean; onClick: () => void }) => (
  <Link 
    href={`/surah/${surah.id}`}
    onClick={onClick}
    className={`
      flex items-center p-5 mb-3 rounded-2xl border transition-all relative group
      ${isActive ? 'bg-[#F8FAF8] dark:bg-[#1A1A1A] border-[#E8F0E8] dark:border-green-900/30' : 'bg-white dark:bg-[#1F1F1F] border-transparent hover:border-gray-100 dark:hover:border-gray-800'}
    `}
  >
    <div className="flex items-center gap-5 pl-1">
      <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
        <div className={`absolute inset-0 transition-all transform rotate-45 rounded-xl flex items-center justify-center ${isActive ? 'bg-brand-500 shadow-lg shadow-brand-500/20' : 'bg-[#F1F3F4] dark:bg-[#333] group-hover:bg-brand-500'}`}></div>
        <span className={`relative z-10 text-base font-bold transition-colors ${isActive ? 'text-white' : 'text-gray-600 dark:text-gray-400 group-hover:text-white'}`}>{surah.id}</span>
      </div>
      <div>
        <h3 className={`font-bold text-lg transition-colors ${isActive ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>
          {surah.nameEnglish}
        </h3>
        <p className="text-sm text-gray-400 font-medium">{surah.nameTranslation}</p>
      </div>
    </div>
  </Link>
));
SurahCard.displayName = 'SurahCard';

const JuzCard = memo(({ juz, surahIds, surahs, expandedJuz, onToggle, pathname, onClose }: any) => {
  const firstSurah = surahs.find((s: any) => s.id === surahIds[0]);
  const subtitle = firstSurah ? `${firstSurah.nameEnglish}${surahIds.length > 1 ? ' & More' : ''}` : '';
  const isExpanded = expandedJuz === juz;
  
  return (
    <div className="mb-4 bg-white dark:bg-[#1A1A1A] rounded-2xl p-4 border border-transparent hover:border-gray-100 dark:hover:border-gray-800 transition-all">
      <div 
        className="flex items-center justify-between cursor-pointer"
        onClick={() => onToggle(isExpanded ? null : juz)}
      >
        <div>
          <h3 className="font-bold text-lg text-brand-500">Juz {juz}</h3>
          <p className="text-sm text-gray-400 font-medium">{subtitle}</p>
        </div>
        <div className="text-right flex flex-col items-end">
          <span className="text-lg font-bold text-gray-700 dark:text-gray-300 leading-tight">{surahIds.length}</span>
          <span className="text-xs text-gray-400 font-medium">Surah</span>
        </div>
      </div>
      
      {isExpanded && (
        <div className="mt-4 space-y-2 bg-[#F8F9F9] dark:bg-[#222] rounded-xl p-2">
          {surahIds.map((surahId: any) => {
            const surah = surahs.find((s: any) => s.id === surahId);
            if (!surah) return null;
            const isSurahActive = pathname === `/surah/${surahId}`;
            return (
              <Link 
                key={surahId}
                href={`/surah/${surahId}`}
                onClick={onClose}
                className={`
                  flex items-center gap-4 p-3 rounded-xl transition-all group
                  ${isSurahActive ? 'bg-white dark:bg-[#2A2A2A] shadow-sm' : 'hover:bg-white/50 dark:hover:bg-[#2A2A2A]/50'}
                `}
              >
                <div className="relative w-10 h-10 flex items-center justify-center shrink-0">
                  <div className={`absolute inset-0 transition-colors transform rotate-45 rounded-lg flex items-center justify-center ${isSurahActive ? 'bg-brand-500 shadow-lg shadow-brand-500/20' : 'bg-[#F1F3F4] dark:bg-[#333] group-hover:bg-gray-200 dark:group-hover:bg-[#444]'}`}></div>
                  <span className={`relative z-10 text-sm font-bold transition-colors ${isSurahActive ? 'text-white' : 'text-gray-500'}`}>{surahId}</span>
                </div>
                <div>
                  <h3 className={`font-bold text-[15px] transition-colors ${isSurahActive ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>{surah.nameEnglish}</h3>
                  <p className="text-[11px] text-gray-400 font-medium">{surah.nameTranslation}</p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
});
JuzCard.displayName = 'JuzCard';

const PageCard = memo(({ page, isActive, onClick }: { page: number; isActive: boolean; onClick: () => void }) => (
  <Link 
    href={`/page/${page}`}
    onClick={onClick}
    className={`
      flex items-center p-4 mb-2 rounded-2xl border border-transparent transition-all relative overflow-hidden group
      ${isActive ? 'bg-white dark:bg-[#1A1A1A] shadow-md border-gray-100 dark:border-gray-800' : 'hover:bg-white/50 dark:hover:bg-[#2A2A2A]/50'}
    `}
  >
    {isActive && <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-brand-500 rounded-r-md"></div>}
    <div className="flex items-center gap-4 pl-1 w-full">
      <div className="relative w-11 h-11 flex items-center justify-center shrink-0">
        <div className={`absolute inset-0 transition-colors transform rotate-45 rounded-lg flex items-center justify-center ${isActive ? 'bg-brand-500 shadow-lg shadow-brand-500/20' : 'bg-[#F1F3F4] dark:bg-[#3A3A3A] group-hover:bg-brand-500'}`}></div>
        <span className={`relative z-10 text-sm font-bold transition-colors ${isActive ? 'text-white' : 'text-gray-700 dark:text-gray-300 group-hover:text-white'}`}>{page}</span>
      </div>
      <div className="flex-1 flex justify-between items-center">
        <h3 className={`font-bold text-[16px] transition-colors ${isActive ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>Page {page}</h3>
      </div>
    </div>
  </Link>
));
PageCard.displayName = 'PageCard';

interface Props {
  surahs: Surah[];
  isOpen: boolean;
  onClose: () => void;
}

export default function SurahListSidebar({ surahs, isOpen, onClose }: Props) {
  const pathname = usePathname();
  const [search, setSearch] = useState('');
  const deferredSearch = useDeferredValue(search);
  const [activeTab, setActiveTab] = useState<'surah' | 'juz' | 'page'>('surah');
  const [expandedJuz, setExpandedJuz] = useState<number | null>(null);

  const filteredSurahs = useMemo(() => 
    surahs.filter(s => 
      s.nameEnglish.toLowerCase().includes(deferredSearch.toLowerCase()) || 
      s.nameTranslation.toLowerCase().includes(deferredSearch.toLowerCase())
    ),
  [surahs, deferredSearch]);

  const filteredJuzList = useMemo(() => 
    Array.from({ length: 30 }, (_, i) => i + 1)
      .filter(j => deferredSearch === '' || j.toString().includes(deferredSearch)),
  [deferredSearch]);

  const filteredPageList = useMemo(() => 
    Array.from({ length: 604 }, (_, i) => i + 1)
      .filter(p => deferredSearch === '' || p.toString().includes(deferredSearch)),
  [deferredSearch]);

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
        fixed lg:static top-0 left-0 h-screen w-[320px] bg-[#F8F9FA] dark:bg-[#121212] border-r border-[var(--border)]
        transform transition-transform duration-300 z-50 flex flex-col shrink-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-4 shrink-0 flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-extrabold text-gray-800 dark:text-white tracking-tight">Quran Mazid</h1>
            <p className="text-sm text-gray-500 font-medium">Read, Study, and Learn The Quran</p>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 bg-[#F1F3F4] dark:bg-[#2A2A2A] p-2 rounded-[32px] w-full">
              {(['surah', 'juz', 'page'] as const).map((tab) => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-2 px-4 rounded-[24px] text-sm font-bold text-center capitalize transition-all ${activeTab === tab ? 'bg-white dark:bg-[#3A3A3A] shadow-sm text-gray-900 dark:text-white border-2 border-gray-900 dark:border-white' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <button className="lg:hidden p-2 ml-2 text-gray-500" onClick={onClose}>✕</button>
          </div>
          
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder={`Search ${activeTab}`} 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#F1F3F4] dark:bg-[#2A2A2A] border-none focus:ring-0 rounded-[32px] py-3 pl-11 pr-4 text-sm text-[var(--foreground)] transition-colors"
            />
          </div>
        </div>
        
        <div className="overflow-y-auto flex-1 scrollbar-thin p-3 space-y-1">
          {activeTab === 'surah' && filteredSurahs.map((surah) => (
            <SurahCard 
              key={surah.id} 
              surah={surah} 
              isActive={pathname === `/surah/${surah.id}`} 
              onClick={onClose} 
            />
          ))}

          {activeTab === 'juz' && filteredJuzList.map((juz) => (
            <JuzCard 
              key={juz}
              juz={juz}
              surahIds={JUZ_SURAH_MAPPING[juz - 1]}
              surahs={surahs}
              expandedJuz={expandedJuz}
              onToggle={setExpandedJuz}
              pathname={pathname}
              onClose={onClose}
            />
          ))}

          {activeTab === 'page' && filteredPageList.map((page) => (
            <PageCard 
              key={page} 
              page={page} 
              isActive={pathname === `/page/${page}`} 
              onClick={onClose} 
            />
          ))}
        </div>
      </div>
    </>
  );
}
