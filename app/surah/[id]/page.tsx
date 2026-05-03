import { getSurahById, getAllSurahs } from '@/lib/api';
import AyahCard from '@/components/AyahCard';
import { notFound } from 'next/navigation';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  const surahs = await getAllSurahs().catch(() => []);
  return surahs.map((surah) => ({
    id: surah.id.toString(),
  }));
}

export default async function SurahPage({ params }: Props) {
  const resolvedParams = await params;
  const id = parseInt(resolvedParams.id, 10);
  
  if (isNaN(id) || id < 1 || id > 114) {
    notFound();
  }
  
  const surah = await getSurahById(id).catch(() => null);
  
  if (!surah || !surah.ayahs) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  // Calculate bismillah to show only for non-Fatiha and non-Tawbah if needed, 
  // but alquran.cloud already includes Bismillah as Ayah 1 for Fatiha, and as a prefix for others.
  // We'll just display what the API gives us. Wait, API often puts Bismillah inside the text.
  // Actually it's fine, we will display it as it comes.

  return (
    <div className="max-w-4xl mx-auto pb-24">
      <div className="bg-[var(--surface)] p-8 border-b border-[var(--border)] text-center sticky top-0 lg:top-0 z-10 shadow-sm backdrop-blur-md bg-[var(--surface)]/90">
        <h1 className="text-4xl font-amiri font-bold text-[var(--foreground)] mb-2" dir="rtl">{surah.nameArabic}</h1>
        <h2 className="text-xl font-bold text-[var(--foreground)]">{surah.nameEnglish}</h2>
        <div className="mt-4 flex items-center justify-center gap-4 text-sm text-gray-400 font-medium">
          <span className="px-3 py-1 rounded-full bg-[var(--background)] border border-[var(--border)]">{surah.revelationType}</span>
          <span className="px-3 py-1 rounded-full bg-[var(--background)] border border-[var(--border)]">{surah.numberOfAyahs} Ayahs</span>
        </div>
      </div>
      
      <div className="bg-[var(--background)]">
        {surah.ayahs.map((ayah) => (
          <AyahCard key={ayah.number} ayah={ayah} surahId={surah.id} />
        ))}
      </div>
    </div>
  );
}
