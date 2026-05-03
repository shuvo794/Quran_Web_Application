import { Surah } from "@/lib/api";
import Link from "next/link";

interface Props {
  surah: Surah;
  showBismillah?: boolean;
}

export default function SurahHeader({ surah, showBismillah = true }: Props) {
  return (
    <div className="relative flex items-center justify-between mb-12 mt-16 first:mt-4 pb-12 border-b border-gray-100 dark:border-gray-800">
      {/* Left side Mosque SVG */}
      <div className="hidden md:flex flex-1 items-center justify-start opacity-20 dark:opacity-40">
        <svg
          width="120"
          height="80"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M50 10 L55 25 H45 Z" fill="currentColor" />
          <path
            d="M50 25 C70 25, 80 50, 80 70 H20 C20 50, 30 25, 50 25 Z"
            fill="currentColor"
          />
          <rect x="25" y="70" width="50" height="20" fill="currentColor" />
          <rect x="10" y="40" width="5" height="50" fill="currentColor" />
          <rect x="85" y="40" width="5" height="50" fill="currentColor" />
          <path d="M12.5 30 L15 40 H10 Z" fill="currentColor" />
          <path d="M87.5 30 L90 40 H85 Z" fill="currentColor" />
        </svg>
      </div>

      {/* Center content */}
      <div className="flex-1 text-center relative z-10 shrink-0">
        <Link
          href={`/surah/${surah.id}`}
          className="inline-block group hover:opacity-80 transition-opacity"
        >
          <h2 className="text-[26px] font-bold text-gray-800 dark:text-gray-100 mb-1 group-hover:text-brand-500 transition-colors">
            Surah {surah.nameEnglish}
          </h2>
        </Link>
        <p className="text-[13px] text-gray-400 font-medium block">
          Ayah-{surah.numberOfAyahs}, {surah.revelationType}
        </p>
      </div>

      {/* Right side Bismillah */}
      <div className="hidden md:flex flex-1 items-center justify-end">
        {showBismillah && surah.id !== 1 && surah.id !== 9 && (
          <span
            className="font-amiri text-[40px] text-gray-700 dark:text-gray-300 opacity-90"
            dir="rtl"
          >
            بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
          </span>
        )}
      </div>
    </div>
  );
}
