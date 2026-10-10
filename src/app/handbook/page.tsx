import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { 
  BookOpen, Building2, Landmark, Sparkles, MapPin, 
  Layers, Compass, ArrowRight 
} from 'lucide-react';
import { getFruitHandbookData } from '@/lib/handbook';
import FruitHandbookView from '@/components/handbook/FruitHandbookView';
import MunicipalityFooter from '@/components/municipality/MunicipalityFooter';

export const metadata: Metadata = {
  title: '都道府県便覧【全38大項目】日本の特産品・基幹産業・水産・暮らしご当地日本一 | 農水省・経産省・総務省統計 | 時事図鑑',
  description: '農水省（米・果実・野菜・畜産・水産）、経産省（自動車・半導体・化学・鉄鋼等）、総務省家計調査・住宅土地統計（餃子・ラーメン・納豆・カレー・喫茶・住まいの広さ等）確定値に基づく47都道府県の全38品目・指標ランキングと主産地・水揚港・主要都市。地理・海洋環境・産業集積・生活文化と自治体カルテを繋ぐ新世代シビックテック便覧。'
};

export default function HandbookPage() {
  const handbookData = getFruitHandbookData();

  return (
    <>
      <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* 上部ナビゲーション */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 self-start">
            <Link
              href="/municipalities"
              className="px-4 py-2 rounded-lg text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white transition flex items-center gap-1.5"
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>市区町村カルテ (1,741)</span>
            </Link>
            <Link
              href="/prefectures"
              className="px-4 py-2 rounded-lg text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white transition flex items-center gap-1.5"
            >
              <Landmark className="w-3.5 h-3.5" />
              <span>都道府県カルテ (47)</span>
            </Link>
            <div className="px-4 py-2 rounded-lg text-xs font-bold bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 shadow-2xs flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5" />
              <span>都道府県便覧 (38項目)</span>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <Link
              href="/municipalities/compare"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 px-3 py-2 rounded-xl transition"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>自治体比較へ</span>
            </Link>
          </div>
        </div>

        {/* ヒーローヘッダー */}
        <div className="rounded-3xl bg-slate-900 text-white p-6 md:p-8 border border-slate-800 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold border border-rose-500/30">
              <BookOpen className="w-3.5 h-3.5" />
              4本柱シビックテック・調べ学習＆探究基盤
            </div>
            <h1 className="text-2xl md:text-4xl font-black tracking-tight text-white">
              都道府県便覧 <span className="text-rose-400 text-xl md:text-2xl font-bold">【産業・水産・特産・暮らしの日本一編】</span>
            </h1>
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
              農林水産省「作物統計・畜産統計・漁業養殖業生産統計」、経済産業省「工業統計・経済構造実態調査」、総務省統計局「家計調査・住宅土地統計調査」の確定値に基づき、日本全国の主要農畜水産物・基幹産業・生活文化（果実・野菜・米・酪農・畜産・自動車・半導体・医薬品・化学・鉄鋼・餃子・ラーメン・納豆・喫茶・住まいの広さ・マグロ・ホタテ・カツオ・サケ・海苔・ブリ等）全38項目の都道府県別シェアと主産地・水揚港・主要都市を完全網羅。
              なぜその地域で盛んなのかの地理・海洋環境・産業集積・生活文化から、自治体の財政・暮らしカルテまでシームレスに探究できます。
            </p>
          </div>
        </div>

        {/* 便覧メインビュー */}
        <FruitHandbookView handbookData={handbookData} />
      </main>

      <MunicipalityFooter />
    </>
  );
}
