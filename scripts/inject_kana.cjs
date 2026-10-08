const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');

const excelPath = path.join(__dirname, 'soumu_code.xlsx');
const summaryPath = path.join(__dirname, '../src/data/municipalities_summary.json');
const fullPath = path.join(__dirname, '../src/data/municipalities.json');

function kanaHalfToHiragana(str) {
  if (!str) return '';
  const kanaMap = {
    'ｶﾞ': 'が', 'ｷﾞ': 'ぎ', 'ｸﾞ': 'ぐ', 'ｹﾞ': 'げ', 'ｺﾞ': 'ご',
    'ｻﾞ': 'ざ', 'ｼﾞ': 'じ', 'ｽﾞ': 'ず', 'ｾﾞ': 'ぜ', 'ｿﾞ': 'ぞ',
    'ﾀﾞ': 'だ', 'ﾁﾞ': 'ぢ', 'ﾂﾞ': 'づ', 'ﾃﾞ': 'で', 'ﾄﾞ': 'ど',
    'ﾊﾞ': 'ば', 'ﾋﾞ': 'び', 'ﾌﾞ': 'ぶ', 'ﾍﾞ': 'べ', 'ﾎﾞ': 'ぼ',
    'ﾊﾟ': 'ぱ', 'ﾋﾟ': 'ぴ', 'ﾌﾟ': 'ぷ', 'ﾍﾟ': 'ぺ', 'ﾎﾟ': 'ぽ',
    'ｳﾞ': 'ゔ',
    'ｱ': 'あ', 'ｲ': 'い', 'ｳ': 'う', 'ｴ': 'え', 'ｵ': 'お',
    'ｶ': 'か', 'ｷ': 'き', 'ｸ': 'く', 'ｹ': 'け', 'ｺ': 'こ',
    'ｻ': 'さ', 'ｼ': 'し', 'ｽ': 'す', 'ｾ': 'せ', 'ｿ': 'そ',
    'ﾀ': 'た', 'ﾁ': 'ち', 'ﾂ': 'つ', 'ﾃ': 'て', 'ﾄ': 'と',
    'ﾅ': 'な', 'ﾆ': 'に', 'ﾇ': 'ぬ', 'ﾈ': 'ね', 'ノ': 'の', 'ﾉ': 'の',
    'ﾊ': 'は', 'ﾋ': 'ひ', 'ﾌ': 'ふ', 'ﾍ': 'へ', 'ﾎ': 'ほ',
    'ﾏ': 'ま', 'ﾐ': 'み', 'ﾑ': 'む', 'ﾒ': 'め', 'ﾓ': 'も',
    'ﾔ': 'や', 'ﾕ': 'ゆ', 'ﾖ': 'よ',
    'ﾗ': 'ら', 'ﾘ': 'り', 'ﾙ': 'る', 'ﾚ': 'れ', 'ﾛ': 'ろ',
    'ﾜ': 'わ', 'ｦ': 'を', 'ﾝ': 'ん',
    'ｧ': 'ぁ', 'ｨ': 'ぃ', 'ｩ': 'ぅ', 'ｪ': 'ぇ', 'ｫ': 'ぉ',
    'ｯ': 'っ', 'ｬ': 'ゃ', 'ｭ': 'ゅ', 'ｮ': 'ょ',
    'ｰ': 'ー', '･': '・'
  };

  let res = '';
  for (let i = 0; i < str.length; i++) {
    const two = str.substr(i, 2);
    if (kanaMap[two]) {
      res += kanaMap[two];
      i++;
    } else if (kanaMap[str[i]]) {
      res += kanaMap[str[i]];
    } else {
      res += str[i];
    }
  }
  return res;
}

const wb = xlsx.readFile(excelPath);
const codeMap = {};

for (const sheetName of wb.SheetNames) {
  const sheet = wb.Sheets[sheetName];
  const rows = xlsx.utils.sheet_to_json(sheet, { header: 1 });
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (!row || !row[0]) continue;
    const code = String(row[0]).trim();
    const prefKana = kanaHalfToHiragana(String(row[3] || '').trim());
    const nameKana = kanaHalfToHiragana(String(row[4] || '').trim());
    if (nameKana) {
      codeMap[code] = {
        nameKana,
        prefKana
      };
    }
  }
}

console.log('Total codes in excel mapping:', Object.keys(codeMap).length);

// Update summary
const summaries = JSON.parse(fs.readFileSync(summaryPath, 'utf8'));
let matchedSummary = 0;
for (const s of summaries) {
  const info = codeMap[s.code];
  if (info) {
    s.kana = info.nameKana;
    s.prefKana = info.prefKana;
    matchedSummary++;
  }
}
fs.writeFileSync(summaryPath, JSON.stringify(summaries), 'utf8');
console.log(`Updated summaries: matched ${matchedSummary} / ${summaries.length}`);

// Update full
const fulls = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
let matchedFull = 0;
for (const m of fulls) {
  const info = codeMap[m.code];
  if (info) {
    m.kana = info.nameKana;
    m.prefKana = info.prefKana;
    matchedFull++;
  }
}
fs.writeFileSync(fullPath, JSON.stringify(fulls), 'utf8');
console.log(`Updated full data: matched ${matchedFull} / ${fulls.length}`);
