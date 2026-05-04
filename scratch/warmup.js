const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '../data');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

async function fetchWithRetry(url, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url);
      if (res.ok) return res;
    } catch (err) {
      if (i === retries - 1) throw err;
      await new Promise(r => setTimeout(r, 1000));
    }
  }
}

async function warmup() {
  const surahsRes = await fetch('https://api.alquran.cloud/v1/meta');
  const surahsData = await surahsRes.json();
  const surahs = surahsData.data.surahs.references;

  console.log(`Starting warmup for ${surahs.length} surahs...`);

  for (const s of surahs) {
    const id = s.number;
    const cacheKey = `surah-${id}`;
    const filePath = path.join(DATA_DIR, `${cacheKey}.json`);

    if (fs.existsSync(filePath)) {
      console.log(`Skipping Surah ${id} (already cached)`);
      continue;
    }

    try {
      console.log(`Fetching Surah ${id}: ${s.englishName}...`);
      
      // Fetch main data
      const res = await fetchWithRetry(`https://api.alquran.cloud/v1/surah/${id}/editions/quran-uthmani,en.asad`);
      const resData = await res.json();
      
      // Fetch words
      const wordsRes = await fetchWithRetry(`https://api.quran.com/api/v4/verses/by_chapter/${id}?words=true&word_fields=text_uthmani,translation,audio_url&audio=7&language=bn&per_page=400`);
      const wordsData = await wordsRes.json();
      
      const wordMap = {};
      wordsData.verses.forEach((v) => {
        wordMap[v.verse_key] = v.words.map((w) => ({
          id: w.id,
          position: w.position,
          arabic: w.text_uthmani || w.text,
          translation: w.translation?.text || '',
          audioUrl: w.audio_url || null,
          charTypeName: w.char_type_name
        }));
      });

      const ar = resData.data[0];
      const en = resData.data[1];
      
      const ayahs = ar.ayahs.map((ayah, index) => {
        const surahId = id;
        const verseKey = `${surahId}:${ayah.numberInSurah}`;
        return {
          number: ayah.numberInSurah,
          arabic: ayah.text,
          translation: en.ayahs[index].text,
          audio: `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${ayah.number}.mp3`,
          surahId,
          words: wordMap[verseKey] || []
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

      fs.writeFileSync(filePath, JSON.stringify(surah));
      console.log(`Successfully cached Surah ${id}`);
    } catch (err) {
      console.error(`Failed to cache Surah ${id}:`, err.message);
    }
    
    // Small delay to avoid rate limiting
    await new Promise(r => setTimeout(r, 500));
  }

  console.log('Warmup complete!');
}

warmup();
