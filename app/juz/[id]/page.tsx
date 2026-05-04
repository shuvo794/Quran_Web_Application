import { getJuzById, getAllSurahs } from "@/lib/api";
import AyahCard from "@/components/AyahCard";
import SurahHeader from "@/components/SurahHeader";

export async function generateStaticParams() {
  return Array.from({ length: 30 }, (_, i) => ({
    id: (i + 1).toString(),
  }));
}

export default async function JuzPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const juz = await getJuzById(parseInt(resolvedParams.id));
  const allSurahs = await getAllSurahs().catch(() => []);

  if (!juz || !juz.ayahs) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 pb-24">
      {/* We can remove the old generic text center header since we have SurahHeader now, 
          but keeping a small badge or breadcrumb for the Juz might be nice */}

      <div>
        {juz.ayahs.map((ayah, i) => {
          const isNewSurah =
            i === 0 || ayah.surahId !== juz.ayahs[i - 1].surahId;
          const surahInfo = allSurahs.find((s) => s.id === ayah.surahId);

          return (
            <div key={`${juz.id}-${i}`}>
              {isNewSurah && surahInfo && (
                <SurahHeader
                  surah={surahInfo}
                  showBismillah={ayah.number === 1}
                />
              )}
              <AyahCard ayah={ayah} surahId={ayah.surahId!} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
