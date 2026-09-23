"use client";

import React, { useState, useId } from "react";
import { Calculator, Users, AlertCircle, TrendingDown, CheckCircle2, Building2, HelpCircle } from "lucide-react";

export const ChildcareSupportFundSimulator: React.FC = () => {
  const incomeSliderId = useId();
  const [annualIncome, setAnnualIncome] = useState<number>(500);
  const [insuranceType, setInsuranceType] = useState<"kenpo" | "union" | "kyosai" | "kokuho">("kenpo");
  const [householdType, setHouseholdType] = useState<"single_or_no_child" | "high_school" | "third_child">("single_or_no_child");
  const [phase, setPhase] = useState<"full" | "initial">("full");

  // こども家庭庁の公表試算に基づく月額支援金額の算出（満額ベース）
  const calculateBaseMonthly = (income: number, type: typeof insuranceType): number => {
    let rate = 0.002; // 基準: 額面の約0.2%
    let cap = 1800;

    switch (type) {
      case "union": // 組合健保（大企業）
        rate = 0.0021;
        cap = 1950;
        break;
      case "kyosai": // 共済組合（公務員等）
        rate = 0.0023;
        cap = 2100;
        break;
      case "kokuho": // 国民健康保険（自営業・1世帯あたり）
        rate = 0.0016;
        cap = 1400;
        break;
      case "kenpo": // 協会けんぽ（中小企業）
      default:
        rate = 0.0020;
        cap = 1800;
        break;
    }

    let monthly = Math.round((income * 10000 * rate) / 12);
    if (monthly < 250) monthly = 250;
    if (monthly > cap) monthly = cap;
    return monthly;
  };

  // 2028年度（満額・年1兆円）と2026年度（初年度・約6,000億円＝約6割）の切り替え
  const fullMonthly = calculateBaseMonthly(annualIncome, insuranceType);
  const monthlyFund = phase === "initial" ? Math.round(fullMonthly * 0.6) : fullMonthly;
  const yearlyFund = monthlyFund * 12;

  // 労使折半（被用者保険は企業が同額負担、国保は会社負担なし）
  const employerShare = insuranceType === "kokuho" ? 0 : yearlyFund;
  const totalContribution = yearlyFund + employerShare;

  // 児童手当拡充（高校生延長月1万円＝年12万円、第3子倍増月3万円＝年36万円）とのネット収支
  let childAllowanceGainYearly = 0;
  if (householdType === "high_school") {
    childAllowanceGainYearly = 120000;
  } else if (householdType === "third_child") {
    childAllowanceGainYearly = 360000;
  }
  const netBalance = childAllowanceGainYearly - yearlyFund;

  return (
    <div className="bg-white rounded-2xl border-2 border-indigo-200/80 shadow-sm p-5 sm:p-7 overflow-hidden">
      {/* ヘッダー */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="p-1.5 rounded-lg bg-indigo-50 text-indigo-700">
              <Calculator className="w-5 h-5" />
            </span>
            <h3 className="text-lg sm:text-xl font-black text-slate-900">
              「子ども・子育て支援金」天引き額シミュレーター
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-500">
            あなたの年収と加入保険から、毎月の給与から天引きされる金額と「実質負担ゼロ」主張とのギャップを試算
          </p>
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-bold self-start sm:self-center shrink-0">
          <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
          <span>2026年4月徴収開始</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* 左側：入力パネル */}
        <div className="lg:col-span-6 space-y-5 bg-slate-50/80 p-4 sm:p-5 rounded-2xl border border-slate-200/70">
          {/* 額面年収スライダー */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label htmlFor={incomeSliderId} className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1">
                <span>額面年収（給与・所得）</span>
              </label>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-indigo-700">{annualIncome}</span>
                <span className="text-xs font-bold text-slate-600">万円</span>
              </div>
            </div>
            <input
              id={incomeSliderId}
              type="range"
              min={200}
              max={1500}
              step={50}
              value={annualIncome}
              onChange={(e) => setAnnualIncome(Number(e.target.value))}
              className="w-full accent-indigo-600 h-2.5 bg-slate-200 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-400 mt-1 font-mono">
              <span>200万</span>
              <span>500万</span>
              <span>800万</span>
              <span>1,200万</span>
              <span>1,500万</span>
            </div>

            {/* クイック選択チップ */}
            <div className="flex flex-wrap gap-1.5 mt-2.5">
              {[300, 500, 700, 1000, 1200].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setAnnualIncome(val)}
                  className={`text-[11px] px-2 py-0.5 rounded-md font-medium border transition-colors ${
                    annualIncome === val
                      ? "bg-indigo-600 text-white border-indigo-600 font-bold"
                      : "bg-white text-slate-600 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {val}万円
                </button>
              ))}
            </div>
          </div>

          {/* 加入健康保険 */}
          <div>
            <label className="text-xs sm:text-sm font-bold text-slate-800 block mb-2">
              加入している健康保険
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => setInsuranceType("kenpo")}
                className={`p-2.5 rounded-xl border text-left font-bold transition-all ${
                  insuranceType === "kenpo"
                    ? "bg-indigo-600 text-white border-indigo-600 shadow-xs"
                    : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className="text-[10px] opacity-80">中小企業等</div>
                <div className="text-xs sm:text-[13px]">協会けんぽ</div>
              </button>
              <button
                type="button"
                onClick={() => setInsuranceType("union")}
                className={`p-2.5 rounded-xl border text-left font-bold transition-all ${
                  insuranceType === "union"
                    ? "bg-indigo-600 text-white border-indigo-600 shadow-xs"
                    : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className="text-[10px] opacity-80">大企業社員</div>
                <div className="text-xs sm:text-[13px]">組合健保</div>
              </button>
              <button
                type="button"
                onClick={() => setInsuranceType("kyosai")}
                className={`p-2.5 rounded-xl border text-left font-bold transition-all ${
                  insuranceType === "kyosai"
                    ? "bg-indigo-600 text-white border-indigo-600 shadow-xs"
                    : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className="text-[10px] opacity-80">公務員・教職員</div>
                <div className="text-xs sm:text-[13px]">共済組合</div>
              </button>
              <button
                type="button"
                onClick={() => setInsuranceType("kokuho")}
                className={`p-2.5 rounded-xl border text-left font-bold transition-all ${
                  insuranceType === "kokuho"
                    ? "bg-indigo-600 text-white border-indigo-600 shadow-xs"
                    : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className="text-[10px] opacity-80">自営業・フリーランス</div>
                <div className="text-xs sm:text-[13px]">国民健康保険</div>
              </button>
            </div>
          </div>

          {/* 世帯状況・子どもの有無 */}
          <div>
            <label className="text-xs sm:text-sm font-bold text-slate-800 block mb-2">
              世帯の状況（児童手当拡充との比較）
            </label>
            <div className="space-y-1.5 text-xs">
              <label
                className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer transition-all ${
                  householdType === "single_or_no_child"
                    ? "bg-indigo-50/80 border-indigo-300 text-indigo-950 font-bold"
                    : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                }`}
              >
                <input
                  type="radio"
                  name="householdType"
                  checked={householdType === "single_or_no_child"}
                  onChange={() => setHouseholdType("single_or_no_child")}
                  className="accent-indigo-600"
                />
                <span>単身・子なし・子育て終了世代（手取り減のみ）</span>
              </label>
              <label
                className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer transition-all ${
                  householdType === "high_school"
                    ? "bg-indigo-50/80 border-indigo-300 text-indigo-950 font-bold"
                    : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                }`}
              >
                <input
                  type="radio"
                  name="householdType"
                  checked={householdType === "high_school"}
                  onChange={() => setHouseholdType("high_school")}
                  className="accent-indigo-600"
                />
                <span>高校生（16〜18歳）がいる家庭（児童手当 +月1万円）</span>
              </label>
              <label
                className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer transition-all ${
                  householdType === "third_child"
                    ? "bg-indigo-50/80 border-indigo-300 text-indigo-950 font-bold"
                    : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                }`}
              >
                <input
                  type="radio"
                  name="householdType"
                  checked={householdType === "third_child"}
                  onChange={() => setHouseholdType("third_child")}
                  className="accent-indigo-600"
                />
                <span>第3子以降がいる家庭（児童手当 +月3万円）</span>
              </label>
            </div>
          </div>

          {/* 徴収時期の選択 */}
          <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600">試算基準時期:</span>
            <div className="inline-flex rounded-lg border border-slate-200 bg-white p-0.5 text-xs">
              <button
                type="button"
                onClick={() => setPhase("full")}
                className={`px-2.5 py-1 rounded-md font-bold transition-all ${
                  phase === "full" ? "bg-indigo-600 text-white shadow-2xs" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                2028年度（満額）
              </button>
              <button
                type="button"
                onClick={() => setPhase("initial")}
                className={`px-2.5 py-1 rounded-md font-bold transition-all ${
                  phase === "initial" ? "bg-indigo-600 text-white shadow-2xs" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                2026年度（初年度）
              </button>
            </div>
          </div>
        </div>

        {/* 右側：試算結果表示 */}
        <div className="lg:col-span-6 space-y-4">
          {/* メイン結果カード */}
          <div className="bg-gradient-to-br from-indigo-700 via-indigo-600 to-blue-700 text-white rounded-2xl p-5 sm:p-6 shadow-md relative overflow-hidden">
            <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-x-4 translate-y-4">
              <TrendingDown className="w-40 h-40 text-white" />
            </div>

            <div className="flex items-center justify-between text-xs font-bold text-indigo-100 mb-1">
              <span>毎月の給料からの天引き額</span>
              <span className="bg-white/20 px-2.5 py-0.5 rounded-full text-[11px] backdrop-blur-xs">
                {phase === "full" ? "2028年度 満額時" : "2026年度 初年度"}
              </span>
            </div>

            <div className="flex items-baseline gap-2 my-2.5">
              <span className="text-3xl sm:text-5xl font-black tracking-tight">{monthlyFund.toLocaleString()}</span>
              <span className="text-lg sm:text-xl font-bold">円 / 月</span>
            </div>

            <div className="pt-3 border-t border-indigo-500/50 flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm text-indigo-100">
              <div>
                年間天引き額: <strong className="text-white text-base font-black">約 {yearlyFund.toLocaleString()} 円</strong>
              </div>
              {insuranceType !== "kokuho" && (
                <div className="text-[11px] bg-indigo-800/60 px-2 py-0.5 rounded text-indigo-200">
                  企業折半: 年約 {employerShare.toLocaleString()} 円
                </div>
              )}
            </div>
          </div>

          {/* ネット収支（児童手当 vs 支援金負担）カード */}
          <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200/90 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-xs sm:text-sm text-slate-900 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-indigo-600" />
                <span>世帯のネット年間収支（手取り影響）</span>
              </h4>
              <span
                className={`text-xs font-black px-2 py-0.5 rounded-md ${
                  netBalance > 0
                    ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                    : "bg-rose-100 text-rose-800 border border-rose-200"
                }`}
              >
                {netBalance > 0 ? `＋${netBalance.toLocaleString()} 円 / 年` : `${netBalance.toLocaleString()} 円 / 年`}
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {householdType === "single_or_no_child" && (
                <span>
                  児童手当などの給付拡充の対象とならないため、年間 <strong>約 {yearlyFund.toLocaleString()} 円の純粋な手取り減</strong> となります（単身者・子育て終了世代・共働き子なし世帯の典型例）。
                </span>
              )}
              {householdType === "high_school" && (
                <span>
                  高校生への児童手当支給（年12万円）が新設されるため、支援金負担（年約{yearlyFund.toLocaleString()}円）を差し引いても、世帯全体では <strong>年約 ＋{netBalance.toLocaleString()} 円の受給増</strong> となります。
                </span>
              )}
              {householdType === "third_child" && (
                <span>
                  第3子以降の児童手当加算倍増（年36万円）により、支援金の天引き（年約{yearlyFund.toLocaleString()}円）を差し引いても、世帯全体では <strong>年約 ＋{netBalance.toLocaleString()} 円の大幅プラス</strong> となります。
                </span>
              )}
            </p>
          </div>

          {/* 「実質負担ゼロ」主張 vs 現実のギャップ対比 */}
          <div className="bg-amber-50/70 rounded-2xl p-4 border border-amber-200/80 space-y-2.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>「実質負担ゼロ」論争と給与明細の現実</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="bg-white/80 p-2.5 rounded-xl border border-amber-200/60">
                <div className="text-[11px] font-bold text-slate-500 mb-1">🏛️ 政府の主張（岸田政権）</div>
                <p className="text-[11px] text-slate-700 leading-relaxed">
                  歳出改革と賃上げによって国民負担率は上がらず、マクロ経済全体として「実質的な追加負担は生じない」。
                </p>
              </div>
              <div className="bg-white/80 p-2.5 rounded-xl border border-amber-200/60">
                <div className="text-[11px] font-bold text-rose-600 mb-1">💸 給与明細の現実</div>
                <p className="text-[11px] text-slate-700 leading-relaxed">
                  健康保険料に新設される項目で、毎月確実に <strong>{monthlyFund.toLocaleString()}円</strong> の現金が手取りから消滅。
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
