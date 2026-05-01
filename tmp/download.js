const https = require('https');
const fs = require('fs');

https.get('https://codeload.github.com/ys-sites/MC-Exterior-Care/zip/refs/heads/main', (res) => {
  const writeStream = fs.createWriteStream('/tmp/repo.zip');
  res.pipe(writeStream);
  writeStream.on('finish', () => {
    console.log('Downloaded');
  });
}).on('error', (err) => {
  console.error(err);
});
