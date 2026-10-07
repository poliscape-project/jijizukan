const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');

console.log('--- Step 2 Data Injection Starting ---');

// 1. Load existing municipalities
const muniPath = path.join(__dirname, '../src/data/municipalities.json');
const munis = JSON.parse(fs.readFileSync(muniPath, 'utf-8'));
console.log(`Loaded ${munis.length} municipalities from DB.`);

// 2. Load Demographics Excel
console.log('Loading population_age.xlsx...');
const popFile = path.join(__dirname, 'population_age.xlsx');
const popWb = xlsx.readFile(popFile);
const popSheet = popWb.Sheets[popWb.SheetNames[0]];
const popRows = xlsx.utils.sheet_to_json(popSheet, { header: 1 });

const ageGroups = [
  '0〜4歳', '5〜9歳', '10〜14歳', '15〜19歳', '20〜24歳',
  '25〜29歳', '30〜34歳', '35〜39歳', '40〜44歳', '45〜49歳',
  '50〜54歳', '55〜59歳', '60〜64歳', '65〜69歳', '70〜74歳',
  '75〜79歳', '80〜84歳', '85〜89歳', '90〜94歳', '95〜99歳',
  '100歳以上'
];

const popDataByCode = new Map();

for (let r = 6; r < popRows.length; r++) {
  const row = popRows[r];
  if (!row || !row[0]) continue;
  const rawCode = String(row[0]).trim();
  const code = rawCode.padStart(6, '0');
  const sex = String(row[3]).trim();

  if (!popDataByCode.has(code)) {
    popDataByCode.set(code, {});
  }
  const entry = popDataByCode.get(code);
  if (sex === '計') entry.totalRow = row;
  else if (sex === '男') entry.maleRow = row;
  else if (sex === '女') entry.femaleRow = row;
}

const demographicsMap = new Map();
for (const [code, entry] of popDataByCode.entries()) {
  const tRow = entry.totalRow;
  if (!tRow) continue;
  const mRow = entry.maleRow || [];
  const fRow = entry.femaleRow || [];

  const total = Number(tRow[4]) || 0;
  if (total === 0) continue;

  const pyramid = [];
  let childPop = 0;
  let workingAgePop = 0;
  let elderlyPop = 0;
  let lateElderlyPop = 0;

  for (let i = 0; i < 21; i++) {
    const colIdx = 5 + i;
    const totVal = Number(tRow[colIdx]) || 0;
    const mVal = Number(mRow[colIdx]) || 0;
    const fVal = Number(fRow[colIdx]) || 0;

    pyramid.push({
      ageGroup: ageGroups[i],
      male: mVal,
      female: fVal,
      total: totVal
    });

    if (i < 3) {
      childPop += totVal; // 0-14
    } else if (i < 13) {
      workingAgePop += totVal; // 15-64
    } else {
      elderlyPop += totVal; // 65+
      if (i >= 15) {
        lateElderlyPop += totVal; // 75+
      }
    }
  }

  const childRate = Math.round((childPop / total) * 1000) / 10;
  const workingAgeRate = Math.round((workingAgePop / total) * 1000) / 10;
  const elderlyRate = Math.round((elderlyPop / total) * 1000) / 10;
  const lateElderlyRate = Math.round((lateElderlyPop / total) * 1000) / 10;

  demographicsMap.set(code, {
    total,
    childPop,
    childRate,
    workingAgePop,
    workingAgeRate,
    elderlyPop,
    elderlyRate,
    lateElderlyPop,
    lateElderlyRate,
    pyramid
  });
}
console.log(`Parsed demographics for ${demographicsMap.size} entities.`);

// 3. Load Furusato Received
console.log('Loading furusato_received_latest.xlsx...');
const fRecFile = path.join(__dirname, 'furusato_received_latest.xlsx');
const fRecWb = xlsx.readFile(fRecFile);
const fRecSheet = fRecWb.Sheets[fRecWb.SheetNames[0]];
const fRecRows = xlsx.utils.sheet_to_json(fRecSheet, { header: 1 });

const fRecMap = new Map();
for (let r = 13; r < fRecRows.length; r++) {
  const row = fRecRows[r];
  if (!row || !row[0]) continue;
  const rawCode = String(row[0]).trim();
  const code = rawCode.padStart(6, '0');
  fRecMap.set(code, {
    receivedCount: Number(row[3]) || 0,
    received: Number(row[4]) || 0,
    expenseProcure: Number(row[11]) || 0,
    expenseShipping: Number(row[12]) || 0,
    expensePr: Number(row[13]) || 0,
    expensePayment: Number(row[14]) || 0,
    expenseAdmin: Number(row[15]) || 0,
    expensesTotal: Number(row[17]) || 0,
  });
}

// 4. Load Furusato Deducted
console.log('Loading furusato_deducted_latest.xlsx...');
const fDedFile = path.join(__dirname, 'furusato_deducted_latest.xlsx');
const fDedWb = xlsx.readFile(fDedFile);
const fDedSheet = fDedWb.Sheets['集計表'];
const fDedRows = xlsx.utils.sheet_to_json(fDedSheet, { header: 1 });

const fDedMap = new Map();
for (let r = 18; r < fDedRows.length; r++) {
  const row = fDedRows[r];
  if (!row || !row[0]) continue;
  const rawCode = String(row[0]).trim();
  const code = rawCode.padStart(6, '0');
  
  // Use column 56 (full deduction with multi/est) or column 5
  const deducted = Math.round(Number(row[56]) || Number(row[5]) || 0);
  const deductedCount = Number(row[54]) || Number(row[3]) || 0;

  fDedMap.set(code, {
    deducted,
    deductedCount
  });
}

// 5. Merge into Municipalities Data
let countMergedDemo = 0;
let countMergedFurusato = 0;

for (const m of munis) {
  const pop = m.population || 1;
  const code = m.code;

  // Demographics
  if (demographicsMap.has(code)) {
    m.demographics = demographicsMap.get(code);
    countMergedDemo++;
  }

  // Furusato
  const rec = fRecMap.get(code) || {
    received: 0,
    receivedCount: 0,
    expensesTotal: 0,
    expenseProcure: 0,
    expenseShipping: 0,
    expensePr: 0,
    expensePayment: 0,
    expenseAdmin: 0
  };
  const ded = fDedMap.get(code) || {
    deducted: 0,
    deductedCount: 0
  };

  const balance = rec.received - ded.deducted;
  const balancePerCapita = Math.round(balance / pop);
  const realBalance = (rec.received - rec.expensesTotal) - ded.deducted;

  m.furusato = {
    received: rec.received,
    receivedCount: rec.receivedCount,
    deducted: ded.deducted,
    deductedCount: ded.deductedCount,
    balance,
    balancePerCapita,
    expensesTotal: rec.expensesTotal,
    expenseProcure: rec.expenseProcure,
    expenseShipping: rec.expenseShipping,
    expensePr: rec.expensePr,
    expensePayment: rec.expensePayment,
    expenseAdmin: rec.expenseAdmin,
    realBalance
  };
  countMergedFurusato++;
}

console.log(`Merged Demographics into: ${countMergedDemo}/${munis.length}`);
console.log(`Merged Furusato into: ${countMergedFurusato}/${munis.length}`);

// Write updated municipalities.json
fs.writeFileSync(muniPath, JSON.stringify(munis, null, 2), 'utf-8');
console.log(`Updated ${muniPath} (size: ${(fs.statSync(muniPath).size / 1024 / 1024).toFixed(2)} MB)`);

// 6. Generate updated municipalities_summary.json
const summaryList = munis.map(m => {
  const pop = m.population || 1;
  const reserveTotal = m.financial.reserveFundTotal * 1000;
  const debtTotal = m.financial.debtOutstanding * 1000;
  return {
    code: m.code,
    prefCode: m.prefCode,
    prefName: m.prefName,
    name: m.name,
    typeGroup: m.typeGroup,
    population: m.population,
    area: m.area,
    financialStrength: m.financial.financialStrengthIndex,
    ordinaryBalance: m.financial.ordinaryBalanceRatio,
    realDebtRatio: m.financial.realDebtServiceRatio,
    revTotal: m.revenues.total,
    expTotal: m.expensesByPurpose.total,
    publicWorks: m.expensesByPurpose.publicWorks,
    welfare: m.expensesByPurpose.welfare,
    publicWorksPerCapita: Math.round((m.expensesByPurpose.publicWorks * 1000) / pop),
    reserveTotal,
    debtTotal,
    netPerCapita: Math.round((reserveTotal - debtTotal) / pop),
    assemblyCostPerCapita: Math.round((m.expensesByPurpose.assembly * 1000) / pop),
    agingRate: m.demographics ? m.demographics.elderlyRate : undefined,
    childRate: m.demographics ? m.demographics.childRate : undefined,
    furusatoBalance: m.furusato ? m.furusato.balance : undefined,
    furusatoReceived: m.furusato ? m.furusato.received : undefined,
    furusatoDeducted: m.furusato ? m.furusato.deducted : undefined,
    furusatoBalancePerCapita: m.furusato ? m.furusato.balancePerCapita : undefined,
    hasAlerts: Boolean(m.alerts && m.alerts.length > 0)
  };
});

const summaryPath = path.join(__dirname, '../src/data/municipalities_summary.json');
fs.writeFileSync(summaryPath, JSON.stringify(summaryList), 'utf-8');
console.log(`Generated ${summaryPath} (size: ${(fs.statSync(summaryPath).size / 1024).toFixed(1)} KB)`);

console.log('--- Step 2 Data Injection Completed Successfully! ---');
