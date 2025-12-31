import type { MetadataRoute } from 'next';
import { getAllPosts } from '@/lib/blog';
import { MAJOR_PAIRS, getPairPageSlug } from '@/lib/majorPairs';

function getSiteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL || 'https://liveforexstrength.com').replace(/\/+$/, '');
}

export const revalidate = 3600;

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}/`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${siteUrl}/heatmap`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${siteUrl}/currencies`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.5,
    },
    {
      url: `${siteUrl}/timeframes`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.5,
    },
    {
      url: `${siteUrl}/pairs`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.5,
    },
    {
      url: `${siteUrl}/about`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    {
      url: `${siteUrl}/faq`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    {
      url: `${siteUrl}/rss.xml`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.2,
    },
    {
      url: `${siteUrl}/blog`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.7,
    },
  ];

  const currencyCodes = ['usd', 'eur', 'gbp', 'jpy', 'chf', 'cad', 'aud', 'nzd'] as const;
  const currencyRoutes: MetadataRoute.Sitemap = currencyCodes.map((code) => ({
    url: `${siteUrl}/currencies/${code}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.4,
  }));

  const tfKeys = ['5m', '15m', '30m', '1h', '4h', '12h', '24h', '1w'] as const;
  const timeframeRoutes: MetadataRoute.Sitemap = tfKeys.map((tf) => ({
    url: `${siteUrl}/timeframes/${tf}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.4,
  }));

  const pairRoutes: MetadataRoute.Sitemap = MAJOR_PAIRS.map((pair) => ({
    url: `${siteUrl}/pairs/${getPairPageSlug(pair)}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.35,
  }));

  const posts = getAllPosts();
  const postRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${siteUrl}/blog/${post.slug}`,
    lastModified: safeDate(post.date) ?? now,
    changeFrequency: 'weekly',
    priority: 0.6,
  }));

  return [...staticRoutes, ...currencyRoutes, ...timeframeRoutes, ...pairRoutes, ...postRoutes];
}

function safeDate(value: string | undefined): Date | null {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}
