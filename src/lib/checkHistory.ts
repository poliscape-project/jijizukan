/**
 * checkHistory.ts
 * 
 * ユーザーが能動的に「確認した（チェックした）」トピックを
 * ブラウザのlocalStorageに保存・管理するユーティリティ。
 * 自動既読判定は行わず、ユーザーがチェックボックスをクリックした時のみ状態が切り替わります。
 */

import { useState, useEffect } from "react";

const STORAGE_KEY = "jijizukan_checked_topics";

/**
 * 保存されている確認済みトピックIDの配列を取得（SSRセーフ）
 */
export function getCheckedTopicIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
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
    setCheckedIds(getCheckedTopicIds());
    setIsLoaded(true);

    const handleUpdate = () => {
      setCheckedIds(getCheckedTopicIds());
    };

    window.addEventListener("checkedTopicsChanged", handleUpdate);
    window.addEventListener("storage", handleUpdate);

    return () => {
      window.removeEventListener("checkedTopicsChanged", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
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
