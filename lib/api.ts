// Simple in-memory cache to speed up navigation
const cache = new Map<string, any>();

export interface Word {
  id: number;
  position: number;
  arabic: string;
  translation: string;
  charTypeName: string;
}

export interface Ayah {
  number: number;
  arabic: string;
  translation: string;
  audio: string;
  surahId?: number;
  words?: Word[];
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

async function fetchWordsData(type: 'chapter' | 'juz' | 'page', id: number) {
  const cacheKey = `words-${type}-${id}`;
  if (cache.has(cacheKey)) return cache.get(cacheKey);

  try {
    const res = await fetch(`https://api.quran.com/api/v4/verses/by_${type}/${id}?words=true&word_fields=text_uthmani,translation&language=bn&per_page=400`, {
      cache: 'force-cache',
      next: { revalidate: 86400 } // Cache for 24 hours
    });
    if (!res.ok) return null;
    const data = await res.json();
    const wordMap = new Map<string, Word[]>();
    
    data.verses.forEach((v: any) => {
      const words = v.words.map((w: any) => ({
        id: w.id,
        position: w.position,
        arabic: w.text_uthmani || w.text,
        translation: w.translation?.text || '',
        charTypeName: w.char_type_name
      }));
      wordMap.set(v.verse_key, words);
    });
    
    cache.set(cacheKey, wordMap);
    return wordMap;
  } catch (error) {
    console.error('Error fetching words data:', error);
    return null;
  }
}

export async function getAllSurahs(): Promise<Surah[]> {
  if (cache.has('allSurahs')) return cache.get('allSurahs');

  try {
    const res = await fetch('https://api.alquran.cloud/v1/meta', {
      cache: 'force-cache',
      next: { revalidate: 86400 }
    });
    if (!res.ok) throw new Error('Failed to fetch surahs');
    const data = await res.json();
    const surahs = data.data.surahs.references.map((s: any) => ({
      id: s.number,
      nameArabic: s.name,
      nameEnglish: s.englishName,
      nameTranslation: s.englishNameTranslation,
      revelationType: s.revelationType,
      numberOfAyahs: s.numberOfAyahs,
    }));
    
    cache.set('allSurahs', surahs);
    return surahs;
  } catch (error) {
    console.error('Error fetching surahs:', error);
    return [];
  }
}

export async function getSurahById(id: number): Promise<Surah> {
  const cacheKey = `surah-${id}`;
  if (cache.has(cacheKey)) return cache.get(cacheKey);

  const [res, wordsMap] = await Promise.all([
    fetch(`https://api.alquran.cloud/v1/surah/${id}/editions/quran-uthmani,en.asad`, {
      cache: 'force-cache',
      next: { revalidate: 86400 }
    }).then(r => {
      if (!r.ok) throw new Error(`Failed to fetch surah ${id}`);
      return r.json();
    }),
    fetchWordsData('chapter', id)
  ]);
  
  const ar = res.data[0];
  const en = res.data[1];
  
  const ayahs = ar.ayahs.map((ayah: any, index: number) => {
    const surahId = ayah.surah ? ayah.surah.number : id;
    const verseKey = `${surahId}:${ayah.numberInSurah}`;
    
    return {
      number: ayah.numberInSurah,
      arabic: ayah.text,
      translation: en.ayahs[index].text,
      audio: `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${ayah.number}.mp3`,
      surahId,
      words: wordsMap?.get(verseKey) || []
    };
  });
  
  const surah = {
    id: ar.number,
    nameArabic: ar.name,
    nameEnglish: ar.englishName,
    nameTranslation: ar.englishNameTranslation,
    revelationType: ar.revelationType,
    numberOfAyahs: ar.numberOfAyahs,
    ayahs,
  };

  cache.set(cacheKey, surah);
  return surah;
}

export async function getJuzById(id: number): Promise<{ id: number; ayahs: Ayah[] }> {
  const cacheKey = `juz-${id}`;
  if (cache.has(cacheKey)) return cache.get(cacheKey);

  const [arRes, enRes, wordsMap] = await Promise.all([
    fetch(`https://api.alquran.cloud/v1/juz/${id}/quran-uthmani`, { cache: 'force-cache', next: { revalidate: 86400 } }),
    fetch(`https://api.alquran.cloud/v1/juz/${id}/en.asad`, { cache: 'force-cache', next: { revalidate: 86400 } }),
    fetchWordsData('juz', id)
  ]);
  
  if (!arRes.ok || !enRes.ok) throw new Error(`Failed to fetch juz ${id}`);
  
  const arData = await arRes.json();
  const enData = await enRes.json();
  
  const ar = arData.data;
  const en = enData.data;
  
  const ayahs = ar.ayahs.map((ayah: any, index: number) => {
    const surahId = ayah.surah.number;
    const verseKey = `${surahId}:${ayah.numberInSurah}`;
    
    return {
      number: ayah.numberInSurah,
      arabic: ayah.text,
      translation: en.ayahs[index].text,
      audio: `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${ayah.number}.mp3`,
      surahId,
      words: wordsMap?.get(verseKey) || []
    };
  });
  
  const result = {
    id: ar.number,
    ayahs,
  };

  cache.set(cacheKey, result);
  return result;
}

export async function getPageById(id: number): Promise<{ id: number; ayahs: Ayah[] }> {
  const cacheKey = `page-${id}`;
  if (cache.has(cacheKey)) return cache.get(cacheKey);

  const [arRes, enRes, wordsMap] = await Promise.all([
    fetch(`https://api.alquran.cloud/v1/page/${id}/quran-uthmani`, { cache: 'force-cache', next: { revalidate: 86400 } }),
    fetch(`https://api.alquran.cloud/v1/page/${id}/en.asad`, { cache: 'force-cache', next: { revalidate: 86400 } }),
    fetchWordsData('page', id)
  ]);
  
  if (!arRes.ok || !enRes.ok) throw new Error(`Failed to fetch page ${id}`);
  
  const arData = await arRes.json();
  const enData = await enRes.json();
  
  const ar = arData.data;
  const en = enData.data;
  
  const ayahs = ar.ayahs.map((ayah: any, index: number) => {
    const surahId = ayah.surah.number;
    const verseKey = `${surahId}:${ayah.numberInSurah}`;
    
    return {
      number: ayah.numberInSurah,
      arabic: ayah.text,
      translation: en.ayahs[index].text,
      audio: `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${ayah.number}.mp3`,
      surahId,
      words: wordsMap?.get(verseKey) || []
    };
  });
  
  const result = {
    id: ar.number,
    ayahs,
  };

  cache.set(cacheKey, result);
  return result;
}



