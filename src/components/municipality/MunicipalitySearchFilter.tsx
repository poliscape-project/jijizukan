'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, Filter, AlertTriangle, ArrowUpDown, ChevronRight, Building, Sparkles } from 'lucide-react';
import { MunicipalitySummary } from '@/types/municipality';

interface Props {
  initialSummaries: MunicipalitySummary[];
}

const PREFECTURES = [
  '全自治体',
  '北海道', '青森県', '岩手県', '宮城県', '秋田県', '山形県', '福島県',
  '茨城県', '栃木県', '群馬県', '埼玉県', '千葉県', '東京都', '神奈川県',
  '新潟県', '富山県', '石川県', '福井県', '山梨県', '長野県',
  '岐阜県', '静岡県', '愛知県', '三重県',
  '滋賀県', '京都府', '大阪府', '兵庫県', '奈良県', '和歌山県',
  '鳥取県', '島根県', '岡山県', '広島県', '山口県',
  '徳島県', '香川県', '愛媛県', '高知県',
  '福岡県', '佐賀県', '長崎県', '熊本県', '大分県', '宮崎県', '鹿児島県', '沖縄県'
];

type SortKey = 
  | 'default' 
  | 'vanishingOnly'
  | 'selfReliantOnly'
  | 'financialDesc' 
  | 'financialAsc' 
  | 'furusatoSurplusDesc'
  | 'furusatoDeficitAsc'
  | 'agingRateDesc'
  | 'childRateDesc'
  | 'netPerCapitaDesc'
  | 'publicWorksDesc' 
  | 'assemblyCostDesc'
  | 'populationDesc' 
  | 'alertsOnly';

export default function MunicipalitySearchFilter({ initialSummaries }: Props) {
  const [query, setQuery] = useState('');
  const [selectedPref, setSelectedPref] = useState('全自治体');
  const [sortKey, setSortKey] = useState<SortKey>('default');
  const [page, setPage] = useState(1);
  const pageSize = 30;

  const filteredAndSorted = useMemo(() => {
    let result = initialSummaries;

    // Filter by pref
    if (selectedPref !== '全自治体') {
      result = result.filter(m => m.prefName === selectedPref);
    }

    // Filter by query (name or code)
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      result = result.filter(m =>
        m.name.toLowerCase().includes(q) ||
        m.prefName.toLowerCase().includes(q) ||
        m.code.includes(q)
      );
    }

    // Sort
    const sorted = [...result];
    switch (sortKey) {
      case 'vanishingOnly':
        sorted.sort((a, b) => {
          const aVan = a.sustainabilityCategory === '消滅可能性自治体' ? 1 : 0;
          const bVan = b.sustainabilityCategory === '消滅可能性自治体' ? 1 : 0;
          if (aVan !== bVan) return bVan - aVan;
          return (a.youngFemaleChangeRate ?? 0) - (b.youngFemaleChangeRate ?? 0);
        });
        break;
      case 'selfReliantOnly':
        sorted.sort((a, b) => {
          const aRel = a.sustainabilityCategory === '自立持続可能性自治体' ? 1 : 0;
          const bRel = b.sustainabilityCategory === '自立持続可能性自治体' ? 1 : 0;
          if (aRel !== bRel) return bRel - aRel;
          return (b.youngFemaleChangeRate ?? 0) - (a.youngFemaleChangeRate ?? 0);
        });
        break;
      case 'financialDesc':
        sorted.sort((a, b) => b.financialStrength - a.financialStrength);
        break;
      case 'financialAsc':
        sorted.sort((a, b) => a.financialStrength - b.financialStrength);
        break;
      case 'furusatoSurplusDesc':
        sorted.sort((a, b) => (b.furusatoBalance ?? 0) - (a.furusatoBalance ?? 0));
        break;
      case 'furusatoDeficitAsc':
        sorted.sort((a, b) => (a.furusatoBalance ?? 0) - (b.furusatoBalance ?? 0));
        break;
      case 'agingRateDesc':
        sorted.sort((a, b) => (b.agingRate ?? 0) - (a.agingRate ?? 0));
        break;
      case 'childRateDesc':
        sorted.sort((a, b) => (b.childRate ?? 0) - (a.childRate ?? 0));
        break;
      case 'publicWorksDesc':
        sorted.sort((a, b) => b.publicWorksPerCapita - a.publicWorksPerCapita);
        break;
      case 'netPerCapitaDesc':
        sorted.sort((a, b) => (b.netPerCapita ?? 0) - (a.netPerCapita ?? 0));
        break;
      case 'assemblyCostDesc':
        sorted.sort((a, b) => (b.assemblyCostPerCapita ?? 0) - (a.assemblyCostPerCapita ?? 0));
        break;
      case 'populationDesc':
        sorted.sort((a, b) => b.population - a.population);
        break;
      case 'alertsOnly':
        sorted.sort((a, b) => (b.hasAlerts ? 1 : 0) - (a.hasAlerts ? 1 : 0));
        break;
      default:
        // Default: Keep official order (pref & city code)
        sorted.sort((a, b) => a.code.localeCompare(b.code));
    }

    return sorted;
  }, [initialSummaries, selectedPref, query, sortKey]);

  const totalPages = Math.ceil(filteredAndSorted.length / pageSize);
  const paginated = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredAndSorted.slice(start, start + pageSize);
  }, [filteredAndSorted, page]);

  const handlePrefChange = (pref: string) => {
    setSelectedPref(pref);
    setPage(1);
  };

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setPage(1);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortKey(e.target.value as SortKey);
    setPage(1);
  };

  return (
    <div className="space-y-6">
      {/* 検索・絞り込みコントロール */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          {/* テキスト検索 */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="自治体名・都道府県名を入力（例: 那須烏山、軽井沢、福岡市）"
              value={query}
              onChange={handleQueryChange}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            />
            {query && (
              <button
                onClick={() => { setQuery(''); setPage(1); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                クリア
              </button>
            )}
          </div>

          {/* ソートセレクター */}
          <div className="flex items-center gap-2 shrink-0">
            <ArrowUpDown className="w-4 h-4 text-slate-400" />
            <select
              value={sortKey}
              onChange={handleSortChange}
              aria-label="並び替え順の選択"
              className="py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="default">全国コード順</option>
              <option value="vanishingOnly">消滅可能性自治体（人口半減危機）</option>
              <option value="selfReliantOnly">自立持続可能性自治体（全国65団体）</option>
              <option value="furusatoSurplusDesc">ふるさと納税 黒字（流入超過順）</option>
              <option value="furusatoDeficitAsc">ふるさと納税 赤字（流出超過順）</option>
              <option value="agingRateDesc">高齢化率（高い順）</option>
              <option value="childRateDesc">子ども比率（高い順）</option>
              <option value="financialDesc">財政力指数（高い順）</option>
              <option value="financialAsc">財政力指数（低い順）</option>
              <option value="netPerCapitaDesc">実質純資産（貯金超過順）</option>
              <option value="publicWorksDesc">1人あたり土木費（高い順）</option>
              <option value="assemblyCostDesc">1人あたり議会費（高い順）</option>
              <option value="populationDesc">人口規模（多い順）</option>
              <option value="alertsOnly">特異点・アラート自治体優先</option>
            </select>
          </div>
        </div>

        {/* 都道府県チップ（スクロール） */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 scrollbar-none text-xs">
          {PREFECTURES.map((pref) => {
            const isSelected = selectedPref === pref;
            return (
              <button
                key={pref}
                onClick={() => handlePrefChange(pref)}
                className={`px-3 py-1.5 rounded-full font-medium whitespace-nowrap transition ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {pref}
              </button>
            );
          })}
        </div>

        {/* 検索結果サマリー */}
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
          <span>
            該当自治体: <strong className="text-slate-900 dark:text-white font-bold">{filteredAndSorted.length}</strong> 団体
            {selectedPref !== '全自治体' && `（${selectedPref}）`}
          </span>
          <span>
            {page} / {Math.max(1, totalPages)} ページ（全{filteredAndSorted.length}件中 {(page - 1) * pageSize + 1}〜{Math.min(page * pageSize, filteredAndSorted.length)}件）
          </span>
        </div>
      </div>

      {/* 自治体グリッド */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {paginated.map((m) => {
          return (
            <Link
              key={m.code}
              href={`/municipalities/${m.code}`}
              className="group bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2 flex-wrap">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
                    <span>{m.prefName}</span>
                    <span>•</span>
                    <span>コード {m.code}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {m.sustainabilityCategory === '消滅可能性自治体' && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300">
                        消滅可能性
                      </span>
                    )}
                    {m.sustainabilityCategory === '自立持続可能性自治体' && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                        自立持続可能
                      </span>
                    )}
                    {m.hasAlerts && (
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                        <AlertTriangle className="w-3 h-3" />
                        特異点
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-black text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
                    {m.name}
                  </h3>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition transform group-hover:translate-x-0.5" />
                </div>

                {/* 指標バッジ */}
                <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs mb-3">
                  <div>
                    <div className="text-[10px] text-slate-400">人口</div>
                    <div className="font-bold text-slate-800 dark:text-slate-200">
                      {(m.population / 10000 >= 1)
                        ? `${(m.population / 10000).toFixed(1)}万人`
                        : `${m.population.toLocaleString()}人`}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400">財政力指数</div>
                    <div className={`font-bold ${m.financialStrength >= 1.0 ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-800 dark:text-slate-200'}`}>
                      {m.financialStrength.toFixed(2)}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400">土木費/人</div>
                    <div className="font-bold text-slate-800 dark:text-slate-200">
                      {m.publicWorksPerCapita.toLocaleString()}円
                    </div>
                  </div>
                </div>

                {/* 実質純資産 */}
                {m.netPerCapita !== undefined && (
                  <div className="flex items-center justify-between text-[11px] px-2.5 py-1 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 mb-1.5">
                    <span className="text-slate-500">純資産（貯金−借金）:</span>
                    <span className={`font-bold ${
                      m.netPerCapita >= 0
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-amber-600 dark:text-amber-400'
                    }`}>
                      {m.netPerCapita >= 0 ? `+${m.netPerCapita.toLocaleString()}` : m.netPerCapita.toLocaleString()}円/人
                    </span>
                  </div>
                )}

                {/* ふるさと納税 & 高齢化率 バッジ */}
                <div className="grid grid-cols-2 gap-1.5 text-[11px] mb-2">
                  {m.furusatoBalance !== undefined && (
                    <div className="flex items-center justify-between px-2 py-1 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                      <span className="text-slate-500 text-[10px]">ふるさと収支:</span>
                      <span className={`font-bold text-[10px] ${
                        m.furusatoBalance >= 0
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-rose-600 dark:text-rose-400'
                      }`}>
                        {m.furusatoBalance >= 0 ? '+' : ''}{(m.furusatoBalance / 1e8).toFixed(1)}億円
                      </span>
                    </div>
                  )}
                  {m.agingRate !== undefined && (
                    <div className="flex items-center justify-between px-2 py-1 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                      <span className="text-slate-500 text-[10px]">高齢化率:</span>
                      <span className={`font-bold text-[10px] ${
                        m.agingRate >= 40
                          ? 'text-rose-600 dark:text-rose-400'
                          : m.agingRate >= 30
                          ? 'text-amber-600 dark:text-amber-400'
                          : 'text-blue-600 dark:text-blue-400'
                      }`}>
                        {m.agingRate}%
                      </span>
                    </div>
                  )}
                </div>

                {/* 産業タイプバッジ */}
                {m.industryType && (
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate mb-1">
                    <span className="font-medium text-slate-700 dark:text-slate-300">産業: </span>
                    {m.industryType}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                <span>歳出: {(m.expTotal / 1000000).toFixed(1)}億円</span>
                <span className="font-medium text-indigo-600 dark:text-indigo-400 group-hover:underline">
                  カルテを見る →
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* ページネーション */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 rounded-xl text-sm font-medium border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            前へ
          </button>
          <span className="text-sm font-medium text-slate-600 dark:text-slate-400 px-3">
            {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 rounded-xl text-sm font-medium border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            次へ
          </button>
        </div>
      )}
    </div>
  );
}
