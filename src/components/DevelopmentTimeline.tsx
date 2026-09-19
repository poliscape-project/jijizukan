import React from "react";
import type { Development } from "@/types/topic";
import { ExternalLink } from "lucide-react";

interface DevelopmentTimelineProps {
  developments: Development[];
}

export const DevelopmentTimeline: React.FC<DevelopmentTimelineProps> = ({
  developments,
}) => {
  return (
    <div className="space-y-0">
      {developments.map((dev, i) => {
        const isFirst = i === 0;
        const significanceColor =
          dev.significance === "high"
            ? "bg-blue-500"
            : dev.significance === "medium"
            ? "bg-slate-400"
            : "bg-slate-300";

        return (
          <div key={i} className="flex gap-4 group">
            {/* タイムライン軸 */}
            <div className="flex flex-col items-center shrink-0">
              <div
                className={`w-3 h-3 rounded-full border-2 ${
                  isFirst
                    ? "bg-blue-500 border-blue-300 ring-4 ring-blue-100"
                    : `${significanceColor} border-white`
                }`}
              />
              {i < developments.length - 1 && (
                <div className="w-0.5 bg-slate-200 flex-1 min-h-6" />
              )}
            </div>

            {/* コンテンツ */}
            <div className={`pb-6 min-w-0 ${isFirst ? "-mt-0.5" : "-mt-1"}`}>
              <div className="flex items-center gap-2 flex-wrap">
                <time className="text-xs font-mono text-slate-500">
                  {dev.date}
                </time>
                {isFirst && (
                  <span className="text-[10px] font-bold bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">
                    NEW
                  </span>
                )}
                {dev.significance === "high" && !isFirst && (
                  <span className="text-[10px] font-bold bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded">
                    重要
                  </span>
                )}
              </div>
              <h4 className="text-sm font-bold text-slate-900 mt-1">
                {dev.title}
              </h4>
              <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                {dev.content}
              </p>
              {dev.sources && dev.sources.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {dev.sources.map((src, j) => (
                    <a
                      key={j}
                      href={src.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      <ExternalLink className="w-3 h-3" />
                      {src.organization || src.title}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
