import { Surah } from '@/lib/api';

interface Props {
  surah: Surah;
}

export default function SurahHeader({ surah }: Props) {
  return (
    <div className="relative overflow-hidden bg-white dark:bg-[#1F1F1F] p-8 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 flex items-center justify-between mb-8 mt-12 first:mt-0">
      
      {/* Background faint graphic (simulated with CSS) */}
      <div className="absolute -left-10 -bottom-10 opacity-5 dark:opacity-10 pointer-events-none">
        <svg width="200" height="200" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C10.89 2 10 2.89 10 4V6H8V8H6V10H4V22H20V10H18V8H16V6H14V4C14 2.89 13.11 2 12 2M12 4C12.55 4 13 4.45 13 5V6H11V5C11 4.45 11.45 4 12 4M10 8H14V10H10V8M8 10H16V12H8V10M6 12H18V20H6V12Z" />
        </svg>
      </div>

      {/* Empty div for left balance */}
      <div className="hidden md:block flex-1"></div>

      {/* Center content */}
      <div className="flex-1 text-center relative z-10 shrink-0">
        <h2 className="text-2xl font-bold text-[var(--foreground)] mb-1">Surah {surah.nameEnglish}</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Ayah-{surah.numberOfAyahs}, {surah.revelationType}</p>
      </div>

      {/* Right side Bismillah */}
      <div className="hidden md:block flex-1 text-right">
        {surah.id !== 1 && surah.id !== 9 && (
          <span className="font-amiri text-4xl text-[var(--foreground)] opacity-80" dir="rtl">
            بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
          </span>
        )}
      </div>
      
    </div>
  );
}
