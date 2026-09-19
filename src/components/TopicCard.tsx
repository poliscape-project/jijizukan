import React from "react";
import Link from "next/link";
import type { Topic } from "@/types/topic";
import { StatusBadge } from "./StatusBadge";
import { Users, ArrowRight } from "lucide-react";

interface TopicCardProps {
  topic: Topic;
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

export const TopicCard: React.FC<TopicCardProps> = ({ topic }) => {
  const style = SCOPE_STYLE[topic.scope];
  const latestDev = topic.developments[0];

  return (
    <Link
      href={`/topics/${topic.id}`}
      className="group bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:border-blue-400 hover:shadow-md transition-all flex flex-col justify-between"
    >
      <div>
        {/* バッジ: スコープ（左） + ステータス（右） */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span
            className={`text-[11px] font-bold px-2.5 py-0.5 rounded-md ${style.scopeBg}`}
          >
            {style.scopeLabel}
          </span>
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
