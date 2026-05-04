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
  const illustration = isMeccan ? "/assets/images/makkah.png" : "/assets/images/madinah.png";

  return (
    <div className="relative flex flex-col items-center py-12 mb-12 border-b border-gray-100 dark:border-gray-800/40 text-center">
      <div className="absolute left-0 top-1/2 -translate-y-1/2 opacity-20 dark:opacity-25 hidden md:block transition-opacity">
        <Image 
          src={illustration} 
          alt={revelationCity} 
          width={240} 
          height={240} 
          className="object-contain"
          priority
        />
      </div>

      <Link href={`/surah/${surah.id}`} className="group mb-2">
        <h1 className="text-3xl md:text-4xl font-bold text-[var(--foreground)] tracking-tight">
          Surah {surah.nameEnglish}
        </h1>
      </Link>
      
      <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 font-medium text-sm mb-8">
        <span>Ayah-{surah.numberOfAyahs}</span>
        <span className="w-1 h-1 bg-gray-300 dark:bg-gray-600 rounded-full"></span>
        <span>{revelationCity}</span>
      </div>

      {showBismillah && surah.id !== 1 && surah.id !== 9 && (
        <div className="mt-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <p className="font-amiri text-4xl md:text-5xl text-gray-800 dark:text-gray-200 opacity-90">
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </p>
        </div>
      )}
    </div>
  );
}

