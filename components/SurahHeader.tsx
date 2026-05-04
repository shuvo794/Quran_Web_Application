import { Surah } from "@/lib/api";
import Link from "next/link";
import Image from "next/image";

interface Props {
  surah: Surah;
  showBismillah?: boolean;
}

export default function SurahHeader({ surah, showBismillah }: Props) {
  const isMeccan = surah.revelationType?.toLowerCase() === "meccan";
  const revelationCity = isMeccan ? "Makkah" : "Madinah";
  const illustrationSrc = isMeccan ? "/mokka.jpeg" : "/modina.jpeg";

  return (
    <div className="relative flex items-center justify-between py-10 mb-16 border-b border-gray-100 dark:border-gray-800/40">
      {/* Left side Illustration */}
      <div className="flex-1 flex justify-start pointer-events-none hidden md:flex">
        <div className="relative w-[180px] h-[120px] opacity-50 dark:opacity-70 transition-opacity">
          <Image 
            src={illustrationSrc} 
            alt={revelationCity}
            fill
            sizes="180px"
            loading="eager"
            className="object-contain"
          />
        </div>
      </div>

      {/* Center content */}
      <div className="flex-1 text-center relative z-10 shrink-0">
        <Link href={`/surah/${surah.id}`} className="group inline-block">
          <h1 className="text-[36px] font-bold text-gray-800 dark:text-gray-100 mb-2 group-hover:text-[#2E7D32] transition-colors tracking-tight font-inter">
            Surah {surah.nameEnglish}
          </h1>
        </Link>
        <div className="flex items-center justify-center gap-3 text-gray-400 font-semibold text-[14px] tracking-wide uppercase">
          <span>Ayah-{surah.numberOfAyahs}</span>
          <span className="w-1 h-1 bg-gray-300 dark:bg-gray-600 rounded-full"></span>
          <span>{revelationCity}</span>
        </div>
        
        {(showBismillah || (surah.id !== 1 && surah.id !== 9)) && (
          <div className="mt-8">
            <span className="font-amiri text-[38px] text-gray-300 dark:text-gray-700 opacity-80" dir="rtl">
              بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
            </span>
          </div>
        )}
      </div>

      {/* Right side Illustration */}
      <div className="flex-1 flex justify-end pointer-events-none hidden md:flex">
        <div className="relative w-[180px] h-[120px] opacity-50 dark:opacity-70 transition-opacity">
          <Image 
            src={illustrationSrc} 
            alt={revelationCity}
            fill
            sizes="180px"
            loading="eager"
            className="object-contain"
            style={{ transform: 'scaleX(-1)' }} // Mirror the image for the right side
          />
        </div>
      </div>
    </div>
  );
}

