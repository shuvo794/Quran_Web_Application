const fetch = require('node-fetch');

async function test() {
  const res = await fetch('http://api.alquran.cloud/v1/surah/1/editions/quran-uthmani,en.asad');
  const data = await res.json();
  console.log(JSON.stringify(data.data[0].name));
  console.log(JSON.stringify(data.data[0].ayahs[0]));
  console.log(JSON.stringify(data.data[1].ayahs[0]));
}

test();
