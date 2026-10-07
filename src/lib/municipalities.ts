import fs from 'fs';
import path from 'path';
import { MunicipalityData, MunicipalitySummary } from '@/types/municipality';

let cachedMunicipalities: MunicipalityData[] | null = null;
let cachedSummaries: MunicipalitySummary[] | null = null;

function getDataFilePath(filename: string): string {
  return path.join(process.cwd(), 'src', 'data', filename);
}

export function getAllMunicipalities(): MunicipalityData[] {
  if (cachedMunicipalities) return cachedMunicipalities;
  const filePath = getDataFilePath('municipalities.json');
  if (!fs.existsSync(filePath)) return [];
  const raw = fs.readFileSync(filePath, 'utf-8');
  cachedMunicipalities = JSON.parse(raw);
  return cachedMunicipalities || [];
}

export function getMunicipalitySummaries(): MunicipalitySummary[] {
  if (cachedSummaries) return cachedSummaries;
  const filePath = getDataFilePath('municipalities_summary.json');
  if (!fs.existsSync(filePath)) {
    // Fallback: derive from full data
    const full = getAllMunicipalities();
    cachedSummaries = full.map(m => ({
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
      hasAlerts: Boolean(m.alerts && m.alerts.length > 0)
    }));
    return cachedSummaries;
  }
  const raw = fs.readFileSync(filePath, 'utf-8');
  cachedSummaries = JSON.parse(raw);
  return cachedSummaries || [];
}

export function getMunicipalityByCode(code: string): MunicipalityData | null {
  const all = getAllMunicipalities();
  return all.find(m => m.code === code) || null;
}

export function getSimilarMunicipalities(typeGroup: string, currentCode: string, limit = 4): MunicipalityData[] {
  const all = getAllMunicipalities();
  return all
    .filter(m => m.typeGroup === typeGroup && m.code !== currentCode)
    .sort((a, b) => Math.abs(a.population - (all.find(x => x.code === currentCode)?.population || 0)) - Math.abs(b.population - (all.find(x => x.code === currentCode)?.population || 0)))
    .slice(0, limit);
}
