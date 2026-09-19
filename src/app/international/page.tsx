"use client";

import React, { useState, useMemo } from "react";
import { getTopicsByScope } from "@/lib/topics";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { TopicCard } from "@/components/TopicCard";
import { Globe, Search, X } from "lucide-react";

const internationalTopics = getTopicsByScope("international");

const CATEGORY_LABELS: Record<string, string> = {
  bilateral: "二国間関係",
  multilateral: "多国間",
  conflict: "紛争・安全保障",
  trade: "通商・経済外交",
  diplomacy: "外交・首脳会談",
  geopolitics: "地政学・勢力均衡",
  alliance: "同盟・連携",
  economy: "経済安全保障",
};

export default function InternationalPage() {
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const categories = useMemo(() => {
    const cats = new Set(internationalTopics.map((t) => t.category));
    return Array.from(cats);
  }, []);

  const filtered = useMemo(() => {
    let result = internationalTopics;

    if (categoryFilter !== "all") {
      result = result.filter((t) => t.category === categoryFilter);
    }

    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.subtitle.toLowerCase().includes(q) ||
          t.tags.some((tag) => tag.toLowerCase().includes(q)) ||
          t.keyActors.some((a) => a.name.toLowerCase().includes(q))
      );
    }

    return result.sort(
      (a, b) =>
        new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
    );
  }, [query, categoryFilter]);

  return (
    <>
      <Header />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <Globe className="w-6 h-6 text-sky-600" />
            🌍 国際関係
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            二国間関係・紛争・外交・通商の動きを追跡
          </p>
        </div>

        {/* 検索 */}
        <div className="relative max-w-md mb-5">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="テーマ名・国名・キーワードで検索…"
            className="w-full pl-10 pr-10 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all"
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

        {/* カテゴリフィルタ */}
        <div className="flex items-center gap-1.5 flex-wrap mb-6">
          <button
            onClick={() => setCategoryFilter("all")}
            className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all ${
              categoryFilter === "all"
                ? "bg-sky-600 text-white"
                : "bg-sky-50 text-sky-700 hover:bg-sky-100"
            }`}
          >
            すべて ({internationalTopics.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all ${
                categoryFilter === cat
                  ? "bg-sky-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {CATEGORY_LABELS[cat] || cat}
            </button>
          ))}
        </div>

        {filtered.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {filtered.map((topic) => (
              <TopicCard key={topic.id} topic={topic} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-slate-500">該当するトピックがありません</p>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
