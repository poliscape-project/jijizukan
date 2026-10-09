import { MetadataRoute } from 'next';
import { getAllTopics } from '@/lib/topics';
import { getAllMunicipalities } from '@/lib/municipalities';
import { getAllPrefectures } from '@/lib/prefectures';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://jijizukan.vercel.app';
  const now = new Date();

  // 静的主要ページ
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/topics`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/domestic`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/international`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/municipalities`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/municipalities/compare`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/prefectures`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/handbook`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
  ];

  // 政策トピック一覧 (全177件)
  const topics = getAllTopics();
  const topicRoutes: MetadataRoute.Sitemap = topics.map((topic) => ({
    url: `${baseUrl}/topics/${topic.id}`,
    lastModified: new Date(topic.lastUpdated || now),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // 都道府県詳細ページ (全47件)
  const prefectures = getAllPrefectures();
  const prefectureRoutes: MetadataRoute.Sitemap = prefectures.map((p) => ({
    url: `${baseUrl}/prefectures/${p.code}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  // 自治体詳細ページ (全1,741件)
  const municipalities = getAllMunicipalities();
  const municipalityRoutes: MetadataRoute.Sitemap = municipalities.map((m) => ({
    url: `${baseUrl}/municipalities/${m.code}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  return [...staticRoutes, ...topicRoutes, ...prefectureRoutes, ...municipalityRoutes];
}
