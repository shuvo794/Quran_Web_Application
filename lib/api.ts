export interface Ayah {
  number: number;
  arabic: string;
  translation: string;
  audio: string;
  surahId?: number;
}

export interface Surah {
  id: number;
  nameArabic: string;
  nameEnglish: string;
  nameTranslation: string;
  revelationType: string;
  numberOfAyahs: number;
  ayahs?: Ayah[];
}

export async function getAllSurahs(): Promise<Surah[]> {
  const res = await fetch('https://api.alquran.cloud/v1/meta');
  if (!res.ok) throw new Error('Failed to fetch surahs');
  const data = await res.json();
  return data.data.surahs.references.map((s: any) => ({
    id: s.number,
    nameArabic: s.name,
    nameEnglish: s.englishName,
    nameTranslation: s.englishNameTranslation,
    revelationType: s.revelationType,
    numberOfAyahs: s.numberOfAyahs,
  }));
}

export async function getSurahById(id: number): Promise<Surah> {
  const res = await fetch(`https://api.alquran.cloud/v1/surah/${id}/editions/quran-uthmani,en.asad`);
  if (!res.ok) throw new Error(`Failed to fetch surah ${id}`);
  const data = await res.json();
  
  const ar = data.data[0];
  const en = data.data[1];
  
  const ayahs = ar.ayahs.map((ayah: any, index: number) => ({
    number: ayah.numberInSurah,
    arabic: ayah.text,
    translation: en.ayahs[index].text,
    audio: `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${ayah.number}.mp3`,
    surahId: ayah.surah ? ayah.surah.number : id
  }));
  
  return {
    id: ar.number,
    nameArabic: ar.name,
    nameEnglish: ar.englishName,
    nameTranslation: ar.englishNameTranslation,
    revelationType: ar.revelationType,
    numberOfAyahs: ar.numberOfAyahs,
    ayahs,
  };
}

export async function getJuzById(id: number): Promise<{ id: number; ayahs: Ayah[] }> {
  const [arRes, enRes] = await Promise.all([
    fetch(`https://api.alquran.cloud/v1/juz/${id}/quran-uthmani`),
    fetch(`https://api.alquran.cloud/v1/juz/${id}/en.asad`)
  ]);
  
  if (!arRes.ok || !enRes.ok) throw new Error(`Failed to fetch juz ${id}`);
  
  const arData = await arRes.json();
  const enData = await enRes.json();
  
  const ar = arData.data;
  const en = enData.data;
  
  const ayahs = ar.ayahs.map((ayah: any, index: number) => ({
    number: ayah.numberInSurah,
    arabic: ayah.text,
    translation: en.ayahs[index].text,
    audio: `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${ayah.number}.mp3`,
    surahId: ayah.surah.number
  }));
  
  return {
    id: ar.number,
    ayahs,
  };
}

export async function getPageById(id: number): Promise<{ id: number; ayahs: Ayah[] }> {
  const [arRes, enRes] = await Promise.all([
    fetch(`https://api.alquran.cloud/v1/page/${id}/quran-uthmani`),
    fetch(`https://api.alquran.cloud/v1/page/${id}/en.asad`)
  ]);
  
  if (!arRes.ok || !enRes.ok) throw new Error(`Failed to fetch page ${id}`);
  
  const arData = await arRes.json();
  const enData = await enRes.json();
  
  const ar = arData.data;
  const en = enData.data;
  
  const ayahs = ar.ayahs.map((ayah: any, index: number) => ({
    number: ayah.numberInSurah,
    arabic: ayah.text,
    translation: en.ayahs[index].text,
    audio: `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${ayah.number}.mp3`,
    surahId: ayah.surah.number
  }));
  
  return {
    id: ar.number,
    ayahs,
  };
}

