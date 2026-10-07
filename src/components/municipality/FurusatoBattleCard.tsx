'use client';

import React from 'react';
import { Gift, TrendingUp, TrendingDown, ArrowRight, AlertTriangle, Sparkles, HelpCircle } from 'lucide-react';
import { MunicipalityData } from '@/types/municipality';

interface Props {
  municipality: MunicipalityData;
}

export default function FurusatoBattleCard({ municipality }: Props) {
  const furusato = municipality.furusato;
  if (!furusato) return null;

  const pop = municipality.population || 1;
  const isSurplus = furusato.balance >= 0;
  const isRealSurplus = furusato.realBalance >= 0;

  // Max for visual comparison
  const maxAmount = Math.max(furusato.received, furusato.deducted, 1);
  const recPct = Math.min(100, Math.round((furusato.received / maxAmount) * 100));
  const dedPct = Math.min(100, Math.round((furusato.deducted / maxAmount) * 100));

  // Expense ratio
  const expenseRatio = furusato.received > 0
    ? Math.min(100, Math.round((furusato.expensesTotal / furusato.received) * 100))
    : 0;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <Gift className="w-4 h-4" />
            </span>
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">
              ふるさと納税 収支バトル（勝ち組 vs 流出超過）
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            全国から稼いだ寄附受入額 vs 住民税として他自治体へ流出した控除額の損益
          </p>
        </div>

        <div>
          {isSurplus ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300">
              <TrendingUp className="w-3.5 h-3.5" />
              黒字（流入超過：+{(furusato.balance / 1e8).toFixed(1)}億円）
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 dark:bg-rose-950/70 dark:text-rose-300">
              <TrendingDown className="w-3.5 h-3.5" />
              赤字（流出超過：{(furusato.balance / 1e8).toFixed(1)}億円）
            </span>
          )}
        </div>
      </div>

      {/* 3 Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* 受入額 */}
        <div className="p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/50">
          <div className="flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-300 font-semibold mb-1">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              寄附受入額（獲得）
            </span>
            <span className="text-[10px] bg-emerald-200/60 dark:bg-emerald-900/60 px-1.5 py-0.5 rounded">
              稼いだ額
            </span>
          </div>
          <div className="text-2xl font-black text-emerald-700 dark:text-emerald-400 tracking-tight">
            {(furusato.received / 1e8).toFixed(2)}
            <span className="text-sm font-normal text-emerald-800 dark:text-emerald-300 ml-1">億円</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            受入件数: <span className="font-semibold text-slate-700 dark:text-slate-200">{furusato.receivedCount.toLocaleString()}</span> 件
          </p>
        </div>

        {/* 流出額 */}
        <div className="p-4 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/60 dark:border-rose-900/50">
          <div className="flex items-center justify-between text-xs text-rose-800 dark:text-rose-300 font-semibold mb-1">
            <span className="flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              住民税控除額（流出）
            </span>
            <span className="text-[10px] bg-rose-200/60 dark:bg-rose-900/60 px-1.5 py-0.5 rounded">
              奪われた市民税
            </span>
          </div>
          <div className="text-2xl font-black text-rose-700 dark:text-rose-400 tracking-tight">
            {(furusato.deducted / 1e8).toFixed(2)}
            <span className="text-sm font-normal text-rose-800 dark:text-rose-300 ml-1">億円</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            控除適用住民: <span className="font-semibold text-slate-700 dark:text-slate-200">{furusato.deductedCount.toLocaleString()}</span> 人
          </p>
        </div>

        {/* 純収支（住民1人あたり影響額） */}
        <div className={`p-4 rounded-xl border ${
          isSurplus
            ? 'bg-blue-50/50 dark:bg-blue-950/20 border-blue-200/60 dark:border-blue-900/50'
            : 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-200/60 dark:border-amber-900/50'
        }`}>
          <div className="flex items-center justify-between text-xs font-semibold mb-1">
            <span className={isSurplus ? 'text-blue-800 dark:text-blue-300' : 'text-amber-800 dark:text-amber-300'}>
              住民1人あたりの純損益
            </span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded ${
              isSurplus
                ? 'bg-blue-200/60 dark:bg-blue-900/60 text-blue-800 dark:text-blue-200'
                : 'bg-amber-200/60 dark:bg-amber-900/60 text-amber-800 dark:text-amber-200'
            }`}>
              収支インパクト
            </span>
          </div>
          <div className={`text-2xl font-black tracking-tight ${
            isSurplus ? 'text-blue-700 dark:text-blue-400' : 'text-amber-700 dark:text-amber-400'
          }`}>
            {furusato.balancePerCapita > 0 ? `+${furusato.balancePerCapita.toLocaleString()}` : furusato.balancePerCapita.toLocaleString()}
            <span className="text-sm font-normal ml-1">円</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            名目差引: <span className="font-semibold text-slate-700 dark:text-slate-200">{isSurplus ? '+' : ''}{(furusato.balance / 1e8).toFixed(2)}億円</span>
          </p>
        </div>
      </div>

      {/* 対比バー */}
      <div className="mb-6 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
        <div className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-3 flex items-center justify-between">
          <span>受入額（獲得） vs 流出額（市民税控除）の直接対決</span>
          <span className="text-[11px] text-slate-500 font-normal">
            総務省「ふるさと納税に関する現況調査（最新）」より
          </span>
        </div>

        {/* 受入バー */}
        <div className="mb-3">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-slate-600 dark:text-slate-400 font-medium">寄附受入額</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">
              {(furusato.received / 1e8).toFixed(2)}億円 ({recPct}%)
            </span>
          </div>
          <div className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${recPct}%` }}
            />
          </div>
        </div>

        {/* 流出バー */}
        <div>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-slate-600 dark:text-slate-400 font-medium">住民税流出額</span>
            <span className="font-bold text-rose-600 dark:text-rose-400">
              {(furusato.deducted / 1e8).toFixed(2)}億円 ({dedPct}%)
            </span>
          </div>
          <div className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-rose-500 rounded-full transition-all duration-500"
              style={{ width: `${dedPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* 返礼品・経費ブレークダウン */}
      {furusato.received > 0 && furusato.expensesTotal > 0 && (
        <div className="mb-6 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-800 dark:text-slate-200 mb-2">
            <span>受入額に対する返礼品調達・経費内訳</span>
            <span className="text-[11px] text-slate-500">
              経費率: <strong className="text-slate-700 dark:text-slate-200">{expenseRatio}%</strong>（国の上限目安50%）
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-slate-600 dark:text-slate-400 mb-3">
            <div className="p-2 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div className="text-[10px] text-slate-400">返礼品調達費</div>
              <div className="font-bold text-slate-800 dark:text-slate-200">
                {(furusato.expenseProcure / 1e8).toFixed(2)}億円
              </div>
            </div>
            <div className="p-2 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div className="text-[10px] text-slate-400">送料</div>
              <div className="font-bold text-slate-800 dark:text-slate-200">
                {(furusato.expenseShipping / 1e8).toFixed(2)}億円
              </div>
            </div>
            <div className="p-2 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div className="text-[10px] text-slate-400">広報・ポータル手数料</div>
              <div className="font-bold text-slate-800 dark:text-slate-200">
                {((furusato.expensePr + furusato.expensePayment) / 1e8).toFixed(2)}億円
              </div>
            </div>
            <div className="p-2 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div className="text-[10px] text-slate-400">実質手残り増収</div>
              <div className={`font-bold ${isRealSurplus ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600'}`}>
                {((furusato.received - furusato.expensesTotal) / 1e8).toFixed(2)}億円
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 解説・住民目線のインサイト */}
      <div className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed bg-slate-50/60 dark:bg-slate-800/30 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 flex items-start gap-2">
        <HelpCircle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
        <div>
          {isSurplus ? (
            <p>
              <strong>流入超過（勝ち組）: </strong>
              この自治体は寄附受入額（{(furusato.received / 1e8).toFixed(1)}億円）が住民税流出額（{(furusato.deducted / 1e8).toFixed(1)}億円）を大きく上回り、差引で<strong>+{(furusato.balance / 1e8).toFixed(1)}億円</strong>の財源獲得に成功しています。住民1人あたりに換算すると<strong>約+{furusato.balancePerCapita.toLocaleString()}円</strong>の純プラス効果をもたらしています。
            </p>
          ) : (
            <p>
              <strong>流出超過（市民税減少）: </strong>
              この自治体は住民のふるさと納税利用等に伴い、市町村民税が他自治体へ<strong>{(furusato.deducted / 1e8).toFixed(1)}億円</strong>流出しています。受入額との差引純収支は<strong>{(furusato.balance / 1e8).toFixed(1)}億円の赤字</strong>で、住民1人あたり<strong>約{furusato.balancePerCapita.toLocaleString()}円</strong>の税収減インパクトとなっています。
              <span className="text-[11px] text-slate-400 block mt-1">
                ※なお、地方交付税の不交付団体でない場合、流出額の約75%は国の地方交付税（基準財政需要額）によって事後的に穴埋め補填される仕組みとなっています。
              </span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
