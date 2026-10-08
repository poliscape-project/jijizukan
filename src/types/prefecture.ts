export interface PrefectureFinancial {
  financialStrengthIndex: number; // 財政力指数
  ordinaryBalanceRatio: number; // 経常収支比率 (%)
  realDebtServiceRatio: number; // 実質公債費比率 (%)
  futureBurdenRatio: number | null; // 将来負担比率 (%)
  realBalanceRatio: number; // 実質収支比率 (%)
  standardFiscalScale: number; // 標準財政規模 (千円)
  reserveFundTotal: number; // 積立金現在高合計 (千円)
  fiscalAdjustmentFund: number; // 財政調整基金現在高 (千円)
  debtOutstanding: number; // 地方債現在高 (千円)
  netPerCapita: number; // 住民1人あたり実質純資産 (円)
  debtPerCapita: number; // 住民1人あたり地方債残高 (円)
  reservePerCapita: number; // 住民1人あたり積立基金 (円)
}

export interface PrefectureRevenues {
  total: number;
  localTax: number; // 道府県税
  localTransferTax: number; // 地方譲与税
  localAllocationTax: number; // 地方交付税
  nationalSubsidy: number; // 国庫支出金
  localBonds: number; // 地方債
  transfers?: number; // 繰入金（基金取崩し等）
  carriedOver?: number; // 繰越金
  miscellaneous?: number; // 諸収入（貸付金回収・利子等）
  other: number;
}

export interface PrefectureExpensesByPurpose {
  total: number;
  assembly: number; // 議会費
  generalAdmin: number; // 総務費
  welfare: number; // 民生費
  healthSanitation: number; // 衛生費
  labor: number; // 労働費
  agriculture: number; // 農林水産業費
  commerceIndustry: number; // 商工費
  publicWorks: number; // 土木費
  police: number; // 警察費
  education: number; // 教育費
  disasterRecovery: number; // 災害復旧費
  debtService: number; // 公債費
  other: number;
}

export interface PrefectureGovernance {
  governorSalary: number; // 知事給料月額 (円)
  councilSalary: number; // 議員報酬月額 (円)
  councilCount: number; // 議員定数
  staffCount: number; // 職員総数
}

export interface PrefectureProfile {
  headline: string; // 一言キャッチコピー
  industrialStructure: string; // 産業・経済構造（RESAS・特化産業等）
  fiscalStrengthsAndRisks: string; // 財政構造の強みと課題（総務省「財政状況分析表」視点）
  futureOutlook: string; // 今後の注目点・政策課題
  tags: string[]; // 構造キーワードタグ
}

export interface PrefectureData {
  code: string; // 6桁コード (例: '280003')
  prefCode: string; // 2桁コード (例: '28')
  name: string; // 都道府県名 (例: '兵庫県')
  type: 'prefecture';
  population: number;
  area: number;
  popDensity: number;
  financial: PrefectureFinancial;
  revenues: PrefectureRevenues;
  expensesByPurpose: PrefectureExpensesByPurpose;
  governance: PrefectureGovernance;
  profile?: PrefectureProfile;
}

export interface PrefectureSummary {
  code: string;
  prefCode: string;
  name: string;
  population: number;
  area: number;
  financialStrength: number;
  ordinaryBalance: number;
  realDebtRatio: number;
  futureBurdenRatio: number | null;
  revTotal: number;
  expTotal: number;
  debtOutstanding: number;
  reserveFundTotal: number;
  debtPerCapita: number;
  reservePerCapita: number;
  netPerCapita: number;
  publicWorksPerCapita: number;
  policePerCapita: number;
  educationPerCapita: number;
  governorSalary: number;
  councilSalary: number;
  headline?: string;
  tags?: string[];
}
