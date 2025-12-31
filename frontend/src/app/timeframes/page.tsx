import type { Metadata } from 'next';
import Link from 'next/link';
import Script from 'next/script';

const TIMEFRAMES = [
  { key: '5m', label: '5m', description: 'Very short-term momentum and micro swings.' },
  { key: '15m', label: '15m', description: 'Intraday bias and timing refinement.' },
  { key: '30m', label: '30m', description: 'Cleaner intraday direction than 5m.' },
  { key: '1h', label: '1h', description: 'Intraday trend context and session structure.' },
  { key: '4h', label: '4h', description: 'Higher-timeframe bias for swing trades.' },
  { key: '12h', label: '12h', description: 'Broader bias; filters noise and chop.' },
  { key: '24h', label: '24h', description: 'Daily trend / longer-term direction.' },
  { key: '1w', label: '1W', description: 'Weekly bias; strongest context filter.' },
] as const;

type TfKey = (typeof TIMEFRAMES)[number]['key'];

function getSiteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL || 'https://liveforexstrength.com').replace(/\/+$/, '');
}

export const metadata: Metadata = {
  title: 'Timeframes',
  description:
    'How to use multiple timeframes (5m–1W) for currency strength analysis: bias vs timing and practical examples.',
  alternates: { canonical: '/timeframes' },
  openGraph: {
    type: 'website',
    url: '/timeframes',
    title: 'Timeframes | LiveForexStrength',
    description:
      'Learn how to interpret currency strength across timeframes from 5m to 1W (weekly).',
    images: [{ url: '/opengraph-image' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Timeframes | LiveForexStrength',
    description: 'Learn how to interpret currency strength from 5m to 1W.',
    images: ['/opengraph-image'],
  },
};

export default function TimeframesIndexPage() {
  const siteUrl = getSiteUrl();

  const breadcrumbs = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Dashboard', item: `${siteUrl}/` },
      { '@type': 'ListItem', position: 2, name: 'Timeframes', item: `${siteUrl}/timeframes` },
    ],
  };

  const itemList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: TIMEFRAMES.map((tf, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      url: `${siteUrl}/timeframes/${tf.key}`,
      name: `Currency strength timeframe ${tf.label}`,
    })),
  };

  return (
    <main className="min-h-screen text-slate-900 dark:text-white">
      <Script id="timeframes-breadcrumbs-jsonld" type="application/ld+json" strategy="beforeInteractive">
        {JSON.stringify(breadcrumbs)}
      </Script>
      <Script id="timeframes-itemlist-jsonld" type="application/ld+json" strategy="beforeInteractive">
        {JSON.stringify(itemList)}
      </Script>

      <div className="pointer-events-none fixed inset-0 -z-10 hidden dark:block bg-[radial-gradient(900px_circle_at_20%_10%,rgba(59,130,246,0.18),transparent_55%),radial-gradient(800px_circle_at_80%_20%,rgba(16,185,129,0.12),transparent_55%),linear-gradient(to_bottom,rgba(2,6,23,1),rgba(0,0,0,1))]" />
      <div className="pointer-events-none fixed inset-0 -z-10 dark:hidden bg-[radial-gradient(900px_circle_at_20%_10%,rgba(106,34,179,0.10),transparent_60%),radial-gradient(800px_circle_at_80%_20%,rgba(61,96,141,0.10),transparent_60%),linear-gradient(to_bottom,rgba(244,245,250,1),rgba(244,245,250,1))]" />

      <div className="container mx-auto max-w-4xl p-4 sm:p-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Timeframes</h1>
          <Link
            href="/"
            className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline dark:text-blue-300 dark:hover:text-blue-200"
          >
            ← Back to Dashboard
          </Link>
        </div>

        <section className="rounded-2xl border border-black/5 bg-white/60 p-6 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5">
          <p className="leading-relaxed text-slate-700 dark:text-white/80">
            A simple rule that works well for strength trading: use higher timeframes to define the
            bias, and lower timeframes to time entries. This reduces whipsaws and avoids trading
            against the dominant flow.
          </p>
          <p className="mt-3 leading-relaxed text-slate-700 dark:text-white/80">
            Below are quick guides for each timeframe available on the dashboard.
          </p>
        </section>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {TIMEFRAMES.map((tf) => (
            <Link
              key={tf.key}
              href={`/timeframes/${tf.key}`}
              className="rounded-2xl border border-black/5 bg-white/60 p-5 shadow-sm backdrop-blur transition hover:bg-white/80 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
            >
              <div className="flex items-baseline justify-between">
                <div className="text-lg font-semibold">{tf.label}</div>
                <div className="text-xs font-mono text-slate-500 dark:text-white/60">{tf.key}</div>
              </div>
              <div className="mt-2 text-sm text-slate-700 dark:text-white/80">{tf.description}</div>
              <div className="mt-3 text-sm font-semibold text-blue-600 dark:text-blue-300">
                View guide →
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}

