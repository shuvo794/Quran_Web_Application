import { getPageById } from '@/lib/api';
import AyahCard from '@/components/AyahCard';

export async function generateStaticParams() {
  return Array.from({ length: 604 }, (_, i) => ({
    id: (i + 1).toString(),
  }));
}

export default async function PageReader({ params }: { params: { id: string } }) {
  const page = await getPageById(parseInt(params.id));

  return (
    <div className="max-w-4xl mx-auto p-6 pb-24">
      <div className="bg-white dark:bg-[#1F1F1F] p-8 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 text-center mb-6">
        <h1 className="text-4xl font-amiri font-bold text-[var(--foreground)] mb-2" dir="rtl">الصفحة {page.id}</h1>
        <h2 className="text-xl font-bold text-[var(--foreground)]">Page {page.id}</h2>
      </div>
      
      <div>
        {page.ayahs.map((ayah, i) => (
          <AyahCard key={`${page.id}-${i}`} ayah={ayah} surahId={ayah.surahId!} />
        ))}
      </div>
    </div>
  );
}
