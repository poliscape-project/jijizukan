"use client";

import React from "react";
import Link from "next/link";
import type { Topic } from "@/types/topic";
import { StatusBadge } from "./StatusBadge";
import { Users, ArrowRight, Check } from "lucide-react";
import { toggleTopicChecked } from "@/lib/checkHistory";

interface TopicCardProps {
  topic: Topic;
  isChecked?: boolean;
}

const SCOPE_STYLE = {
  domestic: {
    scopeLabel: "🇯🇵 国内",
    scopeBg: "bg-rose-50 text-rose-800 border border-rose-100",
  },
  international: {
    scopeLabel: "🌍 国際",
    scopeBg: "bg-sky-50 text-sky-800 border border-sky-100",
  },
};

export const TopicCard: React.FC<TopicCardProps> = ({ topic, isChecked = false }) => {
  const style = SCOPE_STYLE[topic.scope];
  const latestDev = topic.developments[0];

  return (
    <Link
      href={`/topics/${topic.id}`}
      className={`group bg-white rounded-2xl border ${
        isChecked ? "border-emerald-300 ring-1 ring-emerald-200/60" : "border-slate-200/80"
      } p-5 shadow-xs hover:border-blue-400 hover:shadow-md transition-all flex flex-col justify-between relative`}
    >
      <div>
        {/* バッジ: スコープ（左） + 確認チェックボックス + ステータス（右） */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`text-[11px] font-bold px-2.5 py-0.5 rounded-md ${style.scopeBg}`}
            >
              {style.scopeLabel}
            </span>

            {/* 確認チェックボックス（クリックしても記事に飛ばずチェックだけ切替） */}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleTopicChecked(topic.id);
              }}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer shadow-2xs ${
                isChecked
                  ? "bg-emerald-600 text-white shadow-xs hover:bg-emerald-700"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 border border-slate-200"
              }`}
              title={isChecked ? "クリックで未確認に戻す" : "クリックで確認済みにする"}
            >
              <div
                className={`w-3.5 h-3.5 rounded flex items-center justify-center transition-colors ${
                  isChecked ? "bg-white text-emerald-600" : "border-2 border-slate-400 bg-white"
                }`}
              >
                {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
              </div>
              <span>{isChecked ? "確認済" : "確認"}</span>
            </button>
          </div>
          <StatusBadge status={topic.status} label={topic.statusLabel} />
        </div>

        {/* タイトル */}
        <h3 className="text-lg font-black text-slate-900 group-hover:text-blue-700 transition-colors leading-snug">
          {topic.title}
        </h3>

        {/* サブタイトル */}
        <p className="text-xs text-slate-500 mt-1.5 leading-relaxed line-clamp-2">
          {topic.subtitle}
        </p>

        {/* ハイライトバッジ（カテゴリ + キーアクター） */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-blue-50 text-blue-800">
            {topic.categoryLabel}
          </span>
          {topic.keyActors.slice(0, 3).map((actor, i) => (
            <span
              key={i}
              className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600"
            >
              {actor.flag && `${actor.flag} `}
              {actor.name}
            </span>
          ))}
        </div>
      </div>

      {/* 最新の進展 + フッター */}
      <div className="mt-5 pt-3 border-t border-slate-100">
        {latestDev && (
          <div className="flex items-start gap-2 mb-3">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
            <div className="min-w-0">
              <p className="text-[11px] text-slate-400">{latestDev.date}</p>
              <p className="text-xs text-slate-700 font-medium line-clamp-1">
                {latestDev.title}
              </p>
            </div>
          </div>
        )}
        <div className="flex items-center justify-between text-xs font-bold text-blue-700">
          <span>
            📅 更新: {topic.lastUpdated}
          </span>
          <span className="inline-flex items-center gap-1">
            詳しく
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </span>
        </div>
      </div>
    </Link>
  );
};
