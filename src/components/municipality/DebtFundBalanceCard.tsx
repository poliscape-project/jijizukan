'use client';

import React from 'react';
import { PiggyBank, Landmark, Scale, ShieldCheck, AlertCircle, ArrowRight } from 'lucide-react';
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
            <span className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <Scale className="w-4 h-4" />
            </span>
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">
              街の貯金 vs 借金バランス（実質純資産）
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            将来世代にツケを残さないための「基金（貯金）」と「地方債（借金）」の力関係
          </p>
        </div>

        <div>
          {isNetPositive ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300">
              <ShieldCheck className="w-3.5 h-3.5" />
              実質黒字（貯金超過団体）
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300">
              <AlertCircle className="w-3.5 h-3.5" />
              借金先行（将来世代負担型）
            </span>
          )}
        </div>
      </div>

      {/* 住民1人あたりの天秤ハイライト */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* 1人あたり貯金 */}
        <div className="p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/50">
          <div className="flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-300 font-semibold mb-1">
            <span className="flex items-center gap-1.5">
              <PiggyBank className="w-4 h-4 text-emerald-600" />
              住民1人あたりの貯金
            </span>
            <span className="text-[10px] bg-emerald-200/60 dark:bg-emerald-900/60 px-1.5 py-0.5 rounded">
              基金合計
            </span>
          </div>
          <div className="text-2xl font-black text-emerald-900 dark:text-emerald-100 my-1">
            {reservePerCapita.toLocaleString()} <span className="text-xs font-normal text-slate-500">円</span>
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400">
            総額: {(reserveTotal / 100000000).toFixed(2)}億円（財調: {(fiscalAdjustment / 100000000).toFixed(2)}億円）
          </div>
        </div>

        {/* 1人あたり借金 */}
        <div className="p-4 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/60 dark:border-rose-900/50">
          <div className="flex items-center justify-between text-xs text-rose-800 dark:text-rose-300 font-semibold mb-1">
            <span className="flex items-center gap-1.5">
              <Landmark className="w-4 h-4 text-rose-600" />
              住民1人あたりの借金
            </span>
            <span className="text-[10px] bg-rose-200/60 dark:bg-rose-900/60 px-1.5 py-0.5 rounded">
              地方債残高
            </span>
          </div>
          <div className="text-2xl font-black text-rose-900 dark:text-rose-100 my-1">
            {debtPerCapita.toLocaleString()} <span className="text-xs font-normal text-slate-500">円</span>
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400">
            総額: {(debtTotal / 100000000).toFixed(2)}億円（過去の投資インフラ等）
          </div>
        </div>

        {/* 差引・実質純資産 */}
        <div className={`p-4 rounded-xl border ${
          isNetPositive
            ? 'bg-indigo-50/50 dark:bg-indigo-950/20 border-indigo-200/60 dark:border-indigo-900/50'
            : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800'
        }`}>
          <div className="text-xs text-slate-600 dark:text-slate-400 font-semibold mb-1">
            住民1人あたりの差引実質純資産
          </div>
          <div className={`text-2xl font-black my-1 ${
            isNetPositive
              ? 'text-indigo-600 dark:text-indigo-400'
              : 'text-amber-600 dark:text-amber-400'
          }`}>
            {isNetPositive ? `+${netPerCapita.toLocaleString()}` : netPerCapita.toLocaleString()}
            <span className="text-xs font-normal text-slate-500"> 円</span>
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400">
            {isNetPositive
              ? '借金を全額返済しても貯金が残る健全な状態'
              : `借金が貯金を ${(debtTotal / Math.max(1, reserveTotal)).toFixed(1)}倍 上回る構造`}
          </div>
        </div>
      </div>

      {/* ビジュアル比較バー */}
      <div className="space-y-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
        <div>
          <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              貯金（基金残高合計）
            </span>
            <span>{(reserveTotal / 100000000).toFixed(1)} 億円</span>
          </div>
          <div className="h-3 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
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
              借金（地方債残高）
            </span>
            <span>{(debtTotal / 100000000).toFixed(1)} 億円</span>
          </div>
          <div className="h-3 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-rose-500 rounded-full transition-all duration-500"
              style={{ width: `${debtPct}%` }}
            />
          </div>
        </div>

        <p className="text-[11px] text-slate-500 dark:text-slate-400 pt-1 leading-relaxed">
          ※ 基金には災害や税収減に備える「財政調整基金」、借金返済用の「減債基金」、学校や庁舎整備等の「特定目的基金」が含まれます。
          地方債は道路・学校・下水道など将来も利用されるインフラ整備に充当され、将来世代が分割返済します。
        </p>
      </div>
    </div>
  );
}
