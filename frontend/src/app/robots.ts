import type { MetadataRoute } from 'next';

function getSiteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL || 'https://liveforexstrength.com').replace(/\/+$/, '');
}

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/socket.io/', '/health'],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
