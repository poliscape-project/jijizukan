"use client";

import React, { useEffect, useRef } from "react";
import type { Topic } from "@/types/topic";
import {
  MessageSquare,
  GitPullRequest,
  AlertCircle,
  Sparkles,
  ExternalLink,
} from "lucide-react";

interface TopicDiscussionProps {
  topic: Topic;
}

export const TopicDiscussion: React.FC<TopicDiscussionProps> = ({ topic }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = "";

    const script = document.createElement("script");
    script.src = "https://giscus.app/client.js";
    script.setAttribute("data-repo", "poliscape-project/jijizukan");
    script.setAttribute("data-repo-id", "R_kgDOUg2q3Q");
    script.setAttribute("data-category", "General");
    script.setAttribute("data-category-id", "DIC_kwDOUg2q3c4DF9H_");
    script.setAttribute("data-mapping", "pathname");
    script.setAttribute("data-strict", "0");
    script.setAttribute("data-reactions-enabled", "1");
    script.setAttribute("data-emit-metadata", "0");
    script.setAttribute("data-input-position", "top");
    script.setAttribute("data-theme", "light");
    script.setAttribute("data-lang", "ja");
    script.setAttribute("crossorigin", "anonymous");
    script.async = true;

    containerRef.current.appendChild(script);
  }, [topic.id]);

  const githubEditUrl = `https://github.com/poliscape-project/jijizukan/edit/main/src/data/topics/${topic.scope}/${topic.id}.json`;
  const githubIssueUrl = `https://github.com/poliscape-project/jijizukan/issues/new?title=${encodeURIComponent(
    `[情報提供・誤認指摘] ${topic.title}`
  )}`;

  return (
    <section className="my-10 pt-8 border-t border-slate-200">
      {/* ヘッダーエリア */}
      <div className="flex items-center gap-2 mb-2">
        <MessageSquare className="w-5 h-5 text-blue-600" />
        <h2 className="text-xl font-bold text-slate-900">
          議論・専門知識・補足情報スレッド
        </h2>
      </div>
      <p className="text-sm text-slate-600 mb-5 leading-relaxed">
        このテーマに関する背景知識、一次資料のURL、最新の制度変更、現場の実情などをご自由にお寄せください（GitHubアカウントで投稿可能）。
      </p>

      {/* 運用ルールの案内カード */}
      <div className="mb-6 p-4 rounded-xl bg-blue-50/70 border border-blue-100 flex items-start gap-3 text-xs text-blue-900 leading-relaxed">
        <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">知見の公式採用について：</span>
          スレッドに寄せられた有益な情報や前提知識・法改正の動きは、中立性とファクトチェックを確認の上、
          <strong>トピックの公式本文（図鑑データ）に正式に反映・加筆</strong>させていただきます。
          荒らしやデマのない信頼できる情報基盤をコミュニティと共に作っていきます。
        </div>
      </div>

      {/* GitHub直接貢献ボタン群 */}
      <div className="flex flex-wrap gap-2.5 mb-6">
        <a
          href={githubEditUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-white text-slate-700 border border-slate-200 hover:border-slate-400 hover:bg-slate-50 transition-all shadow-2xs"
          title="GitHub上でJSONファイルを直接編集してPull Requestを作成できます"
        >
          <GitPullRequest className="w-3.5 h-3.5 text-blue-600" />
          <span>GitHubで加筆・修正を直接提案</span>
          <ExternalLink className="w-3 h-3 text-slate-400" />
        </a>
        <a
          href={githubIssueUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-white text-slate-700 border border-slate-200 hover:border-slate-400 hover:bg-slate-50 transition-all shadow-2xs"
          title="事実誤認や数値誤り、新しい情報ソースをIssueで報告"
        >
          <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
          <span>事実誤認・情報ソースを報告</span>
          <ExternalLink className="w-3 h-3 text-slate-400" />
        </a>
      </div>

      {/* Giscus コメントスレッドコンテナ */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs min-h-[220px]">
        <div ref={containerRef} className="giscus-frame" />
      </div>
    </section>
  );
};
