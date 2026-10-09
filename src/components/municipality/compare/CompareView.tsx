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
import PieChartBreakdown from '@/components/municipality/PieChartBreakdown';

interface Props {
  muniA: MunicipalityData;
  muniB: MunicipalityData;
  historyA: MunicipalityYearlyHistory[];
  historyB: MunicipalityYearlyHistory[];
  summaries: MunicipalitySummary[];
}

// 注目のおすすめ比較プリセット
const PRESET_MATCHUPS = [
  {
    title: '🏛️ 財政指標上位村 ＆ 財政再生団体',
    desc: '臨海工業地域の村と財政再建に取り組む町の構造比較',
    codeA: '234273', // 愛知県飛島村
    codeB: '012092', // 北海道夕張市
  },
  {
    title: '🏙️ 都心特別区 ＆ 最大政令市',
    desc: '都心特別区と広域大都市（政令市）の行政規模・税構造比較',
    codeA: '131016', // 東京都千代田区
    codeB: '141003', // 神奈川県横浜市
  },
  {
    title: '🎁 ふるさと納税 流入超過自治体 ＆ 流出超過区',
    desc: '全国屈指の寄附受入自治体と住民税控除影響の大きい特別区',
    codeA: '452017', // 宮崎県都城市
    codeB: '131121', // 東京都世田谷区
  },
  {
    title: '🏭 半導体集積の町 ＆ 県庁所在地',
    desc: '大型外資誘致で急成長する工業集積地と地方中核都市',
    codeA: '434043', // 熊本県菊陽町
    codeB: '431001', // 熊本県熊本市
  },
];

export default function CompareView({ muniA, muniB, historyA, historyB, summaries }: Props) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'debtReserve' | 'furusato' | 'population'>('debtReserve');
  const [pieCompareTab, setPieCompareTab] = useState<'revenues' | 'expensesPurpose' | 'expensesNature'>('revenues');
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

  // 構成比（円グラフ）比較用スライス
  const revSlicesA = useMemo(() => [
    { name: '地方税（自主財源）', value: muniA.revenues.localTax, color: '#3b82f6' },
    { name: '普通交付税', value: muniA.revenues.localAllocationTaxOrdinary, color: '#8b5cf6' },
    { name: '国庫支出金（国補助）', value: muniA.revenues.nationalSubsidy, color: '#ec4899' },
    { name: '地方債（借入金）', value: muniA.revenues.localBonds, color: '#f59e0b' },
    { name: '都道府県支出金', value: muniA.revenues.prefecturalSubsidy, color: '#10b981' },
    { name: '特別交付税', value: muniA.revenues.localAllocationTaxSpecial, color: '#6366f1' },
    { name: '地方消費税交付金', value: muniA.revenues.localConsumptionTax, color: '#06b6d4' },
    { name: '繰入・繰越金・その他', value: muniA.revenues.transfers + muniA.revenues.carriedOver + muniA.revenues.miscellaneous + muniA.revenues.other, color: '#94a3b8' }
  ].filter(s => s.value > 0), [muniA]);

  const revSlicesB = useMemo(() => [
    { name: '地方税（自主財源）', value: muniB.revenues.localTax, color: '#3b82f6' },
    { name: '普通交付税', value: muniB.revenues.localAllocationTaxOrdinary, color: '#8b5cf6' },
    { name: '国庫支出金（国補助）', value: muniB.revenues.nationalSubsidy, color: '#ec4899' },
    { name: '地方債（借入金）', value: muniB.revenues.localBonds, color: '#f59e0b' },
    { name: '都道府県支出金', value: muniB.revenues.prefecturalSubsidy, color: '#10b981' },
    { name: '特別交付税', value: muniB.revenues.localAllocationTaxSpecial, color: '#6366f1' },
    { name: '地方消費税交付金', value: muniB.revenues.localConsumptionTax, color: '#06b6d4' },
    { name: '繰入・繰越金・その他', value: muniB.revenues.transfers + muniB.revenues.carriedOver + muniB.revenues.miscellaneous + muniB.revenues.other, color: '#94a3b8' }
  ].filter(s => s.value > 0), [muniB]);

  const expPurposeSlicesA = useMemo(() => [
    { name: '民生費（福祉・子育て）', value: muniA.expensesByPurpose.welfare, color: '#f43f5e' },
    { name: '総務費（庁舎・行政運営）', value: muniA.expensesByPurpose.generalAdmin, color: '#3b82f6' },
    { name: '公債費（地方債償還）', value: muniA.expensesByPurpose.debtService, color: '#64748b' },
    { name: '土木費（道路・公園等）', value: muniA.expensesByPurpose.publicWorks, color: '#f59e0b' },
    { name: '衛生費（保健・清掃）', value: muniA.expensesByPurpose.healthSanitation, color: '#10b981' },
    { name: '教育費（学校・社会教育）', value: muniA.expensesByPurpose.education, color: '#6366f1' },
    { name: '消防費（消防・救急）', value: muniA.expensesByPurpose.fireFighting, color: '#ef4444' },
    { name: '農林水産業費', value: muniA.expensesByPurpose.agricultureForestry, color: '#84cc16' },
    { name: '商工費', value: muniA.expensesByPurpose.commerceIndustry, color: '#06b6d4' },
    { name: '議会費', value: muniA.expensesByPurpose.assembly, color: '#a855f7' },
    { name: '災害復旧・その他', value: muniA.expensesByPurpose.disasterRecovery + muniA.expensesByPurpose.labor + muniA.expensesByPurpose.other, color: '#cbd5e1' }
  ].filter(s => s.value > 0), [muniA]);

  const expPurposeSlicesB = useMemo(() => [
    { name: '民生費（福祉・子育て）', value: muniB.expensesByPurpose.welfare, color: '#f43f5e' },
    { name: '総務費（庁舎・行政運営）', value: muniB.expensesByPurpose.generalAdmin, color: '#3b82f6' },
    { name: '公債費（地方債償還）', value: muniB.expensesByPurpose.debtService, color: '#64748b' },
    { name: '土木費（道路・公園等）', value: muniB.expensesByPurpose.publicWorks, color: '#f59e0b' },
    { name: '衛生費（保健・清掃）', value: muniB.expensesByPurpose.healthSanitation, color: '#10b981' },
    { name: '教育費（学校・社会教育）', value: muniB.expensesByPurpose.education, color: '#6366f1' },
    { name: '消防費（消防・救急）', value: muniB.expensesByPurpose.fireFighting, color: '#ef4444' },
    { name: '農林水産業費', value: muniB.expensesByPurpose.agricultureForestry, color: '#84cc16' },
    { name: '商工費', value: muniB.expensesByPurpose.commerceIndustry, color: '#06b6d4' },
    { name: '議会費', value: muniB.expensesByPurpose.assembly, color: '#a855f7' },
    { name: '災害復旧・その他', value: muniB.expensesByPurpose.disasterRecovery + muniB.expensesByPurpose.labor + muniB.expensesByPurpose.other, color: '#cbd5e1' }
  ].filter(s => s.value > 0), [muniB]);

  const expNatureSlicesA = useMemo(() => [
    { name: '人件費（職員給等）', value: muniA.expensesByNature.personnel, color: '#3b82f6' },
    { name: '扶助費（社会保障給付）', value: muniA.expensesByNature.socialAssistance, color: '#f43f5e' },
    { name: '公債費（元利償還）', value: muniA.expensesByNature.debtService, color: '#64748b' },
    { name: '物件費（委託料・需用費）', value: muniA.expensesByNature.supplies, color: '#10b981' },
    { name: '普通建設事業費（投資的経費）', value: muniA.expensesByNature.investmentOrdinary, color: '#f59e0b' },
    { name: '補助費等', value: muniA.expensesByNature.subsidies, color: '#8b5cf6' },
    { name: '繰出金（下水道・病院等）', value: muniA.expensesByNature.transfers, color: '#06b6d4' },
    { name: 'その他・維持補修', value: muniA.expensesByNature.maintenance + muniA.expensesByNature.disasterRecovery + muniA.expensesByNature.other, color: '#94a3b8' }
  ].filter(s => s.value > 0), [muniA]);

  const expNatureSlicesB = useMemo(() => [
    { name: '人件費（職員給等）', value: muniB.expensesByNature.personnel, color: '#3b82f6' },
    { name: '扶助費（社会保障給付）', value: muniB.expensesByNature.socialAssistance, color: '#f43f5e' },
    { name: '公債費（元利償還）', value: muniB.expensesByNature.debtService, color: '#64748b' },
    { name: '物件費（委託料・需用費）', value: muniB.expensesByNature.supplies, color: '#10b981' },
    { name: '普通建設事業費（投資的経費）', value: muniB.expensesByNature.investmentOrdinary, color: '#f59e0b' },
    { name: '補助費等', value: muniB.expensesByNature.subsidies, color: '#8b5cf6' },
    { name: '繰出金（下水道・病院等）', value: muniB.expensesByNature.transfers, color: '#06b6d4' },
    { name: 'その他・維持補修', value: muniB.expensesByNature.maintenance + muniB.expensesByNature.disasterRecovery + muniB.expensesByNature.other, color: '#94a3b8' }
  ].filter(s => s.value > 0), [muniB]);

  // 歳入主要比率
  const revTotalA = muniA.revenues.total || 1;
  const revTotalB = muniB.revenues.total || 1;
  const taxShareA = (muniA.revenues.localTax / revTotalA) * 100;
  const taxShareB = (muniB.revenues.localTax / revTotalB) * 100;
  const allocShareA = (muniA.revenues.localAllocationTaxOrdinary / revTotalA) * 100;
  const allocShareB = (muniB.revenues.localAllocationTaxOrdinary / revTotalB) * 100;
  const bondShareA = (muniA.revenues.localBonds / revTotalA) * 100;
  const bondShareB = (muniB.revenues.localBonds / revTotalB) * 100;

  // 目的別歳出主要比率
  const expPurpTotalA = muniA.expensesByPurpose.total || 1;
  const expPurpTotalB = muniB.expensesByPurpose.total || 1;
  const welfareShareA = (muniA.expensesByPurpose.welfare / expPurpTotalA) * 100;
  const welfareShareB = (muniB.expensesByPurpose.welfare / expPurpTotalB) * 100;
  const pwShareA = (muniA.expensesByPurpose.publicWorks / expPurpTotalA) * 100;
  const pwShareB = (muniB.expensesByPurpose.publicWorks / expPurpTotalB) * 100;
  const eduShareA = (muniA.expensesByPurpose.education / expPurpTotalA) * 100;
  const eduShareB = (muniB.expensesByPurpose.education / expPurpTotalB) * 100;

  // 性質別歳出主要比率
  const expNatTotalA = muniA.expensesByPurpose.total || 1;
  const expNatTotalB = muniB.expensesByPurpose.total || 1;
  const mandatoryShareA = ((muniA.expensesByNature.personnel + muniA.expensesByNature.socialAssistance + muniA.expensesByNature.debtService) / expNatTotalA) * 100;
  const mandatoryShareB = ((muniB.expensesByNature.personnel + muniB.expensesByNature.socialAssistance + muniB.expensesByNature.debtService) / expNatTotalB) * 100;
  const investShareA = (muniA.expensesByNature.investmentOrdinary / expNatTotalA) * 100;
  const investShareB = (muniB.expensesByNature.investmentOrdinary / expNatTotalB) * 100;

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

      {/* おすすめ比較プリセットピル */}
      <div className="space-y-2">
        <div className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
          <span>注目のテーマ別比較</span>
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
                  <span>比較を見る</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2自治体 比較カード */}
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

          {/* 中央の比較バッジ */}
          <div className="md:col-span-1 flex flex-col items-center justify-center py-2 md:py-0">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-rose-500 flex items-center justify-center text-white shadow-lg border-2 border-slate-900" title="2自治体を比較">
              <Scale className="w-5 h-5 text-white" />
            </div>
            <span className="text-[10px] text-slate-400 font-bold mt-1 tracking-wider">比較</span>
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

      {/* 同一自治体選択時のアラート */}
      {muniA.code === muniB.code && (
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-amber-800 dark:text-amber-200 shadow-2xs">
          <div className="flex items-center gap-2.5 text-xs">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>現在、左右に同じ自治体（<strong>{muniA.name}</strong>）が選択されています。どちらかの自治体を変更すると2自治体での比較が行えます。</span>
          </div>
          <button
            onClick={() => setSelectingSide('B')}
            className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition shrink-0 cursor-pointer shadow-2xs"
          >
            自治体Bを変更
          </button>
        </div>
      )}

      {/* セクション1: 基本スペック横並び比較テーブル */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
        <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
          <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <Scale className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            主要スペック・財政健全度 横並び比較
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            規模・財政力・予算の柔軟性を指標ごとに客観的に対比
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
                </td>
                <td className="py-3 px-3 text-center text-slate-500">人口規模</td>
                <td className="py-3 px-3 text-right">
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
                </td>
                <td className="py-3 px-3 text-center text-slate-700 dark:text-slate-300 font-bold">
                  財政力指数
                  <span className="block text-[10px] text-slate-400 font-normal">1.0以上で不交付団体</span>
                </td>
                <td className="py-3 px-3 text-right">
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
                </td>
                <td className="py-3 px-3 text-center text-slate-500">
                  経常収支比率
                  <span className="block text-[10px] text-slate-400 font-normal">低いほど使途に余裕あり</span>
                </td>
                <td className="py-3 px-3 text-right">
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
                </td>
                <td className="py-3 px-3 text-center text-slate-500">
                  実質公債費比率
                  <span className="block text-[10px] text-slate-400 font-normal">18%以上で起債許可制</span>
                </td>
                <td className="py-3 px-3 text-right">
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

      {/* セクション2: 予算の配分構成比 徹底比較（規模を超えた構造比較） */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-semibold mb-1.5 border border-indigo-200/50">
              <PieChart className="w-3.5 h-3.5" />
              100%規格化・構成比（％）比較
            </div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white">
              予算の配分構成比 左右並列比較
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              総額規模が大きく異なる自治体同士でも、比率（％）を見ることで「稼ぎ方の自立度」や「お金の使われ方」の本質的な性格差が浮き彫りになります
            </p>
          </div>

          {/* タブ切り替えボタン */}
          <div className="inline-flex p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shrink-0 self-start sm:self-auto">
            <button
              onClick={() => setPieCompareTab('revenues')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                pieCompareTab === 'revenues'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              歳入（財源構成）
            </button>
            <button
              onClick={() => setPieCompareTab('expensesPurpose')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                pieCompareTab === 'expensesPurpose'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              目的別歳出（使い道）
            </button>
            <button
              onClick={() => setPieCompareTab('expensesNature')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                pieCompareTab === 'expensesNature'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              性質別歳出（固定費vs投資）
            </button>
          </div>
        </div>

        {/* 主要比率の左右対比ミニカード群 */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {pieCompareTab === 'revenues' && (
            <>
              <RatioComparisonCard
                label="自主財源比率（地方税シェア）"
                desc="自前の税収で賄える割合（高いほど自立）"
                valA={taxShareA}
                valB={taxShareB}
                nameA={muniA.name}
                nameB={muniB.name}
              />
              <RatioComparisonCard
                label="普通交付税 依存度"
                desc="国からの財政保障への依存度（0%なら不交付）"
                valA={allocShareA}
                valB={allocShareB}
                nameA={muniA.name}
                nameB={muniB.name}
              />
              <RatioComparisonCard
                label="地方債（借金）依存度"
                desc="歳入総額に占める新規借入金の割合"
                valA={bondShareA}
                valB={bondShareB}
                nameA={muniA.name}
                nameB={muniB.name}
              />
            </>
          )}
          {pieCompareTab === 'expensesPurpose' && (
            <>
              <RatioComparisonCard
                label="民生費（福祉・子育て）シェア"
                desc="高齢者福祉・生活保護・子育て支援の割合"
                valA={welfareShareA}
                valB={welfareShareB}
                nameA={muniA.name}
                nameB={muniB.name}
              />
              <RatioComparisonCard
                label="土木費（道路・都市基盤）シェア"
                desc="道路整備・公園・都市開発への投資割合"
                valA={pwShareA}
                valB={pwShareB}
                nameA={muniA.name}
                nameB={muniB.name}
              />
              <RatioComparisonCard
                label="教育費（学校教育・文化）シェア"
                desc="小中学校教育・生涯学習への投資割合"
                valA={eduShareA}
                valB={eduShareB}
                nameA={muniA.name}
                nameB={muniB.name}
              />
            </>
          )}
          {pieCompareTab === 'expensesNature' && (
            <>
              <RatioComparisonCard
                label="義務的経費比率（固定費の重さ）"
                desc="人件費＋扶助費＋公債費（削減困難な必須支出）"
                valA={mandatoryShareA}
                valB={mandatoryShareB}
                nameA={muniA.name}
                nameB={muniB.name}
              />
              <RatioComparisonCard
                label="普通建設事業費（投資的経費）"
                desc="公共施設新設やインフラ更新等の先行投資"
                valA={investShareA}
                valB={investShareB}
                nameA={muniA.name}
                nameB={muniB.name}
              />
              <RatioComparisonCard
                label="公債費（借金返済元利）比率"
                desc="過去の借金返済に消える予算の割合"
                valA={(muniA.expensesByNature.debtService / expNatTotalA) * 100}
                valB={(muniB.expensesByNature.debtService / expNatTotalB) * 100}
                nameA={muniA.name}
                nameB={muniB.name}
              />
            </>
          )}
        </div>

        {/* 左右並列円グラフ比較 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
          {/* 自治体A */}
          <div className="rounded-2xl border-2 border-indigo-200/80 dark:border-indigo-900/60 overflow-hidden bg-white dark:bg-slate-900 p-4 shadow-2xs">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-indigo-100 dark:border-indigo-900/40">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-indigo-600 shrink-0" />
                <h4 className="font-black text-sm text-slate-900 dark:text-white">
                  {muniA.name}
                </h4>
                <span className="text-[11px] text-slate-400">({muniA.prefName})</span>
              </div>
              <div className="text-right text-[11px] text-slate-500">
                {pieCompareTab === 'revenues' && `歳入総額: ${(muniA.revenues.total / 100000).toFixed(1)}億円`}
                {pieCompareTab === 'expensesPurpose' && `歳出総額: ${(muniA.expensesByPurpose.total / 100000).toFixed(1)}億円`}
                {pieCompareTab === 'expensesNature' && `歳出総額: ${(muniA.expensesByPurpose.total / 100000).toFixed(1)}億円`}
              </div>
            </div>
            <PieChartBreakdown
              title={
                pieCompareTab === 'revenues'
                  ? `${muniA.name} 歳入の内訳`
                  : pieCompareTab === 'expensesPurpose'
                  ? `${muniA.name} 目的別歳出`
                  : `${muniA.name} 性質別歳出`
              }
              subtitle={
                pieCompareTab === 'revenues'
                  ? `自主財源比率: ${taxShareA.toFixed(1)}%`
                  : pieCompareTab === 'expensesPurpose'
                  ? `民生費比率: ${welfareShareA.toFixed(1)}% / 土木費比率: ${pwShareA.toFixed(1)}%`
                  : `義務的経費: ${mandatoryShareA.toFixed(1)}%`
              }
              data={
                pieCompareTab === 'revenues'
                  ? revSlicesA
                  : pieCompareTab === 'expensesPurpose'
                  ? expPurposeSlicesA
                  : expNatureSlicesA
              }
            />
          </div>

          {/* 自治体B */}
          <div className="rounded-2xl border-2 border-rose-200/80 dark:border-rose-900/60 overflow-hidden bg-white dark:bg-slate-900 p-4 shadow-2xs">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-rose-100 dark:border-rose-900/40">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-600 shrink-0" />
                <h4 className="font-black text-sm text-slate-900 dark:text-white">
                  {muniB.name}
                </h4>
                <span className="text-[11px] text-slate-400">({muniB.prefName})</span>
              </div>
              <div className="text-right text-[11px] text-slate-500">
                {pieCompareTab === 'revenues' && `歳入総額: ${(muniB.revenues.total / 100000).toFixed(1)}億円`}
                {pieCompareTab === 'expensesPurpose' && `歳出総額: ${(muniB.expensesByPurpose.total / 100000).toFixed(1)}億円`}
                {pieCompareTab === 'expensesNature' && `歳出総額: ${(muniB.expensesByPurpose.total / 100000).toFixed(1)}億円`}
              </div>
            </div>
            <PieChartBreakdown
              title={
                pieCompareTab === 'revenues'
                  ? `${muniB.name} 歳入の内訳`
                  : pieCompareTab === 'expensesPurpose'
                  ? `${muniB.name} 目的別歳出`
                  : `${muniB.name} 性質別歳出`
              }
              subtitle={
                pieCompareTab === 'revenues'
                  ? `自主財源比率: ${taxShareB.toFixed(1)}%`
                  : pieCompareTab === 'expensesPurpose'
                  ? `民生費比率: ${welfareShareB.toFixed(1)}% / 土木費比率: ${pwShareB.toFixed(1)}%`
                  : `義務的経費: ${mandatoryShareB.toFixed(1)}%`
              }
              data={
                pieCompareTab === 'revenues'
                  ? revSlicesB
                  : pieCompareTab === 'expensesPurpose'
                  ? expPurposeSlicesB
                  : expNatureSlicesB
              }
            />
          </div>
        </div>
      </div>

      {/* セクション3: 住民1人あたり指標のバーメーター比較 */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-6">
        <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
          <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <Coins className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            住民1人あたり負担・使い道の比較
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            規模の異なる自治体でも人口で割ることで「住民目線のリアルな行政サービス水準」を比較
          </p>
        </div>

        <div className="space-y-6">
          {/* 1. 住民1人あたり土木費 */}
          <CompareBarMeter
            label="住民1人あたり土木費（道路・インフラ投資）"
            desc="過疎地や新興開発地での道路・インフラ投資水準"
            valA={pwA}
            valB={pwB}
            unit="円/人"
            nameA={muniA.name}
            nameB={muniB.name}
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
            allowNegative
          />

          {/* 3. ふるさと納税 住民1人あたり純収支 */}
          <CompareBarMeter
            label="ふるさと納税 1人あたり収支（受入 － 流出）"
            desc="全国からの寄附金受入額と住民税控除流出額の差引収支"
            valA={furuA}
            valB={furuB}
            unit="円/人"
            nameA={muniA.name}
            nameB={muniB.name}
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

      {/* セクション4: 直近10年間（2014〜2023年度）の変遷重ね合わせグラフ */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-semibold mb-1.5 border border-indigo-200/50">
              <Calendar className="w-3.5 h-3.5" />
              直近10年間の時系列推移（2014〜2023年度）
            </div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white">
              {muniA.name}（青） と {muniB.name}（赤）の10年推移
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              過去10年の財政健全化や人口動態の軌跡を同一軸で比較
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
// サブコンポーネント: バーメーター比較 (CompareBarMeter)
// -------------------------------------------------------------
function CompareBarMeter({
  label,
  desc,
  valA,
  valB,
  unit,
  nameA,
  nameB,
  allowNegative = false
}: {
  label: string;
  desc: string;
  valA: number;
  valB: number;
  unit: string;
  nameA: string;
  nameB: string;
  allowNegative?: boolean;
}) {
  const maxAbs = Math.max(Math.abs(valA), Math.abs(valB), 1);
  const pctA = Math.min(100, (Math.abs(valA) / maxAbs) * 100);
  const pctB = Math.min(100, (Math.abs(valB) / maxAbs) * 100);

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
  const getX = (idx: number) => Math.round((padding.left + (idx / (count - 1)) * graphWidth) * 10) / 10;
  const getY = (val: number) => Math.round((padding.top + graphHeight - (val / ceiling) * graphHeight) * 10) / 10;

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
  const getX = (idx: number) => Math.round((padding.left + (idx / (count - 1)) * graphWidth) * 10) / 10;
  // ゼロラインは中央
  const zeroY = padding.top + graphHeight / 2;
  const getY = (val: number) => Math.round((zeroY - (val / ceiling) * (graphHeight / 2)) * 10) / 10;

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
  const getX = (idx: number) => Math.round((padding.left + (idx / (count - 1)) * graphWidth) * 10) / 10;
  const maxAging = 60; // 60%天井
  const getY = (val: number) => Math.round((padding.top + graphHeight - (val / maxAging) * graphHeight) * 10) / 10;

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

// -------------------------------------------------------------
// サブコンポーネント: 構成比率（％）左右対比ミニカード
// -------------------------------------------------------------
function RatioComparisonCard({
  label,
  desc,
  valA,
  valB,
  nameA,
  nameB,
}: {
  label: string;
  desc?: string;
  valA: number;
  valB: number;
  nameA: string;
  nameB: string;
}) {
  const diffA = valA - valB;
  const sum = valA + valB;
  const pctA = sum > 0 ? (valA / sum) * 100 : 50;
  const pctB = sum > 0 ? (valB / sum) * 100 : 50;

  return (
    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 space-y-1.5 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="font-black text-indigo-600 dark:text-indigo-400 text-sm">
            {valA.toFixed(1)}%
          </span>
          <span className="font-bold text-slate-800 dark:text-slate-200 text-center px-1 text-xs">
            {label}
          </span>
          <span className="font-black text-rose-600 dark:text-rose-400 text-sm">
            {valB.toFixed(1)}%
          </span>
        </div>

        <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden flex">
          <div
            style={{ width: `${pctA}%` }}
            className="h-full bg-indigo-500 transition-all duration-300"
            title={`${nameA}: ${valA.toFixed(1)}%`}
          />
          <div
            style={{ width: `${pctB}%` }}
            className="h-full bg-rose-500 transition-all duration-300"
            title={`${nameB}: ${valB.toFixed(1)}%`}
          />
        </div>
      </div>

      <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 pt-1">
        <span className={diffA > 0 ? 'text-indigo-600 dark:text-indigo-400 font-bold' : 'text-slate-400'}>
          {diffA > 0 ? `+${diffA.toFixed(1)}pt` : ''}
        </span>
        {desc && (
          <span className="text-[10px] text-slate-400 dark:text-slate-500 truncate max-w-[170px] text-center" title={desc}>
            {desc}
          </span>
        )}
        <span className={diffA < 0 ? 'text-rose-600 dark:text-rose-400 font-bold' : 'text-slate-400'}>
          {diffA < 0 ? `+${Math.abs(diffA).toFixed(1)}pt` : ''}
        </span>
      </div>
    </div>
  );
}
