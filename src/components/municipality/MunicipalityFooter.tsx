import React from 'react';
import Link from 'next/link';
import { Building2, Code2, Heart } from 'lucide-react';

export default function MunicipalityFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white py-10 text-slate-500 text-xs mt-16">
      <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-5 h-5 rounded-md bg-indigo-600 text-white flex items-center justify-center">
              <Building2 className="w-3 h-3" />
            </div>
            <span className="font-bold text-slate-800 text-sm">
              全国自治体カルテ
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-semibold border border-indigo-200/50">
              地方財政オープンデータ
            </span>
          </div>
          <p className="text-slate-500 text-xs leading-relaxed">
            総務省「地方財政状況調査（決算カード）」のオープンデータを基に、全国47都道府県・全1,741市区町村の決算と税金の使い道を完全可視化するシビックテック基盤です。
          </p>
          <div className="flex flex-wrap items-center gap-3 mt-2 text-[11px] text-slate-400">
            <span>連携プロジェクト:</span>
            <Link href="/" className="text-indigo-600 hover:underline">
              時事図鑑（政治・国際情勢追跡）
            </Link>
            <span>•</span>
            <Link href="/prefectures" className="text-indigo-600 hover:underline">
              47都道府県カルテ
            </Link>
            <span>•</span>
            <Link href="/handbook" className="text-indigo-600 hover:underline">
              都道府県便覧（特産品・果実）
            </Link>
            <span>•</span>
            <a
              href="https://poliscape.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 hover:underline"
            >
              日本政策図鑑（政策データ基盤）
            </a>
          </div>
        </div>

        <div className="flex flex-col sm:items-end gap-2 shrink-0">
          <span className="flex items-center gap-1.5 text-slate-400">
            <Code2 className="w-3.5 h-3.5 text-slate-400" />
            <span>Civic Tech Project with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          </span>
          <p className="text-[11px] text-slate-400">
            © {new Date().getFullYear()} 全国自治体カルテ
          </p>
        </div>
      </div>
    </footer>
  );
}
