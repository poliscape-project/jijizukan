import { MetadataRoute } from 'next';
import { getAllTopics } from '@/lib/topics';
import { getAllMunicipalities } from '@/lib/municipalities';

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
  ];

  // 政策トピック一覧 (全176件)
  const topics = getAllTopics();
  const topicRoutes: MetadataRoute.Sitemap = topics.map((topic) => ({
    url: `${baseUrl}/topics/${topic.id}`,
    lastModified: new Date(topic.lastUpdated || now),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // 自治体詳細ページ (全1,741件)
  const municipalities = getAllMunicipalities();
  const municipalityRoutes: MetadataRoute.Sitemap = municipalities.map((m) => ({
    url: `${baseUrl}/municipalities/${m.code}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  return [...staticRoutes, ...topicRoutes, ...municipalityRoutes];
}
