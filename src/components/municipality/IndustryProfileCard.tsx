'use client';

import React from 'react';
import { Factory, Wheat, Store, Building2, TrendingUp, Info } from 'lucide-react';
import { MunicipalityData } from '@/types/municipality';

interface Props {
  municipality: MunicipalityData;
}

export default function IndustryProfileCard({ municipality }: Props) {
  const ind = municipality.industryRatio;
  if (!ind) return null;

  // Determine industry classification label
  let profileTag = 'バランス型経済';
  let profileColor = 'bg-blue-100 text-blue-800 dark:bg-blue-950/70 dark:text-blue-300';
  let profileDesc = '第1次〜第3次産業がバランスよく配分された地域構造です。';

  if (ind.primary >= 10) {
    profileTag = '農林水産業拠点型';
    profileColor = 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300';
    profileDesc = '全国平均（約3%）を大きく超える第1次産業就業率を誇り、農作物・林業・水産資源が地域経済と食料供給の基盤となっています。';
  } else if (ind.secondary >= 30) {
    profileTag = 'ものづくり・工業都市型';
    profileColor = 'bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300';
    profileDesc = '製造業や建設業などの第2次産業が集積しており、企業立地に伴う法人市民税や固定資産税が財政基盤を支える工業集積地です。';
  } else if (ind.tertiary >= 78) {
    profileTag = '商業・サービス・都市型';
    profileColor = 'bg-purple-100 text-purple-800 dark:bg-purple-950/70 dark:text-purple-300';
    profileDesc = '小売・飲食・IT・医療福祉などの第3次産業が8割近くを占め、都市機能や観光・サービス消費が経済活動の中心となっています。';
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <Factory className="w-4 h-4" />
            </span>
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">
              産業構造 & 経済プロファイル
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            就業人口の産業別構成比（国勢調査）と街の産業特性
          </p>
        </div>

        <div>
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${profileColor}`}>
            <Building2 className="w-3.5 h-3.5" />
            {profileTag}
          </span>
        </div>
      </div>

      {/* 3 Industry Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* 第1次産業 */}
        <div className="p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/50">
          <div className="flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-300 font-semibold mb-1">
            <span className="flex items-center gap-1.5">
              <Wheat className="w-4 h-4 text-emerald-600" />
              第1次産業（農林水産）
            </span>
            <span className="text-[10px] bg-emerald-200/60 dark:bg-emerald-900/60 px-1.5 py-0.5 rounded">
              農業・林業・漁業
            </span>
          </div>
          <div className="text-2xl font-black text-emerald-700 dark:text-emerald-400 tracking-tight">
            {ind.primary}
            <span className="text-sm font-normal text-emerald-800 dark:text-emerald-300 ml-1">%</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            全国平均: 約 3.2%
          </p>
        </div>

        {/* 第2次産業 */}
        <div className="p-4 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/50">
          <div className="flex items-center justify-between text-xs text-amber-800 dark:text-amber-300 font-semibold mb-1">
            <span className="flex items-center gap-1.5">
              <Factory className="w-4 h-4 text-amber-600" />
              第2次産業（鉱工業・建設）
            </span>
            <span className="text-[10px] bg-amber-200/60 dark:bg-amber-900/60 px-1.5 py-0.5 rounded">
              製造業・建設業
            </span>
          </div>
          <div className="text-2xl font-black text-amber-700 dark:text-amber-400 tracking-tight">
            {ind.secondary}
            <span className="text-sm font-normal text-amber-800 dark:text-amber-300 ml-1">%</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            全国平均: 約 23.5%
          </p>
        </div>

        {/* 第3次産業 */}
        <div className="p-4 rounded-xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200/60 dark:border-purple-900/50">
          <div className="flex items-center justify-between text-xs text-purple-800 dark:text-purple-300 font-semibold mb-1">
            <span className="flex items-center gap-1.5">
              <Store className="w-4 h-4 text-purple-600" />
              第3次産業（サービス・商業）
            </span>
            <span className="text-[10px] bg-purple-200/60 dark:bg-purple-900/60 px-1.5 py-0.5 rounded">
              小売・観光・IT・福祉
            </span>
          </div>
          <div className="text-2xl font-black text-purple-700 dark:text-purple-400 tracking-tight">
            {ind.tertiary}
            <span className="text-sm font-normal text-purple-800 dark:text-purple-300 ml-1">%</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            全国平均: 約 73.3%
          </p>
        </div>
      </div>

      {/* 産業比率スタックバー */}
      <div className="mb-6 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
          <span>産業別構成比バランス</span>
          <span className="text-[11px] text-slate-500 font-normal">就業人口比率</span>
        </div>
        <div className="w-full h-4 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden flex">
          <div
            className="h-full bg-emerald-500 transition-all duration-300"
            style={{ width: `${ind.primary}%` }}
            title={`第1次産業: ${ind.primary}%`}
          />
          <div
            className="h-full bg-amber-500 transition-all duration-300"
            style={{ width: `${ind.secondary}%` }}
            title={`第2次産業: ${ind.secondary}%`}
          />
          <div
            className="h-full bg-purple-500 transition-all duration-300"
            style={{ width: `${ind.tertiary}%` }}
            title={`第3次産業: ${ind.tertiary}%`}
          />
        </div>
        <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2 px-1">
          <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
            農林水産 ({ind.primary}%)
          </span>
          <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
            鉱工業・建設 ({ind.secondary}%)
          </span>
          <span className="flex items-center gap-1 text-purple-600 dark:text-purple-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-purple-500 inline-block" />
            サービス・商業 ({ind.tertiary}%)
          </span>
        </div>
      </div>

      {/* 主たる企業 & 看板産業・特産品 */}
      {municipality.economy && (
        <div className="space-y-4 mb-5">
          {/* 主要企業 */}
          {municipality.economy.majorCompanies && municipality.economy.majorCompanies.length > 0 && (
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-2 flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>街を支える主たる企業・中核拠点（納税・雇用の柱）</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {municipality.economy.majorCompanies.map((company, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 shadow-2xs"
                  >
                    🏢 {company}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 看板産業・特産品 */}
          {municipality.economy.featuredSpecialties && municipality.economy.featuredSpecialties.length > 0 && (
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-2 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>看板産業・有名特産品・名物</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {municipality.economy.featuredSpecialties.map((item, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-300"
                  >
                    ✨ {item}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 特徴解説 */}
      <div className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed bg-slate-50/60 dark:bg-slate-800/30 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 flex items-start gap-2">
        <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
        <p>
          {municipality.economy ? municipality.economy.description : profileDesc}
        </p>
      </div>
    </div>
  );
}
