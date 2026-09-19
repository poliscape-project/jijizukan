/**
 * readHistory.ts
 * 
 * ユーザーが閲覧・読了した時事トピックのIDをブラウザのlocalStorageに保存・管理するユーティリティ。
 * ログイン不要・端末ローカル完結で動作し、カスタムイベントによって各コンポーネント間でリアルタイム同期します。
 */

import { useState, useEffect } from "react";

const STORAGE_KEY = "jijizukan_read_topics";

/**
 * 保存されている既読トピックIDの配列を取得（SSRセーフ）
 */
export function getReadTopicIds(): string[] {
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
 * 指定したトピックを既読として記録
 */
export function markTopicAsRead(topicId: string): void {
  if (typeof window === "undefined" || !topicId) return;
  try {
    const current = new Set(getReadTopicIds());
    if (!current.has(topicId)) {
      current.add(topicId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(current)));
      window.dispatchEvent(new Event("readTopicsChanged"));
    }
  } catch (e) {
    console.error("Failed to save read topic:", e);
  }
}

/**
 * 指定したトピックの既読を解除（未読に戻す）
 */
export function unmarkTopicAsRead(topicId: string): void {
  if (typeof window === "undefined" || !topicId) return;
  try {
    const current = new Set(getReadTopicIds());
    if (current.has(topicId)) {
      current.delete(topicId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(current)));
      window.dispatchEvent(new Event("readTopicsChanged"));
    }
  } catch (e) {
    console.error("Failed to remove read topic:", e);
  }
}

/**
 * 既読履歴の全削除
 */
export function clearAllReadHistory(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new Event("readTopicsChanged"));
  } catch (e) {
    console.error("Failed to clear read history:", e);
  }
}

/**
 * Reactコンポーネント用カスタムフック
 * リアルタイムに既読トピックIDの一覧と読破数を返します。
 */
export function useReadTopics() {
  const [readIds, setReadIds] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // クライアントマウント時に取得
    setReadIds(getReadTopicIds());
    setIsLoaded(true);

    const handleUpdate = () => {
      setReadIds(getReadTopicIds());
    };

    window.addEventListener("readTopicsChanged", handleUpdate);
    window.addEventListener("storage", handleUpdate);

    return () => {
      window.removeEventListener("readTopicsChanged", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  return {
    readIds,
    readCount: readIds.length,
    isLoaded,
    isRead: (id: string) => readIds.includes(id),
    markAsRead: markTopicAsRead,
    unmarkAsRead: unmarkTopicAsRead,
  };
}
