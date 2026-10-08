const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');

const EXCEL_PATH = path.join(__dirname, 'cache_kessan', 'pref_000999084.xlsx');
const OUTPUT_FILE = path.join(__dirname, '../src/data/prefectures.json');
const OUTPUT_SUMMARY = path.join(__dirname, '../src/data/prefectures_summary.json');

function parseNum(val) {
  if (val === undefined || val === null || val === '-' || val === '') return 0;
  if (typeof val === 'number') return val;
  const cleaned = String(val).replace(/,/g, '').trim();
  const n = Number(cleaned);
  return isNaN(n) ? 0 : n;
}

const PREF_NAMES = [
  '北海道', '青森県', '岩手県', '宮城県', '秋田県', '山形県', '福島県',
  '茨城県', '栃木県', '群馬県', '埼玉県', '千葉県', '東京都', '神奈川県',
  '新潟県', '富山県', '石川県', '福井県', '山梨県', '長野県', '岐阜県',
  '静岡県', '愛知県', '三重県', '滋賀県', '京都府', '大阪府', '兵庫県',
  '奈良県', '和歌山県', '鳥取県', '島根県', '岡山県', '広島県', '山口県',
  '徳島県', '香川県', '愛媛県', '高知県', '福岡県', '佐賀県', '長崎県',
  '熊本県', '大分県', '宮崎県', '鹿児島県', '沖縄県'
];

function main() {
  console.log('Loading pref Excel:', EXCEL_PATH);
  const wb = xlsx.readFile(EXCEL_PATH);

  const results = [];

  for (let i = 0; i < PREF_NAMES.length; i++) {
    const prefName = PREF_NAMES[i];
    const code = String(i + 1).padStart(2, '0') + '0003'; // 都道府県コード (例: 010003, 130001, 280003 等)
    const prefCode = String(i + 1).padStart(2, '0');

    // シートを探す (例: "2北海道", "29兵庫県")
    const sheetName = wb.SheetNames.find(s => s.includes(prefName));
    if (!sheetName) {
      console.warn(`Sheet not found for ${prefName}`);
      continue;
    }

    const sheet = wb.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });

    // 1. 基本規模
    const popResident = parseNum(data[3] ? data[3][47] : 0); // 住基人口
    const popCensus = parseNum(data[1] ? data[1][32] : 0);   // 国調人口
    const pop = popResident || popCensus || 100000;
    const area = parseNum(data[4] ? data[4][32] : 0);
    const popDensity = parseNum(data[5] ? data[5][32] : 0);

    // 2. 歳入 (千円)
    const localTax = parseNum(data[10] ? data[10][11] : 0);
    const localTransferTax = parseNum(data[11] ? data[11][11] : 0);
    const localAllocationTax = parseNum(data[23] ? data[23][11] : 0); // 地方交付税
    const allocOrdinary = parseNum(data[24] ? data[24][11] : 0);      // 普通交付税
    const allocSpecial = parseNum(data[25] ? data[25][11] : 0);       // 特別交付税
    const nationalSubsidy = parseNum(data[32] ? data[32][11] : 0);    // 国庫支出金
    const transfers = parseNum(data[36] ? data[36][11] : 0);          // 繰入金
    const carriedOver = parseNum(data[37] ? data[37][11] : 0);        // 繰越金
    const miscellaneous = parseNum(data[38] ? data[38][11] : 0);      // 諸収入
    const localBonds = parseNum(data[39] ? data[39][11] : 0);         // 地方債
    const revTotal = parseNum(data[42] ? data[42][11] : 0);           // 歳入合計

    // 3. 目的別歳出 (千円)
    const expAssembly = parseNum(data[47] ? data[47][54] : 0);  // 議会費
    const expGeneral = parseNum(data[48] ? data[48][54] : 0);   // 総務費
    const expWelfare = parseNum(data[49] ? data[49][54] : 0);   // 民生費
    const expHealth = parseNum(data[50] ? data[50][54] : 0);    // 衛生費
    const expLabor = parseNum(data[51] ? data[51][54] : 0);     // 労働費
    const expAgriculture = parseNum(data[52] ? data[52][54] : 0); // 農林水産業費
    const expCommerce = parseNum(data[53] ? data[53][54] : 0);  // 商工費
    const expPublicWorks = parseNum(data[54] ? data[54][54] : 0); // 土木費
    const expPolice = parseNum(data[55] ? data[55][54] : 0);    // 警察費
    const expEducation = parseNum(data[57] ? data[57][54] : 0); // 教育費
    const expDisaster = parseNum(data[58] ? data[58][54] : 0);  // 災害復旧費
    const expDebt = parseNum(data[59] ? data[59][54] : 0);      // 公債費
    const expTotal = parseNum(data[74] ? data[74][54] : (data[71] ? data[71][11] : revTotal)); // 歳出合計

    // 4. 財政健全化判断比率・主要指標
    const finStrength = parseNum(data[37] ? data[37][93] : 0);     // 財政力指数
    const realBalanceRatio = parseNum(data[38] ? data[38][93] : 0);// 実質収支比率
    const debtBurdenRatio = parseNum(data[39] ? data[39][93] : 0); // 公債費負担比率
    const realDebtRatio = parseNum(data[42] ? data[42][93] : 0);   // 実質公債費比率
    const futureBurdenRatio = parseNum(data[43] ? data[43][93] : 0); // 将来負担比率
    const ordinaryBalanceRatio = parseNum(data[67] ? data[67][39] : 0); // 経常収支比率
    const standardFiscalScale = parseNum(data[36] ? data[36][93] : 0); // 標準財政規模

    // 5. 積立基金 & 地方債残高 (千円)
    const fiscalAdjustmentFund = parseNum(data[44] ? data[44][93] : 0); // 財政調整基金
    const debtReductionFund = parseNum(data[45] ? data[45][93] : 0);    // 減債基金
    const specialPurposeFund = parseNum(data[46] ? data[46][93] : 0);   // その他特定目的基金
    const reserveFundTotal = fiscalAdjustmentFund + debtReductionFund + specialPurposeFund;
    const debtOutstanding = parseNum(data[49] ? data[49][93] : 0);      // 地方債現在高

    // 6. ガバナンス
    const governorSalary = parseNum(data[26] ? data[26][104] : 0) * 100; // 知事月額 (円)
    const councilSalary = parseNum(data[31] ? data[31][104] : 0) * 100;  // 議員月額 (円)
    const councilCount = parseNum(data[31] ? data[31][93] : 0);          // 議員定数
    const staffCount = parseNum(data[22] ? data[22][93] : 0);            // 職員総数

    // 住民1人あたり指標
    const reserveTotalYen = reserveFundTotal * 1000;
    const debtTotalYen = debtOutstanding * 1000;
    const netPerCapita = Math.round((reserveTotalYen - debtTotalYen) / pop);
    const publicWorksPerCapita = Math.round((expPublicWorks * 1000) / pop);
    const debtPerCapita = Math.round(debtTotalYen / pop);
    const reservePerCapita = Math.round(reserveTotalYen / pop);

    const prefData = {
      code,
      prefCode,
      name: prefName,
      type: 'prefecture',
      population: pop,
      area,
      popDensity,
      financial: {
        financialStrengthIndex: finStrength,
        ordinaryBalanceRatio,
        realDebtServiceRatio: realDebtRatio,
        futureBurdenRatio,
        realBalanceRatio,
        standardFiscalScale,
        reserveFundTotal,
        fiscalAdjustmentFund,
        debtOutstanding,
        netPerCapita,
        debtPerCapita,
        reservePerCapita
      },
      revenues: {
        total: revTotal,
        localTax,
        localTransferTax,
        localAllocationTax,
        nationalSubsidy,
        localBonds,
        transfers,
        carriedOver,
        miscellaneous,
        other: Math.max(0, revTotal - (localTax + localTransferTax + localAllocationTax + nationalSubsidy + localBonds))
      },
      expensesByPurpose: {
        total: expTotal,
        assembly: expAssembly,
        generalAdmin: expGeneral,
        welfare: expWelfare,
        healthSanitation: expHealth,
        labor: expLabor,
        agriculture: expAgriculture,
        commerceIndustry: expCommerce,
        publicWorks: expPublicWorks,
        police: expPolice,
        education: expEducation,
        disasterRecovery: expDisaster,
        debtService: expDebt,
        other: Math.max(0, expTotal - (expAssembly + expGeneral + expWelfare + expHealth + expLabor + expAgriculture + expCommerce + expPublicWorks + expPolice + expEducation + expDisaster + expDebt))
      },
      governance: {
        governorSalary,
        councilSalary,
        councilCount,
        staffCount
      }
    };

    results.push(prefData);
  }

  console.log(`Parsed ${results.length} prefectures.`);

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(results, null, 2), 'utf-8');
  console.log('Saved to', OUTPUT_FILE);

  // Summary
  const summaries = results.map(p => ({
    code: p.code,
    prefCode: p.prefCode,
    name: p.name,
    population: p.population,
    area: p.area,
    financialStrength: p.financial.financialStrengthIndex,
    ordinaryBalance: p.financial.ordinaryBalanceRatio,
    realDebtRatio: p.financial.realDebtServiceRatio,
    futureBurdenRatio: p.financial.futureBurdenRatio,
    revTotal: p.revenues.total,
    expTotal: p.expensesByPurpose.total,
    debtOutstanding: p.financial.debtOutstanding,
    reserveFundTotal: p.financial.reserveFundTotal,
    debtPerCapita: p.financial.debtPerCapita,
    reservePerCapita: p.financial.reservePerCapita,
    netPerCapita: p.financial.netPerCapita,
    publicWorksPerCapita: Math.round((p.expensesByPurpose.publicWorks * 1000) / p.population),
    policePerCapita: Math.round((p.expensesByPurpose.police * 1000) / p.population),
    educationPerCapita: Math.round((p.expensesByPurpose.education * 1000) / p.population),
    governorSalary: p.governance.governorSalary,
    councilSalary: p.governance.councilSalary
  }));

  fs.writeFileSync(OUTPUT_SUMMARY, JSON.stringify(summaries, null, 2), 'utf-8');
  console.log('Saved summary to', OUTPUT_SUMMARY);
}

main();
