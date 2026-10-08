'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Coins, PiggyBank, Scale, Gift, TrendingDown, Users, AlertOctagon, Sparkles } from 'lucide-react';
import { MunicipalitySummary } from '@/types/municipality';

interface Props {
  topFinancial: MunicipalitySummary[];
  topNetReserve: MunicipalitySummary[];
  topPublicWorks: MunicipalitySummary[];
  topFurusatoSurplus: MunicipalitySummary[];
  topFurusatoDeficit: MunicipalitySummary[];
  topAging: MunicipalitySummary[];
  topVanishing: MunicipalitySummary[];
  topSelfReliant: MunicipalitySummary[];
}

export default function MunicipalityRankingTabs({
  topFinancial,
  topNetReserve,
  topPublicWorks,
  topFurusatoSurplus,
  topFurusatoDeficit,
  topAging,
  topVanishing,
  topSelfReliant
}: Props) {
  const [activeTab, setActiveTab] = useState<'financial' | 'furusato' | 'population'>('financial');

  const tabs = [
    { id: 'financial', label: '財政健全度・税金', icon: Coins, count: '3指標' },
    { id: 'furusato', label: 'ふるさと納税収支', icon: Gift, count: '黒字/赤字' },
    { id: 'population', label: '人口・持続可能性', icon: Users, count: '消滅/自立' }
  ] as const;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-5">
      {/* タブヘッダー */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
        <div>
          <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
            全国注目ランキング（財政・ふるさと・人口）
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            全国1,741自治体の決算から突出した特徴を持つトップ・ワースト自治体
          </p>
        </div>

        {/* タブボタングループ */}
        <div className="inline-flex p-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold self-start sm:self-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition text-xs cursor-pointer ${
                  isActive
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm border border-slate-200/60 dark:border-slate-600 font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-700/60 font-medium'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* タブコンテンツ */}
      {activeTab === 'financial' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* 財政力指数 */}
          <div className="p-4 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Coins className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                  財政力指数 全国トップ
                </span>
                <span className="text-[10px] text-slate-400">不交付団体</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-3">
                地方交付税に頼らず自立運営
              </p>
              <div className="space-y-1.5">
                {topFinancial.map((m, idx) => (
                  <Link
                    key={m.code}
                    href={`/municipalities/${m.code}`}
                    className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-slate-800 hover:border-indigo-400 border border-slate-200/60 dark:border-slate-700/60 transition text-xs group"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-4 h-4 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center text-[10px] font-bold">
                        {idx + 1}
                      </span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
                        {m.prefName} {m.name}
                      </span>
                    </div>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {m.financialStrength.toFixed(2)}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* 実質純資産（貯金超過） */}
          <div className="p-4 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <PiggyBank className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                  実質純資産（基金超過）
                </span>
                <span className="text-[10px] text-slate-400">1人あたり</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-3">
                地方債を即全額償還しても手元に残る積立基金
              </p>
              <div className="space-y-1.5">
                {topNetReserve.map((m, idx) => (
                  <Link
                    key={m.code}
                    href={`/municipalities/${m.code}`}
                    className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-slate-800 hover:border-indigo-400 border border-slate-200/60 dark:border-slate-700/60 transition text-xs group"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-4 h-4 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center text-[10px] font-bold">
                        {idx + 1}
                      </span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
                        {m.prefName} {m.name}
                      </span>
                    </div>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      +{(Math.round((m.netPerCapita || 0) / 10000)).toLocaleString()}万円
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* 住民1人あたり土木費 */}
          <div className="p-4 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Scale className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                  1人あたり土木費 全国トップ
                </span>
                <span className="text-[10px] text-slate-400">道路・治山等</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-3">
                急傾斜地・治山・インフラ維持費の突出
              </p>
              <div className="space-y-1.5">
                {topPublicWorks.map((m, idx) => (
                  <Link
                    key={m.code}
                    href={`/municipalities/${m.code}`}
                    className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-slate-800 hover:border-indigo-400 border border-slate-200/60 dark:border-slate-700/60 transition text-xs group"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-4 h-4 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center text-[10px] font-bold">
                        {idx + 1}
                      </span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
                        {m.prefName} {m.name}
                      </span>
                    </div>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {(m.publicWorksPerCapita || 0).toLocaleString()}円
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'furusato' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* ふるさと納税 黒字（流入超過） */}
          <div className="p-4 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Gift className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  ふるさと納税 黒字（流入超過）トップ
                </span>
                <span className="text-[10px] text-emerald-600 font-bold">受入 ≫ 流出</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-3">
                寄附受入額が市民税控除額を大きく上回る勝ち組
              </p>
              <div className="space-y-1.5">
                {topFurusatoSurplus.map((m, idx) => (
                  <Link
                    key={m.code}
                    href={`/municipalities/${m.code}`}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-white dark:bg-slate-800 hover:border-indigo-400 border border-slate-200/60 dark:border-slate-700/60 transition text-xs group"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-4 h-4 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center text-[10px] font-bold">
                        {idx + 1}
                      </span>
                      <div>
                        <div className="font-semibold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
                          {m.prefName} {m.name}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          1人あたり +{((m.furusatoBalancePerCapita || 0)).toLocaleString()}円
                        </div>
                      </div>
                    </div>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                      +{((m.furusatoBalance || 0) / 1e8).toFixed(1)}億円
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* ふるさと納税 赤字（流出超過） */}
          <div className="p-4 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <TrendingDown className="w-3.5 h-3.5 text-rose-500" />
                  ふるさと納税 赤字（流出超過）ワースト
                </span>
                <span className="text-[10px] text-rose-600 font-bold">住民税減収</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-3">
                住民が他自治体に寄付したことで税収が流出した自治体
              </p>
              <div className="space-y-1.5">
                {topFurusatoDeficit.map((m, idx) => (
                  <Link
                    key={m.code}
                    href={`/municipalities/${m.code}`}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-white dark:bg-slate-800 hover:border-indigo-400 border border-slate-200/60 dark:border-slate-700/60 transition text-xs group"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-4 h-4 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center text-[10px] font-bold">
                        {idx + 1}
                      </span>
                      <div>
                        <div className="font-semibold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
                          {m.prefName} {m.name}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          1人あたり {((m.furusatoBalancePerCapita || 0)).toLocaleString()}円
                        </div>
                      </div>
                    </div>
                    <span className="font-bold text-rose-600 dark:text-rose-400 text-sm">
                      {((m.furusatoBalance || 0) / 1e8).toFixed(1)}億円
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'population' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* 高齢化率トップ */}
          <div className="p-4 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                  高齢化率 全国トップ
                </span>
                <span className="text-[10px] text-slate-400">65歳以上比率</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-3">
                住民基本台帳に基づく高齢化水準
              </p>
              <div className="space-y-1.5">
                {topAging.map((m, idx) => (
                  <Link
                    key={m.code}
                    href={`/municipalities/${m.code}`}
                    className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-slate-800 hover:border-indigo-400 border border-slate-200/60 dark:border-slate-700/60 transition text-xs group"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-4 h-4 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center text-[10px] font-bold">
                        {idx + 1}
                      </span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
                        {m.prefName} {m.name}
                      </span>
                    </div>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {m.agingRate}%
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* 消滅可能性自治体 */}
          <div className="p-4 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <AlertOctagon className="w-3.5 h-3.5 text-rose-500" />
                  消滅可能性（若年女性減少）
                </span>
                <span className="text-[10px] text-rose-600 font-bold">人口戦略会議2024</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-3">
                2050年までの若年女性（20-39歳）減少率
              </p>
              <div className="space-y-1.5">
                {topVanishing.map((m, idx) => (
                  <Link
                    key={m.code}
                    href={`/municipalities/${m.code}`}
                    className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-slate-800 hover:border-indigo-400 border border-slate-200/60 dark:border-slate-700/60 transition text-xs group"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-4 h-4 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center text-[10px] font-bold">
                        {idx + 1}
                      </span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
                        {m.prefName} {m.name}
                      </span>
                    </div>
                    <span className="font-bold text-rose-600 dark:text-rose-400">
                      {m.youngFemaleChangeRate}%
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* 自立持続可能性自治体 */}
          <div className="p-4 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  自立持続可能（女性人口増）
                </span>
                <span className="text-[10px] text-emerald-600 font-bold">全国65自治体</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-3">
                持続モデルとして人口維持に成功
              </p>
              <div className="space-y-1.5">
                {topSelfReliant.map((m, idx) => (
                  <Link
                    key={m.code}
                    href={`/municipalities/${m.code}`}
                    className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-slate-800 hover:border-indigo-400 border border-slate-200/60 dark:border-slate-700/60 transition text-xs group"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-4 h-4 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center text-[10px] font-bold">
                        {idx + 1}
                      </span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
                        {m.prefName} {m.name}
                      </span>
                    </div>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      +{(m.youngFemaleChangeRate || 0)}%
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
