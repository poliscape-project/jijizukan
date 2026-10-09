export interface FruitCityLink {
  code: string; // 自治体コード (例: "022021")
  name: string; // 自治体名 (例: "弘前市")
  highlight?: string; // 特筆事項 (例: "日本一のりんご生産地")
}

export interface FruitRankingItem {
  rank: number;
  prefectureCode: string; // 都道府県コード (例: "020003")
  prefectureName: string; // 都道府県名 (例: "青森県")
  production: number; // 収穫量 (t)
  share: number; // 全国シェア (%)
  mainCities: FruitCityLink[];
  notes?: string; // 地域特性・栽培背景
}

export interface FruitItem {
  id: string; // 品目ID (例: "apple")
  name: string; // 品目名 (例: "りんご")
  kana: string; // フリガナ (例: "リンゴ")
  englishName: string; // 英語名 (例: "Apple")
  icon: string; // 絵文字 (例: "🍎")
  summary: string; // 概要
  season: string; // 旬の時期 (例: "10月〜2月")
  nationalTotalProduction: number; // 全国総収穫量 (t)
  nationalOutputValue: number; // 全国産出額 (億円)
  mainVarieties: string[]; // 代表的品種
  growingConditions: string; // なぜその地域で盛んなのか（地理的・気候的要因）
  trivia: string; // 探究学習・豆知識
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
