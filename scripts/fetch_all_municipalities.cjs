const https = require('https');
const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');

const CACHE_DIR = path.join(__dirname, 'cache_kessan');
const OUTPUT_FILE = path.join(__dirname, '../src/data/municipalities.json');
const OUTPUT_SUMMARY = path.join(__dirname, '../src/data/municipalities_summary.json');

if (!fs.existsSync(CACHE_DIR)) {
  fs.mkdirSync(CACHE_DIR, { recursive: true });
}

function parseNum(val) {
  if (val === undefined || val === null || val === '-' || val === '') return 0;
  if (typeof val === 'number') return val;
  const cleaned = String(val).replace(/,/g, '').trim();
  const n = Number(cleaned);
  return isNaN(n) ? 0 : n;
}

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(dest) && fs.statSync(dest).size > 10000) {
      return resolve(dest);
    }
    const file = fs.createWriteStream(dest);
    https.get(url, res => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return downloadFile(res.headers.location, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        file.close();
        fs.unlinkSync(dest);
        return reject(new Error(`Failed to download ${url}: status ${res.statusCode}`));
      }
      res.pipe(file);
      file.on('finish', () => {
        file.close(() => resolve(dest));
      });
    }).on('error', err => {
      file.close();
      if (fs.existsSync(dest)) fs.unlinkSync(dest);
      reject(err);
    });
  });
}

function parseSheet(sheet, sheetName, defaultPref) {
  const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });
  if (!data || data.length < 50) return null;

  let prefName = defaultPref || '';
  let cityName = sheetName.replace(/^\d+/, '').trim();
  let cityType = '';
  let popResident = 0;
  let popCensus = 0;
  let popChange = 0;
  let area = 0;
  let popDensity = 0;
  let prefCode = '';
  let cityCode = '';

  if (data[6] && data[6][77]) prefName = String(data[6][77]).trim();
  if (data[6] && data[6][88]) cityName = String(data[6][88]).trim();
  if (data[1] && data[1][105]) cityType = String(data[1][105]).trim();
  if (data[1] && data[1][28]) popCensus = parseNum(data[1][28]);
  if (data[3] && data[3][41]) popResident = parseNum(data[3][41]);
  if (data[3] && data[3][28]) popChange = parseNum(data[3][28]);
  if (data[4] && data[4][28]) area = parseNum(data[4][28]);
  if (data[5] && data[5][28]) popDensity = parseNum(data[5][28]);

  const r4 = data[4] || [];
  if (r4[77]) prefCode = String(r4[77]).trim().padStart(2, '0');
  if (r4[88]) cityCode = String(r4[88]).trim().padStart(4, '0');
  const fullCode = prefCode && cityCode ? `${prefCode}${cityCode}` : '';

  if (!fullCode || !cityName) return null;

  const ind1 = parseNum(data[6] ? data[6][61] : 0);
  const ind2 = parseNum(data[8] ? data[8][61] : 0);
  const ind3 = parseNum(data[10] ? data[10][61] : 0);

  // Revenues (Row 10 to 47)
  const localTax = parseNum(data[10] ? data[10][12] : 0);
  const localTransferTax = parseNum(data[11] ? data[11][12] : 0);
  const localConsumptionTax = parseNum(data[16] ? data[16][12] : 0);
  const localAllocationTax = parseNum(data[26] ? data[26][12] : 0);
  const allocOrdinary = parseNum(data[27] ? data[27][12] : 0);
  const allocSpecial = parseNum(data[28] ? data[28][12] : 0);
  const nationalSubsidy = parseNum(data[35] ? data[35][12] : 0);
  const prefSubsidy = parseNum(data[38] ? data[38][12] : 0);
  const propIncome = parseNum(data[39] ? data[39][12] : 0);
  const donation = parseNum(data[40] ? data[40][12] : 0);
  const transferIn = parseNum(data[41] ? data[41][12] : 0);
  const carriedOver = parseNum(data[42] ? data[42][12] : 0);
  const misc = parseNum(data[43] ? data[43][12] : 0);
  const localBonds = parseNum(data[44] ? data[44][12] : 0);
  const revTotal = parseNum(data[47] ? data[47][12] : 0);

  // Expenses by Purpose (Row 52 to 66, C57)
  const expAssembly = parseNum(data[52] ? data[52][57] : 0);
  const expGeneral = parseNum(data[53] ? data[53][57] : 0);
  const expWelfare = parseNum(data[54] ? data[54][57] : 0);
  const expHealth = parseNum(data[55] ? data[55][57] : 0);
  const expLabor = parseNum(data[56] ? data[56][57] : 0);
  const expAgri = parseNum(data[57] ? data[57][57] : 0);
  const expCommerce = parseNum(data[58] ? data[58][57] : 0);
  const expPublicWorks = parseNum(data[59] ? data[59][57] : 0);
  const expFire = parseNum(data[60] ? data[60][57] : 0);
  const expEducation = parseNum(data[61] ? data[61][57] : 0);
  const expDisaster = parseNum(data[62] ? data[62][57] : 0);
  const expDebt = parseNum(data[63] ? data[63][57] : 0);
  const expTotal = parseNum(data[66] ? data[66][57] : 0);

  // Expenses by Nature (Row 51 to 74, C12)
  const natPersonnel = parseNum(data[51] ? data[51][12] : 0);
  const natStaffSalary = parseNum(data[52] ? data[52][12] : 0);
  const natAssistance = parseNum(data[53] ? data[53][12] : 0);
  const natDebt = parseNum(data[54] ? data[54][12] : 0);
  const natSupplies = parseNum(data[59] ? data[59][12] : 0);
  const natMaintenance = parseNum(data[60] ? data[60][12] : 0);
  const natSubsidies = parseNum(data[61] ? data[61][12] : 0);
  const natInvestOrdinary = parseNum(data[69] ? data[69][12] : 0);
  const natInvestDisaster = parseNum(data[72] ? data[72][12] : 0);
  const natTransfers = parseNum(data[63] ? data[63][12] : 0);

  // Financial Indicators
  const finStrength = parseNum(data[54] ? data[54][96] : 0);
  const realBalanceRatio = parseNum(data[55] ? data[55][96] : 0);
  const realDebtRatio = parseNum(data[59] ? data[59][96] : 0);
  const futureBurdenRatio = parseNum(data[60] ? data[60][96] : null);
  const ordinaryBalanceRatio = parseNum(data[70] ? data[70][36] : 0);
  const standardFiscalScale = parseNum(data[53] ? data[53][96] : 0);
  const fiscalAdjustmentFund = parseNum(data[61] ? data[61][96] : 0);
  const debtReductionFund = parseNum(data[62] ? data[62][96] : 0);
  const specialPurposeFund = parseNum(data[63] ? data[63][96] : 0);
  const debtOutstanding = parseNum(data[64] ? data[64][96] : 0);

  // Governance
  const mayorSalary = parseNum(data[31] ? data[31][103] : 0);
  const councilMembersCount = parseNum(data[36] ? data[36][92] : 0);
  const councilSalary = parseNum(data[36] ? data[36][103] : 0);
  const laspeyresIndex = parseNum(data[28] ? data[28][92] : 0);
  const staffCount = parseNum(data[27] ? data[27][92] : 0);

  // Previous year totals
  const prevRevTotal = parseNum(data[10] ? data[10][102] : 0);
  const prevExpTotal = parseNum(data[11] ? data[11][102] : 0);

  return {
    code: fullCode,
    prefCode,
    prefName,
    name: cityName,
    typeGroup: cityType,
    population: popResident || popCensus,
    populationCensus: popCensus,
    popChangeRate: popChange,
    area,
    popDensity,
    industryRatio: {
      primary: ind1,
      secondary: ind2,
      tertiary: ind3
    },
    financial: {
      financialStrengthIndex: finStrength,
      realBalanceRatio,
      ordinaryBalanceRatio,
      realDebtServiceRatio: realDebtRatio,
      futureBurdenRatio,
      laspeyresIndex,
      standardFiscalScale,
      reserveFundTotal: fiscalAdjustmentFund + debtReductionFund + specialPurposeFund,
      fiscalAdjustmentFund,
      debtOutstanding
    },
    revenues: {
      total: revTotal,
      localTax,
      localTransferTax,
      localConsumptionTax,
      localAllocationTax,
      localAllocationTaxOrdinary: allocOrdinary,
      localAllocationTaxSpecial: allocSpecial,
      nationalSubsidy,
      prefecturalSubsidy: prefSubsidy,
      localBonds,
      transfers: transferIn,
      carriedOver,
      miscellaneous: misc,
      other: Math.max(0, revTotal - (localTax + localTransferTax + localConsumptionTax + localAllocationTax + nationalSubsidy + prefSubsidy + localBonds + transferIn + carriedOver + misc))
    },
    expensesByPurpose: {
      total: expTotal,
      assembly: expAssembly,
      generalAdmin: expGeneral,
      welfare: expWelfare,
      healthSanitation: expHealth,
      labor: expLabor,
      agricultureForestry: expAgri,
      commerceIndustry: expCommerce,
      publicWorks: expPublicWorks,
      fireFighting: expFire,
      education: expEducation,
      disasterRecovery: expDisaster,
      debtService: expDebt,
      other: Math.max(0, expTotal - (expAssembly + expGeneral + expWelfare + expHealth + expLabor + expAgri + expCommerce + expPublicWorks + expFire + expEducation + expDisaster + expDebt))
    },
    expensesByNature: {
      personnel: natPersonnel,
      staffSalary: natStaffSalary,
      socialAssistance: natAssistance,
      debtService: natDebt,
      supplies: natSupplies,
      maintenance: natMaintenance,
      subsidies: natSubsidies,
      investmentOrdinary: natInvestOrdinary,
      disasterRecovery: natInvestDisaster,
      transfers: natTransfers,
      other: Math.max(0, expTotal - (natPersonnel + natAssistance + natDebt + natSupplies + natMaintenance + natSubsidies + natInvestOrdinary + natInvestDisaster + natTransfers))
    },
    comparisonPrevYear: {
      revenuesTotal: prevRevTotal,
      expensesTotal: prevExpTotal,
      realBalance: parseNum(data[14] ? data[14][102] : 0)
    },
    governance: {
      mayorSalary: mayorSalary * 100,
      councilMembersCount,
      councilSalary: councilSalary * 100,
      staffCount
    }
  };
}

// Pref list with Soumu Excel links
const PREFS = [
  { pref: "北海道", url: "https://www.soumu.go.jp/main_content/000998921.xlsx" },
  { pref: "北海道", url: "https://www.soumu.go.jp/main_content/000998922.xlsx" },
  { pref: "青森県", url: "https://www.soumu.go.jp/main_content/000998924.xlsx" },
  { pref: "岩手県", url: "https://www.soumu.go.jp/main_content/000998926.xlsx" },
  { pref: "宮城県", url: "https://www.soumu.go.jp/main_content/000998928.xlsx" },
  { pref: "秋田県", url: "https://www.soumu.go.jp/main_content/000998930.xlsx" },
  { pref: "山形県", url: "https://www.soumu.go.jp/main_content/000998932.xlsx" },
  { pref: "福島県", url: "https://www.soumu.go.jp/main_content/000998934.xlsx" },
  { pref: "茨城県", url: "https://www.soumu.go.jp/main_content/000998936.xlsx" },
  { pref: "栃木県", url: "https://www.soumu.go.jp/main_content/000998938.xlsx" },
  { pref: "群馬県", url: "https://www.soumu.go.jp/main_content/000998940.xlsx" },
  { pref: "埼玉県", url: "https://www.soumu.go.jp/main_content/000998942.xlsx" },
  { pref: "千葉県", url: "https://www.soumu.go.jp/main_content/000998944.xlsx" },
  { pref: "東京都", url: "https://www.soumu.go.jp/main_content/000998946.xlsx" },
  { pref: "神奈川県", url: "https://www.soumu.go.jp/main_content/000998948.xlsx" },
  { pref: "新潟県", url: "https://www.soumu.go.jp/main_content/000998950.xlsx" },
  { pref: "富山県", url: "https://www.soumu.go.jp/main_content/000998952.xlsx" },
  { pref: "石川県", url: "https://www.soumu.go.jp/main_content/000998954.xlsx" },
  { pref: "福井県", url: "https://www.soumu.go.jp/main_content/000998956.xlsx" },
  { pref: "山梨県", url: "https://www.soumu.go.jp/main_content/000998958.xlsx" },
  { pref: "長野県", url: "https://www.soumu.go.jp/main_content/000998960.xlsx" },
  { pref: "岐阜県", url: "https://www.soumu.go.jp/main_content/000998962.xlsx" },
  { pref: "静岡県", url: "https://www.soumu.go.jp/main_content/000998964.xlsx" },
  { pref: "愛知県", url: "https://www.soumu.go.jp/main_content/000998966.xlsx" },
  { pref: "三重県", url: "https://www.soumu.go.jp/main_content/000998968.xlsx" },
  { pref: "滋賀県", url: "https://www.soumu.go.jp/main_content/000998970.xlsx" },
  { pref: "京都府", url: "https://www.soumu.go.jp/main_content/000998972.xlsx" },
  { pref: "大阪府", url: "https://www.soumu.go.jp/main_content/000998974.xlsx" },
  { pref: "兵庫県", url: "https://www.soumu.go.jp/main_content/000998976.xlsx" },
  { pref: "奈良県", url: "https://www.soumu.go.jp/main_content/000998978.xlsx" },
  { pref: "和歌山県", url: "https://www.soumu.go.jp/main_content/000998980.xlsx" },
  { pref: "鳥取県", url: "https://www.soumu.go.jp/main_content/000998982.xlsx" },
  { pref: "島根県", url: "https://www.soumu.go.jp/main_content/000998984.xlsx" },
  { pref: "岡山県", url: "https://www.soumu.go.jp/main_content/000998986.xlsx" },
  { pref: "広島県", url: "https://www.soumu.go.jp/main_content/000998988.xlsx" },
  { pref: "山口県", url: "https://www.soumu.go.jp/main_content/000998990.xlsx" },
  { pref: "徳島県", url: "https://www.soumu.go.jp/main_content/000998992.xlsx" },
  { pref: "香川県", url: "https://www.soumu.go.jp/main_content/000998994.xlsx" },
  { pref: "愛媛県", url: "https://www.soumu.go.jp/main_content/000998996.xlsx" },
  { pref: "高知県", url: "https://www.soumu.go.jp/main_content/000998998.xlsx" },
  { pref: "福岡県", url: "https://www.soumu.go.jp/main_content/000999000.xlsx" },
  { pref: "佐賀県", url: "https://www.soumu.go.jp/main_content/000999002.xlsx" },
  { pref: "長崎県", url: "https://www.soumu.go.jp/main_content/000999004.xlsx" },
  { pref: "熊本県", url: "https://www.soumu.go.jp/main_content/000999006.xlsx" },
  { pref: "大分県", url: "https://www.soumu.go.jp/main_content/000999008.xlsx" },
  { pref: "宮崎県", url: "https://www.soumu.go.jp/main_content/000999010.xlsx" },
  { pref: "鹿児島県", url: "https://www.soumu.go.jp/main_content/000999012.xlsx" },
  { pref: "沖縄県", url: "https://www.soumu.go.jp/main_content/000999014.xlsx" }
];

async function main() {
  console.log(`Starting download and parse for ${PREFS.length} prefectures...`);
  const allMunicipalities = [];

  for (let i = 0; i < PREFS.length; i++) {
    const item = PREFS[i];
    const fileId = path.basename(item.url);
    const dest = path.join(CACHE_DIR, `${item.pref}_${fileId}`);
    
    process.stdout.write(`[${i + 1}/${PREFS.length}] ${item.pref}... `);
    try {
      await downloadFile(item.url, dest);
      const wb = xlsx.readFile(dest);
      let count = 0;
      for (const sheetName of wb.SheetNames) {
        if (sheetName === '目次') continue;
        const res = parseSheet(wb.Sheets[sheetName], sheetName, item.pref);
        if (res) {
          allMunicipalities.push(res);
          count++;
        }
      }
      console.log(`done (${count} municipalities parsed)`);
    } catch (err) {
      console.log(`error: ${err.message}`);
    }
  }

  console.log(`\nTotal parsed: ${allMunicipalities.length} municipalities.`);

  // Calculate anomaly alerts & rankings
  console.log('Calculating alerts, anomalies & similar group stats...');
  
  // Group by typeGroup for benchmark comparison
  const typeGroups = {};
  allMunicipalities.forEach(m => {
    if (!m.typeGroup) return;
    if (!typeGroups[m.typeGroup]) {
      typeGroups[m.typeGroup] = {
        count: 0,
        totalPop: 0,
        totalPublicWorksPerCapita: 0,
        totalWelfarePerCapita: 0,
        totalFinancialStrength: 0,
        totalOrdinaryBalance: 0
      };
    }
    const g = typeGroups[m.typeGroup];
    g.count++;
    const pop = m.population || 1;
    g.totalPublicWorksPerCapita += (m.expensesByPurpose.publicWorks * 1000) / pop;
    g.totalWelfarePerCapita += (m.expensesByPurpose.welfare * 1000) / pop;
    g.totalFinancialStrength += m.financial.financialStrengthIndex;
    g.totalOrdinaryBalance += m.financial.ordinaryBalanceRatio;
  });

  const groupAverages = {};
  for (const [k, v] of Object.entries(typeGroups)) {
    groupAverages[k] = {
      avgPublicWorksPerCapita: Math.round(v.totalPublicWorksPerCapita / v.count),
      avgWelfarePerCapita: Math.round(v.totalWelfarePerCapita / v.count),
      avgFinancialStrength: Number((v.totalFinancialStrength / v.count).toFixed(2)),
      avgOrdinaryBalance: Number((v.totalOrdinaryBalance / v.count).toFixed(1))
    };
  }

  // Attach alerts
  allMunicipalities.forEach(m => {
    m.alerts = [];
    const pop = m.population || 1;
    const pwPerCapita = Math.round((m.expensesByPurpose.publicWorks * 1000) / pop);
    const avg = groupAverages[m.typeGroup];

    // Anomaly 1: Super high public works compared to peers
    if (avg && avg.avgPublicWorksPerCapita > 0 && pwPerCapita > avg.avgPublicWorksPerCapita * 1.8) {
      m.alerts.push({
        type: 'warning',
        title: '同規模自治体平均の1.8倍超の土木費',
        description: `住民1人あたり土木費は${pwPerCapita.toLocaleString()}円で、類似団体平均（${avg.avgPublicWorksPerCapita.toLocaleString()}円）の${(pwPerCapita / avg.avgPublicWorksPerCapita).toFixed(1)}倍に達しています。`
      });
    }

    // Anomaly 2: Very high financial strength or dependency
    if (m.financial.financialStrengthIndex >= 1.0) {
      m.alerts.push({
        type: 'info',
        title: '財政力指数1.0超（不交付団体）',
        description: `地方交付税の不交付団体基準（1.0以上）を満たしており、自主財源による自立的運営が行われています。`
      });
    } else if (m.financial.financialStrengthIndex < 0.25) {
      m.alerts.push({
        type: 'caution',
        title: '交付税依存度が高水準（財政力指数0.25未満）',
        description: `歳入の多くを国からの地方交付税に依存しており、国の財政措置方針の変動影響を受けやすい構造です。`
      });
    }

    // Anomaly 3: Ordinary balance ratio tightness
    if (m.financial.ordinaryBalanceRatio > 95) {
      m.alerts.push({
        type: 'warning',
        title: '経常収支比率95%超（財政硬直化アラート）',
        description: `経常的経費が一般財源の95%超を占め、新規政策や突発的支出への財政的弾力性が著しく低下しています。`
      });
    }

    // Specific link alert for Yana minister scandal municipalities
    if (m.name.includes('那須烏山') || m.name.includes('那珂川町')) {
      m.alerts.push({
        type: 'warning',
        title: '【注目】簗副大臣発言・補助金削減疑惑関連自治体',
        description: `第50回衆院選における「道路予算カット」恫喝発言および実際の交付金削減が問題視された自治体です。時事図鑑の特集記事と連動しています。`
      });
    }
  });

  // Save full JSON
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(allMunicipalities, null, 2), 'utf-8');
  console.log(`Saved full dataset to ${OUTPUT_FILE} (${(fs.statSync(OUTPUT_FILE).size / 1024 / 1024).toFixed(2)} MB)`);

  // Create lightweight summary JSON for client-side instant search / filtering
  const summary = allMunicipalities.map(m => ({
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
    publicWorksPerCapita: Math.round((m.expensesByPurpose.publicWorks * 1000) / (m.population || 1)),
    hasAlerts: (m.alerts && m.alerts.length > 0)
  }));

  fs.writeFileSync(OUTPUT_SUMMARY, JSON.stringify(summary), 'utf-8');
  console.log(`Saved summary dataset to ${OUTPUT_SUMMARY} (${(fs.statSync(OUTPUT_SUMMARY).size / 1024).toFixed(1)} KB)`);
}

main().catch(console.error);
