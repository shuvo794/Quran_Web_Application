import surahsData from './surahs.json';
import fs from 'fs';
import path from 'path';

// Simple in-memory cache to speed up navigation
const cache = new Map<string, any>();

// Persistent filesystem cache for production-like speed in dev
const CACHE_DIR = path.join(process.cwd(), 'data');

function getFromFsCache(key: string) {
  try {
    const filePath = path.join(CACHE_DIR, `${key}.json`);
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    }
  } catch (e) {}
  return null;
}

function saveToFsCache(key: string, data: any) {
  try {
    if (!fs.existsSync(CACHE_DIR)) fs.mkdirSync(CACHE_DIR, { recursive: true });
    const filePath = path.join(CACHE_DIR, `${key}.json`);
    fs.writeFileSync(filePath, JSON.stringify(data));
  } catch (e) {}
}

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
      cache: 'no-store' 
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

const FALLBACK_SURAHS: Surah[] = surahsData as Surah[];

export async function getAllSurahs(): Promise<Surah[]> {
  if (cache.has('allSurahs')) return cache.get('allSurahs');
  
  // Return local data immediately for instant load
  cache.set('allSurahs', FALLBACK_SURAHS);
  return FALLBACK_SURAHS;
}

export async function getSurahById(id: number): Promise<Surah | null> {
  const cacheKey = `surah-${id}`;
  if (cache.has(cacheKey)) return cache.get(cacheKey);
  
  // Check filesystem cache first
  const fsCached = getFromFsCache(cacheKey);
  if (fsCached) {
    cache.set(cacheKey, fsCached);
    return fsCached;
  }

  try {
    const [resData, wordsMap] = await Promise.all([
      fetchWithRetry(`https://api.alquran.cloud/v1/surah/${id}/editions/quran-uthmani,en.asad`, {
        cache: 'no-store'
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

    saveToFsCache(cacheKey, surah);
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

  // Check filesystem cache first
  const fsCached = getFromFsCache(cacheKey);
  if (fsCached) {
    cache.set(cacheKey, fsCached);
    return fsCached;
  }

  try {
    const [arRes, enRes, wordsMap] = await Promise.all([
      fetchWithRetry(`https://api.alquran.cloud/v1/juz/${id}/quran-uthmani`, { cache: 'no-store' }),
      fetchWithRetry(`https://api.alquran.cloud/v1/juz/${id}/en.asad`, { cache: 'no-store' }),
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

    saveToFsCache(cacheKey, result);
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

  // Check filesystem cache first
  const fsCached = getFromFsCache(cacheKey);
  if (fsCached) {
    cache.set(cacheKey, fsCached);
    return fsCached;
  }

  try {
    const [arRes, enRes, wordsMap] = await Promise.all([
      fetchWithRetry(`https://api.alquran.cloud/v1/page/${id}/quran-uthmani`, { cache: 'no-store' }),
      fetchWithRetry(`https://api.alquran.cloud/v1/page/${id}/en.asad`, { cache: 'no-store' }),
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

    saveToFsCache(cacheKey, result);
    cache.set(cacheKey, result);
    return result;
  } catch (error) {
    console.error(`Error in getPageById(${id}):`, error);
    return null;
  }
}




