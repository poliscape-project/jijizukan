'use client';

import React from 'react';
import { AlertOctagon, ShieldCheck, Hourglass, TrendingDown, Users, HelpCircle, Sparkles } from 'lucide-react';
import { MunicipalityData } from '@/types/municipality';

interface Props {
  municipality: MunicipalityData;
}

export default function SustainabilityCard({ municipality }: Props) {
  const sus = municipality.sustainability;
  if (!sus || sus.categoryType === 'unestimated') return null;

  const isVanishing = sus.categoryType === 'vanishing';
  const isSelfReliant = sus.categoryType === 'self-reliant';
  const isBlackhole = sus.categoryType === 'blackhole';

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className={`p-1.5 rounded-lg ${
              isVanishing
                ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400'
                : isSelfReliant
                ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400'
                : isBlackhole
                ? 'bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400'
                : 'bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400'
            }`}>
              {isVanishing ? (
                <AlertOctagon className="w-4 h-4" />
              ) : isSelfReliant ? (
                <ShieldCheck className="w-4 h-4" />
              ) : (
                <Hourglass className="w-4 h-4" />
              )}
            </span>
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">
              自治体持続可能性 & 2050年人口予測
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            人口戦略会議（2024年4月最新公表）「地方自治体持続可能性分析レポート」
          </p>
        </div>

        <div>
          {isVanishing && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 dark:bg-rose-950/70 dark:text-rose-300">
              <AlertOctagon className="w-3.5 h-3.5" />
              消滅可能性自治体（全国744団体）
            </span>
          )}
          {isSelfReliant && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300">
              <Sparkles className="w-3.5 h-3.5" />
              自立持続可能性自治体（全国65団体のみ）
            </span>
          )}
          {isBlackhole && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800 dark:bg-purple-950/70 dark:text-purple-300">
              <Hourglass className="w-3.5 h-3.5" />
              ブラックホール型自治体（全国25団体）
            </span>
          )}
          {!isVanishing && !isSelfReliant && !isBlackhole && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 dark:bg-blue-950/70 dark:text-blue-300">
              <ShieldCheck className="w-3.5 h-3.5" />
              持続可能性自治体
            </span>
          )}
        </div>
      </div>

      {/* 3 Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* 若年女性減少率 */}
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 font-semibold mb-1">
            <span>若年女性（20〜39歳）減少率</span>
            <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-500">
              2020→2050年
            </span>
          </div>
          <div className={`text-2xl font-black tracking-tight ${
            sus.youngFemaleChangeRate <= -50
              ? 'text-rose-600 dark:text-rose-400'
              : sus.youngFemaleChangeRate <= -20
              ? 'text-amber-600 dark:text-amber-400'
              : 'text-emerald-600 dark:text-emerald-400'
          }`}>
            {sus.youngFemaleChangeRate > 0 ? `+${sus.youngFemaleChangeRate}` : sus.youngFemaleChangeRate}
            <span className="text-sm font-normal ml-1">%</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            基準: -50%以上で「消滅可能性」判定
          </p>
        </div>

        {/* 2050年予測総人口 */}
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 font-semibold mb-1">
            <span>2050年 予測総人口</span>
            <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-500">
              社人研推計
            </span>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {(sus.projectedPop2050 / 10000 >= 1)
              ? `${(sus.projectedPop2050 / 10000).toFixed(1)}万人`
              : `${sus.projectedPop2050.toLocaleString()}人`}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            現在人口比: <span className={`font-semibold ${sus.popChangeRate < 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
              {sus.popChangeRate > 0 ? `+${sus.popChangeRate}` : sus.popChangeRate}%
            </span>
          </p>
        </div>

        {/* 持続可能性ステータス */}
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 font-semibold mb-1">
            <span>人口戦略会議 分類</span>
            <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-500">
              公式レポート
            </span>
          </div>
          <div className="text-lg font-black text-slate-900 dark:text-white mt-1">
            {sus.category}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            {isVanishing
              ? '若年女性半減により次世代再生産が危機的'
              : isSelfReliant
              ? '全国わずか3.8%の持続可能モデル自治体'
              : isBlackhole
              ? '他地域からの流入依存・出生率は低水準'
              : '一定の人口規模と維持可能性を保持'}
          </p>
        </div>
      </div>

      {/* 解説 */}
      <div className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed bg-white/70 dark:bg-slate-900/60 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 flex items-start gap-2.5">
        <HelpCircle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
        <div>
          {isVanishing ? (
            <p>
              <strong>「消滅可能性自治体」の課題と針路: </strong>
              2020年から2050年の30年間で、次世代の出産を担う20〜39歳の若年女性人口が<strong>{Math.abs(sus.youngFemaleChangeRate)}%減少</strong>すると試算されています。若者の県外・大都市流出の歯止め、子育て環境の劇的改善、および水道・道路・公共施設のコンパクトシティ化による行政維持コストの最適化が待ったなしの優先課題となります。
            </p>
          ) : isSelfReliant ? (
            <p>
              <strong>「自立持続可能性自治体」の強み: </strong>
              若年女性の減少率が20%未満にとどまり、全国でわずか65自治体（全体の約3.8%）しか該当しない「自立持続可能」なモデル地域です。企業誘致による雇用創出や魅力的な子育て施策が奏功し、地方創生の先行事例として注目されています。
            </p>
          ) : isBlackhole ? (
            <p>
              <strong>「ブラックホール型自治体」の構造: </strong>
              若者や単身世帯の転入超過により人口は維持されていますが、地域内の出生率が極端に低く、地方からの人口吸引に依存している構造です。ファミリー層が定着できる住宅環境や子育て支援の強化が求められます。
            </p>
          ) : (
            <p>
              <strong>人口持続の状況: </strong>
              若年女性減少率は一定範囲に収まっており、極端な消滅危機は回避されていますが、2050年に向けて総人口は<strong>{sus.popChangeRate}%</strong>変化すると予測されています。産業活力の維持と社会保障コストのバランスが今後の鍵となります。
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
