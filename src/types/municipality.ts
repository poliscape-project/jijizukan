export interface MunicipalityAlert {
  type: 'warning' | 'info' | 'caution';
  title: string;
  description: string;
}

export interface MunicipalityIndustryRatio {
  primary: number;
  secondary: number;
  tertiary: number;
}

export interface MunicipalityFinancial {
  financialStrengthIndex: number; // 財政力指数
  realBalanceRatio: number; // 実質収支比率 (%)
  ordinaryBalanceRatio: number; // 経常収支比率 (%)
  realDebtServiceRatio: number; // 実質公債費比率 (%)
  futureBurdenRatio: number | null; // 将来負担比率 (%)
  laspeyresIndex: number; // ラスパイレス指数
  standardFiscalScale: number; // 標準財政規模 (千円)
  reserveFundTotal: number; // 積立金現在高合計 (千円)
  fiscalAdjustmentFund: number; // 財政調整基金現在高 (千円)
  debtOutstanding: number; // 地方債現在高 (千円)
}

export interface MunicipalityRevenues {
  total: number;
  localTax: number;
  localTransferTax: number;
  localConsumptionTax: number;
  localAllocationTax: number;
  localAllocationTaxOrdinary: number;
  localAllocationTaxSpecial: number;
  nationalSubsidy: number;
  prefecturalSubsidy: number;
  localBonds: number;
  transfers: number;
  carriedOver: number;
  miscellaneous: number;
  other: number;
}

export interface MunicipalityExpensesByPurpose {
  total: number;
  assembly: number; // 議会費
  generalAdmin: number; // 総務費
  welfare: number; // 民生費
  healthSanitation: number; // 衛生費
  labor: number; // 労働費
  agricultureForestry: number; // 農林水産業費
  commerceIndustry: number; // 商工費
  publicWorks: number; // 土木費
  fireFighting: number; // 消防費
  education: number; // 教育費
  disasterRecovery: number; // 災害復旧費
  debtService: number; // 公債費
  other: number; // 諸支出金等
}

export interface MunicipalityExpensesByNature {
  personnel: number; // 人件費
  staffSalary: number; // うち職員給
  socialAssistance: number; // 扶助費
  debtService: number; // 公債費
  supplies: number; // 物件費
  maintenance: number; // 維持補修費
  subsidies: number; // 補助費等
  investmentOrdinary: number; // 普通建設事業費
  disasterRecovery: number; // 災害復旧事業費
  transfers: number; // 繰出金
  other: number;
}

export interface DemographicAgeGroup {
  ageGroup: string;
  male: number;
  female: number;
  total: number;
}

export interface MunicipalityDemographics {
  total: number;
  childPop: number; // 0〜14歳人口
  childRate: number; // 年少人口比率 (%)
  workingAgePop: number; // 15〜64歳人口
  workingAgeRate: number; // 生産年齢人口比率 (%)
  elderlyPop: number; // 65歳以上人口
  elderlyRate: number; // 高齢化率 (%)
  lateElderlyPop: number; // 75歳以上人口
  lateElderlyRate: number; // 後期高齢化率 (%)
  pyramid: DemographicAgeGroup[];
}

export interface MunicipalityFurusato {
  received: number; // 寄附受入額 (円)
  receivedCount: number; // 受入件数
  deducted: number; // 住民税控除流出額 (円)
  deductedCount: number; // 控除適用人数
  balance: number; // 純収支 = received - deducted (円)
  balancePerCapita: number; // 住民1人あたり収支 (円)
  expensesTotal: number; // 返礼品等の経費合計 (円)
  expenseProcure: number; // うち返礼品調達費
  expenseShipping: number; // うち送料
  expensePr: number; // うち広報費
  expensePayment: number; // うち決済等費用
  expenseAdmin: number; // うち事務費
  realBalance: number; // 実質純収支 = (received - expensesTotal) - deducted
}

export interface MunicipalityGovernance {
  mayorSalary: number; // 市区町村長給料月額 (円)
  councilMembersCount: number; // 議員定数
  councilSalary: number; // 議員1人当たり報酬月額 (円)
  staffCount: number; // 一般職員数 (人)
}

export interface MunicipalityComparisonPrevYear {
  revenuesTotal: number;
  expensesTotal: number;
  realBalance: number;
}

export interface MunicipalityData {
  code: string;
  prefCode: string;
  prefName: string;
  name: string;
  typeGroup: string;
  population: number;
  populationCensus: number;
  popChangeRate: number;
  area: number;
  popDensity: number;
  industryRatio: MunicipalityIndustryRatio;
  financial: MunicipalityFinancial;
  revenues: MunicipalityRevenues;
  expensesByPurpose: MunicipalityExpensesByPurpose;
  expensesByNature: MunicipalityExpensesByNature;
  comparisonPrevYear: MunicipalityComparisonPrevYear;
  governance: MunicipalityGovernance;
  demographics?: MunicipalityDemographics;
  furusato?: MunicipalityFurusato;
  alerts?: MunicipalityAlert[];
}

export interface MunicipalitySummary {
  code: string;
  prefCode: string;
  prefName: string;
  name: string;
  typeGroup: string;
  population: number;
  area: number;
  financialStrength: number;
  ordinaryBalance: number;
  realDebtRatio: number;
  revTotal: number;
  expTotal: number;
  publicWorks: number;
  welfare: number;
  publicWorksPerCapita: number;
  reserveTotal?: number;
  debtTotal?: number;
  netPerCapita?: number;
  assemblyCostPerCapita?: number;
  agingRate?: number;
  childRate?: number;
  furusatoBalance?: number;
  furusatoReceived?: number;
  furusatoDeducted?: number;
  furusatoBalancePerCapita?: number;
  hasAlerts: boolean;
}
