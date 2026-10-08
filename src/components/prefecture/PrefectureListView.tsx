'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Building2, Search, ArrowUpDown, ArrowRight, 
  Coins, PiggyBank, Scale, AlertTriangle, ShieldCheck, MapPin,
  TrendingDown, TrendingUp, Users, Landmark, Filter
} from 'lucide-react';
import { PrefectureSummary } from '@/types/prefecture';

interface Props {
  prefectures: PrefectureSummary[];
}

type SortField = 
  | 'code'
  | 'population' 
  | 'financialStrength' 
  | 'debtOutstanding' 
  | 'debtPerCapita'
  | 'netPerCapita' 
  | 'realDebtRatio' 
  | 'futureBurdenRatio';

const REGIONS: { [key: string]: string[] } = {
  '北海道・東北': ['北海道', '青森県', '岩手県', '宮城県', '秋田県', '山形県', '福島県'],
  '関東': ['茨城県', '栃木県', '群馬県', '埼玉県', '千葉県', '東京都', '神奈川県'],
  '中部': ['新潟県', '富山県', '石川県', '福井県', '山梨県', '長野県', '岐阜県', '静岡県', '愛知県'],
  '近畿': ['三重県', '滋賀県', '京都府', '大阪府', '兵庫県', '奈良県', '和歌山県'],
  '中国': ['鳥取県', '島根県', '岡山県', '広島県', '山口県'],
  '四国': ['徳島県', '香川県', '愛媛県', '高知県'],
  '九州・沖縄': ['福岡県', '佐賀県', '長崎県', '熊本県', '大分県', '宮崎県', '鹿児島県', '沖縄県']
};

export default function PrefectureListView({ prefectures }: Props) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [sortField, setSortField] = useState<SortField>('debtOutstanding');
  const [sortAsc, setSortAsc] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  // 地域特定ヘルパー
  const getRegionName = (name: string): string => {
    for (const [region, prefs] of Object.entries(REGIONS)) {
      if (prefs.includes(name)) return region;
    }
    return 'その他';
  };

  const filteredAndSorted = useMemo(() => {
    return prefectures
      .filter((p) => {
        const matchesSearch = p.name.includes(searchTerm) || p.prefCode.includes(searchTerm);
        if (!matchesSearch) return false;
        if (selectedRegion === 'all') return true;
        const regionPrefs = REGIONS[selectedRegion];
        return regionPrefs ? regionPrefs.includes(p.name) : true;
      })
      .sort((a, b) => {
        let valA = a[sortField] ?? -999999;
        let valB = b[sortField] ?? -999999;
        if (sortAsc) {
          return valA > valB ? 1 : -1;
        } else {
          return valA < valB ? 1 : -1;
        }
      });
  }, [prefectures, searchTerm, selectedRegion, sortField, sortAsc]);

  // 全体マクロ統計
  const totalDebtOku = Math.round(
    prefectures.reduce((sum, p) => sum + p.debtOutstanding, 0) / 100000
  );
  const totalReserveOku = Math.round(
    prefectures.reduce((sum, p) => sum + p.reserveFundTotal, 0) / 100000
  );
  const nonAllocatedCount = prefectures.filter((p) => p.financialStrength >= 1.0).length;

  return (
    <div className="space-y-6">
      {/* 上部マクロ統計バナー */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="text-[11px] font-bold text-slate-500">47都道府県 地方債総残高</div>
          <div className="text-xl md:text-2xl font-black text-rose-600 dark:text-rose-400 mt-1">
            {(totalDebtOku / 10000).toFixed(1)} 兆円
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">全47都道府県の合算負債</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="text-[11px] font-bold text-slate-500">47都道府県 積立基金総額</div>
          <div className="text-xl md:text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
            {(totalReserveOku / 10000).toFixed(1)} 兆円
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">財政調整・減債等の貯金計</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="text-[11px] font-bold text-slate-500">財政力指数 1.0以上（不交付）</div>
          <div className="text-xl md:text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-1">
            {nonAllocatedCount} 団体
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">東京都のみが継続該当</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="text-[11px] font-bold text-slate-500">公債費比率 要注視団体</div>
          <div className="text-xl md:text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">
            {prefectures.filter((p) => p.realDebtRatio >= 18).length} 団体
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">実質公債費比率 18%以上</div>
        </div>
      </div>

      {/* 検索・絞り込み・ソートコントロール */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          {/* キーワード検索 */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="都道府県名で検索（例: 兵庫県、東京都、愛知県）"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* ソートセレクター */}
          <div className="flex items-center gap-2">
            <select
              value={sortField}
              onChange={(e) => setSortField(e.target.value as SortField)}
              className="px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="debtOutstanding">地方債残高（借金総額）</option>
              <option value="debtPerCapita">1人あたり借金</option>
              <option value="netPerCapita">1人あたり純資産（基金-債）</option>
              <option value="financialStrength">財政力指数</option>
              <option value="realDebtRatio">実質公債費比率</option>
              <option value="futureBurdenRatio">将来負担比率</option>
              <option value="population">人口規模</option>
            </select>

            <button
              onClick={() => setSortAsc(!sortAsc)}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition flex items-center justify-center"
              title={sortAsc ? '昇順（小さい順）' : '降順（大きい順）'}
            >
              <ArrowUpDown className="w-4 h-4" />
            </button>

            {/* 表示モード */}
            <div className="hidden sm:flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
              <button
                onClick={() => setViewMode('cards')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  viewMode === 'cards'
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                カード
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  viewMode === 'table'
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                表
              </button>
            </div>
          </div>
        </div>

        {/* 地方ブロックフィルター */}
        <div className="flex items-center gap-1.5 flex-wrap pt-2 border-t border-slate-100 dark:border-slate-800">
          <span className="text-[11px] font-bold text-slate-400 mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3" />
            地方:
          </span>
          <button
            onClick={() => setSelectedRegion('all')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
              selectedRegion === 'all'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            全国すべて ({prefectures.length})
          </button>
          {Object.entries(REGIONS).map(([reg, prefs]) => (
            <button
              key={reg}
              onClick={() => setSelectedRegion(reg)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                selectedRegion === reg
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {reg} ({prefs.length})
            </button>
          ))}
        </div>
      </div>

      {/* 結果一覧 */}
      {viewMode === 'cards' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAndSorted.map((p) => {
            const debtOku = Math.round(p.debtOutstanding / 100000);
            const reserveOku = Math.round(p.reserveFundTotal / 100000);
            const region = getRegionName(p.name);

            return (
              <Link
                key={p.code}
                href={`/prefectures/${p.code}`}
                className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 hover:shadow-md transition p-5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                          {region}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          コード: {p.code}
                        </span>
                      </div>
                      <h3 className="font-black text-xl text-slate-900 dark:text-white group-hover:text-indigo-600 transition mt-1">
                        {p.name}
                      </h3>
                    </div>

                    <div className="text-right">
                      <div className="text-[10px] text-slate-400">財政力指数</div>
                      <div className={`font-black text-sm ${p.financialStrength >= 1.0 ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-700 dark:text-slate-300'}`}>
                        {p.financialStrength.toFixed(2)}
                      </div>
                    </div>
                  </div>

                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                    人口 <strong>{(p.population / 10000).toFixed(1)}万人</strong>
                    {' '}| 面積 <strong>{p.area.toFixed(0)} km²</strong>
                  </div>

                  {/* 財政指標ハイライト */}
                  <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/40">
                      <div className="text-[10px] text-rose-700 dark:text-rose-300 font-semibold flex items-center justify-between">
                        <span>地方債残高</span>
                        <Coins className="w-3 h-3 text-rose-500" />
                      </div>
                      <div className="font-black text-rose-950 dark:text-rose-200 mt-0.5">
                        {debtOku >= 10000 ? `${(debtOku / 10000).toFixed(2)}兆円` : `${debtOku.toLocaleString()}億円`}
                      </div>
                      <div className="text-[10px] text-rose-600 dark:text-rose-400 mt-0.5">
                        1人あたり {p.debtPerCapita.toLocaleString()}円
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40">
                      <div className="text-[10px] text-emerald-700 dark:text-emerald-300 font-semibold flex items-center justify-between">
                        <span>積立基金計</span>
                        <PiggyBank className="w-3 h-3 text-emerald-500" />
                      </div>
                      <div className="font-black text-emerald-950 dark:text-emerald-200 mt-0.5">
                        {reserveOku.toLocaleString()} 億円
                      </div>
                      <div className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-0.5">
                        1人あたり {p.reservePerCapita.toLocaleString()}円
                      </div>
                    </div>
                  </div>

                  {/* 比率情報バッジ */}
                  <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 px-1">
                    <span>実質公債費比率: <strong className={p.realDebtRatio >= 18 ? 'text-rose-600 font-black' : 'text-slate-700 dark:text-slate-300'}>{p.realDebtRatio.toFixed(1)}%</strong></span>
                    <span>将来負担比率: <strong className={(p.futureBurdenRatio ?? 0) > 200 ? 'text-rose-600 font-black' : 'text-slate-700 dark:text-slate-300'}>{p.futureBurdenRatio !== null ? `${p.futureBurdenRatio.toFixed(1)}%` : '-'}</strong></span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                  <span>財政カルテ詳細を見る</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition transform" />
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        /* テーブル表示モード */
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 dark:bg-slate-850 text-slate-500 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4 font-bold">都道府県</th>
                  <th className="py-3 px-4 font-bold text-right">人口</th>
                  <th className="py-3 px-4 font-bold text-right">財政力指数</th>
                  <th className="py-3 px-4 font-bold text-right">地方債残高</th>
                  <th className="py-3 px-4 font-bold text-right">1人あたり負債</th>
                  <th className="py-3 px-4 font-bold text-right">積立基金</th>
                  <th className="py-3 px-4 font-bold text-right">実質公債費比率</th>
                  <th className="py-3 px-4 font-bold text-right">将来負担比率</th>
                  <th className="py-3 px-4 font-bold text-center">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredAndSorted.map((p) => {
                  const debtOku = Math.round(p.debtOutstanding / 100000);
                  const reserveOku = Math.round(p.reserveFundTotal / 100000);

                  return (
                    <tr key={p.code} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition">
                      <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                        <Link href={`/prefectures/${p.code}`} className="hover:text-indigo-600 transition">
                          {p.name}
                        </Link>
                      </td>
                      <td className="py-3 px-4 text-right text-slate-600 dark:text-slate-300">
                        {(p.population / 10000).toFixed(1)}万人
                      </td>
                      <td className="py-3 px-4 text-right font-semibold">
                        <span className={p.financialStrength >= 1.0 ? 'text-indigo-600 font-bold' : 'text-slate-700 dark:text-slate-300'}>
                          {p.financialStrength.toFixed(2)}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-rose-600">
                        {debtOku >= 10000 ? `${(debtOku / 10000).toFixed(2)}兆円` : `${debtOku.toLocaleString()}億円`}
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-slate-700 dark:text-slate-300">
                        {p.debtPerCapita.toLocaleString()}円
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-semibold text-emerald-600">
                        {reserveOku.toLocaleString()}億円
                      </td>
                      <td className="py-3 px-4 text-right font-mono">
                        <span className={p.realDebtRatio >= 18 ? 'text-rose-600 font-bold' : 'text-slate-700 dark:text-slate-300'}>
                          {p.realDebtRatio.toFixed(1)}%
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-slate-700 dark:text-slate-300">
                        {p.futureBurdenRatio !== null ? `${p.futureBurdenRatio.toFixed(1)}%` : '-'}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <Link
                          href={`/prefectures/${p.code}`}
                          className="inline-flex items-center gap-1 text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
                        >
                          <span>カルテ</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
