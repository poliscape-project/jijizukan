const fs = require('fs');
const munis = JSON.parse(fs.readFileSync('src/data/municipalities.json', 'utf-8'));

console.log('=== 消滅可能性自治体 サンプル ===');
const vanishing = munis.filter(m => m.sustainability && m.sustainability.category === '消滅可能性自治体');
console.log(`消滅可能性自治体 合計: ${vanishing.length} 団体`);
vanishing.slice(0, 3).forEach(m => {
  console.log(`- ${m.prefName}${m.name}: 若年女性減少率 ${m.sustainability.youngFemaleChangeRate}%, 2050年予測人口 ${m.sustainability.projectedPop2050}人 (${m.sustainability.popChangeRate}%)`);
});

console.log('\n=== 自立持続可能性自治体 サンプル ===');
const selfReliant = munis.filter(m => m.sustainability && m.sustainability.category === '自立持続可能性自治体');
console.log(`自立持続可能性自治体 合計: ${selfReliant.length} 団体`);
selfReliant.slice(0, 3).forEach(m => {
  console.log(`- ${m.prefName}${m.name}: 若年女性減少率 ${m.sustainability.youngFemaleChangeRate}%, 2050年予測人口 ${m.sustainability.projectedPop2050}人 (${m.sustainability.popChangeRate}%)`);
});

console.log('\n=== ブラックホール型自治体 サンプル ===');
const blackhole = munis.filter(m => m.sustainability && m.sustainability.category === 'ブラックホール型自治体');
console.log(`ブラックホール型自治体 合計: ${blackhole.length} 団体`);
blackhole.slice(0, 3).forEach(m => {
  console.log(`- ${m.prefName}${m.name}: 若年女性減少率 ${m.sustainability.youngFemaleChangeRate}%`);
});

console.log('\n=== 主要企業・産業情報 サンプル ===');
['豊田市', '飛島村', '千歳市', '菊陽町', '那須烏山市', '那珂川町'].forEach(name => {
  const m = munis.find(x => x.name === name);
  if (m && m.economy) {
    console.log(`- ${m.prefName}${m.name}:`);
    console.log(`  タイプ: ${m.economy.industryType}`);
    console.log(`  主要企業: ${m.economy.majorCompanies ? m.economy.majorCompanies.join(', ') : 'なし'}`);
    console.log(`  特産品: ${m.economy.featuredSpecialties ? m.economy.featuredSpecialties.join(', ') : 'なし'}`);
  }
});
