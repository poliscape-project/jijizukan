'use client';

import React, { useState } from 'react';
import { 
  Scale, Users, Gift, Coins, PiggyBank, Briefcase
} from 'lucide-react';
import { MunicipalityData } from '@/types/municipality';
import PieChartBreakdown from '@/components/municipality/PieChartBreakdown';
import TaxSimulator from '@/components/municipality/TaxSimulator';
import SimilarComparisonCard from '@/components/municipality/SimilarComparisonCard';
import DebtFundBalanceCard from '@/components/municipality/DebtFundBalanceCard';
import CouncilCostCard from '@/components/municipality/CouncilCostCard';
import FurusatoBattleCard from '@/components/municipality/FurusatoBattleCard';
import DemographicsCard from '@/components/municipality/DemographicsCard';
import IndustryProfileCard from '@/components/municipality/IndustryProfileCard';
import SustainabilityCard from '@/components/municipality/SustainabilityCard';

interface Slice {
  name: string;
  value: number;
  color: string;
}

interface Props {
  municipality: MunicipalityData;
  similar: MunicipalityData[];
  revSlices: Slice[];
  expPurposeSlices: Slice[];
  expNatureSlices: Slice[];
  pwPerCapita: number;
}

export default function MunicipalityDetailTabs({
  municipality: m,
  similar,
  revSlices,
  expPurposeSlices,
  expNatureSlices,
  pwPerCapita
}: Props) {
  const [activeTab, setActiveTab] = useState<'finance' | 'population' | 'governance'>('finance');

  const tabs = [
    { id: 'finance', label: '財政健全度・税金の使い道', icon: Coins, count: '指標・シミュレーター' },
    { id: 'population', label: '人口ピラミッド・持続性・産業', icon: Users, count: '年齢構成・消滅判定・企業' },
    { id: 'governance', label: 'ふるさと納税・議会・比較', icon: Gift, count: '収支・議員コスト' }
  ] as const;

  return (
    <div className="space-y-6">
      {/* タブナビゲーション（直感的なセグメントボタン） */}
      <div className="bg-slate-100/90 dark:bg-slate-800/80 p-1.5 rounded-2xl border border-slate-200/90 dark:border-slate-700/80">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5" role="tablist" aria-label="自治体カルテ カテゴリ切り替え">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center justify-between sm:justify-center gap-2.5 px-4 py-3 rounded-xl transition-all text-left sm:text-center cursor-pointer ${
                  isActive
                    ? 'bg-white dark:bg-slate-900 text-indigo-700 dark:text-indigo-300 shadow-sm border border-slate-200/80 dark:border-slate-700 font-bold ring-2 ring-indigo-500/20'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-700/50 font-medium'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className={`p-1.5 rounded-lg shrink-0 ${
                    isActive
                      ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300'
                      : 'bg-slate-200/60 dark:bg-slate-700/60 text-slate-500'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="truncate">
                    <div className="text-xs sm:text-sm font-bold tracking-tight">
                      {tab.label}
                    </div>
                    <div className="text-[10px] text-slate-400 font-normal hidden sm:block truncate mt-0.5">
                      {tab.count}
                    </div>
                  </div>
                </div>

                {isActive ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200/50 shrink-0">
                    表示中
                  </span>
                ) : (
                  <span className="text-[10px] text-slate-400 sm:hidden">
                    開く →
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* タブ①：財政健全度・税金 */}
      {activeTab === 'finance' && (
        <div className="space-y-6">
          {/* 主要財務健全化指標4枠 */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Scale className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                財務健全性・重要指標（総務省 決算カード確定値）
              </h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {/* 財政力指数 */}
              <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">財政力指数</div>
                <div className="text-2xl font-black text-slate-900 dark:text-white my-1">
                  {m.financial.financialStrengthIndex.toFixed(2)}
                </div>
                <p className="text-[10px] text-slate-500">
                  {m.financial.financialStrengthIndex >= 1.0 ? '不交付団体（完全自立）' : '1.0未満（地方交付税を受給）'}
                </p>
              </div>

              {/* 経常収支比率 */}
              <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">経常収支比率</div>
                <div className="text-2xl font-black text-slate-900 dark:text-white my-1">
                  {m.financial.ordinaryBalanceRatio.toFixed(1)}<span className="text-xs font-normal text-slate-500">%</span>
                </div>
                <p className="text-[10px] text-slate-500">
                  {m.financial.ordinaryBalanceRatio > 90 ? '硬直化傾向（自由度低）' : '適正水準（弾力性あり）'}
                </p>
              </div>

              {/* 実質公債費比率 */}
              <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">実質公債費比率</div>
                <div className="text-2xl font-black text-slate-900 dark:text-white my-1">
                  {m.financial.realDebtServiceRatio.toFixed(1)}<span className="text-xs font-normal text-slate-500">%</span>
                </div>
                <p className="text-[10px] text-slate-500">
                  {m.financial.realDebtServiceRatio >= 18 ? '起債許可団体（要警戒）' : '健全（基準18%未満）'}
                </p>
              </div>

              {/* 1人あたり土木費 */}
              <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">住民1人あたり土木費</div>
                <div className="text-2xl font-black text-slate-900 dark:text-white my-1">
                  {pwPerCapita.toLocaleString()}<span className="text-xs font-normal text-slate-500">円</span>
                </div>
                <p className="text-[10px] text-slate-500">
                  道路・河川・インフラ維持費
                </p>
              </div>
            </div>
          </div>

          {/* 街の貯金 vs 借金バランス */}
          <DebtFundBalanceCard municipality={m} />

          {/* 歳入・目的別歳出 内訳グラフ */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <PieChartBreakdown
              title="歳入の内訳（財源構成）"
              subtitle={`歳入総額: ${(m.revenues.total / 1000).toLocaleString()} 百万円（自主財源比率: ${((m.revenues.localTax / (m.revenues.total || 1)) * 100).toFixed(1)}%）`}
              data={revSlices}
            />
            <PieChartBreakdown
              title="目的別歳出の内訳（何に使われたか）"
              subtitle={`歳出総額: ${(m.expensesByPurpose.total / 1000).toLocaleString()} 百万円`}
              data={expPurposeSlices}
            />
          </div>

          {/* 税金シミュレーター */}
          <TaxSimulator municipality={m} />

          {/* 性質別歳出 内訳グラフ */}
          <div>
            <PieChartBreakdown
              title="性質別歳出の内訳（人件費・扶助費・建設投資）"
              subtitle="固定負担（義務的経費）と将来への投資（普通建設事業費）の配分バランス"
              data={expNatureSlices}
            />
          </div>
        </div>
      )}

      {/* タブ②：人口ピラミッド・持続可能性・産業 */}
      {activeTab === 'population' && (
        <div className="space-y-6">
          {/* 年齢3区分ピラミッド & 高齢化率・少子化率 */}
          {m.demographics && <DemographicsCard municipality={m} />}

          {/* 自治体持続可能性判定（人口戦略会議2024） */}
          {m.sustainability && <SustainabilityCard municipality={m} />}

          {/* 産業構造 & 街を支える主要企業・看板特産品 */}
          {m.industryRatio && <IndustryProfileCard municipality={m} />}
        </div>
      )}

      {/* タブ③：ふるさと納税・議会・比較 */}
      {activeTab === 'governance' && (
        <div className="space-y-6">
          {/* ふるさと納税 収支バトル */}
          {m.furusato && <FurusatoBattleCard municipality={m} />}

          {/* 議会コスト & 首長・議員体制 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="lg:col-span-2">
              <CouncilCostCard municipality={m} />
            </div>

            {/* 首長給与・職員体制 */}
            <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-1 flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  首長・行政職員体制
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                  決算カード記載の基本情報
                </p>

                <div className="space-y-2.5">
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                    <span className="text-xs text-slate-600 dark:text-slate-400">首長 給料月額</span>
                    <span className="font-bold text-xs text-slate-900 dark:text-white">
                      {m.governance.mayorSalary ? `${(m.governance.mayorSalary / 10000).toFixed(1)}万円` : '未公表'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                    <span className="text-xs text-slate-600 dark:text-slate-400">一般職員数</span>
                    <span className="font-bold text-xs text-slate-900 dark:text-white">
                      {m.governance.staffCount.toLocaleString()}人
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                    <span className="text-xs text-slate-600 dark:text-slate-400">ラスパイレス指数</span>
                    <span className="font-bold text-xs text-slate-900 dark:text-white">
                      {m.financial.laspeyresIndex.toFixed(1)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-[11px] text-slate-400 pt-3 border-t border-slate-100 dark:border-slate-800 mt-4">
                ※国家公務員を100とした給与水準
              </div>
            </div>
          </div>

          {/* 全国類似自治体との比較 */}
          <SimilarComparisonCard municipality={m} similarMunicipalities={similar} />
        </div>
      )}
    </div>
  );
}
