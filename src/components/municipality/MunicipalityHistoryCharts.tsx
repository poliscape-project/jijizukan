'use client';

import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Coins, Gift, Users, Calendar, ArrowRight } from 'lucide-react';
import { MunicipalityYearlyHistory } from '@/types/municipality';

interface Props {
  history: MunicipalityYearlyHistory[];
  municipalityName: string;
}

export default function MunicipalityHistoryCharts({ history, municipalityName }: Props) {
  const [activeTab, setActiveTab] = useState<'debtReserve' | 'furusato' | 'population'>('debtReserve');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (!history || history.length === 0) return null;

  const firstYear = history[0];
  const lastYear = history[history.length - 1];

  // 10年の変化ハイライト計算
  // 1. 借金変化
  const debtDiffMillion = Math.round((lastYear.debtOutstanding - firstYear.debtOutstanding) / 100000); // 億円
  // 2. 貯金変化
  const reserveDiffMillion = Math.round((lastYear.reserveFundTotal - firstYear.reserveFundTotal) / 100000); // 億円
  // 3. 人口変化
  const popDiff = lastYear.population - firstYear.population;
  const popDiffRate = firstYear.population > 0
    ? Math.round((popDiff / firstYear.population) * 1000) / 10
    : 0;
  // 4. ふるさと納税収支変化
  const furusatoDiffMillion = Math.round((lastYear.furusatoBalance - firstYear.furusatoBalance) / 1e8 * 10) / 10;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-6">
      {/* ヘッダー */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-semibold mb-1.5 border border-indigo-200/50">
            <Calendar className="w-3.5 h-3.5" />
            直近10年間の変遷（2014〜2023年度）
          </div>
          <h3 className="text-lg font-black text-slate-900 dark:text-white">
            {municipalityName} の10年タイムライン
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            人口・借金と貯金・ふるさと納税の過去10年の軌跡と構造変化
          </p>
        </div>

        {/* チャート切り替えタブ */}
        <div className="inline-flex p-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold self-start sm:self-auto">
          <button
            onClick={() => { setActiveTab('debtReserve'); setHoveredIndex(null); }}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'debtReserve'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-2xs font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Coins className="w-3.5 h-3.5" />
            <span>地方債 vs 貯金</span>
          </button>
          <button
            onClick={() => { setActiveTab('furusato'); setHoveredIndex(null); }}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'furusato'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-2xs font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Gift className="w-3.5 h-3.5" />
            <span>ふるさと納税収支</span>
          </button>
          <button
            onClick={() => { setActiveTab('population'); setHoveredIndex(null); }}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'population'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-2xs font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>人口 & 高齢化率</span>
          </button>
        </div>
      </div>

      {/* 10年変化サマリーバナー */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
          <div className="text-[10px] text-slate-400 font-medium">地方債（借金）10年変化</div>
          <div className={`font-black text-sm mt-0.5 ${debtDiffMillion <= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
            {debtDiffMillion <= 0 ? `${debtDiffMillion}億円` : `+${debtDiffMillion}億円`}
          </div>
          <div className="text-[10px] text-slate-500">
            {debtDiffMillion <= 0 ? '借金を計画的に圧縮' : 'インフラ投資等で増額'}
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
          <div className="text-[10px] text-slate-400 font-medium">積立基金（貯金）10年変化</div>
          <div className={`font-black text-sm mt-0.5 ${reserveDiffMillion >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
            {reserveDiffMillion >= 0 ? `+${reserveDiffMillion}億円` : `${reserveDiffMillion}億円`}
          </div>
          <div className="text-[10px] text-slate-500">
            {reserveDiffMillion >= 0 ? '貯金を順調に蓄積' : '財政出動で取り崩し'}
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
          <div className="text-[10px] text-slate-400 font-medium">人口10年増減</div>
          <div className={`font-black text-sm mt-0.5 ${popDiff >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-800 dark:text-slate-200'}`}>
            {popDiff >= 0 ? `+${popDiff.toLocaleString()}人` : `${popDiff.toLocaleString()}人`}
            <span className="text-[11px] font-normal text-slate-500 ml-1">({popDiffRate > 0 ? `+${popDiffRate}` : popDiffRate}%)</span>
          </div>
          <div className="text-[10px] text-slate-500">
            {popDiff >= 0 ? '人口増加トレンド' : '自然減・社会減'}
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
          <div className="text-[10px] text-slate-400 font-medium">ふるさと納税 収支変化</div>
          <div className={`font-black text-sm mt-0.5 ${lastYear.furusatoBalance >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
            {lastYear.furusatoBalance >= 0 ? `+${(lastYear.furusatoBalance / 1e8).toFixed(1)}億円` : `${(lastYear.furusatoBalance / 1e8).toFixed(1)}億円`}
          </div>
          <div className="text-[10px] text-slate-500">
            {furusatoDiffMillion >= 0 ? `10年で+${furusatoDiffMillion}億改善` : `10年で${furusatoDiffMillion}億流出拡大`}
          </div>
        </div>
      </div>

      {/* チャート表示エリア */}
      <div className="pt-2">
        {activeTab === 'debtReserve' && (
          <DebtReserveChart history={history} hoveredIndex={hoveredIndex} setHoveredIndex={setHoveredIndex} />
        )}
        {activeTab === 'furusato' && (
          <FurusatoHistoryChart history={history} hoveredIndex={hoveredIndex} setHoveredIndex={setHoveredIndex} />
        )}
        {activeTab === 'population' && (
          <PopulationAgingChart history={history} hoveredIndex={hoveredIndex} setHoveredIndex={setHoveredIndex} />
        )}
      </div>
    </div>
  );
}

// 1. 地方債 vs 積立基金 チャート (SVG)
function DebtReserveChart({
  history,
  hoveredIndex,
  setHoveredIndex
}: {
  history: MunicipalityYearlyHistory[];
  hoveredIndex: number | null;
  setHoveredIndex: (idx: number | null) => void;
}) {
  const maxVal = Math.max(
    ...history.map(h => Math.max(h.debtOutstanding, h.reserveFundTotal))
  );
  const ceiling = Math.ceil((maxVal / 100000) * 1.15) * 100000; // 億円単位で天井

  const width = 640;
  const height = 240;
  const padding = { top: 20, right: 30, bottom: 40, left: 60 };
  const graphWidth = width - padding.left - padding.right;
  const graphHeight = height - padding.top - padding.bottom;

  const getX = (idx: number) => Math.round((padding.left + (idx / (history.length - 1)) * graphWidth) * 10) / 10;
  const getY = (val: number) => Math.round((padding.top + graphHeight - (val / ceiling) * graphHeight) * 10) / 10;

  // 地方債ライン
  const debtPoints = history.map((h, i) => `${getX(i)},${getY(h.debtOutstanding)}`).join(' ');
  // 積立基金ライン
  const reservePoints = history.map((h, i) => `${getX(i)},${getY(h.reserveFundTotal)}`).join(' ');

  const currentHover = hoveredIndex !== null ? history[hoveredIndex] : history[history.length - 1];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 font-semibold text-rose-500">
            <span className="w-3 h-1 bg-rose-500 rounded-full inline-block" />
            <span>地方債残高（借金）</span>
          </div>
          <div className="flex items-center gap-1.5 font-semibold text-emerald-500">
            <span className="w-3 h-1 bg-emerald-500 rounded-full inline-block" />
            <span>積立基金現在高（貯金）</span>
          </div>
        </div>
        <div className="text-[11px] text-slate-500">
          選択年度: <strong className="text-slate-900 dark:text-white font-bold">{currentHover.year}年 ({currentHover.fiscalYearJp})</strong>
          {' '}| 借金: <strong className="text-rose-600 font-bold">{(currentHover.debtOutstanding / 100000).toFixed(1)}億円</strong>
          {' '}| 貯金: <strong className="text-emerald-600 font-bold">{(currentHover.reserveFundTotal / 100000).toFixed(1)}億円</strong>
        </div>
      </div>

      <div className="relative w-full overflow-x-auto">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto select-none">
          {/* Y軸グリッド線 */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
            const y = padding.top + graphHeight * (1 - ratio);
            const valOku = (ceiling * ratio) / 100000;
            return (
              <g key={idx}>
                <line x1={padding.left} y1={y} x2={width - padding.right} y2={y} stroke="currentColor" className="text-slate-100 dark:text-slate-800" strokeDasharray="3 3" />
                <text x={padding.left - 8} y={y + 3} textAnchor="end" className="text-[10px] fill-slate-400 font-mono">
                  {valOku.toFixed(0)}億
                </text>
              </g>
            );
          })}

          {/* 地方債（借金）ポリライン */}
          <polyline fill="none" stroke="#f43f5e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" points={debtPoints} />
          {/* 積立基金（貯金）ポリライン */}
          <polyline fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" points={reservePoints} />

          {/* 各年のポイント & ホバー領域 */}
          {history.map((h, i) => {
            const x = getX(i);
            const yDebt = getY(h.debtOutstanding);
            const yReserve = getY(h.reserveFundTotal);
            const isHovered = hoveredIndex === i;

            return (
              <g key={h.year} onMouseEnter={() => setHoveredIndex(i)}>
                {/* 縦カーソル線 */}
                {isHovered && (
                  <line x1={x} y1={padding.top} x2={x} y2={height - padding.bottom} stroke="currentColor" className="text-indigo-400" strokeWidth="1.5" strokeDasharray="2 2" />
                )}
                {/* 地方債 ドット */}
                <circle cx={x} cy={yDebt} r={isHovered ? 5 : 3.5} fill="#f43f5e" stroke="#ffffff" strokeWidth="2" className="cursor-pointer transition-all" />
                {/* 積立基金 ドット */}
                <circle cx={x} cy={yReserve} r={isHovered ? 5 : 3.5} fill="#10b981" stroke="#ffffff" strokeWidth="2" className="cursor-pointer transition-all" />
                {/* X軸 年度ラベル */}
                <text x={x} y={height - padding.bottom + 16} textAnchor="middle" className={`text-[10px] font-mono cursor-pointer ${isHovered ? 'fill-indigo-600 font-bold text-xs' : 'fill-slate-400'}`}>
                  {h.year}
                </text>
                <text x={x} y={height - padding.bottom + 28} textAnchor="middle" className="text-[9px] fill-slate-400 font-mono">
                  {h.fiscalYearJp}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

// 2. ふるさと納税 収支チャート (受入 vs 流出)
function FurusatoHistoryChart({
  history,
  hoveredIndex,
  setHoveredIndex
}: {
  history: MunicipalityYearlyHistory[];
  hoveredIndex: number | null;
  setHoveredIndex: (idx: number | null) => void;
}) {
  const maxVal = Math.max(
    ...history.map(h => Math.max(h.furusatoReceived, h.furusatoDeducted)),
    10000000 // 最低1000万円
  );
  const ceiling = Math.ceil((maxVal / 1e8) * 1.2 * 10) / 10 * 1e8; // 億円

  const width = 640;
  const height = 240;
  const padding = { top: 20, right: 30, bottom: 40, left: 60 };
  const graphWidth = width - padding.left - padding.right;
  const graphHeight = height - padding.top - padding.bottom;

  const getX = (idx: number) => Math.round((padding.left + (idx / (history.length - 1)) * graphWidth) * 10) / 10;
  const getY = (val: number) => Math.round((padding.top + graphHeight - (val / ceiling) * graphHeight) * 10) / 10;

  const recPoints = history.map((h, i) => `${getX(i)},${getY(h.furusatoReceived)}`).join(' ');
  const dedPoints = history.map((h, i) => `${getX(i)},${getY(h.furusatoDeducted)}`).join(' ');

  const currentHover = hoveredIndex !== null ? history[hoveredIndex] : history[history.length - 1];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 font-semibold text-emerald-600">
            <span className="w-3 h-1 bg-emerald-600 rounded-full inline-block" />
            <span>寄附受入額（流入）</span>
          </div>
          <div className="flex items-center gap-1.5 font-semibold text-rose-500">
            <span className="w-3 h-1 bg-rose-500 rounded-full inline-block" />
            <span>住民税控除額（流出）</span>
          </div>
        </div>
        <div className="text-[11px] text-slate-500">
          {currentHover.year}年 ({currentHover.fiscalYearJp}): 純損益{' '}
          <strong className={`font-bold ${currentHover.furusatoBalance >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
            {currentHover.furusatoBalance >= 0 ? `+${(currentHover.furusatoBalance / 1e8).toFixed(2)}億円` : `${(currentHover.furusatoBalance / 1e8).toFixed(2)}億円`}
          </strong>
        </div>
      </div>

      <div className="relative w-full overflow-x-auto">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto select-none">
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
            const y = padding.top + graphHeight * (1 - ratio);
            const valOku = (ceiling * ratio) / 1e8;
            return (
              <g key={idx}>
                <line x1={padding.left} y1={y} x2={width - padding.right} y2={y} stroke="currentColor" className="text-slate-100 dark:text-slate-800" strokeDasharray="3 3" />
                <text x={padding.left - 8} y={y + 3} textAnchor="end" className="text-[10px] fill-slate-400 font-mono">
                  {valOku.toFixed(1)}億
                </text>
              </g>
            );
          })}

          <polyline fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" points={recPoints} />
          <polyline fill="none" stroke="#f43f5e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" points={dedPoints} />

          {history.map((h, i) => {
            const x = getX(i);
            const isHovered = hoveredIndex === i;
            return (
              <g key={h.year} onMouseEnter={() => setHoveredIndex(i)}>
                {isHovered && (
                  <line x1={x} y1={padding.top} x2={x} y2={height - padding.bottom} stroke="currentColor" className="text-indigo-400" strokeWidth="1.5" strokeDasharray="2 2" />
                )}
                <circle cx={x} cy={getY(h.furusatoReceived)} r={isHovered ? 5 : 3.5} fill="#059669" stroke="#ffffff" strokeWidth="2" className="cursor-pointer transition-all" />
                <circle cx={x} cy={getY(h.furusatoDeducted)} r={isHovered ? 5 : 3.5} fill="#f43f5e" stroke="#ffffff" strokeWidth="2" className="cursor-pointer transition-all" />
                <text x={x} y={height - padding.bottom + 16} textAnchor="middle" className={`text-[10px] font-mono ${isHovered ? 'fill-indigo-600 font-bold' : 'fill-slate-400'}`}>
                  {h.year}
                </text>
                <text x={x} y={height - padding.bottom + 28} textAnchor="middle" className="text-[9px] fill-slate-400 font-mono">
                  {h.fiscalYearJp}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

// 3. 人口推移 & 高齢化率複合チャート
function PopulationAgingChart({
  history,
  hoveredIndex,
  setHoveredIndex
}: {
  history: MunicipalityYearlyHistory[];
  hoveredIndex: number | null;
  setHoveredIndex: (idx: number | null) => void;
}) {
  const maxPop = Math.max(...history.map(h => h.population));
  const minPop = Math.min(...history.map(h => h.population));
  const popRange = maxPop - minPop || 1000;
  const popCeiling = maxPop + popRange * 0.1;
  const popFloor = Math.max(0, minPop - popRange * 0.1);

  const maxAging = Math.max(...history.map(h => h.agingRate || 30));
  const minAging = Math.min(...history.map(h => h.agingRate || 20));

  const width = 640;
  const height = 240;
  const padding = { top: 20, right: 50, bottom: 40, left: 60 };
  const graphWidth = width - padding.left - padding.right;
  const graphHeight = height - padding.top - padding.bottom;

  const getX = (idx: number) => Math.round((padding.left + (idx / (history.length - 1)) * graphWidth) * 10) / 10;
  const getYPop = (val: number) => Math.round((padding.top + graphHeight - ((val - popFloor) / (popCeiling - popFloor)) * graphHeight) * 10) / 10;

  const popPoints = history.map((h, i) => `${getX(i)},${getYPop(h.population)}`).join(' ');

  const currentHover = hoveredIndex !== null ? history[hoveredIndex] : history[history.length - 1];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 font-semibold text-blue-600">
            <span className="w-3 h-1 bg-blue-600 rounded-full inline-block" />
            <span>総人口（人）</span>
          </div>
          <div className="flex items-center gap-1.5 font-semibold text-amber-500">
            <span className="w-2.5 h-2.5 rounded-full border border-amber-500 bg-amber-100 inline-block" />
            <span>高齢化率（%）</span>
          </div>
        </div>
        <div className="text-[11px] text-slate-500">
          {currentHover.year}年 ({currentHover.fiscalYearJp}): 人口{' '}
          <strong className="text-slate-900 dark:text-white font-bold">{currentHover.population.toLocaleString()}人</strong>
          {' '}| 高齢化率: <strong className="text-amber-600 font-bold">{currentHover.agingRate}%</strong>
        </div>
      </div>

      <div className="relative w-full overflow-x-auto">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto select-none">
          {[0, 0.5, 1].map((ratio, idx) => {
            const y = padding.top + graphHeight * (1 - ratio);
            const valPop = Math.round(popFloor + (popCeiling - popFloor) * ratio);
            return (
              <g key={idx}>
                <line x1={padding.left} y1={y} x2={width - padding.right} y2={y} stroke="currentColor" className="text-slate-100 dark:text-slate-800" strokeDasharray="3 3" />
                <text x={padding.left - 8} y={y + 3} textAnchor="end" className="text-[10px] fill-slate-400 font-mono">
                  {valPop >= 10000 ? `${(valPop / 10000).toFixed(1)}万` : `${valPop.toLocaleString()}`}
                </text>
              </g>
            );
          })}

          {/* 人口折れ線 */}
          <polyline fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" points={popPoints} />

          {history.map((h, i) => {
            const x = getX(i);
            const y = getYPop(h.population);
            const isHovered = hoveredIndex === i;
            return (
              <g key={h.year} onMouseEnter={() => setHoveredIndex(i)}>
                {isHovered && (
                  <line x1={x} y1={padding.top} x2={x} y2={height - padding.bottom} stroke="currentColor" className="text-indigo-400" strokeWidth="1.5" strokeDasharray="2 2" />
                )}
                <circle cx={x} cy={y} r={isHovered ? 5 : 3.5} fill="#2563eb" stroke="#ffffff" strokeWidth="2" className="cursor-pointer transition-all" />
                <text x={x} y={height - padding.bottom + 16} textAnchor="middle" className={`text-[10px] font-mono ${isHovered ? 'fill-indigo-600 font-bold' : 'fill-slate-400'}`}>
                  {h.year}
                </text>
                <text x={x} y={height - padding.bottom + 28} textAnchor="middle" className="text-[9px] fill-slate-400 font-mono">
                  {h.agingRate}%
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
