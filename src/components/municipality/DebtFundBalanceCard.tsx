'use client';

import React from 'react';
import { PiggyBank, Landmark, Scale, ShieldCheck, AlertCircle } from 'lucide-react';
import { MunicipalityData } from '@/types/municipality';

interface Props {
  municipality: MunicipalityData;
}

export default function DebtFundBalanceCard({ municipality }: Props) {
  const pop = municipality.population || 1;
  const reserveTotal = municipality.financial.reserveFundTotal * 1000; // 千円 -> 円
  const fiscalAdjustment = municipality.financial.fiscalAdjustmentFund * 1000;
  const debtTotal = municipality.financial.debtOutstanding * 1000;

  const reservePerCapita = Math.round(reserveTotal / pop);
  const debtPerCapita = Math.round(debtTotal / pop);
  const netPerCapita = reservePerCapita - debtPerCapita;
  const isNetPositive = netPerCapita >= 0;

  // Max for scale comparison
  const maxVal = Math.max(reserveTotal, debtTotal, 1);
  const reservePct = Math.min(100, Math.round((reserveTotal / maxVal) * 100));
  const debtPct = Math.min(100, Math.round((debtTotal / maxVal) * 100));

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <Scale className="w-4 h-4" />
            </span>
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">
              街の実質純資産：積立基金 vs 地方債残高
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            将来世代への備えとなる「積立基金」と、インフラ整備等の返済義務である「地方債残高」のバランス
          </p>
        </div>

        <div>
          {isNetPositive ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300">
              <ShieldCheck className="w-3.5 h-3.5" />
              基金超過（実質純資産プラス）
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300">
              <AlertCircle className="w-3.5 h-3.5" />
              将来負担先行（地方債超過）
            </span>
          )}
        </div>
      </div>

      {/* 住民1人あたりの天秤ハイライト */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* 1人あたり基金積立額 */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60">
          <div className="flex items-center justify-between text-xs text-slate-700 dark:text-slate-300 font-semibold mb-1">
            <span className="flex items-center gap-1.5">
              <PiggyBank className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              1人あたり基金積立額
            </span>
            <span className="text-[10px] bg-slate-200/70 dark:bg-slate-700 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-300">
              積立基金計
            </span>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white my-1">
            {reservePerCapita.toLocaleString()} <span className="text-xs font-normal text-slate-500">円</span>
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400">
            総額: {(reserveTotal / 100000000).toFixed(1)}億円（うち財政調整基金: {(fiscalAdjustment / 100000000).toFixed(1)}億円）
          </div>
        </div>

        {/* 1人あたり地方債残高 */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60">
          <div className="flex items-center justify-between text-xs text-slate-700 dark:text-slate-300 font-semibold mb-1">
            <span className="flex items-center gap-1.5">
              <Landmark className="w-4 h-4 text-rose-600 dark:text-rose-400" />
              1人あたり地方債残高
            </span>
            <span className="text-[10px] bg-slate-200/70 dark:bg-slate-700 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-300">
              将来返済義務
            </span>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white my-1">
            {debtPerCapita.toLocaleString()} <span className="text-xs font-normal text-slate-500">円</span>
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400">
            総額: {(debtTotal / 100000000).toFixed(1)}億円（公共施設・道路整備等）
          </div>
        </div>

        {/* 差引・実質純資産 */}
        <div className={`p-4 rounded-xl border ${
          isNetPositive
            ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200/70 dark:border-emerald-900/60'
            : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200/70 dark:border-slate-700/60'
        }`}>
          <div className="text-xs text-slate-600 dark:text-slate-400 font-semibold mb-1">
            1人あたり実質純資産（差引）
          </div>
          <div className={`text-2xl font-black my-1 ${
            isNetPositive
              ? 'text-emerald-600 dark:text-emerald-400'
              : 'text-slate-700 dark:text-slate-300'
          }`}>
            {isNetPositive ? `+${netPerCapita.toLocaleString()}` : netPerCapita.toLocaleString()}
            <span className="text-xs font-normal text-slate-500"> 円</span>
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400">
            {isNetPositive
              ? '地方債を全額償還しても基金が手元に残る健全財政'
              : `地方債残高が積立基金を ${(debtTotal / Math.max(1, reserveTotal)).toFixed(1)}倍 上回る構造`}
          </div>
        </div>
      </div>

      {/* ビジュアル比較バー */}
      <div className="space-y-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
        <div>
          <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              積立基金現在高（財政調整・特定目的等）
            </span>
            <span>{(reserveTotal / 100000000).toFixed(1)} 億円</span>
          </div>
          <div className="h-2.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${reservePct}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              地方債現在高（市債・町債の未償還残高）
            </span>
            <span>{(debtTotal / 100000000).toFixed(1)} 億円</span>
          </div>
          <div className="h-2.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-rose-500 rounded-full transition-all duration-500"
              style={{ width: `${debtPct}%` }}
            />
          </div>
        </div>

        <p className="text-[11px] text-slate-500 dark:text-slate-400 pt-1 leading-relaxed">
          ※ 積立基金には災害や予期せぬ減収に備える「財政調整基金」や、将来の返済に備える「減債基金」、学校・道路等の更新に備える「特定目的基金」が含まれます。
          地方債は長期利用される公共インフラ整備等の財源として発行され、将来世代が公債費として分割償還します。
        </p>
      </div>
    </div>
  );
}
