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
  const illustrationSrc = isMeccan ? "/assets/images/makkah.png" : "/assets/images/madinah.png";

  return (
    <div className="relative flex items-center py-10 mb-16 border-b border-gray-100 dark:border-gray-800/40">
      {/* Left side Illustration */}
      <div className="absolute left-0 pointer-events-none">
        <div className="relative w-[140px] md:w-[220px] h-[100px] md:h-[140px] opacity-15 dark:opacity-30 grayscale contrast-125">
          <Image 
            src={illustrationSrc} 
            alt={revelationCity}
            fill
            sizes="(max-width: 768px) 140px, 220px"
            loading="eager"
            className="object-contain"
          />
        </div>
      </div>

      {/* Center content */}
      <div className="flex-1 text-center relative z-10 shrink-0">
        <Link href={`/surah/${surah.id}`} className="group inline-block">
          <h1 className="text-[32px] md:text-[36px] font-bold text-gray-800 dark:text-gray-100 mb-2 transition-colors tracking-tight font-inter">
            Surah {surah.nameEnglish}
          </h1>
        </Link>
        <div className="flex items-center justify-center gap-2 text-gray-500 dark:text-gray-400 font-medium text-[15px] tracking-tight">
          <span>Ayah-{surah.numberOfAyahs}, {revelationCity}</span>
        </div>
      </div>

      {/* Spacer for symmetry on mobile, or could be right empty space */}
      <div className="hidden md:block w-[220px]"></div>
    </div>
  );
}

