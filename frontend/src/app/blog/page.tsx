import Link from 'next/link';
import { getAllPosts } from '@/lib/blog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Metadata } from 'next';
import Script from 'next/script';

type Props = { searchParams: Promise<{ q?: string }> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { q } = await searchParams;
  const query = (q || '').trim();

  const base: Metadata = {
    title: 'Market Analysis Blog',
    description: 'Forex market analysis, currency strength insights, and strength-based trade ideas.',
    alternates: { canonical: '/blog' },
    openGraph: {
      type: 'website',
      url: '/blog',
      title: 'Market Analysis Blog',
      description: 'Forex market analysis, currency strength insights, and strength-based trade ideas.',
      images: [{ url: '/opengraph-image' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Market Analysis Blog',
      description: 'Forex market analysis, currency strength insights, and strength-based trade ideas.',
      images: ['/opengraph-image'],
    },
  };

  if (!query) return base;

  return {
    ...base,
    title: `Search: ${query}`,
    robots: { index: false, follow: true },
  };
}

export default async function BlogIndex({ searchParams }: Props) {
  const { q } = await searchParams;
  const query = (q || '').trim();

  const posts = getAllPosts();
  const filteredPosts =
    query.length === 0
      ? posts
      : posts.filter((post) => {
          const haystack = `${post.title}\n${post.excerpt || ''}`.toLowerCase();
          return haystack.includes(query.toLowerCase());
        });

  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://liveforexstrength.com').replace(
    /\/+$/,
    '',
  );

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Dashboard',
        item: `${siteUrl}/`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Blog',
        item: `${siteUrl}/blog`,
      },
    ],
  };

  const listSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: filteredPosts.map((post, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      url: `${siteUrl}/blog/${post.slug}`,
      name: post.title,
    })),
  };

  return (
    <>
      <Script id="blog-breadcrumbs-jsonld" type="application/ld+json" strategy="beforeInteractive">
        {JSON.stringify(breadcrumbSchema)}
      </Script>
      <Script id="blog-itemlist-jsonld" type="application/ld+json" strategy="beforeInteractive">
        {JSON.stringify(listSchema)}
      </Script>

      <div className="container mx-auto py-10 px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold tracking-tight">Market Analysis</h1>
          <Link href="/" className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline">
            ← Back to Dashboard
          </Link>
        </div>

        <form action="/blog" method="get" className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="text-sm font-medium text-slate-700 dark:text-white/80" htmlFor="q">
            Search articles
          </label>
          <div className="flex flex-1 items-center gap-2">
            <input
              id="q"
              name="q"
              defaultValue={query}
              placeholder="e.g. strong vs weak"
              className="w-full rounded-xl border border-black/10 bg-white/70 px-4 py-2 text-sm text-slate-900 shadow-sm outline-none ring-blue-500/30 placeholder:text-slate-500 focus:ring-4 dark:border-white/10 dark:bg-white/10 dark:text-white dark:placeholder:text-white/50"
            />
            <button
              type="submit"
              className="shrink-0 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-white/90"
            >
              Search
            </button>
          </div>
          {query ? (
            <Link
              href="/blog"
              className="text-sm font-semibold text-slate-600 hover:underline dark:text-white/70"
            >
              Clear
            </Link>
          ) : null}
        </form>

        {filteredPosts.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <p className="text-xl">
              {query ? 'No articles match your search.' : 'No analysis articles published yet.'}
            </p>
            <p className="mt-2">
              {query ? 'Try a different keyword.' : 'Check back soon for daily market updates.'}
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredPosts.map((post) => (
              <Link href={`/blog/${post.slug}`} key={post.slug} className="group">
                <Card className="h-full transition-all hover:shadow-lg border-gray-200 hover:border-blue-200">
                  <CardHeader>
                    <div className="text-sm text-gray-500 mb-2">{post.date}</div>
                    <CardTitle className="group-hover:text-blue-600 transition-colors">
                      {post.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 line-clamp-3">
                      {post.excerpt || 'Read the full market analysis...'}
                    </p>
                    <div className="mt-4 text-sm font-medium text-blue-500 group-hover:underline">
                      Read Analysis →
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
