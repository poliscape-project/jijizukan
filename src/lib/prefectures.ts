import fs from 'fs';
import path from 'path';
import { PrefectureData, PrefectureSummary } from '@/types/prefecture';

let cachedPrefectures: PrefectureData[] | null = null;
let cachedSummaries: PrefectureSummary[] | null = null;

function getDataFilePath(filename: string): string {
  return path.join(process.cwd(), 'src', 'data', filename);
}

export function getAllPrefectures(): PrefectureData[] {
  if (cachedPrefectures) return cachedPrefectures;
  const filePath = getDataFilePath('prefectures.json');
  if (!fs.existsSync(filePath)) return [];
  const raw = fs.readFileSync(filePath, 'utf-8');
  cachedPrefectures = JSON.parse(raw);
  return cachedPrefectures || [];
}

export function getPrefectureSummaries(): PrefectureSummary[] {
  if (cachedSummaries) return cachedSummaries;
  const filePath = getDataFilePath('prefectures_summary.json');
  if (fs.existsSync(filePath)) {
    const raw = fs.readFileSync(filePath, 'utf-8');
    cachedSummaries = JSON.parse(raw);
    return cachedSummaries || [];
  }
  const all = getAllPrefectures();
  cachedSummaries = all.map(p => ({
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
  return cachedSummaries || [];
}

export function getPrefectureByCode(code: string): PrefectureData | null {
  const all = getAllPrefectures();
  return all.find(p => p.code === code) || null;
}

export function getPrefectureByPrefCode(prefCode: string): PrefectureData | null {
  const all = getAllPrefectures();
  const cleanCode = prefCode.padStart(2, '0');
  return all.find(p => p.prefCode === cleanCode) || null;
}
