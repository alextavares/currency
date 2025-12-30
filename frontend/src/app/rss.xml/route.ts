import { getAllPosts } from '@/lib/blog';

function getSiteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL || 'https://liveforexstrength.com').replace(/\/+$/, '');
}

export async function GET(): Promise<Response> {
  const siteUrl = getSiteUrl();
  const posts = getAllPosts();

  const itemsXml = posts
    .map((post) => {
      const url = `${siteUrl}/blog/${post.slug}`;
      const pubDate = safeRssDate(post.date) ?? new Date().toUTCString();
      return [
        '<item>',
        `<title><![CDATA[${post.title}]]></title>`,
        `<link>${escapeXml(url)}</link>`,
        `<guid isPermaLink="true">${escapeXml(url)}</guid>`,
        `<pubDate>${pubDate}</pubDate>`,
        post.excerpt ? `<description><![CDATA[${post.excerpt}]]></description>` : '',
        '</item>',
      ]
        .filter(Boolean)
        .join('');
    })
    .join('');

  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>` +
    `<rss version="2.0">` +
    `<channel>` +
    `<title><![CDATA[LiveForexStrength]]></title>` +
    `<link>${escapeXml(siteUrl)}</link>` +
    `<description><![CDATA[Forex market analysis and currency strength insights.]]></description>` +
    `<language>en</language>` +
    `<lastBuildDate>${new Date().toUTCString()}</lastBuildDate>` +
    `<ttl>60</ttl>` +
    itemsXml +
    `</channel>` +
    `</rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=0, must-revalidate',
    },
  });
}

function safeRssDate(value: string | undefined): string | null {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d.toUTCString();
}

function escapeXml(input: string): string {
  return input
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

