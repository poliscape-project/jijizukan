import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { 
  Building2, Search, TrendingUp, TrendingDown, AlertTriangle, ShieldCheck, 
  MapPin, Sparkles, HelpCircle, ArrowRight, Coins, Scale, FileText, PiggyBank,
  Gift, Users, AlertOctagon
} from 'lucide-react';
import { getMunicipalitySummaries } from '@/lib/municipalities';
import MunicipalitySearchFilter from '@/components/municipality/MunicipalitySearchFilter';
import RankingTabs from '@/components/municipality/RankingTabs';

export const metadata: Metadata = {
  title: '全国自治体カルテ | 全47都道府県・1,700自治体の決算と税金の使い道を完全可視化',
  description: '総務省「地方財政状況調査（決算カード）」の全自治体データを完全集約。財政力指数、住民1人あたり土木費、首長・議員報酬、類似団体比較、住民税の使途シミュレーターまで、日本初の三位一体シビックテック基盤。'
};

export default function MunicipalitiesPage() {
  const summaries = getMunicipalitySummaries();

  // 注目自治体（簗大臣関連、財政力トップ、等）
  const featured = [
    {
      code: '092151',
      name: '栃木県 那須烏山市',
      badge: '簗農水相発言関連',
      badgeStyle: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700',
      description: '国交省交付金削減率と発言が一致した注目自治体。土木費推移と依存度を検証。'
    },
    {
      code: '094111',
      name: '栃木県 那珂川町',
      badge: '簗農水相発言関連',
      badgeStyle: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700',
      description: '補助金54%減の恫喝対象となった町。地方交付税と道路予算の実態。'
    },
    {
      code: '234273',
      name: '愛知県 飛島村',
      badge: '財政力指数 日本一',
      badgeStyle: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
      description: '財政力指数1.94。名古屋港臨海工業地帯の固定資産税で驚異の自主財源を誇る。'
    },
    {
      code: '434043',
      name: '熊本県 菊陽町',
      badge: 'TSMC半導体メガハブ',
      badgeStyle: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
      description: '世界最大手ファウンドリ進出。税収急増とインフラ投資が進む新興半導体城下町。'
    }
  ];

  // 財政力指数の全国トップ3
  const topFinancial = [...summaries]
    .sort((a, b) => b.financialStrength - a.financialStrength)
    .slice(0, 3);

  // 住民1人あたり土木費トップ3
  const topPublicWorks = [...summaries]
    .sort((a, b) => b.publicWorksPerCapita - a.publicWorksPerCapita)
    .slice(0, 3);

  // 実質純資産（住民1人あたり貯金超過）トップ3
  const topNetReserve = [...summaries]
    .sort((a, b) => (b.netPerCapita ?? 0) - (a.netPerCapita ?? 0))
    .slice(0, 3);

  // ふるさと納税 黒字（流入超過）トップ3
  const topFurusatoSurplus = [...summaries]
    .filter(m => m.furusatoBalance !== undefined)
    .sort((a, b) => (b.furusatoBalance ?? 0) - (a.furusatoBalance ?? 0))
    .slice(0, 3);

  // ふるさと納税 赤字（流出超過）ワースト3
  const topFurusatoDeficit = [...summaries]
    .filter(m => m.furusatoBalance !== undefined)
    .sort((a, b) => (a.furusatoBalance ?? 0) - (b.furusatoBalance ?? 0))
    .slice(0, 3);

  // 高齢化率トップ3
  const topAging = [...summaries]
    .filter(m => m.agingRate !== undefined)
    .sort((a, b) => (b.agingRate ?? 0) - (a.agingRate ?? 0))
    .slice(0, 3);

  // 消滅可能性自治体（若年女性減少率ワースト3）
  const topVanishing = [...summaries]
    .filter(m => m.sustainabilityCategory === '消滅可能性自治体' && m.youngFemaleChangeRate !== undefined)
    .sort((a, b) => (a.youngFemaleChangeRate ?? 0) - (b.youngFemaleChangeRate ?? 0))
    .slice(0, 3);

  // 自立持続可能性自治体（若年女性増加率トップ3）
  const topSelfReliant = [...summaries]
    .filter(m => m.sustainabilityCategory === '自立持続可能性自治体' && m.youngFemaleChangeRate !== undefined)
    .sort((a, b) => (b.youngFemaleChangeRate ?? 0) - (a.youngFemaleChangeRate ?? 0))
    .slice(0, 3);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-8">
      {/* ヒーローセクション：すっきりとした知的なヘッダー */}
      <div className="rounded-2xl bg-slate-900 text-white p-6 md:p-8 border border-slate-800 shadow-sm">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold mb-3 border border-indigo-500/30">
            <Building2 className="w-3.5 h-3.5" />
            自治体決算・税金の使い道オープンデータ
          </div>
          <h1 className="text-2xl md:text-4xl font-black tracking-tight leading-tight mb-2">
            全国自治体カルテ
          </h1>
          <p className="text-sm md:text-base text-slate-300 leading-relaxed">
            総務省「地方財政状況調査（決算カード）」の全自治体データを集約。
            あなたの街の<strong>積立基金・地方債残高・ふるさと納税収支・住民税の使い道</strong>を客観的な事実データから可視化します。
          </p>
        </div>
      </div>

      {/* 【最優先配置】全国自治体検索・データベース */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Search className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            自治体を探す・比較する
          </h2>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            全国 <strong>{summaries.length}</strong> 市区町村
          </span>
        </div>

        <MunicipalitySearchFilter initialSummaries={summaries} />
      </div>

      {/* 注目自治体ピックアップ（コンパクト・低彩度） */}
      <div className="space-y-3">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            注目の自治体ピックアップ
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            ニュース報道や突出した財政構造で注目される自治体
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {featured.map((item) => (
            <Link
              key={item.code}
              href={`/municipalities/${item.code}`}
              className="group bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 transition shadow-2xs flex flex-col justify-between"
            >
              <div>
                <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold mb-2 border ${item.badgeStyle}`}>
                  {item.badge}
                </span>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition mb-1">
                  {item.name}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
                  {item.description}
                </p>
              </div>
              <div className="flex items-center justify-between text-xs font-semibold text-indigo-600 dark:text-indigo-400 pt-3 mt-3 border-t border-slate-100 dark:border-slate-800">
                <span>カルテを見る</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* 特異点ランキング（3大タブに集約） */}
      <RankingTabs
        topFinancial={topFinancial}
        topNetReserve={topNetReserve}
        topPublicWorks={topPublicWorks}
        topFurusatoSurplus={topFurusatoSurplus}
        topFurusatoDeficit={topFurusatoDeficit}
        topAging={topAging}
        topVanishing={topVanishing}
        topSelfReliant={topSelfReliant}
      />

      {/* PoliScape × 時事図鑑 × 自治体カルテ 連動解説 */}
      <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2">
        <h3 className="font-bold text-sm text-slate-900 dark:text-white">
          なぜ「自治体カルテ」を公開するのか？
        </h3>
        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          国の政策論争（PoliScape）や政界ニュース（時事図鑑）だけでなく、国民が納めた税金が足元の自治体でどう使われ、健全に運営されているかを事実データで客観的に照合できるシビックテック基盤を目指しています。
        </p>
        <div className="flex flex-wrap items-center gap-4 text-xs font-semibold pt-1">
          <Link
            href="/topics/yana-minister-road-budget-retaliation-controversy"
            className="text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            簗農水相の道路予算カット発言トピック →
          </Link>
          <a
            href="https://poliscape.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-600 dark:text-slate-400 hover:underline"
          >
            日本政策図鑑（PoliScape）→
          </a>
        </div>
      </div>
    </div>
  );
}
