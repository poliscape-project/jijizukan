'use client';

import React, { useState } from 'react';

interface SliceItem {
  name: string;
  value: number;
  color: string;
}

interface Props {
  title: string;
  subtitle?: string;
  data: SliceItem[];
  unit?: string;
}

export default function PieChartBreakdown({ title, subtitle, data, unit = '千円' }: Props) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const total = data.reduce((sum, item) => sum + item.value, 0) || 1;

  // Calculate angles
  let cumulativeAngle = 0;
  const slices = data.map((item) => {
    const ratio = item.value / total;
    const angle = ratio * 360;
    const startAngle = cumulativeAngle;
    cumulativeAngle += angle;
    return {
      ...item,
      ratio,
      percentage: (ratio * 100).toFixed(1),
      startAngle,
      angle
    };
  });

  // Helper for SVG donut path: 0度＝真上（12時位置）から時計回りに描画
  const radius = 80;
  const innerRadius = 52;
  const center = 100;

  const getCoordinatesForPercent = (deg: number, r: number) => {
    // 0度 = 12時方向（標準数学座標の-90度オフセット）
    const rad = ((deg - 90) * Math.PI) / 180.0;
    return {
      x: center + r * Math.cos(rad),
      y: center + r * Math.sin(rad)
    };
  };

  const activeSlice = hoveredIdx !== null ? slices[hoveredIdx] : null;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col h-full">
      <div className="mb-4">
        <h4 className="font-bold text-base text-slate-900 dark:text-white">{title}</h4>
        {subtitle && <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{subtitle}</p>}
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-6 my-auto">
        {/* SVG Donut */}
        <div className="relative w-48 h-48 shrink-0">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            {slices.map((slice, idx) => {
              if (slice.value <= 0) return null;
              const isLargeArc = slice.angle > 180 ? 1 : 0;
              const startOuter = getCoordinatesForPercent(slice.startAngle, radius);
              const endOuter = getCoordinatesForPercent(slice.startAngle + slice.angle - 0.1, radius);
              const startInner = getCoordinatesForPercent(slice.startAngle + slice.angle - 0.1, innerRadius);
              const endInner = getCoordinatesForPercent(slice.startAngle, innerRadius);

              const pathData = [
                `M ${startOuter.x} ${startOuter.y}`,
                `A ${radius} ${radius} 0 ${isLargeArc} 1 ${endOuter.x} ${endOuter.y}`,
                `L ${startInner.x} ${startInner.y}`,
                `A ${innerRadius} ${innerRadius} 0 ${isLargeArc} 0 ${endInner.x} ${endInner.y}`,
                'Z'
              ].join(' ');

              const isHovered = hoveredIdx === idx;

              return (
                <path
                  key={idx}
                  d={pathData}
                  fill={slice.color}
                  className={`transition-all duration-200 cursor-pointer ${isHovered ? 'opacity-100 scale-105 origin-center' : 'opacity-90 hover:opacity-100'}`}
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                />
              );
            })}
          </svg>

          {/* Center Info Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center px-4">
            {activeSlice ? (
              <>
                <span className="text-xs text-slate-500 font-medium truncate max-w-[90px]">
                  {activeSlice.name}
                </span>
                <span className="text-lg font-black text-slate-900 dark:text-white">
                  {activeSlice.percentage}%
                </span>
                <span className="text-[10px] text-slate-400">
                  {activeSlice.value.toLocaleString()} {unit}
                </span>
              </>
            ) : (
              <>
                <span className="text-xs text-slate-400 font-medium">合計</span>
                <span className="text-sm font-black text-slate-900 dark:text-white">
                  {total.toLocaleString()}
                </span>
                <span className="text-[10px] text-slate-400">{unit}</span>
              </>
            )}
          </div>
        </div>

        {/* Legend */}
        <div className="flex-1 w-full space-y-1.5 overflow-y-auto max-h-48 pr-1">
          {slices.map((slice, idx) => {
            const isHovered = hoveredIdx === idx;
            return (
              <div
                key={idx}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                className={`flex items-center justify-between text-xs p-1.5 rounded-lg cursor-pointer transition ${isHovered ? 'bg-slate-100 dark:bg-slate-800' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}
              >
                <div className="flex items-center gap-2 min-w-0 pr-2">
                  <span
                    className="w-2.5 h-2.5 rounded-sm shrink-0"
                    style={{ backgroundColor: slice.color }}
                  />
                  <span className="text-slate-700 dark:text-slate-300 truncate font-medium">
                    {slice.name}
                  </span>
                </div>
                <div className="text-right shrink-0 flex items-center gap-2">
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {slice.percentage}%
                  </span>
                  <span className="text-slate-400 text-[10px] min-w-[55px]">
                    {slice.value.toLocaleString()}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
