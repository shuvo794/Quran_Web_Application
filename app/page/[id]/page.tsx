import { getPageById, getAllSurahs } from "@/lib/api";
import AyahCard from "@/components/AyahCard";
import SurahHeader from "@/components/SurahHeader";

export async function generateStaticParams() {
  return Array.from({ length: 604 }, (_, i) => ({
    id: (i + 1).toString(),
  }));
}

export default async function PageReader({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const page = await getPageById(parseInt(resolvedParams.id));
  const allSurahs = await getAllSurahs().catch(() => []);

  return (
    <div className="max-w-4xl mx-auto p-6 pb-24">
      <div>
        {page.ayahs.map((ayah, i) => {
          const isNewSurah =
            i === 0 || ayah.surahId !== page.ayahs[i - 1].surahId;
          const surahInfo = allSurahs.find((s) => s.id === ayah.surahId);

          return (
            <div key={`${page.id}-${i}`}>
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
