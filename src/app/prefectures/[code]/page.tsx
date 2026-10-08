import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Metadata } from 'next';
import { 
  Building2, Users, MapPin, Landmark, AlertTriangle, ArrowLeft, 
  Coins, Scale, TrendingDown, TrendingUp, ShieldCheck,
  FileText, Briefcase, PiggyBank, Newspaper, ArrowRight, Shield, Award
} from 'lucide-react';
import { getAllPrefectures, getPrefectureByCode } from '@/lib/prefectures';
import { getAllMunicipalities } from '@/lib/municipalities';
import { getTopicsByMunicipality } from '@/lib/topics';
import PieChartBreakdown from '@/components/municipality/PieChartBreakdown';
import MunicipalityFooter from '@/components/municipality/MunicipalityFooter';

interface Props {
  params: Promise<{ code: string }>;
}

export const dynamicParams = false;

export async function generateStaticParams() {
  const all = getAllPrefectures();
  return all.map(p => ({ code: p.code }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { code } = await params;
  const p = getPrefectureByCode(code);
  if (!p) return { title: '都道府県が見つかりません | 時事図鑑' };

  return {
    title: `${p.name}の財政カルテ・県予算の使い道 | 47都道府県カルテ`,
    description: `${p.name}の決算詳細データ。歳入（${(p.revenues.total / 100000000).toFixed(1)}兆円）、地方債残高（${(p.financial.debtOutstanding / 100000).toFixed(0)}億円）、財政力指数（${p.financial.financialStrengthIndex.toFixed(2)}）、実質公債費比率、警察・教育費の内訳とガバナンス。`
  };
}

export default async function PrefectureDetailPage({ params }: Props) {
  const { code } = await params;
  const p = getPrefectureByCode(code);

  if (!p) {
    notFound();
  }

  // この県に属する全市区町村
  const allMunis = getAllMunicipalities();
  const childMunis = allMunis.filter(m => m.prefName === p.name);

  // 関連トピック（県名で言及されている政策トピック）
  const relatedTopics = getTopicsByMunicipality(p.code, p.name);

  // 歳入スライス (千円単位)
  const revSlices = [
    { name: '道府県税（自主財源）', value: p.revenues.localTax, color: '#3b82f6' },
    { name: '国庫支出金（国補助）', value: p.revenues.nationalSubsidy, color: '#ec4899' },
    { name: '地方交付税', value: p.revenues.localAllocationTax, color: '#8b5cf6' },
    { name: '地方債（県債・借入）', value: p.revenues.localBonds, color: '#f59e0b' },
    { name: '地方譲与税', value: p.revenues.localTransferTax, color: '#10b981' },
    { name: '諸収入・繰入金等', value: p.revenues.other, color: '#94a3b8' }
  ].filter(s => s.value > 0);

  // 目的別歳出スライス
  const expPurposeSlices = [
    { name: '教育費（公立高・学校）', value: p.expensesByPurpose.education, color: '#3b82f6' },
    { name: '民生費（福祉・支援）', value: p.expensesByPurpose.welfare, color: '#10b981' },
    { name: '公債費（借金返済）', value: p.expensesByPurpose.debtService, color: '#f43f5e' },
    { name: '土木費（県道・河川）', value: p.expensesByPurpose.publicWorks, color: '#f59e0b' },
    { name: '商工費（産業支援）', value: p.expensesByPurpose.commerceIndustry, color: '#8b5cf6' },
    { name: '警察費（県警・治安）', value: p.expensesByPurpose.police, color: '#06b6d4' },
    { name: '総務費', value: p.expensesByPurpose.generalAdmin, color: '#64748b' },
    { name: '衛生費（保健・環境）', value: p.expensesByPurpose.healthSanitation, color: '#ec4899' },
    { name: 'その他', value: p.expensesByPurpose.other, color: '#cbd5e1' }
  ].filter(s => s.value > 0);

  const pop = p.population || 1;
  const debtOku = Math.round(p.financial.debtOutstanding / 100000);
  const reserveOku = Math.round(p.financial.reserveFundTotal / 100000);
  const revCho = (p.revenues.total / 1000000000).toFixed(2);
  const expCho = (p.expensesByPurpose.total / 1000000000).toFixed(2);

  return (
    <>
      <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* ナビゲーションバー */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Link
            href="/prefectures"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-indigo-600 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>47都道府県カルテ一覧へ戻る</span>
          </Link>

          <div className="flex items-center gap-2">
            <Link
              href="/municipalities"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-indigo-600 transition px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200"
            >
              <Building2 className="w-3.5 h-3.5 text-indigo-500" />
              <span>市区町村カルテ一覧へ</span>
            </Link>
          </div>
        </div>

        {/* ヒーローカード */}
        <div className="rounded-3xl bg-slate-900 text-white p-6 md:p-8 border border-slate-800 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/30">
                <Landmark className="w-3.5 h-3.5" />
                広域自治体（47都道府県）決算カルテ
              </div>
              <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white">
                {p.name}
              </h1>
              {p.profile?.headline && (
                <p className="text-sm md:text-base font-bold text-indigo-200 mt-1">
                  {p.profile.headline}
                </p>
              )}
              <p className="text-xs md:text-sm text-slate-300">
                人口 <strong>{p.population >= 10000 ? `${(p.population / 10000).toFixed(1)}万人` : `${p.population.toLocaleString()}人`}</strong>
                {' '}| 面積 <strong>{p.area.toFixed(1)} km²</strong>
                {' '}| 所属市区町村数 <strong>{childMunis.length} 団体</strong>
              </p>
              {p.profile?.tags && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {p.profile.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-800 text-slate-300 border border-slate-700/80"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/80">
                <div className="text-[10px] text-slate-400">歳入決算総額</div>
                <div className="font-black text-lg text-white mt-0.5">{revCho} 兆円</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/80">
                <div className="text-[10px] text-slate-400">財政力指数</div>
                <div className={`font-black text-lg mt-0.5 ${p.financial.financialStrengthIndex >= 1.0 ? 'text-indigo-400' : 'text-white'}`}>
                  {p.financial.financialStrengthIndex.toFixed(2)}
                </div>
                <div className="text-[9px] text-slate-400">
                  {p.financial.financialStrengthIndex >= 1.0 ? '不交付団体' : '交付税受給'}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/80 col-span-2 sm:col-span-1">
                <div className="text-[10px] text-slate-400">将来負担比率</div>
                <div className={`font-black text-lg mt-0.5 ${
                  (p.financial.futureBurdenRatio ?? 0) > 300
                    ? 'text-rose-400'
                    : (p.financial.futureBurdenRatio ?? 0) > 200
                    ? 'text-amber-400'
                    : 'text-emerald-400'
                }`}>
                  {p.financial.futureBurdenRatio !== null ? `${p.financial.futureBurdenRatio.toFixed(1)}%` : '-'}
                </div>
                <div className="text-[9px] text-slate-400">
                  {(p.financial.futureBurdenRatio ?? 0) > 300 ? '将来負担極めて大' : '基準内'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 地域特性・財政構造プロファイル（公的分析に基づく客観解説） */}
        {p.profile && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-5">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold text-xs border border-indigo-200/50">
                    地域特性・財政プロファイル
                  </span>
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    公的分析に基づく客観解説
                  </span>
                </div>
                <span className="text-[10px] text-slate-400">
                  出典: 総務省「財政状況分析表」・内閣府/経産省「RESAS」・統計局「統計でみる都道府県のすがた」
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* 産業・経済構造 */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/60 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-700 dark:text-indigo-400 mb-1.5">
                    <Briefcase className="w-3.5 h-3.5" />
                    <span>産業・経済の構造的特徴</span>
                  </div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-2">
                    地域経済と特化産業
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {p.profile.industrialStructure}
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 text-[10px] text-slate-400">
                  RESAS産業特化係数等に基づく構造データ
                </div>
              </div>

              {/* 財政の強みと課題 */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/60 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-700 dark:text-amber-400 mb-1.5">
                    <Scale className="w-3.5 h-3.5" />
                    <span>財政の強みと構造的課題</span>
                  </div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-2">
                    歳入基盤と公債費・維持費
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {p.profile.fiscalStrengthsAndRisks}
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 text-[10px] text-slate-400">
                  総務省「財政状況分析表」公表理由に基づく
                </div>
              </div>

              {/* 今後の政策課題・展望 */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/60 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400 mb-1.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>重要政策課題と展望</span>
                  </div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-2">
                    中長期的持続可能性と重点投資
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {p.profile.futureOutlook}
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 text-[10px] text-slate-400">
                  地方版総合戦略・地方財政計画等に基づく
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 地方債 vs 積立基金（借金と貯金）セクション */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Coins className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              都道府県の地方債（借金） vs 積立基金（貯金）
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              広域インフラや公債費で膨らむ県債残高と、非常時に備える基金現在高の実態
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 地方債現在高 */}
            <div className="p-4 rounded-xl bg-rose-50/60 dark:bg-rose-950/30 border border-rose-200/60 dark:border-rose-900/60">
              <div className="text-xs text-rose-700 dark:text-rose-300 font-bold flex items-center justify-between">
                <span>地方債現在高（借金）</span>
                <TrendingDown className="w-4 h-4 text-rose-500" />
              </div>
              <div className="font-black text-2xl text-rose-950 dark:text-rose-200 mt-1">
                {debtOku >= 10000 ? `${(debtOku / 10000).toFixed(2)}兆円` : `${debtOku.toLocaleString()}億円`}
              </div>
              <div className="text-[11px] text-rose-600 dark:text-rose-400 mt-1">
                住民1人あたり: <strong>{p.financial.debtPerCapita.toLocaleString()}円</strong>
              </div>
            </div>

            {/* 積立基金合計 */}
            <div className="p-4 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-900/60">
              <div className="text-xs text-emerald-700 dark:text-emerald-300 font-bold flex items-center justify-between">
                <span>積立基金現在高（貯金）</span>
                <PiggyBank className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="font-black text-2xl text-emerald-950 dark:text-emerald-200 mt-1">
                {reserveOku.toLocaleString()} 億円
              </div>
              <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1">
                うち財政調整基金: <strong>{Math.round(p.financial.fiscalAdjustmentFund / 100000)}億円</strong>
              </div>
            </div>

            {/* 住民1人あたり実質純資産 */}
            <div className={`p-4 rounded-xl border ${
              p.financial.netPerCapita >= 0
                ? 'bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-200/60'
                : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700'
            }`}>
              <div className="text-xs text-slate-600 dark:text-slate-300 font-bold flex items-center justify-between">
                <span>1人あたり実質純資産</span>
                <Scale className="w-4 h-4 text-slate-400" />
              </div>
              <div className={`font-black text-2xl mt-1 ${p.financial.netPerCapita >= 0 ? 'text-emerald-600' : 'text-slate-900 dark:text-white'}`}>
                {p.financial.netPerCapita >= 0 ? `+${p.financial.netPerCapita.toLocaleString()}円` : `${p.financial.netPerCapita.toLocaleString()}円`}
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                {p.financial.netPerCapita >= 0 ? '貯金超過（資産健全）' : '借金超過（将来世代負担）'}
              </div>
            </div>

            {/* 実質公債費比率 */}
            <div className={`p-4 rounded-xl border ${
              p.financial.realDebtServiceRatio >= 18
                ? 'bg-rose-50/60 dark:bg-rose-950/30 border-rose-300'
                : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700'
            }`}>
              <div className="text-xs text-slate-600 dark:text-slate-300 font-bold flex items-center justify-between">
                <span>実質公債費比率</span>
                <ShieldCheck className="w-4 h-4 text-slate-400" />
              </div>
              <div className={`font-black text-2xl mt-1 ${p.financial.realDebtServiceRatio >= 18 ? 'text-rose-600' : 'text-slate-900 dark:text-white'}`}>
                {p.financial.realDebtServiceRatio.toFixed(1)}%
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                起債許可ライン: <strong>18.0%</strong>
              </div>
            </div>
          </div>
        </div>

        {/* 歳入・歳出円グラフ対比 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <PieChartBreakdown
            title="歳入の内訳（財源構成）"
            subtitle={`歳入総額: ${revCho}兆円（千円単位）`}
            data={revSlices}
            unit="千円"
          />
          <PieChartBreakdown
            title="目的別歳出の内訳（使い道）"
            subtitle={`歳出総額: ${expCho}兆円（千円単位）`}
            data={expPurposeSlices}
            unit="千円"
          />
        </div>

        {/* ガバナンス・政治データ */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Landmark className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              首長・議会・行政組織ガバナンス
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              知事・県議会議員の報酬月額と行政職員数
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <div className="text-[10px] text-slate-400">知事 月額給与</div>
              <div className="font-black text-base text-slate-900 dark:text-white mt-0.5">
                {p.governance.governorSalary > 0 ? `${(p.governance.governorSalary / 10000).toFixed(1)}万円` : '-'}
              </div>
              <div className="text-[10px] text-slate-400">月額基本給</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <div className="text-[10px] text-slate-400">県議会議員 月額報酬</div>
              <div className="font-black text-base text-slate-900 dark:text-white mt-0.5">
                {p.governance.councilSalary > 0 ? `${(p.governance.councilSalary / 10000).toFixed(1)}万円` : '-'}
              </div>
              <div className="text-[10px] text-slate-400">1人あたり平均</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <div className="text-[10px] text-slate-400">県議会 議員定数</div>
              <div className="font-black text-base text-slate-900 dark:text-white mt-0.5">
                {p.governance.councilCount} 名
              </div>
              <div className="text-[10px] text-slate-400">議席定数</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <div className="text-[10px] text-slate-400">都道府県 職員総数</div>
              <div className="font-black text-base text-slate-900 dark:text-white mt-0.5">
                {p.governance.staffCount.toLocaleString()} 名
              </div>
              <div className="text-[10px] text-slate-400">教育・警察含む</div>
            </div>
          </div>
        </div>

        {/* この都道府県に関連する時事トピック */}
        {relatedTopics.length > 0 && (
          <div className="bg-slate-50 dark:bg-slate-900/60 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Newspaper className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                {p.name}に関連する時事・政策トピック
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

        {/* 所属する市区町村カルテ一覧 */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Building2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                {p.name} 内の市区町村カルテ
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                県内の各基礎自治体の決算カード・税金使途詳細
              </p>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              全 {childMunis.length} 自治体
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 max-h-96 overflow-y-auto p-1">
            {childMunis.map((m) => (
              <Link
                key={m.code}
                href={`/municipalities/${m.code}`}
                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 bg-slate-50/50 dark:bg-slate-850 hover:bg-white dark:hover:bg-slate-800 transition flex flex-col justify-between group"
              >
                <div>
                  <div className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-indigo-600 truncate">
                    {m.name}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    人口 {m.population >= 10000 ? `${(m.population / 10000).toFixed(1)}万` : `${m.population.toLocaleString()}`}人
                  </div>
                </div>
                <div className="text-[10px] text-slate-500 mt-2 flex items-center justify-between">
                  <span>財政力 {m.financial.financialStrengthIndex.toFixed(2)}</span>
                  <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <MunicipalityFooter />
    </>
  );
}
