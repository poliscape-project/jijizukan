const https = require('https');
const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');

function download(url, dest, cb) {
  const file = fs.createWriteStream(dest);
  https.get(url, res => {
    console.log(`Downloading ${url} -> status ${res.statusCode}`);
    if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
      return download(res.headers.location, dest, cb);
    }
    res.pipe(file);
    file.on('finish', () => {
      file.close(() => {
        console.log(`Saved to ${dest}, size: ${fs.statSync(dest).size}`);
        cb();
      });
    });
  }).on('error', err => {
    fs.unlink(dest, () => {});
    console.error(err);
  });
}

const url = 'https://www.hit-north.or.jp/cms/wp-content/uploads/2024/04/02_list.xlsx';
const dest = path.join(__dirname, 'sustainability_2024.xlsx');

download(url, dest, () => {
  try {
    const wb = xlsx.readFile(dest);
    console.log('Sheets:', wb.SheetNames);
    const sheet = wb.Sheets[wb.SheetNames[0]];
    const json = xlsx.utils.sheet_to_json(sheet, { header: 1 });
    console.log('Rows count:', json.length);
    for (let r = 0; r < Math.min(15, json.length); r++) {
      console.log(`Row ${r}:`, (json[r] || []).slice(0, 12).filter(x => x !== undefined && x !== null).join(' | '));
    }
  } catch(e) {
    console.error('Error reading excel:', e);
  }
});
