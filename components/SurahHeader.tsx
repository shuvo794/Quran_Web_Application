import { Surah } from "@/lib/api";
import Link from "next/link";

interface Props {
  surah: Surah;
}

const MakkahIllustration = () => (
  <svg
    width="180"
    height="120"
    viewBox="0 0 100 100"
    fill="currentColor"
    className="opacity-10 dark:opacity-20 transition-opacity duration-700"
  >
    {/* Kaaba Silhouette */}
    <rect x="35" y="45" width="30" height="30" />
    <path d="M35 45 L50 35 L65 45 Z" opacity="0.5" />
    <rect x="42" y="52" width="16" height="4" fillOpacity="0.2" />
    {/* Minarets */}
    <path d="M20 75 L23 30 L26 75 Z" />
    <path d="M74 75 L77 30 L80 75 Z" />
    <path d="M10 75 L12 45 L14 75 Z" />
    <path d="M86 75 L88 45 L90 75 Z" />
    <rect x="5" y="75" width="90" height="5" />
  </svg>
);

const MadinahIllustration = () => (
  <svg
    width="180"
    height="120"
    viewBox="0 0 100 100"
    fill="currentColor"
    className="opacity-10 dark:opacity-20 transition-opacity duration-700"
  >
    {/* Green Dome */}
    <path d="M30 75 C30 35, 70 35, 70 75 Z" />
    <path
      d="M50 35 L50 25 M48 25 L52 25"
      stroke="currentColor"
      strokeWidth="2"
    />
    {/* Minarets */}
    <path d="M15 75 L18 20 L21 75 Z" />
    <path d="M79 75 L82 20 L85 75 Z" />
    <rect x="17" y="40" width="2" height="1" />
    <rect x="81" y="40" width="2" height="1" />
    <rect x="5" y="75" width="90" height="5" />
  </svg>
);

export default function SurahHeader({ surah }: Props) {
  const isMeccan = surah.revelationType === "Meccan";
  const revelationCity = isMeccan ? "Makkah" : "Madinah";

  return (
    <div className="relative py-14 mb-16 border-b border-gray-100 dark:border-gray-800/40">
      {/* Left side Illustration Decoration */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 pointer-events-none hidden md:block">
        {isMeccan ? <MakkahIllustration /> : <MadinahIllustration />}
      </div>

      {/* Center content */}
      <div className="text-center relative z-10">
        <Link href={`/surah/${surah.id}`} className="group inline-block">
          <h1 className="text-[34px] font-bold text-gray-800 dark:text-gray-100 mb-3 group-hover:text-[#2E7D32] transition-colors tracking-tight font-inter">
            Surah {surah.nameEnglish}
          </h1>
        </Link>
        <div className="flex items-center justify-center gap-3 text-gray-400 font-semibold text-[13px] tracking-wide uppercase">
          <span className="bg-gray-50 dark:bg-gray-800/50 px-3 py-1 rounded-full border border-gray-100 dark:border-gray-700/50">
            Ayah-{surah.numberOfAyahs}
          </span>
          <span className="w-1 h-1 bg-gray-300 dark:bg-gray-600 rounded-full"></span>
          <span className="bg-gray-50 dark:bg-gray-800/50 px-3 py-1 rounded-full border border-gray-100 dark:border-gray-700/50">
            {revelationCity}
          </span>
        </div>
      </div>

      {/* Right side mirror decoration for balance */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none hidden md:block scale-x-[-1]">
        {isMeccan ? <MakkahIllustration /> : <MadinahIllustration />}
      </div>
    </div>
  );
}
