'use client';

import React from 'react';
import { Users2, Award, Coins, Scale, Building, TrendingUp } from 'lucide-react';
import { MunicipalityData } from '@/types/municipality';

interface Props {
  municipality: MunicipalityData;
}

export default function CouncilCostCard({ municipality }: Props) {
  const pop = municipality.population || 1;
  const assemblyExpTotal = municipality.expensesByPurpose.assembly * 1000; // 千円 -> 円
  const membersCount = municipality.governance.councilMembersCount || 1;
  const monthlySalary = municipality.governance.councilSalary || 0;

  // 住民1人あたり年間議会費負担
  const costPerResident = Math.round(assemblyExpTotal / pop);

  // 議員1人あたりが代表する住民数
  const residentsPerMember = Math.round(pop / membersCount);

  // 議員1人にかかる年間議会総予算（議会事務局・政務活動費・議場維持等を含む）
  const costPerMember = Math.round(assemblyExpTotal / membersCount);

  // 議員推定年収（月額×12ヶ月＋期末手当約3.3ヶ月換算）
  const estimatedAnnualPay = monthlySalary > 0 ? Math.round(monthlySalary * 15.3) : 0;

  // 全国の標準的議会費負担（市町村規模で約2,500円〜4,000円が中央値）
  const isHighCost = costPerResident > 4500;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <Users2 className="w-4 h-4" />
            </span>
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">
              市町村議会コスト & 住民負担（議会通信簿）
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            議会運営にかかる総公金と、住民1人あたり・議員1人あたりのリアルなコスト構造
          </p>
        </div>

        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            議員定数: {membersCount > 0 ? `${membersCount}名` : '未公表'}
          </span>
        </div>
      </div>

      {/* 4指標グリッド */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {/* 住民1人あたり年間議会費 */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            住民1人あたりの年間議会費
          </div>
          <div className={`text-2xl font-black my-1 ${
            isHighCost ? 'text-amber-600 dark:text-amber-400' : 'text-slate-900 dark:text-white'
          }`}>
            {costPerResident.toLocaleString()} <span className="text-xs font-normal text-slate-500">円/年</span>
          </div>
          <p className="text-[11px] text-slate-400">
            {isHighCost ? '小規模自治体特有の割高傾向' : '同規模自治体の適正水準内'}
          </p>
        </div>

        {/* 議員1人あたり代表住民数 */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            議員1人が代表する住民数
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white my-1">
            {residentsPerMember.toLocaleString()} <span className="text-xs font-normal text-slate-500">人</span>
          </div>
          <p className="text-[11px] text-slate-400">
            住民{residentsPerMember.toLocaleString()}人に議員1名の比率
          </p>
        </div>

        {/* 議員報酬月額 */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            議員1人あたり報酬月額
          </div>
          <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400 my-1">
            {monthlySalary > 0 ? (
              <>
                {(monthlySalary / 10000).toFixed(1)} <span className="text-xs font-normal text-slate-500">万円</span>
              </>
            ) : (
              <span className="text-base text-slate-400">未集計</span>
            )}
          </div>
          <p className="text-[11px] text-slate-400">
            {estimatedAnnualPay > 0 ? `推定年収: 約${Math.round(estimatedAnnualPay / 10000)}万円` : '手当・政活費除く'}
          </p>
        </div>

        {/* 議員1人にかかる年間議会予算 */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            議員1人あたりの年間議会予算
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white my-1">
            {(costPerMember / 10000).toFixed(1)} <span className="text-xs font-normal text-slate-500">万円</span>
          </div>
          <p className="text-[11px] text-slate-400">
            議会費総額 {(assemblyExpTotal / 10000).toLocaleString()}万円 ÷ {membersCount}名
          </p>
        </div>
      </div>

      <div className="p-3.5 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
        💡 <strong>議会コストの視点</strong>: 議員報酬だけでなく、議場施設維持費、議会中継システム費、議会事務局職員の人件費等を含めた「議会費総額」を住民数で割ることで、市民1人あたりが民主主義と地方自治の維持に毎年いくら支払っているかが明確になります。
      </div>
    </div>
  );
}
