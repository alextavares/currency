import type { Metadata } from 'next';
import Link from 'next/link';
import Script from 'next/script';

const CURRENCIES = ['USD', 'EUR', 'GBP', 'JPY', 'CHF', 'CAD', 'AUD', 'NZD'] as const;
type CurrencyCode = (typeof CURRENCIES)[number];

function getSiteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL || 'https://liveforexstrength.com').replace(/\/+$/, '');
}

export const metadata: Metadata = {
  title: 'Currencies',
  description:
    'Currency strength pages for the 8 major FX currencies (USD, EUR, GBP, JPY, CHF, CAD, AUD, NZD).',
  alternates: { canonical: '/currencies' },
  openGraph: {
    type: 'website',
    url: '/currencies',
    title: 'Currencies | LiveForexStrength',
    description:
      'Explore currency strength pages for USD, EUR, GBP, JPY, CHF, CAD, AUD and NZD.',
    images: [{ url: '/opengraph-image' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Currencies | LiveForexStrength',
    description: 'Explore currency strength pages for the 8 major FX currencies.',
    images: ['/opengraph-image'],
  },
};

export default function CurrenciesIndexPage() {
  const siteUrl = getSiteUrl();

  const breadcrumbs = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Dashboard', item: `${siteUrl}/` },
      { '@type': 'ListItem', position: 2, name: 'Currencies', item: `${siteUrl}/currencies` },
    ],
  };

  const itemList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: CURRENCIES.map((c, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      url: `${siteUrl}/currencies/${c.toLowerCase()}`,
      name: `${c} currency strength`,
    })),
  };

  return (
    <main className="min-h-screen text-slate-900 dark:text-white">
      <Script id="currencies-breadcrumbs-jsonld" type="application/ld+json" strategy="beforeInteractive">
        {JSON.stringify(breadcrumbs)}
      </Script>
      <Script id="currencies-itemlist-jsonld" type="application/ld+json" strategy="beforeInteractive">
        {JSON.stringify(itemList)}
      </Script>

      <div className="pointer-events-none fixed inset-0 -z-10 hidden dark:block bg-[radial-gradient(900px_circle_at_20%_10%,rgba(59,130,246,0.18),transparent_55%),radial-gradient(800px_circle_at_80%_20%,rgba(16,185,129,0.12),transparent_55%),linear-gradient(to_bottom,rgba(2,6,23,1),rgba(0,0,0,1))]" />
      <div className="pointer-events-none fixed inset-0 -z-10 dark:hidden bg-[radial-gradient(900px_circle_at_20%_10%,rgba(106,34,179,0.10),transparent_60%),radial-gradient(800px_circle_at_80%_20%,rgba(61,96,141,0.10),transparent_60%),linear-gradient(to_bottom,rgba(244,245,250,1),rgba(244,245,250,1))]" />

      <div className="container mx-auto max-w-4xl p-4 sm:p-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Currencies</h1>
          <Link
            href="/"
            className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline dark:text-blue-300 dark:hover:text-blue-200"
          >
            ← Back to Dashboard
          </Link>
        </div>

        <section className="rounded-2xl border border-black/5 bg-white/60 p-6 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5">
          <p className="leading-relaxed text-slate-700 dark:text-white/80">
            These pages explain how to interpret currency strength for each major currency. If you
            want a quick scan, open the live meter and look for strong-vs-weak combinations.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {CURRENCIES.map((c) => (
              <CurrencyPill key={c} code={c} />
            ))}
          </div>
        </section>

        <section className="mt-6 rounded-2xl border border-black/5 bg-white/60 p-6 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5">
          <h2 className="text-lg font-semibold">How to use these pages</h2>
          <ul className="mt-3 list-disc pl-5 text-slate-700 dark:text-white/80 space-y-1">
            <li>Start with a higher timeframe (4h/12h/1W) to identify the dominant bias.</li>
            <li>Confirm on a lower timeframe (5m/15m/30m) to time entries.</li>
            <li>
              Look for pairs that combine a strong currency with a weak currency (e.g., strong USD
              vs weak JPY).
            </li>
          </ul>
        </section>
      </div>
    </main>
  );
}

function CurrencyPill({ code }: { code: CurrencyCode }) {
  return (
    <Link
      href={`/currencies/${code.toLowerCase()}`}
      className="rounded-full border border-black/10 bg-white/70 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-white dark:border-white/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
    >
      {code}
    </Link>
  );
}

