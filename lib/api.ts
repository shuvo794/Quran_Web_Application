// Simple in-memory cache to speed up navigation
const cache = new Map<string, any>();

async function fetchWithRetry(url: string, options: any = {}, retries = 2) {
  for (let i = 0; i < retries; i++) {
    try {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), 8000); // 8 second timeout

      const res = await fetch(url, {
        ...options,
        signal: controller.signal
      });
      clearTimeout(id);
      
      if (res.ok) return res;
      if (res.status === 404) return res;
    } catch (err) {
      if (i === retries - 1) {
        console.error(`Fetch failed for ${url}:`, err);
        return null;
      }
      await new Promise(r => setTimeout(r, 500)); // Faster retry
    }
  }
  return null;
}

export interface Word {
  id: number;
  position: number;
  arabic: string;
  translation: string;
  audioUrl?: string | null;
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
    // Adding audio=7 for Mishary Rashid Al-Afasy which supports word-by-word audio
    const res = await fetchWithRetry(`https://api.quran.com/api/v4/verses/by_${type}/${id}?words=true&word_fields=text_uthmani,translation,audio_url&audio=7&language=bn&per_page=400`, {
      next: { revalidate: 86400 } 
    });
    
    if (!res || !res.ok) return null;
    const data = await res.json();
    const wordMap = new Map<string, Word[]>();
    
    data.verses.forEach((v: any) => {
      const words = v.words.map((w: any) => ({
        id: w.id,
        position: w.position,
        arabic: w.text_uthmani || w.text,
        translation: w.translation?.text || '',
        // The API provides the full URL when audio=7 is used
        audioUrl: w.audio_url || null,
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

const FALLBACK_SURAHS: Surah[] = [
  { id: 1, nameArabic: "الفاتحة", nameEnglish: "Al-Fatihah", nameTranslation: "The Opener", revelationType: "Meccan", numberOfAyahs: 7 },
  { id: 2, nameArabic: "البقرة", nameEnglish: "Al-Baqarah", nameTranslation: "The Cow", revelationType: "Medinan", numberOfAyahs: 286 },
  { id: 3, nameArabic: "آل عمران", nameEnglish: "Ali 'Imran", nameTranslation: "Family of Imran", revelationType: "Medinan", numberOfAyahs: 200 },
  { id: 18, nameArabic: "الكهف", nameEnglish: "Al-Kahf", nameTranslation: "The Cave", revelationType: "Meccan", numberOfAyahs: 110 },
  { id: 36, nameArabic: "يس", nameEnglish: "Ya-Sin", nameTranslation: "Ya Sin", revelationType: "Meccan", numberOfAyahs: 83 },
  { id: 67, nameArabic: "الملك", nameEnglish: "Al-Mulk", nameTranslation: "The Sovereignty", revelationType: "Meccan", numberOfAyahs: 30 },
  { id: 114, nameArabic: "الناس", nameEnglish: "An-Nas", nameTranslation: "Mankind", revelationType: "Meccan", numberOfAyahs: 6 }
];

export async function getAllSurahs(): Promise<Surah[]> {
  if (cache.has('allSurahs')) return cache.get('allSurahs');

  try {
    const res = await fetchWithRetry('https://api.alquran.cloud/v1/meta', {
      next: { revalidate: 86400 }
    });
    
    if (res && res.ok) {
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
    }
    
    console.warn('Using fallback surahs due to API failure');
    return FALLBACK_SURAHS;
  } catch (error) {
    console.error('Error fetching surahs:', error);
    return FALLBACK_SURAHS;
  }
}

export async function getSurahById(id: number): Promise<Surah | null> {
  const cacheKey = `surah-${id}`;
  if (cache.has(cacheKey)) return cache.get(cacheKey);

  try {
    const [resData, wordsMap] = await Promise.all([
      fetchWithRetry(`https://api.alquran.cloud/v1/surah/${id}/editions/quran-uthmani,en.asad`, {
        next: { revalidate: 86400 }
      }).then(r => r && r.ok ? r.json() : null),
      fetchWordsData('chapter', id).catch(() => null)
    ]);
    
    if (!resData || !resData.data) {
      console.warn(`Could not fetch main data for surah ${id}`);
      return null;
    }
    
    const ar = resData.data[0];
    const en = resData.data[1];
    
    if (!ar || !en) return null;
    
    const ayahs = ar.ayahs.map((ayah: any, index: number) => {
      const surahId = ayah.surah ? ayah.surah.number : id;
      const verseKey = `${surahId}:${ayah.numberInSurah}`;
      
      return {
        number: ayah.numberInSurah,
        arabic: ayah.text,
        translation: en.ayahs[index]?.text || '',
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
  } catch (error) {
    console.error(`Error in getSurahById(${id}):`, error);
    return null;
  }
}

export async function getJuzById(id: number): Promise<{ id: number; ayahs: Ayah[] } | null> {
  const cacheKey = `juz-${id}`;
  if (cache.has(cacheKey)) return cache.get(cacheKey);

  try {
    const [arRes, enRes, wordsMap] = await Promise.all([
      fetchWithRetry(`https://api.alquran.cloud/v1/juz/${id}/quran-uthmani`, { next: { revalidate: 86400 } }),
      fetchWithRetry(`https://api.alquran.cloud/v1/juz/${id}/en.asad`, { next: { revalidate: 86400 } }),
      fetchWordsData('juz', id).catch(() => null)
    ]);
    
    if (!arRes || !enRes || !arRes.ok || !enRes.ok) {
      console.warn(`Failed to fetch juz ${id}`);
      return null;
    }
    
    const arData = await arRes.json();
    const enData = await enRes.json();
    
    const ar = arData.data;
    const en = enData.data;
    
    if (!ar || !en) return null;
    
    const ayahs = ar.ayahs.map((ayah: any, index: number) => {
      const surahId = ayah.surah.number;
      const verseKey = `${surahId}:${ayah.numberInSurah}`;
      
      return {
        number: ayah.numberInSurah,
        arabic: ayah.text,
        translation: en.ayahs[index]?.text || '',
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
  } catch (error) {
    console.error(`Error in getJuzById(${id}):`, error);
    return null;
  }
}

export async function getPageById(id: number): Promise<{ id: number; ayahs: Ayah[] } | null> {
  const cacheKey = `page-${id}`;
  if (cache.has(cacheKey)) return cache.get(cacheKey);

  try {
    const [arRes, enRes, wordsMap] = await Promise.all([
      fetchWithRetry(`https://api.alquran.cloud/v1/page/${id}/quran-uthmani`, { next: { revalidate: 86400 } }),
      fetchWithRetry(`https://api.alquran.cloud/v1/page/${id}/en.asad`, { next: { revalidate: 86400 } }),
      fetchWordsData('page', id).catch(() => null)
    ]);
    
    if (!arRes || !enRes || !arRes.ok || !enRes.ok) {
      console.warn(`Failed to fetch page ${id}`);
      return null;
    }
    
    const arData = await arRes.json();
    const enData = await enRes.json();
    
    const ar = arData.data;
    const en = enData.data;
    
    if (!ar || !en) return null;
    
    const ayahs = ar.ayahs.map((ayah: any, index: number) => {
      const surahId = ayah.surah.number;
      const verseKey = `${surahId}:${ayah.numberInSurah}`;
      
      return {
        number: ayah.numberInSurah,
        arabic: ayah.text,
        translation: en.ayahs[index]?.text || '',
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
  } catch (error) {
    console.error(`Error in getPageById(${id}):`, error);
    return null;
  }
}




