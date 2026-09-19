/**
 * checkHistory.ts
 * 
 * ユーザーが能動的に「確認した（チェックした）」トピックを
 * ブラウザのlocalStorageに保存・管理するユーティリティ。
 * 自動既読判定は行わず、ユーザーがチェックボックスをクリックした時のみ状態が切り替わります。
 */

import { useState, useEffect } from "react";

const STORAGE_KEY = "jijizukan_checked_topics";
const OLD_STORAGE_KEY = "jijizukan_read_topics";

/**
 * 保存されている確認済みトピックIDの配列を取得（SSRセーフ）
 * 以前の「既読」キー（jijizukan_read_topics）が存在する場合は自動で引き継ぎます。
 */
export function getCheckedTopicIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }

    // 新キーが存在しない場合、旧「既読」キーから自動移行
    const oldRaw = localStorage.getItem(OLD_STORAGE_KEY);
    if (oldRaw) {
      const parsed = JSON.parse(oldRaw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
        return parsed;
      }
    }

    return [];
  } catch {
    return [];
  }
}

/**
 * 指定したトピックの確認状態を反転（トグル）
 */
export function toggleTopicChecked(topicId: string): boolean {
  if (typeof window === "undefined" || !topicId) return false;
  try {
    const current = new Set(getCheckedTopicIds());
    const isNowChecked = !current.has(topicId);
    if (isNowChecked) {
      current.add(topicId);
    } else {
      current.delete(topicId);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(current)));
    window.dispatchEvent(new Event("checkedTopicsChanged"));
    return isNowChecked;
  } catch (e) {
    console.error("Failed to toggle checked topic:", e);
    return false;
  }
}

/**
 * Reactコンポーネント用カスタムフック
 */
export function useCheckedTopics() {
  const [checkedIds, setCheckedIds] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const sync = () => {
      setCheckedIds(getCheckedTopicIds());
      setIsLoaded(true);
    };

    sync();

    window.addEventListener("checkedTopicsChanged", sync);
    window.addEventListener("storage", sync);
    window.addEventListener("pageshow", sync);
    window.addEventListener("focus", sync);

    return () => {
      window.removeEventListener("checkedTopicsChanged", sync);
      window.removeEventListener("storage", sync);
      window.removeEventListener("pageshow", sync);
      window.removeEventListener("focus", sync);
    };
  }, []);

  return {
    checkedIds,
    checkedCount: checkedIds.length,
    isLoaded,
    isChecked: (id: string) => checkedIds.includes(id),
    toggleChecked: toggleTopicChecked,
  };
}
