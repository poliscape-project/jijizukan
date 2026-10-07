'use client';

import React from 'react';
import Link from 'next/link';
import { Users, TrendingUp, AlertTriangle, ArrowRight } from 'lucide-react';
import { MunicipalityData } from '@/types/municipality';

interface Props {
  municipality: MunicipalityData;
  similarMunicipalities: MunicipalityData[];
}

export default function SimilarComparisonCard({ municipality, similarMunicipalities }: Props) {
  const pop = municipality.population || 1;
  const currentPWPerCapita = Math.round((municipality.expensesByPurpose.publicWorks * 1000) / pop);

  // Group average calculation
  const allSimilar = [municipality, ...similarMunicipalities];
  const avgPWPerCapita = Math.round(
    allSimilar.reduce((sum, m) => sum + ((m.expensesByPurpose.publicWorks * 1000) / (m.population || 1)), 0) / allSimilar.length
  );
  const avgFinStrength = Number(
    (allSimilar.reduce((sum, m) => sum + m.financial.financialStrengthIndex, 0) / allSimilar.length).toFixed(2)
  );
  const avgOrdinaryBalance = Number(
    (allSimilar.reduce((sum, m) => sum + m.financial.ordinaryBalanceRatio, 0) / allSimilar.length).toFixed(1)
  );

  const diffPW = currentPWPerCapita - avgPWPerCapita;
  const diffPWPct = avgPWPerCapita > 0 ? ((diffPW / avgPWPerCapita) * 100).toFixed(1) : '0';

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
              類型群: {municipality.typeGroup || '未分類'}
            </span>
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">
              類似自治体ベンチマーク比較
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            人口規模・産業構造が同水準のグループ内での財政ポジショニング
          </p>
        </div>
      </div>

      {/* 指標比較グリッド */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* 1人あたり土木費 */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
          <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">住民1人あたり土木費</div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mb-1">
            {currentPWPerCapita.toLocaleString()} <span className="text-xs font-normal text-slate-500">円</span>
          </div>
          <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-200 dark:border-slate-700">
            <span className="text-slate-500">類似群平均: {avgPWPerCapita.toLocaleString()}円</span>
            <span className={`font-bold ${diffPW > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
              {diffPW > 0 ? `+${diffPWPct}%` : `${diffPWPct}%`}
            </span>
          </div>
        </div>

        {/* 財政力指数 */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
          <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">財政力指数</div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mb-1">
            {municipality.financial.financialStrengthIndex.toFixed(2)}
          </div>
          <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-200 dark:border-slate-700">
            <span className="text-slate-500">類似群平均: {avgFinStrength.toFixed(2)}</span>
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              {municipality.financial.financialStrengthIndex >= 1.0 ? '不交付' : '交付団体'}
            </span>
          </div>
        </div>

        {/* 経常収支比率 */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
          <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">経常収支比率（硬直度）</div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mb-1">
            {municipality.financial.ordinaryBalanceRatio.toFixed(1)} <span className="text-xs font-normal text-slate-500">%</span>
          </div>
          <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-200 dark:border-slate-700">
            <span className="text-slate-500">類似群平均: {avgOrdinaryBalance}%</span>
            <span className={`font-semibold ${municipality.financial.ordinaryBalanceRatio > 90 ? 'text-amber-500' : 'text-slate-500'}`}>
              {municipality.financial.ordinaryBalanceRatio > 90 ? '硬直傾向' : '適正'}
            </span>
          </div>
        </div>
      </div>

      {/* 類似自治体リスト */}
      {similarMunicipalities.length > 0 && (
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
            人口規模が近い同一類型の自治体
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {similarMunicipalities.map((item) => (
              <Link
                key={item.code}
                href={`/municipalities/${item.code}`}
                className="group p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 bg-slate-50/50 dark:bg-slate-850 transition"
              >
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  {item.prefName}
                </div>
                <div className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 flex items-center justify-between">
                  <span>{item.name}</span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition" />
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                  人口: {item.population.toLocaleString()}人
                </div>
                <div className="text-xs font-medium text-slate-700 dark:text-slate-300 mt-0.5">
                  財政力: {item.financial.financialStrengthIndex.toFixed(2)}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
