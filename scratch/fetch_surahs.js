const fs = require('fs');

async function fetchAndSave() {
  try {
    const res = await fetch('https://api.alquran.cloud/v1/meta');
    const data = await res.json();
    const surahs = data.data.surahs.references.map((s) => ({
      id: s.number,
      nameArabic: s.name,
      nameEnglish: s.englishName,
      nameTranslation: s.englishNameTranslation,
      revelationType: s.revelationType,
      numberOfAyahs: s.numberOfAyahs,
    }));
    fs.writeFileSync('./lib/surahs.json', JSON.stringify(surahs, null, 2));
    console.log('Saved 114 surahs to lib/surahs.json');
  } catch (err) {
    console.error('Failed to fetch surahs:', err);
  }
}

fetchAndSave();
