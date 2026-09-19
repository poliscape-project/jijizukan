import React from "react";
import Link from "next/link";
import type { RelatedTopic } from "@/types/topic";
import { Newspaper, ArrowRight } from "lucide-react";

interface RelatedTopicsProps {
  topics: RelatedTopic[];
}

export const RelatedTopics: React.FC<RelatedTopicsProps> = ({ topics }) => {
  if (!topics || topics.length === 0) return null;

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
        <Newspaper className="w-4 h-4 text-blue-600" />
        関連する時事トピック（時事図鑑）
      </h3>
      <div className="space-y-2">
        {topics.map((item) => (
          <Link
            key={item.id}
            href={`/topics/${item.id}`}
            className="flex items-start gap-3 p-3.5 bg-blue-50/50 rounded-xl border border-blue-200/60 hover:bg-blue-50 hover:border-blue-300 transition-all group shadow-2xs"
          >
            <Newspaper className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-blue-950 group-hover:text-blue-700 flex items-center justify-between gap-1">
                <span>{item.title}</span>
                <ArrowRight className="w-3.5 h-3.5 text-blue-500 group-hover:translate-x-0.5 transition-transform shrink-0" />
              </p>
              {item.relationship && (
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {item.relationship}
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
