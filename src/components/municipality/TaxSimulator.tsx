'use client';

import React, { useState } from 'react';
import { Calculator, ArrowRight, ShieldAlert, Heart, School, Hammer, Building2, Flame, Landmark } from 'lucide-react';
import { MunicipalityData } from '@/types/municipality';

interface Props {
  municipality: MunicipalityData;
}

export default function TaxSimulator({ municipality }: Props) {
  const [taxAmount, setTaxAmount] = useState<number>(200000); // デフォルト20万円

  const totalExp = municipality.expensesByPurpose.total || 1;
  const {
    welfare,
    education,
    publicWorks,
    healthSanitation,
    fireFighting,
    generalAdmin,
    assembly,
    agricultureForestry,
    commerceIndustry,
    debtService,
    other
  } = municipality.expensesByPurpose;

  // 各目的への配分計算
  const calcShare = (amount: number) => {
    return Math.round((amount / totalExp) * taxAmount);
  };

  const categories = [
    {
      name: '福祉・子育て・医療（民生費）',
      amount: calcShare(welfare),
      ratio: ((welfare / totalExp) * 100).toFixed(1),
      icon: Heart,
      color: 'bg-rose-500 text-rose-500',
      bgColor: 'bg-rose-50 dark:bg-rose-950/30',
      borderColor: 'border-rose-200 dark:border-rose-900',
      description: '保育園・子育て給付・高齢者介護・生活支援など'
    },
    {
      name: '学校・教育・文化（教育費）',
      amount: calcShare(education),
      ratio: ((education / totalExp) * 100).toFixed(1),
      icon: School,
      color: 'bg-indigo-500 text-indigo-500',
      bgColor: 'bg-indigo-50 dark:bg-indigo-950/30',
      borderColor: 'border-indigo-200 dark:border-indigo-900',
      description: '小中学校のICT環境・給食支援・図書館・公民館など'
    },
    {
      name: '道路・河川・インフラ（土木費）',
      amount: calcShare(publicWorks),
      ratio: ((publicWorks / totalExp) * 100).toFixed(1),
      icon: Hammer,
      color: 'bg-amber-500 text-amber-500',
      bgColor: 'bg-amber-50 dark:bg-amber-950/30',
      borderColor: 'border-amber-200 dark:border-amber-900',
      description: '市道舗装・橋梁補修・公園整備・治水治山など'
    },
    {
      name: '保健・清掃・ごみ処理（衛生費）',
      amount: calcShare(healthSanitation),
      ratio: ((healthSanitation / totalExp) * 100).toFixed(1),
      icon: Building2,
      color: 'bg-emerald-500 text-emerald-500',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950/30',
      borderColor: 'border-emerald-200 dark:border-emerald-900',
      description: '健康診断・予防接種・ごみ収集・し尿処理など'
    },
    {
      name: '消防・防災・救急（消防費）',
      amount: calcShare(fireFighting),
      ratio: ((fireFighting / totalExp) * 100).toFixed(1),
      icon: Flame,
      color: 'bg-red-500 text-red-500',
      bgColor: 'bg-red-50 dark:bg-red-950/30',
      borderColor: 'border-red-200 dark:border-red-900',
      description: '消防署・消防団・救急搬送・防災行政無線など'
    },
    {
      name: '過去の借金返済（公債費）',
      amount: calcShare(debtService),
      ratio: ((debtService / totalExp) * 100).toFixed(1),
      icon: Landmark,
      color: 'bg-slate-500 text-slate-500',
      bgColor: 'bg-slate-50 dark:bg-slate-950/30',
      borderColor: 'border-slate-200 dark:border-slate-800',
      description: '過去に建設したインフラ等の地方債（借金）元利償還'
    },
    {
      name: '役所運営・窓口（総務費・その他）',
      amount: calcShare(generalAdmin + assembly + agricultureForestry + commerceIndustry + other),
      ratio: (((generalAdmin + assembly + agricultureForestry + commerceIndustry + other) / totalExp) * 100).toFixed(1),
      icon: Building2,
      color: 'bg-blue-500 text-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-950/30',
      borderColor: 'border-blue-200 dark:border-blue-900',
      description: 'マイナンバー・戸籍住民票・選挙・庁舎管理・議会運営等'
    }
  ];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
          <Calculator className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-bold text-lg text-slate-900 dark:text-white">
            あなたの税金はどこへ消えた？（Where Does My Money Go?）
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {municipality.name}に納めた住民税が、何に何円使われているかを決算構成比から逆算
          </p>
        </div>
      </div>

      {/* スライダー入力 */}
      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
            あなたの年間住民税額（目安）
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              step="10000"
              min="10000"
              max="2000000"
              value={taxAmount}
              onChange={(e) => setTaxAmount(Math.max(0, Number(e.target.value) || 0))}
              className="w-36 px-3 py-1.5 text-right font-bold text-lg rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <span className="font-bold text-slate-700 dark:text-slate-300">円 / 年</span>
          </div>
        </div>

        <input
          type="range"
          min="20000"
          max="800000"
          step="10000"
          value={taxAmount}
          onChange={(e) => setTaxAmount(Number(e.target.value))}
          className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
        />

        <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mt-2">
          <span>2万円（新社会人/パート）</span>
          <span>20万円（平均的世帯）</span>
          <span>40万円（中堅層）</span>
          <span>80万円（高所得層）</span>
        </div>
      </div>

      {/* 積み上げバー */}
      <div className="h-4 w-full rounded-full overflow-hidden flex mb-6">
        {categories.map((c, i) => (
          <div
            key={i}
            className={`${c.color.split(' ')[0]} transition-all duration-300`}
            style={{ width: `${c.ratio}%` }}
            title={`${c.name}: ${c.ratio}% (${c.amount.toLocaleString()}円)`}
          />
        ))}
      </div>

      {/* 各項目の明細グリッド */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {categories.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className={`p-3.5 rounded-xl border ${item.borderColor} ${item.bgColor} flex items-start gap-3 transition hover:shadow-sm`}
            >
              <div className={`p-2 rounded-lg ${item.color.split(' ')[0]} text-white shrink-0`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2 mb-0.5">
                  <span className="font-bold text-sm text-slate-900 dark:text-white truncate">
                    {item.name}
                  </span>
                  <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-white/70 dark:bg-slate-900/70 text-slate-700 dark:text-slate-300">
                    {item.ratio}%
                  </span>
                </div>
                <div className="text-xl font-black text-slate-900 dark:text-white mb-1">
                  {item.amount.toLocaleString()} <span className="text-xs font-normal text-slate-500">円</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-snug">
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
