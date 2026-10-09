import fruitsDataRaw from '@/data/handbook/fruits.json';
import { FruitHandbookData, FruitItem, FruitRankingItem } from '@/types/handbook';

const fruitsData: FruitHandbookData = fruitsDataRaw as FruitHandbookData;

export function getFruitHandbookData(): FruitHandbookData {
  return fruitsData;
}

export function getAllFruits(): FruitItem[] {
  return fruitsData.items;
}

export function getFruitById(id: string): FruitItem | undefined {
  return fruitsData.items.find((item) => item.id === id);
}

/**
 * 特定の都道府県コードが上位にランクインしている果実一覧を取得
 */
export function getFruitsByPrefecture(prefectureCode: string): { fruit: FruitItem; rankItem: FruitRankingItem }[] {
  const result: { fruit: FruitItem; rankItem: FruitRankingItem }[] = [];

  for (const fruit of fruitsData.items) {
    const rankItem = fruit.rankings.find((r) => r.prefectureCode === prefectureCode);
    if (rankItem) {
      result.push({ fruit, rankItem });
    }
  }

  // 順位順にソート（1位が先頭）
  return result.sort((a, b) => a.rankItem.rank - b.rankItem.rank);
}

/**
 * 特定の自治体コードが主要産地として登録されている果実一覧を取得
 */
export function getFruitsByMunicipality(municipalityCode: string): { fruit: FruitItem; rankItem: FruitRankingItem; highlight?: string }[] {
  const result: { fruit: FruitItem; rankItem: FruitRankingItem; highlight?: string }[] = [];

  for (const fruit of fruitsData.items) {
    for (const ranking of fruit.rankings) {
      const city = ranking.mainCities.find((c) => c.code === municipalityCode);
      if (city) {
        result.push({
          fruit,
          rankItem: ranking,
          highlight: city.highlight,
        });
      }
    }
  }

  return result.sort((a, b) => a.rankItem.rank - b.rankItem.rank);
}
