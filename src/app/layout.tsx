import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "時事図鑑 | 政治・国際情勢を事実ベースで追跡",
    template: "%s | 時事図鑑",
  },
  description:
    "国内政治と国際関係の動きを、テーマごとに事実ベースで時系列追跡。細かいニュースを追わなくても「今どうなっているか」がわかる。",
  keywords: [
    "政治",
    "国際関係",
    "時事",
    "ニュースまとめ",
    "時事図鑑",
    "国会",
    "外交",
    "安全保障",
  ],
  authors: [{ name: "時事図鑑" }],
  creator: "時事図鑑",
  publisher: "時事図鑑",
  openGraph: {
    title: "時事図鑑 | 政治・国際情勢を事実ベースで追跡",
    description:
      "国内政治と国際関係の動きを、テーマごとに事実ベースで時系列追跡。",
    siteName: "時事図鑑",
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "時事図鑑 | 政治・国際情勢を事実ベースで追跡",
    description:
      "国内政治と国際関係の動きを、テーマごとに事実ベースで時系列追跡。",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}
