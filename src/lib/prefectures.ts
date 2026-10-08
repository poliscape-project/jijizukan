import fs from 'fs';
import path from 'path';
import { PrefectureData, PrefectureSummary, PrefectureProfile } from '@/types/prefecture';

let cachedPrefectures: PrefectureData[] | null = null;
let cachedSummaries: PrefectureSummary[] | null = null;
let cachedProfiles: Record<string, PrefectureProfile> | null = null;

const isProd = process.env.NODE_ENV === 'production';

function getDataFilePath(filename: string): string {
  return path.join(process.cwd(), 'src', 'data', filename);
}

function getProfiles(): Record<string, PrefectureProfile> {
  if (isProd && cachedProfiles) return cachedProfiles;
  const filePath = getDataFilePath('prefecture_profiles.json');
  if (!fs.existsSync(filePath)) return {};
  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    const parsed = JSON.parse(raw);
    if (isProd) cachedProfiles = parsed;
    return parsed || {};
  } catch {
    return {};
  }
}

export function getAllPrefectures(): PrefectureData[] {
  if (isProd && cachedPrefectures) return cachedPrefectures;
  const filePath = getDataFilePath('prefectures.json');
  if (!fs.existsSync(filePath)) return [];
  const raw = fs.readFileSync(filePath, 'utf-8');
  const baseList: PrefectureData[] = JSON.parse(raw);
  const profiles = getProfiles();

  const mapped = baseList.map(p => {
    const profile = profiles[p.prefCode];
    return {
      ...p,
      profile: profile || undefined
    };
  });

  if (isProd) cachedPrefectures = mapped;
  return mapped;
}

export function getPrefectureSummaries(): PrefectureSummary[] {
  if (isProd && cachedSummaries) return cachedSummaries;
  const all = getAllPrefectures();
  const profiles = getProfiles();

  const mapped = all.map(p => {
    const prof = profiles[p.prefCode];
    return {
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
      councilSalary: p.governance.councilSalary,
      headline: prof?.headline,
      tags: prof?.tags
    };
  });

  if (isProd) cachedSummaries = mapped;
  return mapped;
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
