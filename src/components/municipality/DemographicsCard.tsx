'use client';

import React, { useState } from 'react';
import { Users, Baby, Briefcase, HeartHandshake, Info } from 'lucide-react';
import { MunicipalityData } from '@/types/municipality';

interface Props {
  municipality: MunicipalityData;
}

export default function DemographicsCard({ municipality }: Props) {
  const demo = municipality.demographics;
  const [hoveredGroup, setHoveredGroup] = useState<string | null>(null);

  if (!demo || demo.total === 0) return null;

  // National averages for comparison (approx. 2024-2026)
  const nationalAgingRate = 29.1;
  const nationalChildRate = 11.4;

  const isAgingHigh = demo.elderlyRate > 35;
  const isAgingVeryHigh = demo.elderlyRate > 45;
  const isChildHigh = demo.childRate > nationalChildRate;

  // Max value in pyramid for bar scaling
  const maxBarVal = Math.max(
    ...demo.pyramid.map(p => Math.max(p.male, p.female)),
    1
  );

  // Hovered item details
  const activeItem = demo.pyramid.find(p => p.ageGroup === hoveredGroup);

  // Dependency ratio: (child + elderly) / workingAge
  const dependencyRatio = demo.workingAgePop > 0
    ? Math.round(((demo.childPop + demo.elderlyPop) / demo.workingAgePop) * 100)
    : 0;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400">
              <Users className="w-4 h-4" />
            </span>
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">
              年齢3区分 & 人口ピラミッド
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            住民基本台帳に基づく最新の人口構成・高齢化率・少子化トレンド
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
            isAgingVeryHigh
              ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/70 dark:text-rose-300'
              : isAgingHigh
              ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300'
              : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300'
          }`}>
            高齢化率: {demo.elderlyRate}%
            <span className="text-[10px] font-normal opacity-80">
              (全国平均比 {demo.elderlyRate >= nationalAgingRate ? `+${(demo.elderlyRate - nationalAgingRate).toFixed(1)}pt` : `${(demo.elderlyRate - nationalAgingRate).toFixed(1)}pt`})
            </span>
          </span>
        </div>
      </div>

      {/* 3 Major Age Segments Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* 年少人口 (0-14) */}
        <div className="p-4 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/60 dark:border-blue-900/50">
          <div className="flex items-center justify-between text-xs text-blue-800 dark:text-blue-300 font-semibold mb-1">
            <span className="flex items-center gap-1.5">
              <Baby className="w-4 h-4 text-blue-600" />
              年少人口（0〜14歳）
            </span>
            <span className="text-[10px] bg-blue-200/60 dark:bg-blue-900/60 px-1.5 py-0.5 rounded">
              少子化指標
            </span>
          </div>
          <div className="text-2xl font-black text-blue-700 dark:text-blue-400 tracking-tight">
            {demo.childRate}
            <span className="text-sm font-normal text-blue-800 dark:text-blue-300 ml-1">%</span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            <span>{demo.childPop.toLocaleString()} 人</span>
            <span className={isChildHigh ? 'text-emerald-600 font-semibold' : 'text-slate-400'}>
              全国平均 {nationalChildRate}%
            </span>
          </div>
        </div>

        {/* 生産年齢人口 (15-64) */}
        <div className="p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/50">
          <div className="flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-300 font-semibold mb-1">
            <span className="flex items-center gap-1.5">
              <Briefcase className="w-4 h-4 text-emerald-600" />
              生産年齢人口（15〜64歳）
            </span>
            <span className="text-[10px] bg-emerald-200/60 dark:bg-emerald-900/60 px-1.5 py-0.5 rounded">
              働き手・現役
            </span>
          </div>
          <div className="text-2xl font-black text-emerald-700 dark:text-emerald-400 tracking-tight">
            {demo.workingAgeRate}
            <span className="text-sm font-normal text-emerald-800 dark:text-emerald-300 ml-1">%</span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            <span>{demo.workingAgePop.toLocaleString()} 人</span>
            <span>扶養比率: {dependencyRatio}%</span>
          </div>
        </div>

        {/* 老年人口 (65歳以上) */}
        <div className="p-4 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/50">
          <div className="flex items-center justify-between text-xs text-amber-800 dark:text-amber-300 font-semibold mb-1">
            <span className="flex items-center gap-1.5">
              <HeartHandshake className="w-4 h-4 text-amber-600" />
              老年人口（65歳以上）
            </span>
            <span className="text-[10px] bg-amber-200/60 dark:bg-amber-900/60 px-1.5 py-0.5 rounded">
              高齢化率
            </span>
          </div>
          <div className="text-2xl font-black text-amber-700 dark:text-amber-400 tracking-tight">
            {demo.elderlyRate}
            <span className="text-sm font-normal text-amber-800 dark:text-amber-300 ml-1">%</span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            <span>{demo.elderlyPop.toLocaleString()} 人</span>
            <span>うち75歳以上: {demo.lateElderlyRate}%</span>
          </div>
        </div>
      </div>

      {/* 年齢3区分スタックバー */}
      <div className="mb-6 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
          <span>年齢3区分の全体構成比</span>
          <span className="text-[11px] text-slate-500 font-normal">
            総人口: {demo.total.toLocaleString()} 人
          </span>
        </div>
        <div className="w-full h-4 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden flex">
          <div
            className="h-full bg-blue-500 transition-all duration-300"
            style={{ width: `${demo.childRate}%` }}
            title={`年少人口: ${demo.childRate}%`}
          />
          <div
            className="h-full bg-emerald-500 transition-all duration-300"
            style={{ width: `${demo.workingAgeRate}%` }}
            title={`生産年齢人口: ${demo.workingAgeRate}%`}
          />
          <div
            className="h-full bg-amber-500 transition-all duration-300"
            style={{ width: `${demo.elderlyRate}%` }}
            title={`老年人口: ${demo.elderlyRate}%`}
          />
        </div>
        <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2 px-1">
          <span className="flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />
            年少 0〜14歳 ({demo.childRate}%)
          </span>
          <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
            生産年齢 15〜64歳 ({demo.workingAgeRate}%)
          </span>
          <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
            老年 65歳以上 ({demo.elderlyRate}%)
          </span>
        </div>
      </div>

      {/* 人口ピラミッド（男女別・5歳階級SVGチャート） */}
      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200 mb-4">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-sky-600 dark:text-sky-400 font-semibold">
              <span className="w-2.5 h-2.5 rounded bg-sky-500 inline-block" />
              男性
            </span>
            <span className="text-slate-400">|</span>
            <span className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400 font-semibold">
              <span className="w-2.5 h-2.5 rounded bg-rose-500 inline-block" />
              女性
            </span>
          </div>
          <div className="text-[11px] text-slate-500 font-normal">
            {activeItem ? (
              <span className="font-bold text-slate-700 dark:text-slate-200">
                {activeItem.ageGroup}: 計 {activeItem.total.toLocaleString()}人（男 {activeItem.male.toLocaleString()} / 女 {activeItem.female.toLocaleString()}）
              </span>
            ) : (
              'バーにカーソルを合わせると詳細を表示'
            )}
          </div>
        </div>

        {/* Pyramid Chart (Top = 100+, Bottom = 0-4) */}
        <div className="space-y-1">
          {demo.pyramid.slice().reverse().map(item => {
            const mWidth = Math.min(100, (item.male / maxBarVal) * 100);
            const fWidth = Math.min(100, (item.female / maxBarVal) * 100);
            const isHovered = hoveredGroup === item.ageGroup;

            return (
              <div
                key={item.ageGroup}
                className={`flex items-center text-[10px] py-0.5 rounded cursor-pointer transition-colors ${
                  isHovered ? 'bg-indigo-50 dark:bg-indigo-950/40' : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
                onMouseEnter={() => setHoveredGroup(item.ageGroup)}
                onMouseLeave={() => setHoveredGroup(null)}
              >
                {/* Male Bar (Right-aligned, expands to left) */}
                <div className="flex-1 flex justify-end items-center pr-2">
                  <div className="w-full max-w-[140px] flex justify-end">
                    <div
                      className={`h-2.5 rounded-l transition-all ${
                        isHovered ? 'bg-sky-600' : 'bg-sky-400 dark:bg-sky-500'
                      }`}
                      style={{ width: `${mWidth}%` }}
                    />
                  </div>
                </div>

                {/* Age Label (Center) */}
                <div className="w-14 text-center shrink-0 font-medium text-slate-600 dark:text-slate-400 text-[10px]">
                  {item.ageGroup.replace('歳', '')}
                </div>

                {/* Female Bar (Left-aligned, expands to right) */}
                <div className="flex-1 flex justify-start items-center pl-2">
                  <div className="w-full max-w-[140px]">
                    <div
                      className={`h-2.5 rounded-r transition-all ${
                        isHovered ? 'bg-rose-600' : 'bg-rose-400 dark:bg-rose-500'
                      }`}
                      style={{ width: `${fWidth}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Note / Demographic interpretation */}
      <div className="mt-4 text-xs text-slate-500 dark:text-slate-400 flex items-start gap-2">
        <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          現役世代（15〜64歳）100人あたりで支える従属人口（年少＋高齢者）は<strong>{dependencyRatio}人</strong>です。高齢化率が35%を超える自治体では、社会保障費や介護需要の増加に加え、地方公営企業や生活インフラの維持管理負担が今後の重要政策課題となります。
        </p>
      </div>
    </div>
  );
}
