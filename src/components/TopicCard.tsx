import React from "react";
import Link from "next/link";
import type { Topic } from "@/types/topic";
import { StatusBadge } from "./StatusBadge";
import { Calendar, Users, ArrowRight } from "lucide-react";

interface TopicCardProps {
  topic: Topic;
}

const SCOPE_STYLE = {
  domestic: {
    border: "border-l-rose-400",
    scopeLabel: "🇯🇵 国内",
    scopeBg: "bg-rose-50 text-rose-700",
  },
  international: {
    border: "border-l-sky-400",
    scopeLabel: "🌍 国際",
    scopeBg: "bg-sky-50 text-sky-700",
  },
};

export const TopicCard: React.FC<TopicCardProps> = ({ topic }) => {
  const style = SCOPE_STYLE[topic.scope];
  const latestDev = topic.developments[0];

  return (
    <Link
      href={`/topics/${topic.id}`}
      className={`block bg-white rounded-xl border border-slate-200 border-l-4 ${style.border} shadow-sm hover:shadow-md hover:border-slate-300 transition-all group`}
    >
      <div className="p-5">
        {/* ヘッダー: スコープ + ステータス + カテゴリ */}
        <div className="flex items-center gap-2 flex-wrap mb-2">
          <span
            className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${style.scopeBg}`}
          >
            {style.scopeLabel}
          </span>
          <StatusBadge status={topic.status} label={topic.statusLabel} />
          <span className="text-[10px] text-slate-400">
            {topic.categoryLabel}
          </span>
        </div>

        {/* タイトル */}
        <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-700 transition-colors leading-snug">
          {topic.title}
        </h3>

        {/* サブタイトル */}
        <p className="text-sm text-slate-600 mt-1 line-clamp-2">
          {topic.subtitle}
        </p>

        {/* キーアクター */}
        {topic.keyActors.length > 0 && (
          <div className="flex items-center gap-1.5 mt-3 flex-wrap">
            <Users className="w-3 h-3 text-slate-400" />
            {topic.keyActors.slice(0, 4).map((actor, i) => (
              <span
                key={i}
                className="text-[11px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded"
              >
                {actor.flag && `${actor.flag} `}
                {actor.name}
              </span>
            ))}
          </div>
        )}

        {/* 最新の進展 */}
        {latestDev && (
          <div className="mt-3 pt-3 border-t border-slate-100">
            <div className="flex items-start gap-2">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
              <div className="min-w-0">
                <p className="text-[11px] text-slate-400">{latestDev.date}</p>
                <p className="text-xs text-slate-700 font-medium line-clamp-1">
                  {latestDev.title}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* フッター */}
        <div className="flex items-center justify-between mt-3">
          <span className="flex items-center gap-1 text-[11px] text-slate-400">
            <Calendar className="w-3 h-3" />
            更新: {topic.lastUpdated}
          </span>
          <span className="text-xs text-blue-600 font-medium group-hover:underline flex items-center gap-0.5">
            詳しく <ArrowRight className="w-3 h-3" />
          </span>
        </div>
      </div>
    </Link>
  );
};
