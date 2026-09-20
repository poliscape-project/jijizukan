"use client";

import React, { useEffect, useState } from "react";
import { Eye } from "lucide-react";

interface ViewCounterProps {
  topicId: string;
  className?: string;
  showIcon?: boolean;
}

export const ViewCounter: React.FC<ViewCounterProps> = ({
  topicId,
  className = "",
  showIcon = true,
}) => {
  const [views, setViews] = useState<number | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function recordAndFetchViews() {
      try {
        const sessionKey = `viewed_topic_${topicId}`;
        const hasViewedInSession = typeof window !== "undefined" && sessionStorage.getItem(sessionKey);

        // セッション内で初回閲覧なら POST でインクリメント、閲覧済みなら GET のみ
        const method = hasViewedInSession ? "GET" : "POST";
        const res = await fetch(`/api/views/${topicId}`, {
          method,
          headers: { "Content-Type": "application/json" },
        });

        if (res.ok) {
          const data = await res.json();
          if (isMounted && typeof data.views === "number") {
            setViews(data.views);
            if (method === "POST" && typeof window !== "undefined") {
              sessionStorage.setItem(sessionKey, "1");
            }
          }
        }
      } catch (err) {
        console.error("Failed to fetch views:", err);
      }
    }

    recordAndFetchViews();

    return () => {
      isMounted = false;
    };
  }, [topicId]);

  if (views === null) {
    return (
      <span className={`inline-flex items-center gap-1.5 text-xs text-slate-400 ${className}`}>
        {showIcon && <Eye className="w-3.5 h-3.5 animate-pulse text-slate-300" />}
        <span>---</span>
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 bg-slate-100/80 px-2.5 py-1 rounded-full border border-slate-200/60 ${className}`}
      title={`これまでの閲覧回数: ${views.toLocaleString()}回`}
    >
      {showIcon && <Eye className="w-3.5 h-3.5 text-slate-500" />}
      <span>{views.toLocaleString()} views</span>
    </span>
  );
};
