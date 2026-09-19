"use client";

import React from "react";
import Link from "next/link";
import { Newspaper, BookMarked, Globe, Landmark, CheckCircle2 } from "lucide-react";
import { getAllTopics } from "@/lib/topics";
import { useCheckedTopics } from "@/lib/checkHistory";

const allTopics = getAllTopics();
const totalTopics = allTopics.length;

export const Header: React.FC = () => {
  const { checkedCount, isLoaded } = useCheckedTopics();
  const percent = totalTopics > 0 ? Math.round((checkedCount / totalTopics) * 100) : 0;

  return (
    <header className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* ロゴ */}
        <Link
          href="/"
          className="flex items-center gap-3 group rounded-xl transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          title="トップページへ戻る"
        >
          <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-blue-400 shadow-sm group-hover:scale-105 group-hover:bg-slate-800 transition-all border border-slate-700/60">
            <Newspaper className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-black text-slate-900 tracking-tight group-hover:text-blue-700 transition-colors">
                時事図鑑
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-200/60">
                事実ベース
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5 group-hover:text-slate-600 transition-colors">
              政治・国際情勢を、テーマごとに追跡
            </p>
          </div>
        </Link>

        {/* ナビゲーション & 確認メーター */}
        <nav aria-label="メインナビゲーション">
          <div className="flex items-center gap-2 self-end sm:self-auto flex-wrap">
            {/* 確認メーター */}
            <div
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/80 shadow-2xs cursor-default"
              title={`全${totalTopics}トピック中、${checkedCount}トピックを確認済み`}
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>
                確認済{" "}
                <strong className="font-bold text-emerald-900">
                  {isLoaded ? checkedCount : 0}
                </strong>
                /{totalTopics}
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.2 bg-emerald-600 text-white rounded-full">
                {isLoaded ? percent : 0}%
              </span>
            </div>

            <Link
              href="/domestic"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-800 hover:bg-rose-100 border border-rose-200/70 transition-all shadow-2xs cursor-pointer"
              title="国内政治トピック一覧"
            >
              <Landmark className="w-3.5 h-3.5 text-rose-600" />
              <span>国内政治</span>
            </Link>
            <Link
              href="/international"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-sky-50 text-sky-800 hover:bg-sky-100 border border-sky-200/70 transition-all shadow-2xs cursor-pointer"
              title="国際関係トピック一覧"
            >
              <Globe className="w-3.5 h-3.5 text-sky-600" />
              <span>国際関係</span>
            </Link>
            <a
              href="https://poliscape.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200/70 transition-all shadow-2xs cursor-pointer"
              title="日本政策図鑑（姉妹サイト）"
            >
              <BookMarked className="w-3.5 h-3.5 text-slate-500" />
              <span>日本政策図鑑</span>
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
};
