'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Surah } from '@/lib/api';

interface Props {
  surahs: Surah[];
  isOpen: boolean;
  onClose: () => void;
}

export default function SurahListSidebar({ surahs, isOpen, onClose }: Props) {
  const pathname = usePathname();

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
        fixed lg:static top-0 left-0 h-screen w-80 bg-[var(--background)] border-r border-[var(--border)]
        transform transition-transform duration-300 z-50 flex flex-col
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-4 border-b border-[var(--border)] shrink-0 flex items-center justify-between">
          <h2 className="text-xl font-bold">Surahs</h2>
          <button className="lg:hidden p-2" onClick={onClose}>
            ✕
          </button>
        </div>
        
        <div className="overflow-y-auto flex-1 scrollbar-thin">
          {surahs.map((surah) => {
            const isActive = pathname === `/surah/${surah.id}`;
            return (
              <Link 
                key={surah.id} 
                href={`/surah/${surah.id}`}
                onClick={() => onClose()}
                className={`
                  flex items-center justify-between p-4 border-b border-[var(--border)]/50
                  hover:bg-[var(--surface)] transition-colors
                  ${isActive ? 'bg-[var(--surface)] border-l-4 border-brand-500' : 'border-l-4 border-transparent'}
                `}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm ${isActive ? 'bg-brand-500 text-white' : 'bg-[var(--surface)]'}`}>
                    {surah.id}
                  </div>
                  <div>
                    <h3 className="font-semibold text-[var(--foreground)]">{surah.nameEnglish}</h3>
                    <p className="text-xs text-gray-400">{surah.nameTranslation}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-amiri text-lg" dir="rtl">{surah.nameArabic}</p>
                  <p className="text-xs text-gray-500">{surah.numberOfAyahs} Ayahs</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
