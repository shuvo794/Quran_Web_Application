const https = require('https');

function get(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });
}

async function test() {
  try {
    const data = await get('https://api.alquran.cloud/v1/meta');
    const surahs = data.data.surahs.references;
    console.log('Surah 1:', surahs[0]); // Al-Fatihah (Meccan)
    console.log('Surah 2:', surahs[1]); // Al-Baqarah (Medinan)
  } catch (err) {
    console.error(err);
  }
}

test();
