import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { Landmark, Building2, Layers, AlertCircle, ArrowRight } from 'lucide-react';
import { getPrefectureSummaries } from '@/lib/prefectures';
import PrefectureListView from '@/components/prefecture/PrefectureListView';
import MunicipalityFooter from '@/components/municipality/MunicipalityFooter';

export const metadata: Metadata = {
  title: '47都道府県 財政カルテ・県予算まとめ | 時事図鑑',
  description: '全国47都道府県の決算データ、地方債残高（借金）、積立基金（貯金）、財政力指数、実質公債費比率、将来負担比率を完全収録。知事給与や議員報酬、警察・教育費の内訳まで徹底可視化。'
};

export default function PrefecturesPage() {
  const prefectures = getPrefectureSummaries();

  return (
    <>
      <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* ナビゲーション・タブ */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 self-start">
            <Link
              href="/municipalities"
              className="px-4 py-2 rounded-lg text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white transition flex items-center gap-1.5"
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>市区町村カルテ (1,741)</span>
            </Link>
            <div className="px-4 py-2 rounded-lg text-xs font-bold bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-2xs flex items-center gap-1.5">
              <Landmark className="w-3.5 h-3.5" />
              <span>都道府県カルテ (47)</span>
            </div>
          </div>

          <Link
            href="/municipalities/compare"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 px-3 py-2 rounded-xl transition self-start sm:self-auto"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>2自治体 徹底比較へ</span>
          </Link>
        </div>

        {/* ヒーローヘッダー */}
        <div className="rounded-3xl bg-slate-900 text-white p-6 md:p-8 border border-slate-800 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/30">
              <Landmark className="w-3.5 h-3.5" />
              広域自治体の決算・地方債完全網羅
            </div>
            <h1 className="text-2xl md:text-4xl font-black tracking-tight text-white">
              全国47都道府県 財政カルテ
            </h1>
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
              総務省公表の地方財政状況調査（決算カード）を基に、全国47都道府県の地方債残高（借金）、積立基金（貯金）、
              財政力指数、将来負担比率を可視化。都道府県民1人あたりの負債負担額や、警察費・教育費・知事給与の実態を中立・客観的に検証します。
            </p>
          </div>
        </div>

        {/* リスト・検索・ソート */}
        <PrefectureListView prefectures={prefectures} />
      </main>

      <MunicipalityFooter />
    </>
  );
}
