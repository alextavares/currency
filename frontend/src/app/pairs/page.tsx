import type { Metadata } from 'next';
import Link from 'next/link';
import Script from 'next/script';
import { MAJOR_PAIRS, getPairPageSlug, type MajorPair } from '@/lib/majorPairs';

function getSiteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL || 'https://liveforexstrength.com').replace(/\/+$/, '');
}

export const metadata: Metadata = {
  title: 'Major Forex Pairs',
  description:
    'Major and cross FX pairs derived from the 8 major currencies. Use these pages to learn how to apply currency strength to pair selection.',
  alternates: { canonical: '/pairs' },
  openGraph: {
    type: 'website',
    url: '/pairs',
    title: 'Major Forex Pairs | LiveForexStrength',
    description:
      'Explore major FX pairs and crosses and learn how to select strong-vs-weak pairs using currency strength.',
    images: [{ url: '/opengraph-image' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Major Forex Pairs | LiveForexStrength',
    description: 'Explore major FX pairs and crosses using currency strength.',
    images: ['/opengraph-image'],
  },
};

export default function PairsIndexPage() {
  const siteUrl = getSiteUrl();

  const breadcrumbs = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Dashboard', item: `${siteUrl}/` },
      { '@type': 'ListItem', position: 2, name: 'Pairs', item: `${siteUrl}/pairs` },
    ],
  };

  const itemList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: MAJOR_PAIRS.map((pair, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      url: `${siteUrl}/pairs/${getPairPageSlug(pair)}`,
      name: `${pair} currency strength context`,
    })),
  };

  return (
    <main className="min-h-screen text-slate-900 dark:text-white">
      <Script id="pairs-breadcrumbs-jsonld" type="application/ld+json" strategy="beforeInteractive">
        {JSON.stringify(breadcrumbs)}
      </Script>
      <Script id="pairs-itemlist-jsonld" type="application/ld+json" strategy="beforeInteractive">
        {JSON.stringify(itemList)}
      </Script>

      <div className="pointer-events-none fixed inset-0 -z-10 hidden dark:block bg-[radial-gradient(900px_circle_at_20%_10%,rgba(59,130,246,0.18),transparent_55%),radial-gradient(800px_circle_at_80%_20%,rgba(16,185,129,0.12),transparent_55%),linear-gradient(to_bottom,rgba(2,6,23,1),rgba(0,0,0,1))]" />
      <div className="pointer-events-none fixed inset-0 -z-10 dark:hidden bg-[radial-gradient(900px_circle_at_20%_10%,rgba(106,34,179,0.10),transparent_60%),radial-gradient(800px_circle_at_80%_20%,rgba(61,96,141,0.10),transparent_60%),linear-gradient(to_bottom,rgba(244,245,250,1),rgba(244,245,250,1))]" />

      <div className="container mx-auto max-w-4xl p-4 sm:p-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Major Forex Pairs</h1>
          <Link
            href="/"
            className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline dark:text-blue-300 dark:hover:text-blue-200"
          >
            ← Back to Dashboard
          </Link>
        </div>

        <section className="rounded-2xl border border-black/5 bg-white/60 p-6 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5">
          <p className="leading-relaxed text-slate-700 dark:text-white/80">
            A currency strength meter becomes actionable when you translate rankings into{' '}
            <strong>pair selection</strong>. These pages give quick context for the most commonly
            traded pairs derived from the 8 major currencies.
          </p>
          <p className="mt-3 leading-relaxed text-slate-700 dark:text-white/80">
            For the clean trend method, read:{' '}
            <Link href="/blog/2025-12-31-strong-vs-weak-pairs-how-to-pick" className="text-blue-600 hover:underline dark:text-blue-300">
              strong vs weak pair selection
            </Link>
            .
          </p>
        </section>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {MAJOR_PAIRS.map((pair) => (
            <PairCard key={pair} pair={pair} />
          ))}
        </div>
      </div>
    </main>
  );
}

function PairCard({ pair }: { pair: MajorPair }) {
  return (
    <Link
      href={`/pairs/${getPairPageSlug(pair)}`}
      className="rounded-2xl border border-black/5 bg-white/60 p-5 shadow-sm backdrop-blur transition hover:bg-white/80 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
    >
      <div className="flex items-baseline justify-between">
        <div className="text-lg font-semibold">{pair}</div>
        <div className="text-xs font-mono text-slate-500 dark:text-white/60">pair</div>
      </div>
      <div className="mt-3 text-sm font-semibold text-blue-600 dark:text-blue-300">View context →</div>
    </Link>
  );
}

