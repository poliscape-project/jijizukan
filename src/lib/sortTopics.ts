import type { Topic } from "@/types/topic";

export type SortOption =
  | "latest-event"     // 📅 最新の出来事順（直近ニュース・ソース日付）
  | "created-at"       // 🆕 新着トピック順（サイト追加順）
  | "last-updated"     // 🔄 記事の更新日順
  | "unchecked-first"  // ☑️ 未確認優先（未チェックを上に）
  | "title-asc";       // 🔤 タイトル五十音順

export const SORT_OPTIONS: { value: SortOption; label: string; shortLabel: string }[] = [
  { value: "latest-event", label: "最新の出来事順（直近ニュース・ソース日付）", shortLabel: "📅 最新の出来事順" },
  { value: "created-at", label: "新着トピック順（サイト追加順）", shortLabel: "🆕 新着トピック順" },
  { value: "last-updated", label: "記事の最終更新日順", shortLabel: "🔄 更新日順" },
  { value: "unchecked-first", label: "未確認優先（未チェックを上に）", shortLabel: "☑️ 未確認優先" },
  { value: "title-asc", label: "タイトル五十音順（あ〜ん）", shortLabel: "🔤 五十音順" },
];

/**
 * トピック内で最も新しい出来事の日付（UNIXタイムスタンプ）を取得
 */
function getLatestEventDate(topic: Topic): number {
  let latestTime = new Date(topic.lastUpdated).getTime();
  if (topic.developments && topic.developments.length > 0) {
    for (const dev of topic.developments) {
      if (dev.date) {
        const t = new Date(dev.date).getTime();
        if (!isNaN(t) && t > latestTime) {
          latestTime = t;
        }
      }
    }
  }
  return isNaN(latestTime) ? 0 : latestTime;
}

export function sortTopics(
  topics: Topic[],
  sortBy: SortOption,
  checkedIds: string[] = []
): Topic[] {
  return [...topics].sort((a, b) => {
    switch (sortBy) {
      case "latest-event": {
        const timeA = getLatestEventDate(a);
        const timeB = getLatestEventDate(b);
        if (timeA !== timeB) return timeB - timeA;
        return a.title.localeCompare(b.title, "ja");
      }
      case "created-at": {
        const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        if (timeA !== timeB) return timeB - timeA;
        return a.title.localeCompare(b.title, "ja");
      }
      case "last-updated": {
        const timeA = new Date(a.lastUpdated).getTime();
        const timeB = new Date(b.lastUpdated).getTime();
        if (timeA !== timeB) return timeB - timeA;
        return a.title.localeCompare(b.title, "ja");
      }
      case "unchecked-first": {
        const isCheckedA = checkedIds.includes(a.id) ? 1 : 0;
        const isCheckedB = checkedIds.includes(b.id) ? 1 : 0;
        if (isCheckedA !== isCheckedB) {
          return isCheckedA - isCheckedB; // 0（未確認）が先
        }
        // 未確認同士・確認済同士は最新出来事順
        const timeA = getLatestEventDate(a);
        const timeB = getLatestEventDate(b);
        return timeB - timeA;
      }
      case "title-asc": {
        return a.title.localeCompare(b.title, "ja");
      }
      default:
        return 0;
    }
  });
}
