import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { 
  Building2, Search, TrendingUp, AlertTriangle, ShieldCheck, 
  MapPin, Sparkles, HelpCircle, ArrowRight, Coins, Scale, FileText
} from 'lucide-react';
import { getMunicipalitySummaries } from '@/lib/municipalities';
import MunicipalitySearchFilter from '@/components/municipality/MunicipalitySearchFilter';

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
      badgeColor: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300',
      description: '国交省交付金削減率と発言が一致した注目自治体。土木費推移と依存度を検証。'
    },
    {
      code: '094111',
      name: '栃木県 那珂川町',
      badge: '簗農水相発言関連',
      badgeColor: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300',
      description: '補助金54%減の恫喝対象となった町。地方交付税と道路予算の実態。'
    },
    {
      code: '234273',
      name: '愛知県 飛島村',
      badge: '財政力指数 日本一',
      badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300',
      description: '財政力指数1.94。名古屋港臨海工業地帯の固定資産税で驚異の自主財源を誇る。'
    },
    {
      code: '203211',
      name: '長野県 軽井沢町',
      badge: '屈指の不交付団体',
      badgeColor: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300',
      description: '財政力指数1.52。別荘地固定資産税と観光産業による自立した財政構造。'
    }
  ];

  // 財政力指数の全国トップ3 & ワースト3
  const topFinancial = [...summaries]
    .sort((a, b) => b.financialStrength - a.financialStrength)
    .slice(0, 3);

  // 住民1人あたり土木費トップ3
  const topPublicWorks = [...summaries]
    .sort((a, b) => b.publicWorksPerCapita - a.publicWorksPerCapita)
    .slice(0, 3);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-10">
      {/* ヒーローセクション */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 text-white p-8 md:p-12 shadow-xl border border-indigo-800/40">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-bold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            日本初・三位一体シビックテック基盤
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight mb-4">
            全国自治体カルテ
          </h1>
          <p className="text-base md:text-lg text-slate-300 leading-relaxed mb-6">
            国の政策（PoliScape）× 政界のニュース（時事図鑑）に、<strong>「足元の税金・自治体の財布」</strong>を完全ドッキング。
            総務省の地方財政状況調査（決算カード）を完全集約し、しがらみのない独立系シビックテックだからこそできる予算の歪み・特異点・税金の使い道を丸裸にします。
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-300">
            <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg backdrop-blur-sm">
              <Building2 className="w-4 h-4 text-indigo-400" />
              <span>全国 <strong>{summaries.length}</strong> 市区町村を網羅</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg backdrop-blur-sm">
              <Coins className="w-4 h-4 text-amber-400" />
              <span>「税金はどこへ消えた？」シミュレーター搭載</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg backdrop-blur-sm">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <span>類似団体比較 & 異常値検知</span>
            </div>
          </div>
        </div>
      </div>

      {/* 注目自治体ピックアップ */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              注目の特異点自治体ピックアップ
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              ニュース報道や財政構造の突出で注目される代表的自治体
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {featured.map((item) => (
            <Link
              key={item.code}
              href={`/municipalities/${item.code}`}
              className="group bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold mb-3 ${item.badgeColor}`}>
                  {item.badge}
                </span>
                <h3 className="font-black text-base text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition mb-2">
                  {item.name}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                  {item.description}
                </p>
              </div>
              <div className="flex items-center justify-between text-xs font-bold text-indigo-600 dark:text-indigo-400 pt-3 border-t border-slate-100 dark:border-slate-800">
                <span>カルテを見る</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* 特異点ランキング（財政力 & 土木費） */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 財政力指数トップ */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="font-bold text-base text-slate-900 dark:text-white mb-1 flex items-center gap-2">
            <Coins className="w-4 h-4 text-emerald-500" />
            財政力指数 全国トップ（不交付団体）
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
            国からの普通交付税に頼らず自主財源で運営できる自治体
          </p>

          <div className="space-y-2.5">
            {topFinancial.map((m, idx) => (
              <Link
                key={m.code}
                href={`/municipalities/${m.code}`}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 border border-slate-100 dark:border-slate-800 transition"
              >
                <div className="flex items-center gap-3">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${
                    idx === 0 ? 'bg-amber-400 text-slate-900' : idx === 1 ? 'bg-slate-300 text-slate-900' : 'bg-amber-700 text-white'
                  }`}>
                    {idx + 1}
                  </span>
                  <div>
                    <div className="font-bold text-sm text-slate-900 dark:text-white">
                      {m.prefName} {m.name}
                    </div>
                    <div className="text-[10px] text-slate-500">人口: {m.population.toLocaleString()}人</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-black text-emerald-600 dark:text-emerald-400 text-base">
                    {m.financialStrength.toFixed(2)}
                  </div>
                  <div className="text-[10px] text-slate-400">財政力指数</div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* 住民1人あたり土木費トップ */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="font-bold text-base text-slate-900 dark:text-white mb-1 flex items-center gap-2">
            <Scale className="w-4 h-4 text-amber-500" />
            住民1人あたり土木費 全国トップ
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
            離島航路・急傾斜地治山・港湾等で突出した土木投資を行う自治体
          </p>

          <div className="space-y-2.5">
            {topPublicWorks.map((m, idx) => (
              <Link
                key={m.code}
                href={`/municipalities/${m.code}`}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 border border-slate-100 dark:border-slate-800 transition"
              >
                <div className="flex items-center gap-3">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${
                    idx === 0 ? 'bg-amber-400 text-slate-900' : idx === 1 ? 'bg-slate-300 text-slate-900' : 'bg-amber-700 text-white'
                  }`}>
                    {idx + 1}
                  </span>
                  <div>
                    <div className="font-bold text-sm text-slate-900 dark:text-white">
                      {m.prefName} {m.name}
                    </div>
                    <div className="text-[10px] text-slate-500">人口: {m.population.toLocaleString()}人</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-black text-amber-600 dark:text-amber-400 text-base">
                    {m.publicWorksPerCapita.toLocaleString()}円
                  </div>
                  <div className="text-[10px] text-slate-400">1人あたり年間土木費</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* 全国1,662自治体インタラクティブ検索 & 一覧 */}
      <div>
        <div className="mb-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Building2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            全国自治体カルテ 検索・データベース
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            47都道府県・1,662市区町村の全決算カードから瞬時に検索・比較
          </p>
        </div>

        <MunicipalitySearchFilter initialSummaries={summaries} />
      </div>

      {/* PoliScape × 時事図鑑 × 自治体カルテ 連動解説 */}
      <div className="p-6 md:p-8 rounded-3xl bg-slate-100 dark:bg-slate-850 border border-slate-200 dark:border-slate-800">
        <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">
          なぜ私たちは「自治体カルテ」を公開するのか？
        </h3>
        <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
          大企業や既存メディアは、自治体・官公庁からのPR案件受注や各種入札・記者クラブ利害関係により、「自治体の予算配分の歪みや異常値」を正面から検証・可視化することが極めて困難です。<br />
          当プラットフォームは、国の政策比較（PoliScape）と政治トピック（時事図鑑）に、住民の足元の税金（全国自治体カルテ）を直接接続し、独立した完全中立シビックテックとして日本の財政透明性を底上げします。
        </p>
        <div className="flex flex-wrap items-center gap-4 text-xs font-bold">
          <Link
            href="/topics/yana-minister-road-budget-retaliation-controversy"
            className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
          >
            簗農水相の道路予算カット発言トピックを見る →
          </Link>
          <a
            href="https://poliscape.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-600 dark:text-slate-400 hover:underline flex items-center gap-1"
          >
            PoliScape（政党政策比較）を見る →
          </a>
        </div>
      </div>
    </div>
  );
}
