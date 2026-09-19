const fs = require('fs');
const path = require('path');

const dirs = ['domestic', 'international'];
let results = {
  upToDate2026: [],
  stale2025: [],
  stale2024: [],
  older: []
};

for (const dir of dirs) {
  const p = path.join(__dirname, '../src/data/topics', dir);
  const files = fs.readdirSync(p).filter(f => f.endsWith('.json'));
  for (const f of files) {
    const data = JSON.parse(fs.readFileSync(path.join(p, f), 'utf-8'));
    const latestDev = data.developments && data.developments.length > 0 ? data.developments[0].date : 'none';
    const year = latestDev.substring(0, 4);
    const item = {
      scope: dir,
      id: data.id,
      title: data.title,
      latestDev: latestDev,
      hasCustom: !!data.customSections,
      category: data.category
    };
    if (year === '2026') results.upToDate2026.push(item);
    else if (year === '2025') results.stale2025.push(item);
    else if (year === '2024') results.stale2024.push(item);
    else results.older.push(item);
  }
}

console.log('=== SUMMARY ===');
console.log('2026 (Updated):', results.upToDate2026.length);
console.log('2025:', results.stale2025.length);
console.log('2024 (Stale):', results.stale2024.length);
console.log('Older:', results.older.length);

console.log('\n=== 2026 UPDATED TOPICS (' + results.upToDate2026.length + ') ===');
results.upToDate2026.forEach(t => {
  console.log('[' + t.scope + '] ' + t.id + ' : ' + t.title + ' (' + t.latestDev + ') custom:' + t.hasCustom);
});

console.log('\n=== 2025 TOPICS (' + results.stale2025.length + ') ===');
results.stale2025.forEach(t => {
  console.log('[' + t.scope + '] ' + t.id + ' : ' + t.title + ' (' + t.latestDev + ') custom:' + t.hasCustom);
});

console.log('\n=== 2024 STALE TOPICS (' + results.stale2024.length + ') ===');
results.stale2024.forEach(t => {
  console.log('[' + t.scope + '] ' + t.id + ' : ' + t.title + ' (' + t.latestDev + ')');
});
