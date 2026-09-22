"use client";

import React from "react";
import Link from "next/link";
import type { Topic } from "@/types/topic";
import { useCheckedTopics } from "@/lib/checkHistory";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { StatusBadge } from "./StatusBadge";
import { KeyActorsBar } from "./KeyActorsBar";
import { DevelopmentTimeline } from "./DevelopmentTimeline";
import { RelatedPolicies } from "./RelatedPolicies";
import { RelatedTopics } from "./RelatedTopics";
import { TopicDiscussion } from "./TopicDiscussion";
import { ViewCounter } from "./ViewCounter";
import {
  ArrowLeft,
  Calendar,
  ExternalLink,
  FileText,
  Landmark,
  Globe,
  Tag,
  Check,
} from "lucide-react";

interface TopicDetailViewProps {
  topic: Topic;
}

export const TopicDetailView: React.FC<TopicDetailViewProps> = ({ topic }) => {
  const { isChecked, toggleChecked, isLoaded } = useCheckedTopics();
  const checked = isChecked(topic.id);

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
            <ViewCounter topicId={topic.id} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
            {topic.title}
          </h1>
          <p className="text-base text-slate-600 mt-2">{topic.subtitle}</p>
          <div className="flex items-center justify-between flex-wrap gap-2 mt-3 text-xs text-slate-400">
            <div className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              最終更新: {topic.lastUpdated}
            </div>

            {isLoaded && (
              <button
                type="button"
                onClick={() => toggleChecked(topic.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer shadow-2xs ${
                  checked
                    ? "bg-emerald-600 text-white shadow-xs hover:bg-emerald-700"
                    : "bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200 hover:text-slate-900"
                }`}
                title={checked ? "クリックで未確認に戻す" : "クリックで確認済みにする"}
              >
                <div
                  className={`w-3.5 h-3.5 rounded flex items-center justify-center transition-colors ${
                    checked
                      ? "bg-white text-emerald-600"
                      : "border-2 border-slate-400 bg-white"
                  }`}
                >
                  {checked && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
                <span>{checked ? "確認済み" : "確認済みにする"}</span>
              </button>
            )}
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
        {(() => {
          const sections = [...(topic.customSections || [])];
          if (topic.statCardsData && topic.statCardsData.length > 0 && !sections.some((s) => s.type === "stat_cards")) {
            sections.push({
              title: "重要指標・対比データ",
              icon: "📊",
              type: "stat_cards",
              statCardsData: topic.statCardsData,
            });
          }
          if (topic.cardsData && topic.cardsData.length > 0 && !sections.some((s) => s.type === "cards")) {
            sections.push({
              title: "深掘り4大論点",
              icon: "📌",
              type: "cards",
              cardsData: topic.cardsData,
            });
          }

          return sections.map((section, sIdx) => (
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
                          <th
                            key={hIdx}
                            className={`py-3 px-3 sm:px-4 font-bold text-slate-700 ${
                              hIdx === 0 ? "whitespace-nowrap shrink-0" : "min-w-[120px]"
                            }`}
                          >
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {section.tableData.rows.map((row, rIdx) => (
                        <tr key={rIdx} className={rIdx % 2 === 1 ? "bg-slate-50/50" : "bg-white"}>
                          {row.map((cell, cIdx) => (
                            <td
                              key={cIdx}
                              className={`py-3 px-3 sm:px-4 text-slate-700 leading-relaxed ${
                                cIdx === 0 ? "font-bold text-slate-900 whitespace-nowrap align-top" : "align-top"
                              }`}
                            >
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

            {/* 数値・予算・比較ハイライト付きデータカード（横スクロール不要のスタックカード） */}
            {section.type === "stat_cards" && section.statCardsData && (
              <div className="space-y-4">
                {section.statCardsData.map((item, idx) => {
                  const leftContent = item.leftContent || item.challenge;
                  const leftTitle = item.leftTitle || (item.challenge ? "⚠️ 現状と課題" : undefined);
                  const rightContent = item.rightContent || item.measure;
                  const rightTitle = item.rightTitle || (item.measure ? "💡 対策・今後の見通し" : undefined);

                  return (
                    <div
                      key={idx}
                      className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-2xs hover:border-slate-300 transition-all"
                    >
                      <div className="border-b border-slate-100 pb-3 mb-3.5 space-y-2.5">
                        {/* タイトル行：横幅全体を使い、タイトルが縦に押し潰されないように配置 */}
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
                          <h3 className="font-bold text-sm sm:text-base text-slate-900 leading-snug">
                            {item.title}
                          </h3>
                          {item.badge && (
                            <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 shrink-0">
                              {item.badge}
                            </span>
                          )}
                        </div>

                        {/* ハイライト数値（value）：独立した行でゆったり美しく目立たせる */}
                        {item.value && (
                          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-50/80 text-blue-800 border border-blue-200/70 font-bold text-xs sm:text-sm shadow-2xs max-w-full">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                            <span className="break-words leading-relaxed">{item.value}</span>
                          </div>
                        )}
                      </div>

                      {/* 2カラム比較・詳細ブロック */}
                      {(leftContent || rightContent) && (
                        <div className={`grid ${leftContent && rightContent ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"} gap-3`}>
                          {leftContent && (
                            <div className="bg-amber-50/30 rounded-lg p-3.5 border border-amber-200/40">
                              {leftTitle && (
                                <div className="font-bold text-xs text-amber-900 mb-1.5 flex items-center gap-1.5">
                                  <span>{leftTitle}</span>
                                </div>
                              )}
                              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                                {leftContent}
                              </p>
                            </div>
                          )}
                          {rightContent && (
                            <div className="bg-emerald-50/30 rounded-lg p-3.5 border border-emerald-200/40">
                              {rightTitle && (
                                <div className="font-bold text-xs text-emerald-900 mb-1.5 flex items-center gap-1.5">
                                  <span>{rightTitle}</span>
                                </div>
                              )}
                              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                                {rightContent}
                              </p>
                            </div>
                          )}
                        </div>
                      )}

                      {/* フッター全幅ブロック（裁判所判断や結論など） */}
                      {item.footerContent && (
                        <div className="mt-3 bg-blue-50/40 rounded-lg p-3.5 border border-blue-200/50">
                          {item.footerTitle && (
                            <div className="font-bold text-xs text-blue-900 mb-1.5 flex items-center gap-1.5">
                              <span>{item.footerTitle}</span>
                            </div>
                          )}
                          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                            {item.footerContent}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
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
        ));
        })()}

        {/* 海外主要国の制度比較・国際動向 */}
        {topic.international && topic.international.length > 0 && (
          <section className="mb-8">
            <h2 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Globe className="w-5 h-5 text-indigo-600" />
              海外主要国の制度比較・国際動向
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {topic.international.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs hover:border-slate-300 transition-all"
                >
                  <div className="flex items-center gap-2 mb-2">
                    {item.flag && <span className="text-base">{item.flag}</span>}
                    <h3 className="font-bold text-sm text-slate-900">
                      {item.country}
                    </h3>
                  </div>
                  {(item.system || item.title) && (
                    <div className="text-xs font-semibold text-indigo-700 bg-indigo-50/80 border border-indigo-100 rounded-md px-2.5 py-1 mb-2">
                      {item.system || item.title}
                    </div>
                  )}
                  <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
                    {item.description || item.detail}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

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

        {/* 関連する時事トピック（時事図鑑内の相互リンク） */}
        {topic.relatedTopics && topic.relatedTopics.length > 0 && (
          <section className="mb-8">
            <RelatedTopics topics={topic.relatedTopics} />
          </section>
        )}

        {/* 関連する政策（日本政策図鑑への外部リンク） */}
        {topic.relatedPolicies && topic.relatedPolicies.length > 0 && (
          <section className="mb-8">
            <RelatedPolicies policies={topic.relatedPolicies} />
          </section>
        )}

        {/* タグ */}
        {topic.tags && topic.tags.length > 0 && (
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

        {/* 完了確認チェックボックスカード */}
        {isLoaded && (
          <div className="my-8 p-5 sm:p-6 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                このトピックの確認チェック
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                チェックを入れると、一覧カードや上部の進捗メーターに反映されます。
              </p>
            </div>
            <button
              type="button"
              onClick={() => toggleChecked(topic.id)}
              className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer shadow-xs shrink-0 ${
                checked
                  ? "bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-200/50"
                  : "bg-white text-slate-700 border-2 border-slate-300 hover:border-emerald-500 hover:text-emerald-700"
              }`}
            >
              <div
                className={`w-4 h-4 rounded flex items-center justify-center ${
                  checked
                    ? "bg-white text-emerald-600"
                    : "border-2 border-slate-400 bg-white"
                }`}
              >
                {checked && <Check className="w-3 h-3 stroke-[3]" />}
              </div>
              <span>{checked ? "確認済み" : "確認済みにする"}</span>
            </button>
          </div>
        )}

        {/* 💬 議論・専門知識・補足情報スレッド（Giscus & GitHub連携） */}
        <TopicDiscussion topic={topic} />

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
