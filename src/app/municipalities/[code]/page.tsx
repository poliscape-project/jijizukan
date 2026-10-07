import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Metadata } from 'next';
import { 
  Building2, Users, MapPin, Landmark, AlertTriangle, ArrowLeft, 
  ExternalLink, Coins, Scale, TrendingDown, TrendingUp, ShieldCheck,
  FileText, Briefcase
} from 'lucide-react';
import { getMunicipalityByCode, getSimilarMunicipalities, getAllMunicipalities } from '@/lib/municipalities';
import PieChartBreakdown from '@/components/municipality/PieChartBreakdown';
import TaxSimulator from '@/components/municipality/TaxSimulator';
import SimilarComparisonCard from '@/components/municipality/SimilarComparisonCard';
import DebtFundBalanceCard from '@/components/municipality/DebtFundBalanceCard';
import CouncilCostCard from '@/components/municipality/CouncilCostCard';

interface Props {
  params: Promise<{ code: string }>;
}

export async function generateStaticParams() {
  const all = getAllMunicipalities();
  // Generate static pages for sample notable municipalities or all
  // In Next.js SSG, returning a representative subset or all
  return all.slice(0, 100).map(m => ({ code: m.code }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { code } = await params;
  const m = getMunicipalityByCode(code);
  if (!m) return { title: '自治体が見つかりません | 時事図鑑' };

  return {
    title: `${m.name}（${m.prefName}）の財政カルテ・税金の使い道 | 全国自治体カルテ`,
    description: `${m.prefName}${m.name}の決算カード詳細データ。歳入・歳出の内訳、財政力指数（${m.financial.financialStrengthIndex.toFixed(2)}）、住民1人あたり土木費、首長・議員報酬、類似団体比較と税金使途シミュレーター。`
  };
}

export default async function MunicipalityDetailPage({ params }: Props) {
  const { code } = await params;
  const m = getMunicipalityByCode(code);

  if (!m) {
    notFound();
  }

  const similar = getSimilarMunicipalities(m.typeGroup, m.code, 4);

  // Revenues slice
  const revSlices = [
    { name: '地方税（自主財源）', value: m.revenues.localTax, color: '#3b82f6' },
    { name: '普通交付税', value: m.revenues.localAllocationTaxOrdinary, color: '#8b5cf6' },
    { name: '国庫支出金（国補助）', value: m.revenues.nationalSubsidy, color: '#ec4899' },
    { name: '地方債（借入金）', value: m.revenues.localBonds, color: '#f59e0b' },
    { name: '都道府県支出金', value: m.revenues.prefecturalSubsidy, color: '#10b981' },
    { name: '特別交付税', value: m.revenues.localAllocationTaxSpecial, color: '#6366f1' },
    { name: '地方消費税交付金', value: m.revenues.localConsumptionTax, color: '#06b6d4' },
    { name: '繰入・繰越金・その他', value: m.revenues.transfers + m.revenues.carriedOver + m.revenues.miscellaneous + m.revenues.other, color: '#94a3b8' }
  ].filter(s => s.value > 0);

  // Purpose Expenses slice
  const expPurposeSlices = [
    { name: '民生費（福祉・子育て）', value: m.expensesByPurpose.welfare, color: '#f43f5e' },
    { name: '総務費（庁舎・行政運営）', value: m.expensesByPurpose.generalAdmin, color: '#3b82f6' },
    { name: '公債費（借金返済）', value: m.expensesByPurpose.debtService, color: '#64748b' },
    { name: '土木費（道路・公園等）', value: m.expensesByPurpose.publicWorks, color: '#f59e0b' },
    { name: '衛生費（保健・清掃）', value: m.expensesByPurpose.healthSanitation, color: '#10b981' },
    { name: '教育費（学校・社会教育）', value: m.expensesByPurpose.education, color: '#6366f1' },
    { name: '消防費（消防・救急）', value: m.expensesByPurpose.fireFighting, color: '#ef4444' },
    { name: '農林水産業費', value: m.expensesByPurpose.agricultureForestry, color: '#84cc16' },
    { name: '商工費', value: m.expensesByPurpose.commerceIndustry, color: '#06b6d4' },
    { name: '議会費', value: m.expensesByPurpose.assembly, color: '#a855f7' },
    { name: '災害復旧・その他', value: m.expensesByPurpose.disasterRecovery + m.expensesByPurpose.labor + m.expensesByPurpose.other, color: '#cbd5e1' }
  ].filter(s => s.value > 0);

  // Nature Expenses slice
  const expNatureSlices = [
    { name: '人件費（職員給等）', value: m.expensesByNature.personnel, color: '#3b82f6' },
    { name: '扶助費（社会保障給付）', value: m.expensesByNature.socialAssistance, color: '#f43f5e' },
    { name: '公債費（元利償還）', value: m.expensesByNature.debtService, color: '#64748b' },
    { name: '物件費（委託料・需用費）', value: m.expensesByNature.supplies, color: '#10b981' },
    { name: '普通建設事業費（投資的経費）', value: m.expensesByNature.investmentOrdinary, color: '#f59e0b' },
    { name: '補助費等', value: m.expensesByNature.subsidies, color: '#8b5cf6' },
    { name: '繰出金（下水道・病院等）', value: m.expensesByNature.transfers, color: '#06b6d4' },
    { name: 'その他・維持補修', value: m.expensesByNature.maintenance + m.expensesByNature.disasterRecovery + m.expensesByNature.other, color: '#94a3b8' }
  ].filter(s => s.value > 0);

  const pop = m.population || 1;
  const pwPerCapita = Math.round((m.expensesByPurpose.publicWorks * 1000) / pop);

  const isYanaRelated = m.name.includes('那須烏山') || m.name.includes('那珂川町');

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* ナビゲーション・パンくず */}
      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
        <Link href="/" className="hover:text-indigo-600 dark:hover:text-indigo-400">トップ</Link>
        <span>/</span>
        <Link href="/municipalities" className="hover:text-indigo-600 dark:hover:text-indigo-400">全国自治体カルテ</Link>
        <span>/</span>
        <span>{m.prefName}</span>
        <span>/</span>
        <span className="font-bold text-slate-900 dark:text-white">{m.name}</span>
      </div>

      {/* 自治体ヘッダー */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
                {m.prefName}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                全国コード: {m.code}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                市町村類型: {m.typeGroup || '未区分'}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              {m.name} 財政カルテ
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              総務省「地方財政状況調査（決算カード）」普通会計決算最新確定値に基づく詳細分析
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 shrink-0">
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-center">
              <div className="text-[10px] text-slate-400 font-medium">住民基本台帳人口</div>
              <div className="text-lg font-black text-slate-900 dark:text-white">
                {m.population.toLocaleString()}<span className="text-xs font-normal text-slate-500">人</span>
              </div>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-center">
              <div className="text-[10px] text-slate-400 font-medium">総面積</div>
              <div className="text-lg font-black text-slate-900 dark:text-white">
                {m.area.toFixed(1)}<span className="text-xs font-normal text-slate-500">k㎡</span>
              </div>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-center col-span-2 sm:col-span-1">
              <div className="text-[10px] text-slate-400 font-medium">人口密度</div>
              <div className="text-lg font-black text-slate-900 dark:text-white">
                {m.popDensity.toLocaleString()}<span className="text-xs font-normal text-slate-500">人/k㎡</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 異常値・特異点アラート */}
      {m.alerts && m.alerts.length > 0 && (
        <div className="space-y-3">
          {m.alerts.map((alert, i) => (
            <div
              key={i}
              className={`p-5 rounded-2xl border flex items-start gap-4 ${
                alert.type === 'warning'
                  ? 'bg-amber-50/80 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900 text-amber-900 dark:text-amber-200'
                  : alert.type === 'caution'
                  ? 'bg-rose-50/80 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900 text-rose-900 dark:text-rose-200'
                  : 'bg-indigo-50/80 dark:bg-indigo-950/30 border-indigo-200 dark:border-indigo-900 text-indigo-900 dark:text-indigo-200'
              }`}
            >
              <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-bold text-sm mb-1">{alert.title}</h4>
                <p className="text-xs leading-relaxed opacity-90">{alert.description}</p>
                {isYanaRelated && (
                  <div className="mt-3">
                    <Link
                      href="/topics/yana-minister-road-budget-retaliation-controversy"
                      className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg bg-amber-600 text-white hover:bg-amber-700 transition"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      時事図鑑 特集記事「簗農水相の道路予算カット発言と報復的配分の実態」を読む →
                    </Link>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 主要財務健全化指標 */}
      <div>
        <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-3 flex items-center gap-2">
          <Scale className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          財務健全性・重要指標
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* 財政力指数 */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">財政力指数</div>
            <div className="text-3xl font-black text-slate-900 dark:text-white my-1">
              {m.financial.financialStrengthIndex.toFixed(2)}
            </div>
            <p className="text-[11px] text-slate-500">
              {m.financial.financialStrengthIndex >= 1.0 ? '地方交付税の不交付団体' : '1.0未満（国から地方交付税を受給）'}
            </p>
          </div>

          {/* 経常収支比率 */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">経常収支比率</div>
            <div className="text-3xl font-black text-slate-900 dark:text-white my-1">
              {m.financial.ordinaryBalanceRatio.toFixed(1)}<span className="text-sm font-normal text-slate-500">%</span>
            </div>
            <p className="text-[11px] text-slate-500">
              {m.financial.ordinaryBalanceRatio > 90 ? '硬直化傾向（自由度が低い）' : '適正水準（財政的弾力性あり）'}
            </p>
          </div>

          {/* 実質公債費比率 */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">実質公債費比率</div>
            <div className="text-3xl font-black text-slate-900 dark:text-white my-1">
              {m.financial.realDebtServiceRatio.toFixed(1)}<span className="text-sm font-normal text-slate-500">%</span>
            </div>
            <p className="text-[11px] text-slate-500">
              {m.financial.realDebtServiceRatio >= 18 ? '起債許可団体基準（要警戒）' : '早期健全化基準（25%）未満で健全'}
            </p>
          </div>

          {/* 1人あたり土木費 */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">住民1人あたり土木費</div>
            <div className="text-3xl font-black text-slate-900 dark:text-white my-1">
              {pwPerCapita.toLocaleString()}<span className="text-sm font-normal text-slate-500">円</span>
            </div>
            <p className="text-[11px] text-slate-500">
              道路・河川・インフラ維持整備等への支出
            </p>
          </div>
        </div>
      </div>

      {/* 街の貯金 vs 借金バランス（実質純資産） */}
      <DebtFundBalanceCard municipality={m} />

      {/* 歳入・歳出の内訳グラフ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PieChartBreakdown
          title="歳入の内訳（どこからお金が入ったか）"
          subtitle={`歳入総額: ${(m.revenues.total / 1000).toLocaleString()} 百万円（うち自主財源・地方税比率: ${((m.revenues.localTax / (m.revenues.total || 1)) * 100).toFixed(1)}%）`}
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

      {/* 性質別歳出 & 議会・公務員・首長情報 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 性質別歳出 */}
        <div className="lg:col-span-2">
          <PieChartBreakdown
            title="性質別歳出の内訳（義務的経費と投資的経費）"
            subtitle="人件費・扶助費・公債費等の固定負担と、普通建設事業費のバランス"
            data={expNatureSlices}
          />
        </div>

        {/* 統治・首長・議会情報 */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <h4 className="font-bold text-base text-slate-900 dark:text-white mb-1 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              首長・議会・職員体制
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              決算カード記載のガバナンス指標
            </p>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <span className="text-xs text-slate-600 dark:text-slate-400">市区町村長 給料月額</span>
                <span className="font-bold text-sm text-slate-900 dark:text-white">
                  {m.governance.mayorSalary > 0 ? `${m.governance.mayorSalary.toLocaleString()}円` : '非公開・未集計'}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <span className="text-xs text-slate-600 dark:text-slate-400">市町村議会 議員定数</span>
                <span className="font-bold text-sm text-slate-900 dark:text-white">
                  {m.governance.councilMembersCount > 0 ? `${m.governance.councilMembersCount}名` : '未集計'}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <span className="text-xs text-slate-600 dark:text-slate-400">議員1人あたり 報酬月額</span>
                <span className="font-bold text-sm text-slate-900 dark:text-white">
                  {m.governance.councilSalary > 0 ? `${m.governance.councilSalary.toLocaleString()}円` : '未集計'}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <span className="text-xs text-slate-600 dark:text-slate-400">一般職員数（行政職）</span>
                <span className="font-bold text-sm text-slate-900 dark:text-white">
                  {m.governance.staffCount > 0 ? `${m.governance.staffCount}名` : '未集計'}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <span className="text-xs text-slate-600 dark:text-slate-400">ラスパイレス指数（給与水準）</span>
                <span className="font-bold text-sm text-slate-900 dark:text-white">
                  {m.financial.laspeyresIndex > 0 ? m.financial.laspeyresIndex.toFixed(1) : '未集計'}（国＝100）
                </span>
              </div>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 dark:text-slate-500 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
            ※ 給与額は基本月額であり、諸手当・賞与等は含まれません。
          </div>
        </div>
      </div>

      {/* 市町村議会コスト & 住民負担（議会通信簿） */}
      <CouncilCostCard municipality={m} />

      {/* 類似自治体とのベンチマーク比較 */}
      <SimilarComparisonCard municipality={m} similarMunicipalities={similar} />

      {/* フッターナビゲーション */}
      <div className="flex items-center justify-between pt-6 border-t border-slate-200 dark:border-slate-800 text-sm">
        <Link
          href="/municipalities"
          className="inline-flex items-center gap-1.5 font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          全国自治体カルテ一覧に戻る
        </Link>
        <div className="text-xs text-slate-400">
          データ出典: 総務省 地方財政状況調査（決算カード）
        </div>
      </div>
    </div>
  );
}
