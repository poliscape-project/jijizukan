export interface FruitCityLink {
  code: string; // 自治体コード (例: "022021")
  name: string; // 自治体名 (例: "弘前市")
  highlight?: string; // 特筆事項 (例: "日本一のりんご生産地")
}

export interface FruitRankingItem {
  rank: number;
  prefectureCode: string; // 都道府県コード (例: "020003")
  prefectureName: string; // 都道府県名 (例: "青森県")
  production: number; // 収穫量 (t) / 飼養頭数 / 出荷額 (億円・兆円)
  share: number; // 全国シェア (%)
  mainCities: FruitCityLink[];
  notes?: string; // 地域特性・産業・栽培背景
}

export type HandbookCategory = 'all' | 'fruit' | 'grain' | 'vegetable' | 'livestock' | 'industry' | 'living' | 'fishery';

export interface FruitItem {
  id: string; // 品目ID (例: "automobile")
  name: string; // 品目名 (例: "自動車・輸送用機械")
  kana: string; // フリガナ (例: "ジドウシャ")
  englishName: string; // 英語名 (例: "Automotive & Transport")
  category: 'fruit' | 'grain' | 'vegetable' | 'livestock' | 'industry' | 'living' | 'fishery'; // 分類カテゴリ
  categoryLabel: string; // 分類ラベル (例: "果実", "主食・米", "野菜", "畜産・酪農", "鉱工業・先端産業")
  unit: string; // 単位 (例: "t", "頭", "億円", "兆円")
  icon: string; // 絵文字 (例: "🚗")
  summary: string; // 概要
  season: string; // 旬・主要拠点・産業規模
  nationalTotalProduction: number; // 全国総量 (t / 頭 / 億円)
  nationalOutputValue: number; // 全国産出額・出荷額 (億円)
  mainVarieties: string[]; // 代表的品種・銘柄・主要企業・クラスター
  growingConditions: string; // なぜその地域で盛んなのか（地理的・立地的・インフラ的要因）
  trivia: string; // 探究学習・豆知識コラム
  rankings: FruitRankingItem[]; // 都道府県別ランキング
}

export interface FruitHandbookData {
  title: string;
  subtitle: string;
  description: string;
  lastUpdated: string;
  source: string;
  items: FruitItem[];
}
