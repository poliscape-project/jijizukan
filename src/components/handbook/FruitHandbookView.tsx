"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Sparkles, Award, MapPin, Calendar, TrendingUp, BookOpen, 
  Search, ArrowRight, Building2, Landmark, CheckCircle2, ChevronRight,
  Layers, Info, Compass
} from 'lucide-react';
import { FruitHandbookData, FruitItem } from '@/types/handbook';

interface Props {
  handbookData: FruitHandbookData;
}

export default function FruitHandbookView({ handbookData }: Props) {
  const [selectedFruitId, setSelectedFruitId] = useState<string>(handbookData.items[0]?.id || 'apple');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'fruit' | 'prefecture'>('fruit');
  const [selectedPrefectureCode, setSelectedPrefectureCode] = useState<string>('020003'); // デフォルト青森県

  // 現在選択中の果実
  const currentFruit = useMemo(() => {
    return handbookData.items.find(f => f.id === selectedFruitId) || handbookData.items[0];
  }, [handbookData.items, selectedFruitId]);

  // 検索フィルター（果実名、品種、都道府県名など）
  const filteredFruits = useMemo(() => {
    if (!searchQuery.trim()) return handbookData.items;
    const q = searchQuery.toLowerCase().trim();
    return handbookData.items.filter(item => {
      return (
        item.name.toLowerCase().includes(q) ||
        item.kana.toLowerCase().includes(q) ||
        item.englishName.toLowerCase().includes(q) ||
        item.mainVarieties.some(v => v.toLowerCase().includes(q)) ||
        item.rankings.some(r => r.prefectureName.toLowerCase().includes(q) || r.mainCities.some(c => c.name.toLowerCase().includes(q)))
      );
    });
  }, [handbookData.items, searchQuery]);

  // 全ランキングから都道府県一覧を抽出（重複除去・順位順）
  const allRankedPrefectures = useMemo(() => {
    const map = new Map<string, { code: string; name: string; count: number }>();
    for (const item of handbookData.items) {
      for (const ranking of item.rankings) {
        const existing = map.get(ranking.prefectureCode);
        if (existing) {
          existing.count += 1;
        } else {
          map.set(ranking.prefectureCode, {
            code: ranking.prefectureCode,
            name: ranking.prefectureName,
            count: 1
          });
        }
      }
    }
    return Array.from(map.values()).sort((a, b) => b.count - a.count);
  }, [handbookData.items]);

  // 選択された都道府県がランクインしている果実一覧
  const selectedPrefFruits = useMemo(() => {
    const list: { fruit: FruitItem; rank: number; share: number; production: number; mainCities: any[]; notes?: string }[] = [];
    for (const item of handbookData.items) {
      const found = item.rankings.find(r => r.prefectureCode === selectedPrefectureCode);
      if (found) {
        list.push({
          fruit: item,
          rank: found.rank,
          share: found.share,
          production: found.production,
          mainCities: found.mainCities,
          notes: found.notes
        });
      }
    }
    return list.sort((a, b) => a.rank - b.rank);
  }, [handbookData.items, selectedPrefectureCode]);

  // シェアバー用のカラーパレット
  const rankColors = [
    'bg-rose-500',
    'bg-amber-500',
    'bg-emerald-500',
    'bg-sky-500',
    'bg-indigo-500',
  ];

  return (
    <div className="space-y-8">
      {/* 2大ビュー切り替えタブ（品目から探す / 都道府県から探す） */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 self-start">
          <button
            onClick={() => setActiveTab('fruit')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'fruit'
                ? 'bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-rose-500" />
            <span>品目（果実）から探す</span>
          </button>
          <button
            onClick={() => setActiveTab('prefecture')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'prefecture'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-indigo-500" />
            <span>都道府県（ご当地）から探す</span>
          </button>
        </div>

        {/* 検索入力ボックス */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="果実名・品種・産地名で検索..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {activeTab === 'fruit' ? (
        <>
          {/* 果実アイコン一覧セレクター */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span className="font-semibold">調べたい果実を選択：</span>
              <span>全 {filteredFruits.length} 品目</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 md:grid-cols-10 gap-2">
              {filteredFruits.map((item) => {
                const isSelected = item.id === currentFruit.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setSelectedFruitId(item.id)}
                    className={`p-2.5 rounded-xl border text-center transition flex flex-col items-center justify-center gap-1.5 cursor-pointer ${
                      isSelected
                        ? 'border-rose-500 bg-rose-50/70 dark:bg-rose-950/40 text-rose-900 dark:text-rose-100 shadow-sm ring-2 ring-rose-500/20'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span className="text-2xl leading-none">{item.icon}</span>
                    <span className="text-xs font-bold leading-tight">{item.name.split('（')[0]}</span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">1位: {item.rankings[0]?.prefectureName.replace('県', '').replace('府', '')}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 選択された果実の詳細ビュー */}
          <div className="space-y-6">
            {/* メインスペックカード */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 md:p-8 shadow-sm space-y-6">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-6">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-100 dark:border-rose-900/50 flex items-center justify-center text-4xl shadow-2xs shrink-0">
                    {currentFruit.icon}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 px-2.5 py-0.5 rounded-full border border-rose-200 dark:border-rose-800">
                        {currentFruit.englishName}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        旬: <strong>{currentFruit.season}</strong>
                      </span>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">
                      {currentFruit.name}
                    </h2>
                    <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
                      {currentFruit.summary}
                    </p>
                  </div>
                </div>

                {/* 主要指標 */}
                <div className="flex items-center gap-3 shrink-0 self-start">
                  <div className="bg-slate-50 dark:bg-slate-800/80 px-4 py-3 rounded-2xl border border-slate-100 dark:border-slate-700/60 text-right">
                    <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">年間総収穫量</div>
                    <div className="text-lg md:text-xl font-black text-slate-900 dark:text-white">
                      {currentFruit.nationalTotalProduction.toLocaleString()}
                      <span className="text-xs font-normal text-slate-500 ml-1">t</span>
                    </div>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800/80 px-4 py-3 rounded-2xl border border-slate-100 dark:border-slate-700/60 text-right">
                    <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">年間産出額</div>
                    <div className="text-lg md:text-xl font-black text-slate-900 dark:text-white">
                      {currentFruit.nationalOutputValue.toLocaleString()}
                      <span className="text-xs font-normal text-slate-500 ml-1">億円</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 代表的品種タグ */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-amber-500" />
                  主な代表品種：
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {currentFruit.mainVarieties.map((v) => (
                    <span
                      key={v}
                      className="px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/70"
                    >
                      {v}
                    </span>
                  ))}
                </div>
              </div>

              {/* 全国シェア・プロポーショナルバー */}
              <div className="space-y-3 bg-slate-50 dark:bg-slate-800/40 p-4 md:p-5 rounded-2xl border border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-rose-500" />
                    全国収穫量シェア構成比（上位5県）
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    上位5県合計: {(currentFruit.rankings.reduce((sum, r) => sum + r.share, 0)).toFixed(1)}%
                  </span>
                </div>

                {/* 積み上げバー */}
                <div className="h-6 w-full rounded-xl overflow-hidden flex bg-slate-200 dark:bg-slate-700 shadow-inner">
                  {currentFruit.rankings.map((r, idx) => (
                    <div
                      key={r.prefectureCode}
                      style={{ width: `${r.share}%` }}
                      className={`${rankColors[idx % rankColors.length]} h-full transition-all flex items-center justify-center text-[11px] font-bold text-white overflow-hidden text-ellipsis whitespace-nowrap px-1 hover:brightness-110 cursor-pointer`}
                      title={`${r.prefectureName}: ${r.share}% (${r.production.toLocaleString()}t)`}
                    >
                      {r.share >= 6 ? `${r.prefectureName.replace('県', '')} ${r.share}%` : ''}
                    </div>
                  ))}
                  {/* その他 */}
                  {(() => {
                    const top5Sum = currentFruit.rankings.reduce((s, r) => s + r.share, 0);
                    const rest = Math.max(0, 100 - top5Sum);
                    return rest > 0 ? (
                      <div
                        style={{ width: `${rest}%` }}
                        className="bg-slate-400 dark:bg-slate-600 h-full flex items-center justify-center text-[10px] font-medium text-white px-1 whitespace-nowrap"
                        title={`その他全国: ${rest.toFixed(1)}%`}
                      >
                        {rest >= 8 ? `他 ${rest.toFixed(1)}%` : ''}
                      </div>
                    ) : null;
                  })()}
                </div>

                {/* バー凡例 */}
                <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
                  {currentFruit.rankings.map((r, idx) => (
                    <div key={r.prefectureCode} className="flex items-center gap-1.5">
                      <span className={`w-2.5 h-2.5 rounded-full ${rankColors[idx % rankColors.length]}`} />
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{r.prefectureName}</span>
                      <span className="text-slate-500 dark:text-slate-400 font-mono text-[11px]">({r.share}%)</span>
                    </div>
                  ))}
                  <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-400 dark:bg-slate-600" />
                    <span>その他</span>
                  </div>
                </div>
              </div>

              {/* 都道府県別ランキング詳細表 */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-500" />
                  収穫量・産地自治体ランキング詳細
                </h3>

                <div className="space-y-3">
                  {currentFruit.rankings.map((r) => {
                    const rankMedal = r.rank === 1 ? '🥇 1位' : r.rank === 2 ? '🥈 2位' : r.rank === 3 ? '🥉 3位' : `${r.rank}位`;
                    const badgeBg = r.rank === 1 ? 'bg-amber-100 text-amber-900 border-amber-300' :
                                    r.rank === 2 ? 'bg-slate-200 text-slate-800 border-slate-300' :
                                    r.rank === 3 ? 'bg-orange-100 text-orange-900 border-orange-300' :
                                    'bg-slate-100 text-slate-700 border-slate-200';

                    return (
                      <div
                        key={r.prefectureCode}
                        className="p-4 md:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 hover:border-indigo-400 dark:hover:border-indigo-600 transition shadow-2xs space-y-3"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="flex items-center gap-3">
                            <span className={`px-2.5 py-1 rounded-lg text-xs font-black border ${badgeBg}`}>
                              {rankMedal}
                            </span>
                            <div className="flex items-center gap-2">
                              <span className="text-base font-black text-slate-900 dark:text-white">
                                {r.prefectureName}
                              </span>
                              {/* 都道府県カルテへのリンク */}
                              <Link
                                href={`/prefectures/${r.prefectureCode}`}
                                className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 px-2 py-0.5 rounded-lg border border-indigo-200 dark:border-indigo-800 transition"
                                title={`${r.prefectureName}の財政カルテを見る`}
                              >
                                <Landmark className="w-3 h-3" />
                                <span>県カルテへ</span>
                                <ArrowRight className="w-2.5 h-2.5" />
                              </Link>
                            </div>
                          </div>

                          <div className="flex items-center gap-4 text-xs">
                            <div>
                              <span className="text-slate-400 text-[11px]">収穫量: </span>
                              <strong className="text-slate-900 dark:text-white font-mono">{r.production.toLocaleString()}</strong>
                              <span className="text-slate-500 text-[10px] ml-0.5">t</span>
                            </div>
                            <div>
                              <span className="text-slate-400 text-[11px]">全国シェア: </span>
                              <strong className="text-rose-600 dark:text-rose-400 font-mono text-sm">{r.share}%</strong>
                            </div>
                          </div>
                        </div>

                        {/* 地域特性の解説 */}
                        {r.notes && (
                          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                            {r.notes}
                          </p>
                        )}

                        {/* 主要産地市町村リンクバッジ */}
                        <div className="space-y-1.5 pt-1">
                          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            主な産地市町村（カルテ連携）：
                          </span>
                          <div className="flex flex-wrap gap-2">
                            {r.mainCities.map((city) => (
                              <Link
                                key={city.code}
                                href={`/municipalities/${city.code}`}
                                className="group/city inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs bg-slate-100 hover:bg-indigo-50 dark:bg-slate-800 dark:hover:bg-indigo-950/60 text-slate-700 dark:text-slate-200 hover:text-indigo-700 dark:hover:text-indigo-300 border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700 transition"
                                title={`${city.name}の自治体カルテ（決算・税金の使途）を見る`}
                              >
                                <Building2 className="w-3 h-3 text-slate-400 group-hover/city:text-indigo-500" />
                                <span className="font-bold">{city.name}</span>
                                {city.highlight && (
                                  <span className="text-[10px] text-slate-500 dark:text-slate-400 border-l border-slate-300 dark:border-slate-600 pl-1.5 group-hover/city:text-indigo-600 dark:group-hover/city:text-indigo-400">
                                    {city.highlight}
                                  </span>
                                )}
                                <ArrowRight className="w-2.5 h-2.5 text-slate-400 group-hover/city:translate-x-0.5 transition transform" />
                              </Link>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 地理・気候の解説＆探究コラム（調べ学習用） */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="bg-emerald-50/60 dark:bg-emerald-950/30 p-5 rounded-2xl border border-emerald-200/70 dark:border-emerald-800/50 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 dark:text-emerald-300">
                    <Compass className="w-4 h-4 text-emerald-600" />
                    なぜその地域で育つのか？（地理・自然条件）
                  </div>
                  <p className="text-xs text-emerald-950 dark:text-emerald-100 leading-relaxed">
                    {currentFruit.growingConditions}
                  </p>
                </div>

                <div className="bg-amber-50/60 dark:bg-amber-950/30 p-5 rounded-2xl border border-amber-200/70 dark:border-amber-800/50 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-800 dark:text-amber-300">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    探究学習・豆知識コラム
                  </div>
                  <p className="text-xs text-amber-950 dark:text-amber-100 leading-relaxed">
                    {currentFruit.trivia}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        /* 都道府県（ご当地）から逆引き検索するビュー */
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 md:p-8 shadow-sm space-y-6">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Landmark className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                都道府県を選択（主要産地47選）
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                選択した都道府県が全国トップクラスのシェアを誇る果実一覧を表示します
              </p>
            </div>

            {/* 都道府県チップボタン */}
            <div className="flex flex-wrap gap-2">
              {allRankedPrefectures.map((p) => {
                const isSelected = p.code === selectedPrefectureCode;
                return (
                  <button
                    key={p.code}
                    onClick={() => setSelectedPrefectureCode(p.code)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-500/20'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    <span>{p.name}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-indigo-700 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}>
                      {p.count}品目
                    </span>
                  </button>
                );
              })}
            </div>

            {/* 選択された都道府県の特産果実一覧 */}
            <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-black text-slate-900 dark:text-white">
                    {allRankedPrefectures.find(p => p.code === selectedPrefectureCode)?.name}の名産果実
                  </span>
                  <Link
                    href={`/prefectures/${selectedPrefectureCode}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    <span>都道府県カルテを見る</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
                <span className="text-xs text-slate-500">
                  該当 <strong>{selectedPrefFruits.length}</strong> 件
                </span>
              </div>

              {selectedPrefFruits.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedPrefFruits.map((item) => (
                    <div
                      key={item.fruit.id}
                      className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850 hover:bg-white dark:hover:bg-slate-800 transition shadow-2xs space-y-3"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-3xl">{item.fruit.icon}</span>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-base font-black text-slate-900 dark:text-white">
                                {item.fruit.name}
                              </span>
                              <span className={`px-2 py-0.5 rounded text-[11px] font-black ${
                                item.rank === 1 ? 'bg-amber-100 text-amber-900 border border-amber-300' :
                                item.rank === 2 ? 'bg-slate-200 text-slate-800' :
                                'bg-orange-100 text-orange-900'
                              }`}>
                                全国 {item.rank}位
                              </span>
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                              全国シェア: <strong className="text-rose-600 dark:text-rose-400">{item.share}%</strong>（{item.production.toLocaleString()}t）
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            setSelectedFruitId(item.fruit.id);
                            setActiveTab('fruit');
                          }}
                          className="px-2.5 py-1 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg border border-rose-200 dark:border-rose-900/60 transition"
                        >
                          詳細へ
                        </button>
                      </div>

                      {item.notes && (
                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                          {item.notes}
                        </p>
                      )}

                      <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 space-y-1">
                        <div className="text-[11px] font-bold text-slate-400">主要産地自治体：</div>
                        <div className="flex flex-wrap gap-1.5">
                          {item.mainCities.map((city: any) => (
                            <Link
                              key={city.code}
                              href={`/municipalities/${city.code}`}
                              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline bg-white dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700"
                            >
                              {city.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-slate-400 text-xs">
                  登録された主要果樹の上位データがありません。
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 出典・免責事項 */}
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 space-y-1">
        <div className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
          <Info className="w-3.5 h-3.5 text-slate-400" />
          データ出典・統計について
        </div>
        <p>
          本ページに掲載している収穫量・産出額・全国シェアデータは、{handbookData.source}に基づき作成されています。
          産地市町村の自治体カルテリンクは、総務省「地方財政状況調査（決算カード）」の各自治体財務データへ直結しています。
        </p>
      </div>
    </div>
  );
}
