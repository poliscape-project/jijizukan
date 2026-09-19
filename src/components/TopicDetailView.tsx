"use client";

import React from "react";
import Link from "next/link";
import type { Topic } from "@/types/topic";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { StatusBadge } from "./StatusBadge";
import { KeyActorsBar } from "./KeyActorsBar";
import { DevelopmentTimeline } from "./DevelopmentTimeline";
import { RelatedPolicies } from "./RelatedPolicies";
import {
  ArrowLeft,
  Calendar,
  ExternalLink,
  FileText,
  Landmark,
  Globe,
  Tag,
} from "lucide-react";

interface TopicDetailViewProps {
  topic: Topic;
}

export const TopicDetailView: React.FC<TopicDetailViewProps> = ({ topic }) => {
  const scopeIcon =
    topic.scope === "domestic" ? (
      <Landmark className="w-4 h-4 text-rose-600" />
    ) : (
      <Globe className="w-4 h-4 text-sky-600" />
    );

  const scopeLabel = topic.scope === "domestic" ? "🇯🇵 国内政治" : "🌍 国際関係";
  const scopeLink =
    topic.scope === "domestic" ? "/domestic" : "/international";

  return (
    <>
      <Header />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        {/* パンくず */}
        <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6">
          <Link href="/" className="hover:text-blue-600 transition-colors">
            トップ
          </Link>
          <span>/</span>
          <Link
            href={scopeLink}
            className="hover:text-blue-600 transition-colors"
          >
            {scopeLabel}
          </Link>
          <span>/</span>
          <span className="text-slate-800 font-medium truncate">
            {topic.title}
          </span>
        </nav>

        {/* ヘッダー */}
        <div className="mb-8">
          <div className="flex items-center gap-2 flex-wrap mb-3">
            <span
              className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded ${
                topic.scope === "domestic"
                  ? "bg-rose-50 text-rose-700"
                  : "bg-sky-50 text-sky-700"
              }`}
            >
              {scopeIcon}
              {topic.categoryLabel}
            </span>
            <StatusBadge
              status={topic.status}
              label={topic.statusLabel}
              size="md"
            />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
            {topic.title}
          </h1>
          <p className="text-base text-slate-600 mt-2">{topic.subtitle}</p>
          <div className="flex items-center gap-1 mt-3 text-xs text-slate-400">
            <Calendar className="w-3.5 h-3.5" />
            最終更新: {topic.lastUpdated}
          </div>
        </div>

        {/* ざっくり言うと */}
        {topic.simpleSummary && (
          <section className="mb-8">
            <div className="bg-blue-50 rounded-xl border border-blue-200/60 p-5">
              <h2 className="text-sm font-bold text-blue-800 mb-2 flex items-center gap-1.5">
                💬 ざっくり言うと
              </h2>
              <p className="text-[15px] text-blue-900 leading-relaxed whitespace-pre-line">
                {topic.simpleSummary}
              </p>
            </div>
          </section>
        )}

        {/* 背景 */}
        {topic.background && (
          <section className="mb-8">
            <h2 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
              📖 背景
            </h2>
            <div className="bg-amber-50/50 rounded-xl border border-amber-200/50 p-5">
              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                {topic.background}
              </p>
            </div>
          </section>
        )}

        {/* 現在の状況 */}
        <section className="mb-8">
          <h2 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            現在の状況
          </h2>
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
              {topic.overview}
            </p>
          </div>
        </section>

        {/* 記事ごとの特別セクション（表、比較カード、独自解説等） */}
        {topic.customSections && topic.customSections.map((section, sIdx) => (
          <section key={sIdx} className="mb-8">
            <h2 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
              {section.icon ? <span>{section.icon}</span> : <FileText className="w-5 h-5 text-blue-600" />}
              {section.title}
            </h2>
            {section.description && (
              <p className="text-xs text-slate-500 mb-3">{section.description}</p>
            )}

            {/* テーブル型レイアウト */}
            {section.type === "table" && section.tableData && (
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs sm:text-sm">
                    <thead>
                      <tr className="bg-slate-100/80 border-b border-slate-200">
                        {section.tableData.headers.map((header, hIdx) => (
                          <th key={hIdx} className="py-3 px-4 font-bold text-slate-700 whitespace-nowrap">
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {section.tableData.rows.map((row, rIdx) => (
                        <tr key={rIdx} className={rIdx % 2 === 1 ? "bg-slate-50/50" : "bg-white"}>
                          {row.map((cell, cIdx) => (
                            <td key={cIdx} className={`py-3 px-4 text-slate-700 leading-relaxed ${cIdx === 0 ? "font-bold text-slate-900 whitespace-nowrap" : ""}`}>
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 数値・予算ハイライト付きデータカード（横スクロール不要のスタックカード） */}
            {section.type === "stat_cards" && section.statCardsData && (
              <div className="space-y-4">
                {section.statCardsData.map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-2xs hover:border-slate-300 transition-all"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-slate-100 pb-3 mb-3.5">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
                        <h3 className="font-bold text-sm sm:text-base text-slate-900">
                          {item.title}
                        </h3>
                        {item.badge && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 shrink-0">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-800 border border-blue-200/70 font-bold text-xs sm:text-sm shrink-0 self-start sm:self-auto shadow-2xs">
                        <span>💰</span>
                        <span>{item.value}</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="bg-amber-50/40 rounded-lg p-3.5 border border-amber-200/40">
                        <div className="font-bold text-xs text-amber-900 mb-1.5 flex items-center gap-1.5">
                          <span>⚠️</span>
                          <span>現状と課題</span>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                          {item.challenge}
                        </p>
                      </div>
                      <div className="bg-emerald-50/40 rounded-lg p-3.5 border border-emerald-200/40">
                        <div className="font-bold text-xs text-emerald-900 mb-1.5 flex items-center gap-1.5">
                          <span>💡</span>
                          <span>対策・今後の見通し</span>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                          {item.measure}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* カード型レイアウト */}
            {section.type === "cards" && section.cardsData && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {section.cardsData.map((card, cIdx) => (
                  <div key={cIdx} className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <h3 className="font-bold text-sm text-slate-900">{card.title}</h3>
                      {card.badge && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-100 shrink-0">
                          {card.badge}
                        </span>
                      )}
                    </div>
                    {card.subtitle && (
                      <p className="text-xs font-semibold text-slate-500 mb-2">{card.subtitle}</p>
                    )}
                    <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">{card.content}</p>
                  </div>
                ))}
              </div>
            )}

            {/* テキストコールアウト型レイアウト */}
            {section.type === "text" && section.content && (
              <div className="bg-white rounded-xl border border-slate-200 p-5">
                <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                  {section.content}
                </p>
              </div>
            )}
          </section>
        ))}

        {/* 主な関係者 */}
        {topic.keyActors.length > 0 && (
          <section className="mb-8">
            <h2 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
              👥 主な関係者
            </h2>
            <KeyActorsBar actors={topic.keyActors} />
          </section>
        )}

        {/* 経緯 */}
        {topic.developments.length > 0 && (
          <section className="mb-8">
            <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              📅 経緯
            </h2>
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <DevelopmentTimeline developments={topic.developments} />
            </div>
          </section>
        )}

        {/* 関連する政策（日本政策図鑑） */}
        {topic.relatedPolicies && topic.relatedPolicies.length > 0 && (
          <section className="mb-8">
            <RelatedPolicies policies={topic.relatedPolicies} />
          </section>
        )}

        {/* タグ */}
        {topic.tags.length > 0 && (
          <section className="mb-8">
            <h2 className="text-sm font-bold text-slate-800 mb-2 flex items-center gap-2">
              <Tag className="w-4 h-4 text-slate-500" />
              タグ
            </h2>
            <div className="flex flex-wrap gap-1.5">
              {topic.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[11px] bg-slate-100 text-slate-600 px-2 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* 情報ソース */}
        {topic.sources.length > 0 && (
          <section className="mb-8">
            <h2 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
              📎 情報ソース
            </h2>
            <div className="space-y-2">
              {topic.sources.map((src, i) => (
                <a
                  key={i}
                  href={src.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2 text-sm text-blue-700 hover:text-blue-900 hover:underline group"
                >
                  <ExternalLink className="w-3.5 h-3.5 mt-0.5 shrink-0 text-slate-400 group-hover:text-blue-500" />
                  <div>
                    <span className="font-medium">{src.title}</span>
                    {src.organization && (
                      <span className="text-xs text-slate-500 ml-1">
                        — {src.organization}
                      </span>
                    )}
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* 戻るリンク */}
        <div className="pt-6 border-t border-slate-200">
          <Link
            href={scopeLink}
            className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            {topic.scope === "domestic"
              ? "国内政治の一覧に戻る"
              : "国際関係の一覧に戻る"}
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
};
