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

const f1 = path.join(__dirname, 'furusato_received_latest.xlsx');
const f2 = path.join(__dirname, 'furusato_deducted_latest.xlsx');

download('https://www.soumu.go.jp/main_content/001084989.xlsx', f1, () => {
  download('https://www.soumu.go.jp/main_content/001085012.xlsx', f2, () => {
    console.log('Both files downloaded successfully!');
    
    // Inspect f1
    const wb1 = xlsx.readFile(f1);
    console.log('\n--- Received file sheets:', wb1.SheetNames);
    const sheet1 = wb1.Sheets[wb1.SheetNames[0]];
    const json1 = xlsx.utils.sheet_to_json(sheet1, { header: 1 });
    console.log('F1 Row count:', json1.length);
    for (let r = 0; r < Math.min(10, json1.length); r++) {
      console.log(`F1 R${r}:`, (json1[r] || []).slice(0, 10).filter(x => x !== undefined && x !== null).join(' | '));
    }

    // Inspect f2
    const wb2 = xlsx.readFile(f2);
    console.log('\n--- Deducted file sheets:', wb2.SheetNames);
    const sheet2 = wb2.Sheets[wb2.SheetNames[0]];
    const json2 = xlsx.utils.sheet_to_json(sheet2, { header: 1 });
    console.log('F2 Row count:', json2.length);
    for (let r = 0; r < Math.min(10, json2.length); r++) {
      console.log(`F2 R${r}:`, (json2[r] || []).slice(0, 10).filter(x => x !== undefined && x !== null).join(' | '));
    }
  });
});
