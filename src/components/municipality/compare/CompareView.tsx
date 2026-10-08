'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Building2, ArrowLeft, ArrowRight, Share2, Check, Search, 
  Coins, Users, Scale, Calendar, Gift, AlertTriangle, ShieldCheck,
  TrendingUp, TrendingDown, Sparkles, X, ChevronRight, PieChart, Layers
} from 'lucide-react';
import { MunicipalityData, MunicipalitySummary, MunicipalityYearlyHistory } from '@/types/municipality';

interface Props {
  muniA: MunicipalityData;
  muniB: MunicipalityData;
  historyA: MunicipalityYearlyHistory[];
  historyB: MunicipalityYearlyHistory[];
  summaries: MunicipalitySummary[];
}

// 注目のおすすめ対決プリセット
const PRESET_MATCHUPS = [
  {
    title: '👑 財政日本一 vs 財政再生団体',
    desc: '日本一裕福な村と借金返済に挑む町の財政対決',
    codeA: '234273', // 愛知県飛島村
    codeB: '012092', // 北海道夕張市
  },
  {
    title: '🏙️ 首都中枢 vs 最大政令市',
    desc: '日本屈指の富裕区と最大規模基礎自治体の比較',
    codeA: '131016', // 東京都千代田区
    codeB: '141003', // 神奈川県横浜市
  },
  {
    title: '🎁 ふるさと納税 勝ち組 vs 負け組',
    desc: '全国屈指の黒字流入自治体 vs 巨額流出赤字区',
    codeA: '452017', // 宮崎県都城市
    codeB: '131121', // 東京都世田谷区
  },
  {
    title: '🏭 TSMC半導体メガハブ vs 地方県都',
    desc: '巨額外資誘致で激変する新興城下町と中核市',
    codeA: '434043', // 熊本県菊陽町
    codeB: '431001', // 熊本県熊本市
  },
];

export default function CompareView({ muniA, muniB, historyA, historyB, summaries }: Props) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'debtReserve' | 'furusato' | 'population'>('debtReserve');
  const [hoveredYearIndex, setHoveredYearIndex] = useState<number | null>(null);

  // 自治体変更モーダル
  const [selectingSide, setSelectingSide] = useState<'A' | 'B' | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // シェア用URLコピー
  const handleCopyUrl = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // 自治体選択ハンドラー
  const handleSelectMunicipality = (targetCode: string) => {
    if (selectingSide === 'A') {
      router.push(`/municipalities/compare?a=${targetCode}&b=${muniB.code}`);
    } else if (selectingSide === 'B') {
      router.push(`/municipalities/compare?a=${muniA.code}&b=${targetCode}`);
    }
    setSelectingSide(null);
    setSearchQuery('');
  };

  // 左右入れ替え
  const handleSwap = () => {
    router.push(`/municipalities/compare?a=${muniB.code}&b=${muniA.code}`);
  };

  // 検索フィルター
  const filteredSummaries = useMemo(() => {
    if (!searchQuery.trim()) return summaries.slice(0, 30);
    const q = searchQuery.trim().toLowerCase();
    const qHiragana = q.replace(/[\u30a1-\u30f6]/g, m => String.fromCharCode(m.charCodeAt(0) - 0x60));
    return summaries.filter(m =>
      m.name.toLowerCase().includes(q) ||
      m.prefName.toLowerCase().includes(q) ||
      m.code.includes(q) ||
      (m.kana && (m.kana.includes(q) || m.kana.includes(qHiragana))) ||
      (m.prefKana && (m.prefKana.includes(q) || m.prefKana.includes(qHiragana)))
    ).slice(0, 50);
  }, [summaries, searchQuery]);

  // 1人あたり主要指標の計算
  const popA = muniA.population || 1;
  const popB = muniB.population || 1;

  const pwA = Math.round((muniA.expensesByPurpose.publicWorks * 1000) / popA);
  const pwB = Math.round((muniB.expensesByPurpose.publicWorks * 1000) / popB);

  const netA = Math.round(((muniA.financial.reserveFundTotal - muniA.financial.debtOutstanding) * 1000) / popA);
  const netB = Math.round(((muniB.financial.reserveFundTotal - muniB.financial.debtOutstanding) * 1000) / popB);

  const furuA = muniA.furusato?.balancePerCapita ?? 0;
  const furuB = muniB.furusato?.balancePerCapita ?? 0;

  const mayorSalaryA = muniA.governance.mayorSalary;
  const mayorSalaryB = muniB.governance.mayorSalary;

  const councilSalaryA = muniA.governance.councilSalary;
  const councilSalaryB = muniB.governance.councilSalary;

  return (
    <div className="space-y-8">
      {/* ナビゲーションバー */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link
          href="/municipalities"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-indigo-600 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>全国自治体カルテ一覧へ戻る</span>
        </Link>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handleSwap}
            className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
            title="左右を入れ替える"
          >
            <Scale className="w-3.5 h-3.5 text-indigo-500" />
            <span>左右を入れ替え</span>
          </button>
          <button
            onClick={handleCopyUrl}
            className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-emerald-600 dark:text-emerald-400">URLコピー完了</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5 text-slate-400" />
                <span>比較をシェア</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* おすすめ対決プリセットピル */}
      <div className="space-y-2">
        <div className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
          <span>注目のテーマ対決クイック切り替え</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {PRESET_MATCHUPS.map((preset, idx) => {
            const isCurrent = (muniA.code === preset.codeA && muniB.code === preset.codeB) ||
                              (muniA.code === preset.codeB && muniB.code === preset.codeA);
            return (
              <button
                key={idx}
                onClick={() => router.push(`/municipalities/compare?a=${preset.codeA}&b=${preset.codeB}`)}
                className={`text-left p-3 rounded-xl border transition cursor-pointer flex flex-col justify-between ${
                  isCurrent
                    ? 'bg-indigo-50/80 dark:bg-indigo-950/40 border-indigo-400 dark:border-indigo-600 ring-2 ring-indigo-500/20'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700 shadow-2xs'
                }`}
              >
                <div>
                  <div className="text-xs font-black text-slate-900 dark:text-white truncate">
                    {preset.title}
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                    {preset.desc}
                  </div>
                </div>
                <div className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold mt-2 flex items-center gap-1">
                  <span>対決を見る</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* VS ヒーロー対決カード */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 md:p-8 border border-slate-800 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-11 gap-6 items-center">
          {/* 自治体A */}
          <div className="md:col-span-5 bg-slate-800/80 rounded-2xl p-5 border border-indigo-500/40 shadow-inner flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                  自治体 A（青）
                </span>
                <span className="text-xs text-slate-400 font-mono">{muniA.code}</span>
              </div>
              <div className="text-xs text-slate-300 font-medium">{muniA.prefName}</div>
              <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight mt-0.5">
                {muniA.name}
              </h2>
              <div className="text-xs text-indigo-200 mt-1">
                {muniA.typeGroup || '一般市町村'}
                {muniA.sustainability?.category && (
                  <span className="ml-2 px-1.5 py-0.2 rounded text-[10px] bg-slate-700 text-slate-300">
                    {muniA.sustainability.category}
                  </span>
                )}
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-700/60 flex items-center justify-between">
              <Link
                href={`/municipalities/${muniA.code}`}
                className="text-xs text-indigo-300 hover:text-white font-bold inline-flex items-center gap-1"
              >
                <span>カルテ詳細へ</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
              <button
                onClick={() => setSelectingSide('A')}
                className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition cursor-pointer flex items-center gap-1 shadow-2xs"
              >
                <Search className="w-3 h-3" />
                <span>自治体Aを変更</span>
              </button>
            </div>
          </div>

          {/* VS バッジ */}
          <div className="md:col-span-1 flex flex-col items-center justify-center py-2 md:py-0">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-rose-500 flex items-center justify-center font-black text-sm tracking-widest text-white shadow-lg border-2 border-slate-900">
              VS
            </div>
          </div>

          {/* 自治体B */}
          <div className="md:col-span-5 bg-slate-800/80 rounded-2xl p-5 border border-rose-500/40 shadow-inner flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40">
                  自治体 B（赤）
                </span>
                <span className="text-xs text-slate-400 font-mono">{muniB.code}</span>
              </div>
              <div className="text-xs text-slate-300 font-medium">{muniB.prefName}</div>
              <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight mt-0.5">
                {muniB.name}
              </h2>
              <div className="text-xs text-rose-200 mt-1">
                {muniB.typeGroup || '一般市町村'}
                {muniB.sustainability?.category && (
                  <span className="ml-2 px-1.5 py-0.2 rounded text-[10px] bg-slate-700 text-slate-300">
                    {muniB.sustainability.category}
                  </span>
                )}
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-700/60 flex items-center justify-between">
              <Link
                href={`/municipalities/${muniB.code}`}
                className="text-xs text-rose-300 hover:text-white font-bold inline-flex items-center gap-1"
              >
                <span>カルテ詳細へ</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
              <button
                onClick={() => setSelectingSide('B')}
                className="px-3 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition cursor-pointer flex items-center gap-1 shadow-2xs"
              >
                <Search className="w-3 h-3" />
                <span>自治体Bを変更</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* セクション1: 基本スペック横並び対決テーブル */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
        <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
          <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <Scale className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            主要スペック・財政健全度 徹底対決
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            規模・財政力・予算の柔軟性を指標ごとに直接対比
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-500">
                <th className="py-2.5 px-3 text-left w-1/3 text-indigo-600 dark:text-indigo-400 font-bold">
                  {muniA.name}
                </th>
                <th className="py-2.5 px-3 text-center w-1/3 font-semibold text-slate-700 dark:text-slate-300">
                  比較項目
                </th>
                <th className="py-2.5 px-3 text-right w-1/3 text-rose-600 dark:text-rose-400 font-bold">
                  {muniB.name}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              {/* 人口 */}
              <tr>
                <td className="py-3 px-3 text-left">
                  <span className="font-bold text-sm text-slate-900 dark:text-white">
                    {muniA.population >= 10000 ? `${(muniA.population / 10000).toFixed(1)}万人` : `${muniA.population.toLocaleString()}人`}
                  </span>
                  {muniA.population > muniB.population && <span className="ml-1.5 text-[10px] text-indigo-600 font-bold">大</span>}
                </td>
                <td className="py-3 px-3 text-center text-slate-500">人口規模</td>
                <td className="py-3 px-3 text-right">
                  {muniB.population > muniA.population && <span className="mr-1.5 text-[10px] text-rose-600 font-bold">大</span>}
                  <span className="font-bold text-sm text-slate-900 dark:text-white">
                    {muniB.population >= 10000 ? `${(muniB.population / 10000).toFixed(1)}万人` : `${muniB.population.toLocaleString()}人`}
                  </span>
                </td>
              </tr>

              {/* 面積 */}
              <tr>
                <td className="py-3 px-3 text-left">
                  <span className="font-bold text-sm text-slate-900 dark:text-white">{muniA.area.toFixed(1)} km²</span>
                </td>
                <td className="py-3 px-3 text-center text-slate-500">総面積</td>
                <td className="py-3 px-3 text-right">
                  <span className="font-bold text-sm text-slate-900 dark:text-white">{muniB.area.toFixed(1)} km²</span>
                </td>
              </tr>

              {/* 財政力指数 */}
              <tr className="bg-slate-50/50 dark:bg-slate-800/30">
                <td className="py-3 px-3 text-left">
                  <span className={`font-black text-base ${muniA.financial.financialStrengthIndex >= 1.0 ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-900 dark:text-white'}`}>
                    {muniA.financial.financialStrengthIndex.toFixed(2)}
                  </span>
                  {muniA.financial.financialStrengthIndex >= 1.0 && (
                    <span className="ml-1.5 px-1.5 py-0.2 rounded text-[10px] bg-indigo-100 text-indigo-700 font-bold">不交付</span>
                  )}
                  {muniA.financial.financialStrengthIndex > muniB.financial.financialStrengthIndex && (
                    <span className="ml-1.5 text-xs">👑</span>
                  )}
                </td>
                <td className="py-3 px-3 text-center text-slate-700 dark:text-slate-300 font-bold">
                  財政力指数
                  <span className="block text-[10px] text-slate-400 font-normal">1.0以上で不交付団体</span>
                </td>
                <td className="py-3 px-3 text-right">
                  {muniB.financial.financialStrengthIndex > muniA.financial.financialStrengthIndex && (
                    <span className="mr-1.5 text-xs">👑</span>
                  )}
                  {muniB.financial.financialStrengthIndex >= 1.0 && (
                    <span className="mr-1.5 px-1.5 py-0.2 rounded text-[10px] bg-rose-100 text-rose-700 font-bold">不交付</span>
                  )}
                  <span className={`font-black text-base ${muniB.financial.financialStrengthIndex >= 1.0 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-900 dark:text-white'}`}>
                    {muniB.financial.financialStrengthIndex.toFixed(2)}
                  </span>
                </td>
              </tr>

              {/* 経常収支比率 */}
              <tr>
                <td className="py-3 px-3 text-left">
                  <span className={`font-bold text-sm ${muniA.financial.ordinaryBalanceRatio > 95 ? 'text-amber-600' : 'text-slate-900 dark:text-white'}`}>
                    {muniA.financial.ordinaryBalanceRatio.toFixed(1)}%
                  </span>
                  {muniA.financial.ordinaryBalanceRatio < muniB.financial.ordinaryBalanceRatio && (
                    <span className="ml-1.5 text-[10px] text-emerald-600 font-bold">柔軟</span>
                  )}
                </td>
                <td className="py-3 px-3 text-center text-slate-500">
                  経常収支比率
                  <span className="block text-[10px] text-slate-400 font-normal">低いほど使途に余裕あり</span>
                </td>
                <td className="py-3 px-3 text-right">
                  {muniB.financial.ordinaryBalanceRatio < muniA.financial.ordinaryBalanceRatio && (
                    <span className="mr-1.5 text-[10px] text-emerald-600 font-bold">柔軟</span>
                  )}
                  <span className={`font-bold text-sm ${muniB.financial.ordinaryBalanceRatio > 95 ? 'text-amber-600' : 'text-slate-900 dark:text-white'}`}>
                    {muniB.financial.ordinaryBalanceRatio.toFixed(1)}%
                  </span>
                </td>
              </tr>

              {/* 実質公債費比率 */}
              <tr>
                <td className="py-3 px-3 text-left">
                  <span className={`font-bold text-sm ${muniA.financial.realDebtServiceRatio >= 18 ? 'text-rose-600 font-black' : 'text-slate-900 dark:text-white'}`}>
                    {muniA.financial.realDebtServiceRatio.toFixed(1)}%
                  </span>
                  {muniA.financial.realDebtServiceRatio < muniB.financial.realDebtServiceRatio && (
                    <span className="ml-1.5 text-[10px] text-emerald-600 font-bold">健全</span>
                  )}
                </td>
                <td className="py-3 px-3 text-center text-slate-500">
                  実質公債費比率
                  <span className="block text-[10px] text-slate-400 font-normal">18%以上で起債許可制</span>
                </td>
                <td className="py-3 px-3 text-right">
                  {muniB.financial.realDebtServiceRatio < muniA.financial.realDebtServiceRatio && (
                    <span className="mr-1.5 text-[10px] text-emerald-600 font-bold">健全</span>
                  )}
                  <span className={`font-bold text-sm ${muniB.financial.realDebtServiceRatio >= 18 ? 'text-rose-600 font-black' : 'text-slate-900 dark:text-white'}`}>
                    {muniB.financial.realDebtServiceRatio.toFixed(1)}%
                  </span>
                </td>
              </tr>

              {/* 地方債残高（借金総額） */}
              <tr className="bg-slate-50/50 dark:bg-slate-800/30">
                <td className="py-3 px-3 text-left font-bold text-slate-900 dark:text-white">
                  {(muniA.financial.debtOutstanding / 100000).toFixed(1)} 億円
                </td>
                <td className="py-3 px-3 text-center text-slate-500">地方債残高（借金）</td>
                <td className="py-3 px-3 text-right font-bold text-slate-900 dark:text-white">
                  {(muniB.financial.debtOutstanding / 100000).toFixed(1)} 億円
                </td>
              </tr>

              {/* 積立基金（貯金総額） */}
              <tr className="bg-slate-50/50 dark:bg-slate-800/30">
                <td className="py-3 px-3 text-left font-bold text-emerald-600 dark:text-emerald-400">
                  {(muniA.financial.reserveFundTotal / 100000).toFixed(1)} 億円
                </td>
                <td className="py-3 px-3 text-center text-slate-500">積立基金（貯金）</td>
                <td className="py-3 px-3 text-right font-bold text-emerald-600 dark:text-emerald-400">
                  {(muniB.financial.reserveFundTotal / 100000).toFixed(1)} 億円
                </td>
              </tr>

              {/* 高齢化率 */}
              <tr>
                <td className="py-3 px-3 text-left font-bold text-slate-900 dark:text-white">
                  {muniA.demographics ? `${muniA.demographics.elderlyRate.toFixed(1)}%` : '-'}
                </td>
                <td className="py-3 px-3 text-center text-slate-500">高齢化率（65歳以上）</td>
                <td className="py-3 px-3 text-right font-bold text-slate-900 dark:text-white">
                  {muniB.demographics ? `${muniB.demographics.elderlyRate.toFixed(1)}%` : '-'}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* セクション2: 住民1人あたり指標のバーメーター対決 */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-6">
        <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
          <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <Coins className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            住民1人あたり負担・使い道メーター対比
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            規模の異なる自治体でも人口で割ることで「住民目線のリアルな行政サービス水準」を比較
          </p>
        </div>

        <div className="space-y-6">
          {/* 1. 住民1人あたり土木費 */}
          <CompareBarMeter
            label="住民1人あたり土木費（道路・インフラ投資）"
            desc="高すぎる自治体は過疎地での過剰投資や道路偏重の傾向"
            valA={pwA}
            valB={pwB}
            unit="円/人"
            nameA={muniA.name}
            nameB={muniB.name}
            betterSide="lower"
          />

          {/* 2. 住民1人あたり純資産（貯金 － 借金） */}
          <CompareBarMeter
            label="住民1人あたり実質純資産（基金 － 地方債）"
            desc="プラスなら住民1人あたりの純貯金、マイナスなら将来世代への純借金"
            valA={netA}
            valB={netB}
            unit="円/人"
            nameA={muniA.name}
            nameB={muniB.name}
            betterSide="higher"
            allowNegative
          />

          {/* 3. ふるさと納税 住民1人あたり純収支 */}
          <CompareBarMeter
            label="ふるさと納税 1人あたり収支（受入 － 流出）"
            desc="全国からの寄附金獲得による黒字か、住民税流出による赤字か"
            valA={furuA}
            valB={furuB}
            unit="円/人"
            nameA={muniA.name}
            nameB={muniB.name}
            betterSide="higher"
            allowNegative
          />

          {/* 4. 市区町村長 月額給与 */}
          <CompareBarMeter
            label="市区町村長（首長）月給"
            desc="自治体トップの月額基本報酬"
            valA={mayorSalaryA}
            valB={mayorSalaryB}
            unit="円/月"
            nameA={muniA.name}
            nameB={muniB.name}
          />

          {/* 5. 議員 月額報酬 */}
          <CompareBarMeter
            label="地方議会議員 報酬月額"
            desc="議会1人あたりの月額議員報酬"
            valA={councilSalaryA}
            valB={councilSalaryB}
            unit="円/月"
            nameA={muniA.name}
            nameB={muniB.name}
          />
        </div>
      </div>

      {/* セクション3: 直近10年間（2014〜2023年度）の変遷重ね合わせグラフ */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-semibold mb-1.5 border border-indigo-200/50">
              <Calendar className="w-3.5 h-3.5" />
              直近10年間の時系列重ね合わせ（2014〜2023年度）
            </div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white">
              {muniA.name}（青） vs {muniB.name}（赤） 10年タイムライン
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              過去10年の政策努力、財政健全化、人口減少スピードの軌跡を同一軸で比較
            </p>
          </div>

          {/* チャート切り替えタブ */}
          <div className="inline-flex p-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold self-start sm:self-auto">
            <button
              onClick={() => { setActiveTab('debtReserve'); setHoveredYearIndex(null); }}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'debtReserve'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-2xs font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Coins className="w-3.5 h-3.5" />
              <span>地方債 & 貯金</span>
            </button>
            <button
              onClick={() => { setActiveTab('furusato'); setHoveredYearIndex(null); }}
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
              onClick={() => { setActiveTab('population'); setHoveredYearIndex(null); }}
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

        {/* チャート描画 */}
        <div className="pt-2">
          {activeTab === 'debtReserve' && (
            <CompareDebtReserveChart
              historyA={historyA}
              historyB={historyB}
              nameA={muniA.name}
              nameB={muniB.name}
              hoveredIndex={hoveredYearIndex}
              setHoveredIndex={setHoveredYearIndex}
            />
          )}
          {activeTab === 'furusato' && (
            <CompareFurusatoChart
              historyA={historyA}
              historyB={historyB}
              nameA={muniA.name}
              nameB={muniB.name}
              hoveredIndex={hoveredYearIndex}
              setHoveredIndex={setHoveredYearIndex}
            />
          )}
          {activeTab === 'population' && (
            <ComparePopulationChart
              historyA={historyA}
              historyB={historyB}
              nameA={muniA.name}
              nameB={muniB.name}
              hoveredIndex={hoveredYearIndex}
              setHoveredIndex={setHoveredYearIndex}
            />
          )}
        </div>
      </div>

      {/* 自治体選択モーダル */}
      {selectingSide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full max-h-[85vh] flex flex-col border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h4 className="font-black text-slate-900 dark:text-white text-base">
                  自治体 {selectingSide} を変更
                </h4>
                <p className="text-xs text-slate-500">全国1,741市区町村から選択</p>
              </div>
              <button
                onClick={() => { setSelectingSide(null); setSearchQuery(''); }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 border-b border-slate-100 dark:border-slate-800">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  autoFocus
                  placeholder="自治体名・かな・都道府県名で検索..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="overflow-y-auto p-2 flex-1 divide-y divide-slate-100 dark:divide-slate-800">
              {filteredSummaries.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400">該当する自治体が見つかりません</div>
              ) : (
                filteredSummaries.map((m) => (
                  <button
                    key={m.code}
                    onClick={() => handleSelectMunicipality(m.code)}
                    className="w-full text-left p-3 hover:bg-indigo-50/60 dark:hover:bg-slate-800/80 rounded-xl transition flex items-center justify-between cursor-pointer group"
                  >
                    <div>
                      <div className="text-[11px] text-slate-400 font-medium">
                        {m.prefName} <span className="font-mono text-[10px] ml-1">({m.code})</span>
                      </div>
                      <div className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-indigo-600 transition">
                        {m.name}
                      </div>
                    </div>
                    <div className="text-right text-xs">
                      <div className="text-slate-500 font-medium">
                        人口 {m.population >= 10000 ? `${(m.population / 10000).toFixed(1)}万人` : `${m.population.toLocaleString()}人`}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        財政力指数 <strong className="font-bold text-slate-700 dark:text-slate-300">{m.financialStrength.toFixed(2)}</strong>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// -------------------------------------------------------------
// サブコンポーネント: バーメーター対比 (CompareBarMeter)
// -------------------------------------------------------------
function CompareBarMeter({
  label,
  desc,
  valA,
  valB,
  unit,
  nameA,
  nameB,
  betterSide,
  allowNegative = false
}: {
  label: string;
  desc: string;
  valA: number;
  valB: number;
  unit: string;
  nameA: string;
  nameB: string;
  betterSide?: 'higher' | 'lower';
  allowNegative?: boolean;
}) {
  const maxAbs = Math.max(Math.abs(valA), Math.abs(valB), 1);
  const pctA = Math.min(100, (Math.abs(valA) / maxAbs) * 100);
  const pctB = Math.min(100, (Math.abs(valB) / maxAbs) * 100);

  const isWinA = betterSide === 'higher' ? valA > valB : betterSide === 'lower' ? valA < valB : false;
  const isWinB = betterSide === 'higher' ? valB > valA : betterSide === 'lower' ? valB < valA : false;

  return (
    <div className="space-y-2 p-3 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-1">
        <div>
          <span className="font-bold text-slate-800 dark:text-slate-200">{label}</span>
          <span className="block text-[10px] text-slate-400">{desc}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 pt-1">
        {/* A市側 */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-indigo-600 dark:text-indigo-400 truncate max-w-[120px]">{nameA}</span>
            <span className={`font-black ${valA < 0 ? 'text-rose-600' : 'text-slate-900 dark:text-white'}`}>
              {valA.toLocaleString()} <span className="text-[10px] font-normal text-slate-400">{unit}</span>
              {isWinA && <span className="ml-1 text-xs">👑</span>}
            </span>
          </div>
          <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                allowNegative && valA < 0 ? 'bg-rose-500' : 'bg-indigo-600'
              }`}
              style={{ width: `${pctA}%` }}
            />
          </div>
        </div>

        {/* B市側 */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-rose-600 dark:text-rose-400 truncate max-w-[120px]">{nameB}</span>
            <span className={`font-black ${valB < 0 ? 'text-rose-600' : 'text-slate-900 dark:text-white'}`}>
              {valB.toLocaleString()} <span className="text-[10px] font-normal text-slate-400">{unit}</span>
              {isWinB && <span className="ml-1 text-xs">👑</span>}
            </span>
          </div>
          <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                allowNegative && valB < 0 ? 'bg-rose-500' : 'bg-rose-600'
              }`}
              style={{ width: `${pctB}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// サブコンポーネント: 地方債 vs 基金 10年比較チャート
// -------------------------------------------------------------
function CompareDebtReserveChart({
  historyA,
  historyB,
  nameA,
  nameB,
  hoveredIndex,
  setHoveredIndex
}: {
  historyA: MunicipalityYearlyHistory[];
  historyB: MunicipalityYearlyHistory[];
  nameA: string;
  nameB: string;
  hoveredIndex: number | null;
  setHoveredIndex: (idx: number | null) => void;
}) {
  const maxVal = Math.max(
    ...historyA.map(h => Math.max(h.debtOutstanding, h.reserveFundTotal)),
    ...historyB.map(h => Math.max(h.debtOutstanding, h.reserveFundTotal)),
    100000
  );
  const ceiling = Math.ceil((maxVal / 100000) * 1.15) * 100000;

  const width = 640;
  const height = 240;
  const padding = { top: 20, right: 30, bottom: 40, left: 60 };
  const graphWidth = width - padding.left - padding.right;
  const graphHeight = height - padding.top - padding.bottom;

  const count = Math.min(historyA.length, historyB.length);
  const getX = (idx: number) => padding.left + (idx / (count - 1)) * graphWidth;
  const getY = (val: number) => padding.top + graphHeight - (val / ceiling) * graphHeight;

  // A市（青系実線＝地方債、青系破線＝基金）
  const debtPointsA = historyA.map((h, i) => `${getX(i)},${getY(h.debtOutstanding)}`).join(' ');
  const reservePointsA = historyA.map((h, i) => `${getX(i)},${getY(h.reserveFundTotal)}`).join(' ');

  // B市（赤系実線＝地方債、赤系破線＝基金）
  const debtPointsB = historyB.map((h, i) => `${getX(i)},${getY(h.debtOutstanding)}`).join(' ');
  const reservePointsB = historyB.map((h, i) => `${getX(i)},${getY(h.reserveFundTotal)}`).join(' ');

  const currentIdx = hoveredIndex !== null ? hoveredIndex : count - 1;
  const hA = historyA[currentIdx] || historyA[0];
  const hB = historyB[currentIdx] || historyB[0];

  return (
    <div className="space-y-3">
      {/* 凡例 & 選択値 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1 font-semibold text-indigo-600">
            <span className="w-3.5 h-1 bg-indigo-600 rounded-full inline-block" />
            <span>{nameA} 地方債</span>
          </div>
          <div className="flex items-center gap-1 font-semibold text-indigo-400">
            <span className="w-3.5 h-1 border-t-2 border-dashed border-indigo-400 inline-block" />
            <span>{nameA} 貯金</span>
          </div>
          <div className="flex items-center gap-1 font-semibold text-rose-600">
            <span className="w-3.5 h-1 bg-rose-600 rounded-full inline-block" />
            <span>{nameB} 地方債</span>
          </div>
          <div className="flex items-center gap-1 font-semibold text-rose-400">
            <span className="w-3.5 h-1 border-t-2 border-dashed border-rose-400 inline-block" />
            <span>{nameB} 貯金</span>
          </div>
        </div>
        <div className="text-[11px] text-slate-500">
          年度: <strong className="text-slate-900 dark:text-white font-bold">{hA.year}年 ({hA.fiscalYearJp})</strong>
          {' '}| {nameA}: 借金<strong>{(hA.debtOutstanding / 100000).toFixed(1)}億</strong> / 貯金<strong>{(hA.reserveFundTotal / 100000).toFixed(1)}億</strong>
          {' '}| {nameB}: 借金<strong>{(hB.debtOutstanding / 100000).toFixed(1)}億</strong> / 貯金<strong>{(hB.reserveFundTotal / 100000).toFixed(1)}億</strong>
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

          {/* A市のライン */}
          <polyline fill="none" stroke="#4f46e5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" points={debtPointsA} />
          <polyline fill="none" stroke="#818cf8" strokeWidth="2" strokeDasharray="4 3" strokeLinecap="round" strokeLinejoin="round" points={reservePointsA} />

          {/* B市のライン */}
          <polyline fill="none" stroke="#e11d48" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" points={debtPointsB} />
          <polyline fill="none" stroke="#fb7185" strokeWidth="2" strokeDasharray="4 3" strokeLinecap="round" strokeLinejoin="round" points={reservePointsB} />

          {/* ホバー用バー */}
          {historyA.slice(0, count).map((h, i) => {
            const x = getX(i);
            const isSelected = i === currentIdx;
            return (
              <g key={i} className="cursor-pointer" onMouseEnter={() => setHoveredIndex(i)}>
                <rect
                  x={x - graphWidth / count / 2}
                  y={padding.top}
                  width={graphWidth / count}
                  height={graphHeight}
                  fill="transparent"
                />
                {isSelected && (
                  <line x1={x} y1={padding.top} x2={x} y2={height - padding.bottom} stroke="currentColor" className="text-slate-400" strokeWidth="1" strokeDasharray="2 2" />
                )}
                {/* 年ラベル */}
                <text x={x} y={height - padding.bottom + 16} textAnchor="middle" className={`text-[10px] font-mono ${isSelected ? 'fill-indigo-600 font-bold' : 'fill-slate-400'}`}>
                  {h.year}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// サブコンポーネント: ふるさと納税 10年比較チャート
// -------------------------------------------------------------
function CompareFurusatoChart({
  historyA,
  historyB,
  nameA,
  nameB,
  hoveredIndex,
  setHoveredIndex
}: {
  historyA: MunicipalityYearlyHistory[];
  historyB: MunicipalityYearlyHistory[];
  nameA: string;
  nameB: string;
  hoveredIndex: number | null;
  setHoveredIndex: (idx: number | null) => void;
}) {
  const allBalances = [
    ...historyA.map(h => h.furusatoBalance),
    ...historyB.map(h => h.furusatoBalance)
  ];
  const maxAbs = Math.max(...allBalances.map(v => Math.abs(v)), 100000000);
  const ceiling = Math.ceil((maxAbs / 1e8) * 1.2) * 1e8;

  const width = 640;
  const height = 240;
  const padding = { top: 20, right: 30, bottom: 40, left: 60 };
  const graphWidth = width - padding.left - padding.right;
  const graphHeight = height - padding.top - padding.bottom;

  const count = Math.min(historyA.length, historyB.length);
  const getX = (idx: number) => padding.left + (idx / (count - 1)) * graphWidth;
  // ゼロラインは中央
  const zeroY = padding.top + graphHeight / 2;
  const getY = (val: number) => zeroY - (val / ceiling) * (graphHeight / 2);

  const pointsA = historyA.map((h, i) => `${getX(i)},${getY(h.furusatoBalance)}`).join(' ');
  const pointsB = historyB.map((h, i) => `${getX(i)},${getY(h.furusatoBalance)}`).join(' ');

  const currentIdx = hoveredIndex !== null ? hoveredIndex : count - 1;
  const hA = historyA[currentIdx] || historyA[0];
  const hB = historyB[currentIdx] || historyB[0];

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 font-semibold text-indigo-600">
            <span className="w-3.5 h-1.5 bg-indigo-600 rounded-full inline-block" />
            <span>{nameA} 収支</span>
          </div>
          <div className="flex items-center gap-1.5 font-semibold text-rose-600">
            <span className="w-3.5 h-1.5 bg-rose-600 rounded-full inline-block" />
            <span>{nameB} 収支</span>
          </div>
        </div>
        <div className="text-[11px] text-slate-500">
          年度: <strong className="text-slate-900 dark:text-white font-bold">{hA.year}年</strong>
          {' '}| {nameA}: <strong className={hA.furusatoBalance >= 0 ? 'text-emerald-600' : 'text-rose-600'}>{(hA.furusatoBalance / 1e8).toFixed(1)}億円</strong>
          {' '}| {nameB}: <strong className={hB.furusatoBalance >= 0 ? 'text-emerald-600' : 'text-rose-600'}>{(hB.furusatoBalance / 1e8).toFixed(1)}億円</strong>
        </div>
      </div>

      <div className="relative w-full overflow-x-auto">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto select-none">
          {/* 0ライン（基準線） */}
          <line x1={padding.left} y1={zeroY} x2={width - padding.right} y2={zeroY} stroke="currentColor" className="text-slate-400" strokeWidth="1.5" />
          <text x={padding.left - 8} y={zeroY + 3} textAnchor="end" className="text-[10px] fill-slate-500 font-bold">
            ±0
          </text>

          {/* プラス・マイナス限界線 */}
          <line x1={padding.left} y1={padding.top} x2={width - padding.right} y2={padding.top} stroke="currentColor" className="text-slate-100 dark:text-slate-800" strokeDasharray="3 3" />
          <text x={padding.left - 8} y={padding.top + 3} textAnchor="end" className="text-[10px] fill-emerald-500 font-mono">
            +{(ceiling / 1e8).toFixed(0)}億
          </text>

          <line x1={padding.left} y1={height - padding.bottom} x2={width - padding.right} y2={height - padding.bottom} stroke="currentColor" className="text-slate-100 dark:text-slate-800" strokeDasharray="3 3" />
          <text x={padding.left - 8} y={height - padding.bottom + 3} textAnchor="end" className="text-[10px] fill-rose-500 font-mono">
            -{(ceiling / 1e8).toFixed(0)}億
          </text>

          {/* A市のポリライン */}
          <polyline fill="none" stroke="#4f46e5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" points={pointsA} />
          {/* B市のポリライン */}
          <polyline fill="none" stroke="#e11d48" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" points={pointsB} />

          {/* ホバーエリア */}
          {historyA.slice(0, count).map((h, i) => {
            const x = getX(i);
            const isSelected = i === currentIdx;
            return (
              <g key={i} className="cursor-pointer" onMouseEnter={() => setHoveredIndex(i)}>
                <rect x={x - graphWidth / count / 2} y={padding.top} width={graphWidth / count} height={graphHeight} fill="transparent" />
                {isSelected && (
                  <line x1={x} y1={padding.top} x2={x} y2={height - padding.bottom} stroke="currentColor" className="text-slate-400" strokeWidth="1" strokeDasharray="2 2" />
                )}
                <text x={x} y={height - padding.bottom + 16} textAnchor="middle" className={`text-[10px] font-mono ${isSelected ? 'fill-indigo-600 font-bold' : 'fill-slate-400'}`}>
                  {h.year}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// サブコンポーネント: 人口 & 高齢化率 10年比較チャート
// -------------------------------------------------------------
function ComparePopulationChart({
  historyA,
  historyB,
  nameA,
  nameB,
  hoveredIndex,
  setHoveredIndex
}: {
  historyA: MunicipalityYearlyHistory[];
  historyB: MunicipalityYearlyHistory[];
  nameA: string;
  nameB: string;
  hoveredIndex: number | null;
  setHoveredIndex: (idx: number | null) => void;
}) {
  // 高齢化率の比較（同一の0〜60%スケールで比較可能）
  const width = 640;
  const height = 240;
  const padding = { top: 20, right: 30, bottom: 40, left: 60 };
  const graphWidth = width - padding.left - padding.right;
  const graphHeight = height - padding.top - padding.bottom;

  const count = Math.min(historyA.length, historyB.length);
  const getX = (idx: number) => padding.left + (idx / (count - 1)) * graphWidth;
  const maxAging = 60; // 60%天井
  const getY = (val: number) => padding.top + graphHeight - (val / maxAging) * graphHeight;

  const pointsA = historyA.map((h, i) => `${getX(i)},${getY(h.agingRate ?? 30)}`).join(' ');
  const pointsB = historyB.map((h, i) => `${getX(i)},${getY(h.agingRate ?? 30)}`).join(' ');

  const currentIdx = hoveredIndex !== null ? hoveredIndex : count - 1;
  const hA = historyA[currentIdx] || historyA[0];
  const hB = historyB[currentIdx] || historyB[0];

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 font-semibold text-indigo-600">
            <span className="w-3.5 h-1.5 bg-indigo-600 rounded-full inline-block" />
            <span>{nameA} 高齢化率</span>
          </div>
          <div className="flex items-center gap-1.5 font-semibold text-rose-600">
            <span className="w-3.5 h-1.5 bg-rose-600 rounded-full inline-block" />
            <span>{nameB} 高齢化率</span>
          </div>
        </div>
        <div className="text-[11px] text-slate-500">
          年度: <strong className="text-slate-900 dark:text-white font-bold">{hA.year}年</strong>
          {' '}| {nameA}: 人口<strong>{hA.population.toLocaleString()}人</strong>（高齢化<strong>{(hA.agingRate ?? 0).toFixed(1)}%</strong>）
          {' '}| {nameB}: 人口<strong>{hB.population.toLocaleString()}人</strong>（高齢化<strong>{(hB.agingRate ?? 0).toFixed(1)}%</strong>）
        </div>
      </div>

      <div className="relative w-full overflow-x-auto">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto select-none">
          {[0, 15, 30, 45, 60].map((rate, idx) => {
            const y = getY(rate);
            return (
              <g key={idx}>
                <line x1={padding.left} y1={y} x2={width - padding.right} y2={y} stroke="currentColor" className="text-slate-100 dark:text-slate-800" strokeDasharray="3 3" />
                <text x={padding.left - 8} y={y + 3} textAnchor="end" className="text-[10px] fill-slate-400 font-mono">
                  {rate}%
                </text>
              </g>
            );
          })}

          {/* A市のポリライン */}
          <polyline fill="none" stroke="#4f46e5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" points={pointsA} />
          {/* B市のポリライン */}
          <polyline fill="none" stroke="#e11d48" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" points={pointsB} />

          {/* ホバーエリア */}
          {historyA.slice(0, count).map((h, i) => {
            const x = getX(i);
            const isSelected = i === currentIdx;
            return (
              <g key={i} className="cursor-pointer" onMouseEnter={() => setHoveredIndex(i)}>
                <rect x={x - graphWidth / count / 2} y={padding.top} width={graphWidth / count} height={graphHeight} fill="transparent" />
                {isSelected && (
                  <line x1={x} y1={padding.top} x2={x} y2={height - padding.bottom} stroke="currentColor" className="text-slate-400" strokeWidth="1" strokeDasharray="2 2" />
                )}
                <text x={x} y={height - padding.bottom + 16} textAnchor="middle" className={`text-[10px] font-mono ${isSelected ? 'fill-indigo-600 font-bold' : 'fill-slate-400'}`}>
                  {h.year}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
