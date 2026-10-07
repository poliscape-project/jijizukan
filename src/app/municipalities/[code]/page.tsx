import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Metadata } from 'next';
import { 
  Building2, Users, MapPin, Landmark, AlertTriangle, ArrowLeft, 
  ExternalLink, Coins, Scale, TrendingDown, TrendingUp, ShieldCheck,
  FileText, Briefcase, PiggyBank, Gift, Newspaper, ArrowRight
} from 'lucide-react';
import { getMunicipalityByCode, getSimilarMunicipalities, getAllMunicipalities } from '@/lib/municipalities';
import { getTopicsByMunicipality } from '@/lib/topics';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import MunicipalityDetailTabs from '@/components/municipality/MunicipalityDetailTabs';

interface Props {
  params: Promise<{ code: string }>;
}

export async function generateStaticParams() {
  const all = getAllMunicipalities();
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
    { name: '公債費（地方債償還）', value: m.expensesByPurpose.debtService, color: '#64748b' },
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

  // 純資産（貯金超過）
  const reserveTotal = m.financial.reserveFundTotal * 1000;
  const debtTotal = m.financial.debtOutstanding * 1000;
  const netPerCapita = Math.round((reserveTotal - debtTotal) / pop);

  const isYanaRelated = m.name.includes('那須烏山') || m.name.includes('那珂川町');
  const relatedTopics = getTopicsByMunicipality(m.code, m.name);

  return (
    <>
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-8 space-y-6">
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

        {/* 自治体ヘッダー（端正でスッキリしたデザイン） */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                  {m.prefName}
                </span>
                <span className="px-2 py-0.5 rounded text-[11px] font-medium text-slate-500 bg-slate-50 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60">
                  コード: {m.code}
                </span>
                <span className="px-2 py-0.5 rounded text-[11px] font-medium text-slate-500 bg-slate-50 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60">
                  類型: {m.typeGroup || '未区分'}
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                {m.name} 財政カルテ
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                総務省「地方財政状況調査（決算カード）」確定値に基づく詳細カルテ
              </p>
            </div>

            {/* 重要基本統計（人口・面積・密度） */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <div className="px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-center">
                <div className="text-[10px] text-slate-400 font-medium">住基人口</div>
                <div className="text-base font-bold text-slate-900 dark:text-white">
                  {m.population.toLocaleString()}<span className="text-[11px] font-normal text-slate-500">人</span>
                </div>
              </div>
              <div className="px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-center">
                <div className="text-[10px] text-slate-400 font-medium">総面積</div>
                <div className="text-base font-bold text-slate-900 dark:text-white">
                  {m.area.toFixed(1)}<span className="text-[11px] font-normal text-slate-500">k㎡</span>
                </div>
              </div>
              <div className="px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-center">
                <div className="text-[10px] text-slate-400 font-medium">人口密度</div>
                <div className="text-base font-bold text-slate-900 dark:text-white">
                  {m.popDensity.toLocaleString()}<span className="text-[10px] font-normal text-slate-500">人/k㎡</span>
                </div>
              </div>
            </div>
          </div>

          {/* 3大ハイライトサマリー（パッと見でわかる主要指標） */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40">
              <span className="text-slate-500 flex items-center gap-1.5">
                <Coins className="w-3.5 h-3.5 text-slate-400" />
                財政力指数:
              </span>
              <span className="font-bold text-slate-900 dark:text-white">
                {m.financial.financialStrengthIndex.toFixed(2)}
                <span className="font-normal text-[10px] text-slate-400 ml-1">
                  ({m.financial.financialStrengthIndex >= 1.0 ? '不交付' : '交付受給'})
                </span>
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40">
              <span className="text-slate-500 flex items-center gap-1.5">
                <PiggyBank className="w-3.5 h-3.5 text-slate-400" />
                1人あたり純資産:
              </span>
              <span className={`font-bold ${netPerCapita >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                {netPerCapita >= 0 ? `+${(Math.round(netPerCapita / 10000)).toLocaleString()}万円 (基金超過)` : `${(Math.round(netPerCapita / 10000)).toLocaleString()}万円 (地方債超過)`}
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40">
              <span className="text-slate-500 flex items-center gap-1.5">
                <Gift className="w-3.5 h-3.5 text-slate-400" />
                ふるさと納税収支:
              </span>
              <span className={`font-bold ${((m.furusato?.balance || 0) >= 0) ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                {m.furusato ? (
                  `${((m.furusato.balance || 0) >= 0) ? '+' : ''}${((m.furusato.balance || 0) / 1e8).toFixed(1)}億円`
                ) : '集計中'}
              </span>
            </div>
          </div>
        </div>

        {/* 異常値・特異点アラート（ある場合のみ表示） */}
        {m.alerts && m.alerts.length > 0 && (
          <div className="space-y-2">
            {m.alerts.map((alert, i) => (
              <div
                key={i}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-start gap-3 text-xs"
              >
                <AlertTriangle className="w-4 h-4 shrink-0 text-amber-500 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-bold text-slate-900 dark:text-white mb-0.5">{alert.title}</h4>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{alert.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* この自治体に関連する時事トピック（動的連動） */}
        {relatedTopics.length > 0 && (
          <div className="bg-slate-50 dark:bg-slate-900/60 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Newspaper className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                この自治体に関連する時事・国政トピック
              </h3>
              <span className="text-[11px] text-slate-500">
                {relatedTopics.length}件の特集記事
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {relatedTopics.map((topic) => (
                <Link
                  key={topic.id}
                  href={`/topics/${topic.id}`}
                  className="group p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 hover:shadow-xs transition flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
                        {topic.categoryLabel}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {topic.statusLabel}
                      </span>
                    </div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-indigo-600 transition line-clamp-1">
                      {topic.title}
                    </h4>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                      {topic.subtitle}
                    </p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs font-semibold text-indigo-600 dark:text-indigo-400 flex items-center justify-between">
                    <span>解説記事を読む</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition transform" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* 3大タブコンポーネント（財政 / 人口・産業 / ふるさと・議会） */}
        <MunicipalityDetailTabs
          municipality={m}
          similar={similar}
          revSlices={revSlices}
          expPurposeSlices={expPurposeSlices}
          expNatureSlices={expNatureSlices}
          pwPerCapita={pwPerCapita}
        />
      </main>
      <Footer />
    </>
  );
}
