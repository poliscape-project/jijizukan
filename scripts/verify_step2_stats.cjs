const fs = require('fs');
const munis = JSON.parse(fs.readFileSync('src/data/municipalities.json', 'utf-8'));

console.log('=== ふるさと納税 純収支（黒字）トップ5 ===');
munis.slice().sort((a,b) => b.furusato.balance - a.furusato.balance).slice(0, 5).forEach((m, i) => {
  console.log(`${i+1}. ${m.prefName}${m.name}: 受入 ${(m.furusato.received/1e8).toFixed(1)}億円 - 流出 ${(m.furusato.deducted/1e8).toFixed(1)}億円 = 黒字 ${(m.furusato.balance/1e8).toFixed(1)}億円 (1人あたり +${m.furusato.balancePerCapita.toLocaleString()}円)`);
});

console.log('\n=== ふるさと納税 純収支（赤字/流出超過）ワースト5 ===');
munis.slice().sort((a,b) => a.furusato.balance - b.furusato.balance).slice(0, 5).forEach((m, i) => {
  console.log(`${i+1}. ${m.prefName}${m.name}: 受入 ${(m.furusato.received/1e8).toFixed(1)}億円 - 流出 ${(m.furusato.deducted/1e8).toFixed(1)}億円 = 赤字 ${(m.furusato.balance/1e8).toFixed(1)}億円 (1人あたり ${m.furusato.balancePerCapita.toLocaleString()}円)`);
});

console.log('\n=== 高齢化率 トップ5 ===');
munis.slice().sort((a,b) => b.demographics.elderlyRate - a.demographics.elderlyRate).slice(0, 5).forEach((m, i) => {
  console.log(`${i+1}. ${m.prefName}${m.name}: 高齢化率 ${m.demographics.elderlyRate}% (総人口 ${m.demographics.total}人, 65歳以上 ${m.demographics.elderlyPop}人)`);
});

console.log('\n=== 年少人口比率（子ども率）トップ5 ===');
munis.slice().sort((a,b) => b.demographics.childRate - a.demographics.childRate).slice(0, 5).forEach((m, i) => {
  console.log(`${i+1}. ${m.prefName}${m.name}: 子ども比率 ${m.demographics.childRate}% (高齢化率 ${m.demographics.elderlyRate}%)`);
});
