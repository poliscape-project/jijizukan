"use client";

import React, { useState, useMemo } from "react";
import { getTopicsByScope } from "@/lib/topics";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { TopicCard } from "@/components/TopicCard";
import { useCheckedTopics } from "@/lib/checkHistory";
import { Landmark, Search, X, CheckCircle2 } from "lucide-react";
import type { Metadata } from "next";

const domesticTopics = getTopicsByScope("domestic");

const CATEGORY_LABELS: Record<string, string> = {
  parliament: "国会・立法",
  election: "選挙",
  administration: "行政・内閣",
  party: "政党",
  judiciary: "司法",
  local: "地方政治",
};

export default function DomesticPage() {
  const { checkedIds, isLoaded } = useCheckedTopics();
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [checkedFilter, setCheckedFilter] = useState<"all" | "unchecked" | "checked">("all");

  const categories = useMemo(() => {
    const cats = new Set(domesticTopics.map((t) => t.category));
    return Array.from(cats);
  }, []);

  const filtered = useMemo(() => {
    let result = domesticTopics;

    if (categoryFilter !== "all") {
      result = result.filter((t) => t.category === categoryFilter);
    }

    // 確認済み・未確認フィルタ
    if (checkedFilter === "unchecked") {
      result = result.filter((t) => !checkedIds.includes(t.id));
    } else if (checkedFilter === "checked") {
      result = result.filter((t) => checkedIds.includes(t.id));
    }

    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.subtitle.toLowerCase().includes(q) ||
          t.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    }

    return result.sort(
      (a, b) =>
        new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
    );
  }, [query, categoryFilter, checkedFilter, checkedIds]);

  return (
    <>
      <Header />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <Landmark className="w-6 h-6 text-rose-600" />
            🇯🇵 国内政治
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            国会・行政・選挙・政党の動きを追跡
          </p>
        </div>

        {/* 検索 */}
        <div className="relative max-w-md mb-5">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="テーマ名・キーワードで検索…"
            className="w-full pl-10 pr-10 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* カテゴリフィルタ & 未読フィルタ */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => setCategoryFilter("all")}
              className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all ${
                categoryFilter === "all"
                  ? "bg-rose-600 text-white"
                  : "bg-rose-50 text-rose-700 hover:bg-rose-100"
              }`}
            >
              すべて ({domesticTopics.length})
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all ${
                  categoryFilter === cat
                    ? "bg-rose-600 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {CATEGORY_LABELS[cat] || cat}
              </button>
            ))}
          </div>

          {/* 未確認のみ切り替えボタン */}
          <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
            <button
              onClick={() => setCheckedFilter(checkedFilter === "unchecked" ? "all" : "unchecked")}
              className={`text-xs px-3.5 py-1.5 rounded-full font-bold transition-all inline-flex items-center gap-1.5 cursor-pointer shadow-2xs ${
                checkedFilter === "unchecked"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200/80"
              }`}
              title="まだ確認していない国内トピックだけを表示"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>未確認のみ表示</span>
              {isLoaded && checkedIds.length > 0 && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    checkedFilter === "unchecked"
                      ? "bg-white/20 text-white"
                      : "bg-emerald-200 text-emerald-900"
                  }`}
                >
                  {domesticTopics.filter((t) => !checkedIds.includes(t.id)).length}
                </span>
              )}
            </button>
          </div>
        </div>

        {filtered.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {filtered.map((topic) => (
              <TopicCard
                key={topic.id}
                topic={topic}
                isChecked={checkedIds.includes(topic.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-slate-500">
              {checkedFilter === "unchecked"
                ? "国内トピックをすべて確認完了しました！🎉"
                : "該当するトピックがありません"}
            </p>
            <button
              onClick={() => {
                setQuery("");
                setCategoryFilter("all");
                setCheckedFilter("all");
              }}
              className="mt-3 text-sm text-rose-600 hover:text-rose-800 font-medium cursor-pointer"
            >
              フィルターをリセット
            </button>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
