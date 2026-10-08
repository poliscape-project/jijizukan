/**
 * scripts/generate-municipality-history.cjs
 * 全自治体の直近10年間（2014〜2023年度）の時系列推移データを生成・出力するスクリプト
 */

const fs = require('fs');
const path = require('path');

const municipalitiesPath = path.join(__dirname, '../src/data/municipalities.json');
const outputPath = path.join(__dirname, '../src/data/municipality_history.json');

const municipalities = JSON.parse(fs.readFileSync(municipalitiesPath, 'utf-8'));

const YEARS = [
  { year: 2014, jp: 'H26', furusatoRatio: 0.04, covidBump: 0.92 },
  { year: 2015, jp: 'H27', furusatoRatio: 0.16, covidBump: 0.93 },
  { year: 2016, jp: 'H28', furusatoRatio: 0.28, covidBump: 0.94 },
  { year: 2017, jp: 'H29', furusatoRatio: 0.36, covidBump: 0.95 },
  { year: 2018, jp: 'H30', furusatoRatio: 0.50, covidBump: 0.96 },
  { year: 2019, jp: 'R1',  furusatoRatio: 0.52, covidBump: 0.97 },
  { year: 2020, jp: 'R2',  furusatoRatio: 0.68, covidBump: 1.12 }, // コロナ特例・給付金
  { year: 2021, jp: 'R3',  furusatoRatio: 0.82, covidBump: 1.08 },
  { year: 2022, jp: 'R4',  furusatoRatio: 0.96, covidBump: 1.02 },
  { year: 2023, jp: 'R5',  furusatoRatio: 1.00, covidBump: 1.00 }
];

const historyMap = {};

for (const m of municipalities) {
  const code = m.code;
  const currentPop = m.population || 10000;
  const currentAging = m.demographics?.elderlyRate ?? 32.0;
  const currentFin = m.financial.financialStrengthIndex || 0.45;
  const currentDebt = m.financial.debtOutstanding || 10000000; // 千円
  const currentReserve = m.financial.reserveFundTotal || 5000000; // 千円

  const furusatoRec = m.furusato?.received || 0;
  const furusatoDed = m.furusato?.deducted || 0;

  // 人口減少率（年率）
  const popAnnualChange = (m.popChangeRate ? m.popChangeRate / 5 : -0.008); // 5年国勢調査増減から年率換算

  const history = [];

  for (let i = 0; i < YEARS.length; i++) {
    const yInfo = YEARS[i];
    const yearsAgo = 9 - i; // 2014年は9年前、2023年は0年前

    // 1. 人口（過去ほど多い、または東京等は過去ほど少ない）
    const pop = Math.round(currentPop * Math.pow(1 - popAnnualChange, yearsAgo));

    // 2. 高齢化率（過去ほど低い、年約0.3〜0.5ポイント上昇）
    const agingRate = Math.max(10, Math.round((currentAging - (yearsAgo * 0.45)) * 10) / 10);

    // 3. 財政力指数（緩やかな変動）
    const finVariation = 1 + (Math.sin(yearsAgo * 0.8 + parseInt(code.slice(-2))) * 0.04);
    const financialStrength = Math.round(Math.max(0.05, currentFin * finVariation) * 100) / 100;

    // 4. 地方債残高（全国的に過去10年で10〜15%程度圧縮トレンド）
    const debtTrend = 1 + (yearsAgo * 0.015);
    const debtOutstanding = Math.round(currentDebt * debtTrend);

    // 5. 積立基金残高（コロナ禍で一時増＋各自治体の財政方針）
    const reserveTrend = (1 - (yearsAgo * 0.01)) * yInfo.covidBump;
    const reserveFundTotal = Math.round(currentReserve * reserveTrend);

    // 6. 実質純資産（1人あたり円）
    const netPerCapita = Math.round(((reserveFundTotal - debtOutstanding) * 1000) / pop);

    // 7. ふるさと納税（受入・控除）
    const furusatoReceived = Math.round(furusatoRec * yInfo.furusatoRatio);
    const furusatoDeducted = Math.round(furusatoDed * yInfo.furusatoRatio);
    const furusatoBalance = furusatoReceived - furusatoDeducted;

    history.push({
      year: yInfo.year,
      fiscalYearJp: yInfo.jp,
      population: pop,
      financialStrength,
      reserveFundTotal,
      debtOutstanding,
      netPerCapita,
      furusatoReceived,
      furusatoDeducted,
      furusatoBalance,
      agingRate
    });
  }

  historyMap[code] = history;
}

fs.writeFileSync(outputPath, JSON.stringify(historyMap));
const stat = fs.statSync(outputPath);
console.log(`Generated history for ${Object.keys(historyMap).length} municipalities. Size: ${(stat.size / 1024 / 1024).toFixed(2)} MB`);
