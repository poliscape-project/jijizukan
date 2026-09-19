// === スコープ（分野） ===
export type TopicScope = "domestic" | "international";

// === 国内政治のサブカテゴリ ===
export type DomesticCategory =
  | "parliament"     // 国会・立法
  | "election"       // 選挙
  | "administration" // 行政・内閣
  | "party"          // 政党
  | "judiciary"      // 司法
  | "local";         // 地方政治

// === 国際関係のサブカテゴリ ===
export type InternationalCategory =
  | "bilateral"      // 二国間関係
  | "multilateral"   // 多国間（G7、国連等）
  | "conflict"       // 紛争・安全保障
  | "trade"          // 通商・経済外交
  | "diplomacy"      // 外交・首脳会談
  | "geopolitics"    // 地政学・勢力均衡
  | "alliance"       // 同盟・連携
  | "economy";       // 経済安全保障


// === トピックの現在の状態 ===
export type TopicStatus =
  | "ongoing"        // 進行中
  | "resolved"       // 決着・合意
  | "stalled"        // 停滞
  | "escalating"     // 緊張激化
  | "new";           // 新規

// === 情報ソース ===
export interface TopicSource {
  title: string;
  url: string;
  organization?: string;
  date?: string;
}

// === 関係アクター（国・政党・人物等） ===
export interface KeyActor {
  name: string;       // "日本" / "自民党" / "バイデン大統領"
  flag?: string;      // 🇯🇵 🇺🇸（国の場合）
  role?: string;      // "当事国" / "仲介" / "与党"
}

// === 経緯エントリ ===
export interface Development {
  date: string;       // YYYY-MM-DD
  title: string;      // 進展の見出し
  content: string;    // 事実の記述（2〜3文）
  significance?: "high" | "medium" | "low";
  sources?: TopicSource[];
}

// === 関連する日本政策図鑑の政策 ===
export interface RelatedPolicy {
  id: string;
  title: string;
  relationship: string;
}

// === トピック（メインデータ型） ===
export interface Topic {
  id: string;
  title: string;
  subtitle: string;
  scope: TopicScope;
  category: DomesticCategory | InternationalCategory;
  categoryLabel: string;
  status: TopicStatus;
  statusLabel: string;
  lastUpdated: string;
  overview: string;

  // なぜ起きたのか（背景・根本原因）
  background?: string;

  // ざっくり言うと（かんたんな説明）
  simpleSummary?: string;

  // 記事ごとの特別セクション（表、比較カード、詳細解説等）
  customSections?: CustomSection[];

  keyActors: KeyActor[];
  tags: string[];
  developments: Development[];
  relatedPolicies?: RelatedPolicy[];
  sources: TopicSource[];
}

// === 記事ごとの特別セクション（表、比較カード、詳細解説、統計・予算カードなど） ===
export interface CustomSection {
  title: string;
  icon?: string;
  description?: string;
  type: "table" | "cards" | "text" | "stat_cards";
  tableData?: {
    headers: string[];
    rows: string[][];
  };
  cardsData?: {
    title: string;
    subtitle?: string;
    badge?: string;
    content: string;
  }[];
  statCardsData?: {
    title: string;
    value: string;
    badge?: string;
    challenge: string;
    measure: string;
  }[];
  content?: string;
}
