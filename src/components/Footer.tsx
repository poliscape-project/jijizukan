import React from "react";
import { Code2, Heart } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-200 bg-white py-10 text-slate-500 text-xs mt-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <p className="font-semibold text-slate-800">
            時事図鑑 — 政治・国際情勢を、テーマごとに追跡
          </p>
          <p className="mt-1 text-slate-500">
            本サイトは事実関係のみを記載し、特定の立場を支持するものではありません。
          </p>
          <p className="mt-1 text-slate-400">
            姉妹サイト:{" "}
            <a
              href="https://poliscape.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline underline-offset-2"
            >
              日本政策図鑑
            </a>
            {" "}— くらしに関わる国のルールを、データと図解で
          </p>
        </div>
        <div className="flex flex-col sm:items-end gap-2 shrink-0">
          <span className="flex items-center gap-1.5 text-slate-400">
            <Code2 className="w-3.5 h-3.5 text-slate-400" />
            <span>Civic Tech Project with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          </span>
          <p className="text-[11px] text-slate-400">
            © {new Date().getFullYear()} 時事図鑑
          </p>
        </div>
      </div>
    </footer>
  );
};
