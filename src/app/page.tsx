"use client";

import React, { useState, useMemo } from "react";
import { getAllTopics } from "@/lib/topics";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { TopicCard } from "@/components/TopicCard";
import { useCheckedTopics } from "@/lib/checkHistory";
import { Search, X, Landmark, Globe, Filter, CheckCircle2 } from "lucide-react";
import type { TopicStatus } from "@/types/topic";

const allTopics = getAllTopics();

const STATUS_FILTERS: { value: TopicStatus | "all"; label: string }[] = [
  { value: "all", label: "すべて" },
  { value: "escalating", label: "🔴 緊張激化" },
  { value: "ongoing", label: "🟡 進行中" },
  { value: "stalled", label: "⚪ 停滞" },
  { value: "resolved", label: "🟢 決着" },
];

export default function HomePage() {
  const { checkedIds, isLoaded } = useCheckedTopics();
  const [query, setQuery] = useState("");
  const [scopeFilter, setScopeFilter] = useState<
    "all" | "domestic" | "international"
  >("all");
  const [statusFilter, setStatusFilter] = useState<TopicStatus | "all">("all");
  const [checkedFilter, setCheckedFilter] = useState<"all" | "unchecked" | "checked">("all");

  const filtered = useMemo(() => {
    let result = allTopics;

    // スコープフィルタ
    if (scopeFilter !== "all") {
      result = result.filter((t) => t.scope === scopeFilter);
    }

    // ステータスフィルタ
    if (statusFilter !== "all") {
      result = result.filter((t) => t.status === statusFilter);
    }

    // 確認済み・未確認フィルタ
    if (checkedFilter === "unchecked") {
      result = result.filter((t) => !checkedIds.includes(t.id));
    } else if (checkedFilter === "checked") {
      result = result.filter((t) => checkedIds.includes(t.id));
    }

    // 検索
    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.subtitle.toLowerCase().includes(q) ||
          t.tags.some((tag) => tag.toLowerCase().includes(q)) ||
          t.keyActors.some((a) => a.name.toLowerCase().includes(q)) ||
          t.categoryLabel.toLowerCase().includes(q)
      );
    }

    // 更新日順
    return result.sort(
      (a, b) =>
        new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
    );
  }, [query, scopeFilter, statusFilter, checkedFilter, checkedIds]);

  return (
    <>
      <Header />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* ヒーロー */}
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            時事図鑑
          </h1>
          <p className="text-base text-slate-600 mt-2">
            政治・国際情勢を、テーマごとに事実ベースで追跡
          </p>
          <p className="text-xs text-slate-400 mt-1">
            細かいニュースを毎日追わなくても「今どうなっているか」がわかる
          </p>
        </div>

        {/* 検索バー */}
        <div className="relative max-w-xl mx-auto mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="テーマ名・キーワード・国名で検索…"
            className="w-full pl-10 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-300 transition-all"
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

        {/* フィルタ */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-2 flex-wrap">
            {/* スコープフィルタ */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <button
                onClick={() => setScopeFilter("all")}
                className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all ${
                  scopeFilter === "all"
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                すべて ({allTopics.length})
              </button>
              <button
                onClick={() => setScopeFilter("domestic")}
                className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all inline-flex items-center gap-1 ${
                  scopeFilter === "domestic"
                    ? "bg-rose-600 text-white"
                    : "bg-rose-50 text-rose-700 hover:bg-rose-100"
                }`}
              >
                <Landmark className="w-3 h-3" />
                国内 ({allTopics.filter((t) => t.scope === "domestic").length})
              </button>
              <button
                onClick={() => setScopeFilter("international")}
                className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all inline-flex items-center gap-1 ${
                  scopeFilter === "international"
                    ? "bg-sky-600 text-white"
                    : "bg-sky-50 text-sky-700 hover:bg-sky-100"
                }`}
              >
                <Globe className="w-3 h-3" />
                国際 ({allTopics.filter((t) => t.scope === "international").length})
              </button>
            </div>

            {/* ステータスフィルタ */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {STATUS_FILTERS.map((sf) => (
                <button
                  key={sf.value}
                  onClick={() => setStatusFilter(sf.value)}
                  className={`text-[11px] px-2.5 py-1 rounded-full font-medium transition-all ${
                    statusFilter === sf.value
                      ? "bg-slate-700 text-white"
                      : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                  }`}
                >
                  {sf.label}
                </button>
              ))}
            </div>
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
              title="まだ確認していないトピックだけを表示"
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
                  {allTopics.length - checkedIds.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* トピック一覧 */}
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
                ? "すべてのトピックを確認完了しました！🎉"
                : "該当するトピックがありません"}
            </p>
            <button
              onClick={() => {
                setQuery("");
                setScopeFilter("all");
                setStatusFilter("all");
                setCheckedFilter("all");
              }}
              className="mt-3 text-sm text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
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
