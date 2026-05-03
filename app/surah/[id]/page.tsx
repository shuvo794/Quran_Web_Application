import { getSurahById, getAllSurahs } from "@/lib/api";
import AyahCard from "@/components/AyahCard";
import SurahHeader from "@/components/SurahHeader";
import { notFound } from "next/navigation";

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

  return (
    <div className="max-w-4xl mx-auto p-6 pb-24">
      <SurahHeader surah={surah} />

      <div>
        {surah.ayahs.map((ayah) => (
          <AyahCard key={ayah.number} ayah={ayah} surahId={surah.id} />
        ))}
      </div>
    </div>
  );
}
