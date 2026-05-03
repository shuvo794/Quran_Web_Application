'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Surah } from '@/lib/api';
import { Search } from 'lucide-react';
import { useState } from 'react';

const JUZ_SURAH_MAPPING = [[1,2],[2],[2,3],[3,4],[4],[4,5],[5,6],[6,7],[7,8],[8,9],[9,10,11],[11,12],[12,13,14,15],[15,16,17],[17,18],[18,19,20,21],[21,22,23],[23,24,25],[25,26,27],[27,28,29],[29,30,31,32,33],[33,34,35,36],[36,37,38,39],[39,40,41],[41,42,43,44,45,46],[46,47,48,49,50,51],[51,52,53,54,55,56,57,58],[58,59,60,61,62,63,64,65,66,67],[67,68,69,70,71,72,73,74,75,76,77,78],[78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114]];

interface Props {
  surahs: Surah[];
  isOpen: boolean;
  onClose: () => void;
}

export default function SurahListSidebar({ surahs, isOpen, onClose }: Props) {
  const pathname = usePathname();
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'surah' | 'juz' | 'page'>('surah');
  const [expandedJuz, setExpandedJuz] = useState<number | null>(null);

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
              <button 
                onClick={() => setActiveTab('surah')}
                className={`flex-1 py-1.5 px-3 rounded-md text-sm font-semibold text-center transition-all ${activeTab === 'surah' ? 'bg-white dark:bg-[#3A3A3A] shadow-sm text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
              >
                Surah
              </button>
              <button 
                onClick={() => setActiveTab('juz')}
                className={`flex-1 py-1.5 px-3 rounded-md text-sm font-semibold text-center transition-all ${activeTab === 'juz' ? 'bg-white dark:bg-[#3A3A3A] shadow-sm text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
              >
                Juz
              </button>
              <button 
                onClick={() => setActiveTab('page')}
                className={`flex-1 py-1.5 px-3 rounded-md text-sm font-semibold text-center transition-all ${activeTab === 'page' ? 'bg-white dark:bg-[#3A3A3A] shadow-sm text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
              >
                Page
              </button>
            </div>
            <button className="lg:hidden p-2 ml-2 text-gray-500" onClick={onClose}>✕</button>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder={`Search by ${activeTab === 'surah' ? 'Surah Name' : activeTab === 'juz' ? 'Juz Number' : 'Page Number'}`} 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-gray-50 dark:bg-[#2A2A2A] border border-transparent focus:border-brand-500 focus:bg-[var(--surface)] focus:outline-none rounded-lg py-2 pl-10 pr-4 text-sm text-[var(--foreground)] transition-colors"
            />
          </div>
        </div>
        
        <div className="overflow-y-auto flex-1 scrollbar-thin p-3 space-y-1">
          {activeTab === 'surah' && filteredSurahs.map((surah) => {
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

          {activeTab === 'juz' && Array.from({ length: 30 }, (_, i) => i + 1)
            .filter(j => search === '' || j.toString().includes(search))
            .map((juz) => {
              const surahIds = JUZ_SURAH_MAPPING[juz - 1];
              const firstSurah = surahs.find(s => s.id === surahIds[0]);
              const subtitle = firstSurah ? `${firstSurah.nameEnglish}${surahIds.length > 1 ? ' & More' : ''}` : '';
              
              return (
                <div key={juz} className="mb-2">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/juz/${juz}`}
                      onClick={() => onClose()}
                      className="flex-1 flex items-center justify-between p-4 bg-gray-50 dark:bg-[#2A2A2A] rounded-xl hover:shadow-sm border border-transparent hover:border-gray-200 dark:hover:border-gray-700 transition-all text-left"
                    >
                      <div>
                        <h3 className="font-bold text-[15px] text-brand-500">Juz {juz}</h3>
                        <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
                      </div>
                      <div className="text-center">
                        <span className="block font-bold text-gray-700 dark:text-gray-300 text-sm">{surahIds.length}</span>
                        <span className="text-[10px] text-gray-400">Surah</span>
                      </div>
                    </Link>
                    <button 
                      onClick={() => setExpandedJuz(expandedJuz === juz ? null : juz)}
                      className="p-4 bg-gray-50 dark:bg-[#2A2A2A] rounded-xl hover:bg-gray-100 dark:hover:bg-[#3A3A3A] transition-colors flex items-center justify-center shrink-0 border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
                      aria-label="Toggle Surahs"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform ${expandedJuz === juz ? 'rotate-180' : ''}`}>
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </button>
                  </div>
                  
                  {expandedJuz === juz && (
                    <div className="pl-4 pr-1 mt-2 space-y-1">
                      {surahIds.map(surahId => {
                        const surah = surahs.find(s => s.id === surahId);
                        if (!surah) return null;
                        const isSurahActive = pathname === `/juz/${juz}` || pathname === `/surah/${surahId}`;
                        return (
                          <Link 
                            key={surahId}
                            href={`/surah/${surahId}`}
                            onClick={() => onClose()}
                            className={`
                              flex items-center gap-4 p-3 rounded-lg border border-transparent transition-all relative overflow-hidden group
                              ${isSurahActive ? 'bg-brand-50 dark:bg-[#2A2A2A]' : 'hover:bg-gray-50 dark:hover:bg-[#2A2A2A]'}
                            `}
                          >
                            <div className="relative w-8 h-8 flex items-center justify-center shrink-0">
                              <div className="absolute inset-0 bg-gray-100 dark:bg-[#3A3A3A] group-hover:bg-brand-500 transition-colors transform rotate-45 rounded flex items-center justify-center"></div>
                              <span className="relative z-10 text-[10px] font-bold text-[var(--foreground)] group-hover:text-white transition-colors">{surahId}</span>
                            </div>
                            <div>
                              <h3 className="font-semibold text-sm text-[var(--foreground)]">{surah.nameEnglish}</h3>
                              <p className="text-[10px] text-gray-500">{surah.nameTranslation}</p>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}

          {activeTab === 'page' && Array.from({ length: 604 }, (_, i) => i + 1)
            .filter(p => search === '' || p.toString().includes(search))
            .map((page) => {
              const isActive = pathname === `/page/${page}`;
              return (
                <Link 
                  key={page} 
                  href={`/page/${page}`}
                  onClick={() => onClose()}
                  className={`
                    flex items-center p-3 rounded-lg border border-transparent transition-all relative overflow-hidden group
                    ${isActive ? 'bg-brand-50 dark:bg-[#2A2A2A]' : 'hover:bg-gray-50 dark:hover:bg-[#2A2A2A]'}
                  `}
                >
                  {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-500 rounded-r-md"></div>}
                  <div className="flex items-center gap-4 pl-1 w-full">
                    <div className="relative w-10 h-10 flex items-center justify-center shrink-0">
                      <div className="absolute inset-0 bg-gray-100 dark:bg-[#3A3A3A] group-hover:bg-brand-500 transition-colors transform rotate-45 rounded flex items-center justify-center"></div>
                      <span className="relative z-10 text-xs font-bold text-[var(--foreground)] group-hover:text-white transition-colors">{page}</span>
                    </div>
                    <div className="flex-1 flex justify-between items-center">
                      <h3 className="font-semibold text-[15px] text-[var(--foreground)]">Page {page}</h3>
                    </div>
                  </div>
                </Link>
              );
            })}
        </div>
      </div>
    </>
  );
}
