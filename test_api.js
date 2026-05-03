const https = require('https');

https.get('https://api.quran.com/api/v4/verses/by_chapter/1?words=true&word_fields=text_uthmani,translation&language=bn', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    const json = JSON.parse(data);
    console.log(JSON.stringify(json.verses[0].words.slice(0, 2), null, 2));
  });
}).on('error', (err) => {
  console.log("Error: " + err.message);
});
