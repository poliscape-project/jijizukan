"use client";

import React, { useState, useId } from "react";
import { Calculator, Users, AlertCircle, TrendingDown, CheckCircle2, Building2, HelpCircle, Plus, Minus, Baby, Sparkles } from "lucide-react";

export const ChildcareSupportFundSimulator: React.FC = () => {
  const incomeSliderId = useId();
  const [annualIncome, setAnnualIncome] = useState<number>(500);
  const [insuranceType, setInsuranceType] = useState<"kenpo" | "union" | "kyosai" | "kokuho">("kenpo");
  const [phase, setPhase] = useState<"full" | "initial">("full");

  // 子どもの人数（年齢・区分別）
  const [highSchoolCount, setHighSchoolCount] = useState<number>(0); // 高校生（16〜18歳）：手当新設 +月1万円
  const [youngerCount, setYoungerCount] = useState<number>(0); // 0歳〜中学生（第1・2子）：手当は従前から継続（増額0円）
  const [thirdChildCount, setThirdChildCount] = useState<number>(0); // 第3子以降（高校生以下）：手当倍増 +月2万円程度

  // プリセット適用関数
  const applyPreset = (preset: "single" | "younger_only" | "high_school_one" | "younger_and_high" | "three_kids") => {
    switch (preset) {
      case "single":
        setHighSchoolCount(0);
        setYoungerCount(0);
        setThirdChildCount(0);
        break;
      case "younger_only":
        setHighSchoolCount(0);
        setYoungerCount(1);
        setThirdChildCount(0);
        break;
      case "high_school_one":
        setHighSchoolCount(1);
        setYoungerCount(0);
        setThirdChildCount(0);
        break;
      case "younger_and_high":
        setHighSchoolCount(1);
        setYoungerCount(1);
        setThirdChildCount(0);
        break;
      case "three_kids":
        setHighSchoolCount(1);
        setYoungerCount(1);
        setThirdChildCount(1);
        break;
    }
  };

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

  // 児童手当の法改正による「増額分」の計算
  // 高校生: 月1万円（年12万円）新設
  // 0〜中学生（第1・2子）: 手当は従来から受給しているため、今回の法改正での純増は0円
  // 第3子以降: 月3万円へ拡充（従来比で月約1.5万〜2万円増 ＝ 年約24万円増）
  const highSchoolGainYearly = highSchoolCount * 120000;
  const youngerGainYearly = youngerCount * 0;
  const thirdChildGainYearly = thirdChildCount * 240000;
  const totalChildAllowanceGainYearly = highSchoolGainYearly + youngerGainYearly + thirdChildGainYearly;

  const totalChildren = highSchoolCount + youngerCount + thirdChildCount;
  const netBalance = totalChildAllowanceGainYearly - yearlyFund;

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

          {/* お子さまの状況（児童手当改正による増額との比較） */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <Baby className="w-4 h-4 text-indigo-600" />
                <span>お子さまの人数・年齢区分</span>
              </label>
              <span className="text-[11px] text-slate-500 font-medium">
                合計: <strong className="text-indigo-700 font-bold">{totalChildren}人</strong>
              </span>
            </div>

            {/* クイック選択プリセット */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              <button
                type="button"
                onClick={() => applyPreset("single")}
                className={`text-[11px] px-2 py-1 rounded-lg border font-medium transition-colors ${
                  totalChildren === 0
                    ? "bg-indigo-600 text-white border-indigo-600 font-bold"
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-100"
                }`}
              >
                単身・子なし
              </button>
              <button
                type="button"
                onClick={() => applyPreset("younger_only")}
                className={`text-[11px] px-2 py-1 rounded-lg border font-medium transition-colors ${
                  youngerCount === 1 && highSchoolCount === 0 && thirdChildCount === 0
                    ? "bg-indigo-600 text-white border-indigo-600 font-bold"
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-100"
                }`}
              >
                小中学生 1人
              </button>
              <button
                type="button"
                onClick={() => applyPreset("high_school_one")}
                className={`text-[11px] px-2 py-1 rounded-lg border font-medium transition-colors ${
                  highSchoolCount === 1 && youngerCount === 0 && thirdChildCount === 0
                    ? "bg-indigo-600 text-white border-indigo-600 font-bold"
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-100"
                }`}
              >
                高校生 1人
              </button>
              <button
                type="button"
                onClick={() => applyPreset("younger_and_high")}
                className={`text-[11px] px-2 py-1 rounded-lg border font-medium transition-colors ${
                  highSchoolCount === 1 && youngerCount === 1 && thirdChildCount === 0
                    ? "bg-indigo-600 text-white border-indigo-600 font-bold"
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-100"
                }`}
              >
                小中＋高校
              </button>
              <button
                type="button"
                onClick={() => applyPreset("three_kids")}
                className={`text-[11px] px-2 py-1 rounded-lg border font-medium transition-colors ${
                  thirdChildCount >= 1
                    ? "bg-indigo-600 text-white border-indigo-600 font-bold"
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-100"
                }`}
              >
                子ども3人（第3子加算）
              </button>
            </div>

            {/* カウンターリスト */}
            <div className="space-y-2 text-xs">
              {/* 高校生 */}
              <div className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 bg-white shadow-2xs">
                <div>
                  <div className="font-bold text-slate-800 flex items-center gap-1.5">
                    <span>高校生（16〜18歳）</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-bold">新設 +月1万円</span>
                  </div>
                  <div className="text-[11px] text-slate-500">児童手当が新たに高校生まで支給延長</div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setHighSchoolCount(Math.max(0, highSchoolCount - 1))}
                    className="w-7 h-7 rounded-lg border border-slate-300 flex items-center justify-center text-slate-600 hover:bg-slate-100 active:scale-95 transition-all"
                    aria-label="高校生を1人減らす"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-5 text-center font-bold text-sm text-slate-800 font-mono">{highSchoolCount}</span>
                  <button
                    type="button"
                    onClick={() => setHighSchoolCount(highSchoolCount + 1)}
                    className="w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-300 text-indigo-700 flex items-center justify-center hover:bg-indigo-100 active:scale-95 transition-all"
                    aria-label="高校生を1人増やす"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* 0歳〜中学生（第1・2子） */}
              <div className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 bg-white shadow-2xs">
                <div>
                  <div className="font-bold text-slate-800 flex items-center gap-1.5">
                    <span>0歳〜中学生（第1・2子）</span>
                    <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-bold">改正増額なし</span>
                  </div>
                  <div className="text-[11px] text-slate-500">手当は従前から受給中（今回の純増はゼロ）</div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setYoungerCount(Math.max(0, youngerCount - 1))}
                    className="w-7 h-7 rounded-lg border border-slate-300 flex items-center justify-center text-slate-600 hover:bg-slate-100 active:scale-95 transition-all"
                    aria-label="0歳〜中学生を1人減らす"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-5 text-center font-bold text-sm text-slate-800 font-mono">{youngerCount}</span>
                  <button
                    type="button"
                    onClick={() => setYoungerCount(youngerCount + 1)}
                    className="w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-300 text-indigo-700 flex items-center justify-center hover:bg-indigo-100 active:scale-95 transition-all"
                    aria-label="0歳〜中学生を1人増やす"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* 第3子以降 */}
              <div className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 bg-white shadow-2xs">
                <div>
                  <div className="font-bold text-slate-800 flex items-center gap-1.5">
                    <span>第3子以降のお子さま</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-bold">加算倍増 +月2万円</span>
                  </div>
                  <div className="text-[11px] text-slate-500">月3万円へ増額（高校生年代まで対象）</div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setThirdChildCount(Math.max(0, thirdChildCount - 1))}
                    className="w-7 h-7 rounded-lg border border-slate-300 flex items-center justify-center text-slate-600 hover:bg-slate-100 active:scale-95 transition-all"
                    aria-label="第3子以降を1人減らす"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-5 text-center font-bold text-sm text-slate-800 font-mono">{thirdChildCount}</span>
                  <button
                    type="button"
                    onClick={() => setThirdChildCount(thirdChildCount + 1)}
                    className="w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-300 text-indigo-700 flex items-center justify-center hover:bg-indigo-100 active:scale-95 transition-all"
                    aria-label="第3子以降を1人増やす"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
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
                <span>手取りの実質的な増減額（年間）</span>
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

            {/* 内訳ミニバー */}
            <div className="grid grid-cols-2 gap-2 text-[11px] py-1.5 px-2 bg-white rounded-lg border border-slate-200/80">
              <div className="flex flex-col">
                <span className="text-slate-500">児童手当の増額分:</span>
                <span className="font-bold text-emerald-700">＋{totalChildAllowanceGainYearly.toLocaleString()} 円 / 年</span>
              </div>
              <div className="flex flex-col">
                <span className="text-slate-500">支援金の天引き額:</span>
                <span className="font-bold text-rose-700">−{yearlyFund.toLocaleString()} 円 / 年</span>
              </div>
            </div>

            {/* 世帯構成ごとの解説文 */}
            <div className="text-xs text-slate-600 leading-relaxed">
              {totalChildren === 0 ? (
                <p>
                  児童手当などの給付拡充の対象とならないため、年間 <strong>約 {yearlyFund.toLocaleString()} 円の純粋な手取り減</strong> となります（単身者・子育て終了世代・共働き子なし世帯の典型例）。
                </p>
              ) : youngerCount > 0 && highSchoolCount === 0 && thirdChildCount === 0 ? (
                <div className="space-y-1 bg-amber-50/90 p-2.5 rounded-xl border border-amber-200 text-amber-950">
                  <div className="font-bold text-[11px] text-amber-900 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>制度の盲点：子育て世帯でも手取りが減るパターン</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-amber-900">
                    0歳〜中学生の手当は従前から支給されているため<strong>今回の法改正による純増はゼロ</strong>です。支援金の天引き（年約{yearlyFund.toLocaleString()}円）が始まるため、<strong>子育て中であっても今回の制度改正では実質手取りが減ります</strong>。
                  </p>
                </div>
              ) : (
                <p>
                  高校生への手当新設（年{highSchoolGainYearly.toLocaleString()}円）や第3子加算拡充（年{thirdChildGainYearly.toLocaleString()}円）により、支援金の天引き負担（年約{yearlyFund.toLocaleString()}円）を上回り、世帯全体では <strong>年約 ＋{netBalance.toLocaleString()} 円の実質手取り増</strong> となります。
                </p>
              )}
            </div>
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
