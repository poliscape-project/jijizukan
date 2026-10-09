import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getMunicipalityByCode, getMunicipalityHistory, getMunicipalitySummaries } from '@/lib/municipalities';
import CompareView from '@/components/municipality/compare/CompareView';
import MunicipalityFooter from '@/components/municipality/MunicipalityFooter';

interface Props {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const resolvedParams = await searchParams;
  const codeA = typeof resolvedParams.a === 'string' ? resolvedParams.a : '234273';
  const codeB = typeof resolvedParams.b === 'string' ? resolvedParams.b : '012092';

  const mA = getMunicipalityByCode(codeA) || getMunicipalityByCode('234273');
  const mB = getMunicipalityByCode(codeB) || getMunicipalityByCode('012092');

  if (!mA || !mB) {
    return { title: '自治体比較 | 全国自治体カルテ' };
  }

  return {
    title: `${mA.name} と ${mB.name} の財政・決算データ比較 | 全国自治体カルテ`,
    description: `${mA.prefName}${mA.name}と${mB.prefName}${mB.name}の地方財政状況調査（決算カード）詳細比較。財政力指数、住民1人あたり土木費、実質純資産、ふるさと納税収支、10年間の推移をグラフで客観対比。`,
    openGraph: {
      title: `${mA.name} と ${mB.name} の財政・決算データ比較 | 全国自治体カルテ`,
      description: `${mA.name}と${mB.name}の財政健全度、住民1人あたり負担、10年推移を客観比較。`,
    }
  };
}

export default async function MunicipalityComparePage({ searchParams }: Props) {
  const resolvedParams = await searchParams;
  // デフォルト: 飛島村 (234273) vs 夕張市 (012092)
  const codeA = typeof resolvedParams.a === 'string' ? resolvedParams.a : '234273';
  const codeB = typeof resolvedParams.b === 'string' ? resolvedParams.b : '012092';

  const mA = getMunicipalityByCode(codeA) || getMunicipalityByCode('234273');
  const mB = getMunicipalityByCode(codeB) || getMunicipalityByCode('012092');

  if (!mA || !mB) {
    notFound();
  }

  const historyA = getMunicipalityHistory(mA.code);
  const historyB = getMunicipalityHistory(mB.code);
  const summaries = getMunicipalitySummaries();

  return (
    <>
      <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        <CompareView
          muniA={mA}
          muniB={mB}
          historyA={historyA}
          historyB={historyB}
          summaries={summaries}
        />
      </main>
      <MunicipalityFooter />
    </>
  );
}
