import type { Metadata } from 'next';
import Link from 'next/link';
import Script from 'next/script';
import { notFound } from 'next/navigation';

const CURRENCIES = ['USD', 'EUR', 'GBP', 'JPY', 'CHF', 'CAD', 'AUD', 'NZD'] as const;
type CurrencyCode = (typeof CURRENCIES)[number];

function getSiteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL || 'https://liveforexstrength.com').replace(/\/+$/, '');
}

function normalizeCode(raw: string): CurrencyCode | null {
  const upper = raw.trim().toUpperCase();
  return (CURRENCIES as readonly string[]).includes(upper) ? (upper as CurrencyCode) : null;
}

function getCurrencySummary(code: CurrencyCode): { title: string; blurb: string; pairs: string[] } {
  switch (code) {
    case 'USD':
      return {
        title: 'US Dollar (USD)',
        blurb:
          'USD is the world’s main reserve currency and sits on one side of most major FX pairs. USD strength often reflects risk sentiment, rate expectations, and liquidity conditions.',
        pairs: ['EURUSD', 'GBPUSD', 'USDJPY', 'USDCHF', 'USDCAD', 'AUDUSD', 'NZDUSD'],
      };
    case 'EUR':
      return {
        title: 'Euro (EUR)',
        blurb:
          'EUR strength often moves with Eurozone rates, energy dynamics, and broad risk conditions. EURUSD is the most traded FX pair and tends to set the tone for EUR crosses.',
        pairs: ['EURUSD', 'EURGBP', 'EURJPY', 'EURCHF', 'EURCAD', 'EURAUD', 'EURNZD'],
      };
    case 'GBP':
      return {
        title: 'British Pound (GBP)',
        blurb:
          'GBP can be volatile, especially around UK data releases and BOE expectations. Strong/weak GBP readings can move quickly across GBPUSD and GBPJPY.',
        pairs: ['GBPUSD', 'GBPJPY', 'GBPCHF', 'GBPCAD', 'GBPAUD', 'GBPNZD', 'EURGBP'],
      };
    case 'JPY':
      return {
        title: 'Japanese Yen (JPY)',
        blurb:
          'JPY is a classic funding currency. JPY strength often appears during risk-off moves, while JPY weakness can appear during carry trade conditions.',
        pairs: ['USDJPY', 'EURJPY', 'GBPJPY', 'AUDJPY', 'NZDJPY', 'CADJPY', 'CHFJPY'],
      };
    case 'CHF':
      return {
        title: 'Swiss Franc (CHF)',
        blurb:
          'CHF can behave as a defensive currency during risk-off periods. CHF strength may show up in CHFJPY and USDCHF, especially when global volatility increases.',
        pairs: ['USDCHF', 'EURCHF', 'GBPCHF', 'CHFJPY', 'AUDCHF', 'NZDCHF', 'CADCHF'],
      };
    case 'CAD':
      return {
        title: 'Canadian Dollar (CAD)',
        blurb:
          'CAD often correlates with oil and North American growth expectations. USDCAD is the primary reference; CADJPY is also popular for risk sentiment.',
        pairs: ['USDCAD', 'CADJPY', 'CADCHF', 'EURCAD', 'GBPCAD', 'AUDCAD', 'NZDCAD'],
      };
    case 'AUD':
      return {
        title: 'Australian Dollar (AUD)',
        blurb:
          'AUD is commonly treated as a risk-on currency. AUD strength can align with commodities and broader growth sentiment, often showing clearly in AUDJPY and AUDUSD.',
        pairs: ['AUDUSD', 'AUDJPY', 'AUDCHF', 'AUDCAD', 'AUDNZD', 'EURAUD', 'GBPAUD'],
      };
    case 'NZD':
      return {
        title: 'New Zealand Dollar (NZD)',
        blurb:
          'NZD behaves similarly to AUD in many regimes but can diverge around local data and RBNZ expectations. NZDUSD and NZDJPY are common benchmarks.',
        pairs: ['NZDUSD', 'NZDJPY', 'NZDCHF', 'NZDCAD', 'AUDNZD', 'EURNZD', 'GBPNZD'],
      };
  }
}

type Props = { params: Promise<{ code: string }> };

export function generateStaticParams(): Array<{ code: string }> {
  return CURRENCIES.map((c) => ({ code: c.toLowerCase() }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { code: raw } = await params;
  const code = normalizeCode(raw);
  if (!code) {
    return {
      title: 'Currency Not Found',
      robots: { index: false, follow: false },
    };
  }

  const summary = getCurrencySummary(code);
  const title = `${summary.title} Strength`;
  const description = `How to interpret ${code} strength on the LiveForexStrength meter (0–100), plus the most relevant major pairs.`;

  return {
    title,
    description,
    alternates: { canonical: `/currencies/${code.toLowerCase()}` },
    openGraph: {
      type: 'website',
      url: `/currencies/${code.toLowerCase()}`,
      title: `${title} | LiveForexStrength`,
      description,
      images: [{ url: '/opengraph-image' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | LiveForexStrength`,
      description,
      images: ['/opengraph-image'],
    },
  };
}

export default async function CurrencyPage({ params }: Props) {
  const { code: raw } = await params;
  const code = normalizeCode(raw);
  if (!code) notFound();

  const siteUrl = getSiteUrl();
  const { title, blurb, pairs } = getCurrencySummary(code);
  const pageUrl = `${siteUrl}/currencies/${code.toLowerCase()}`;

  const breadcrumbs = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Dashboard', item: `${siteUrl}/` },
      { '@type': 'ListItem', position: 2, name: 'Currencies', item: `${siteUrl}/currencies` },
      { '@type': 'ListItem', position: 3, name: code, item: pageUrl },
    ],
  };

  const webpage = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    url: pageUrl,
    name: `${title} strength`,
    description: `Interpret ${code} strength across multiple timeframes and identify strong-vs-weak pairs.`,
    isPartOf: {
      '@type': 'WebSite',
      name: 'LiveForexStrength',
      url: siteUrl,
    },
  };

  return (
    <main className="min-h-screen text-slate-900 dark:text-white">
      <Script id={`currency-breadcrumbs-${code}`} type="application/ld+json" strategy="beforeInteractive">
        {JSON.stringify(breadcrumbs)}
      </Script>
      <Script id={`currency-webpage-${code}`} type="application/ld+json" strategy="beforeInteractive">
        {JSON.stringify(webpage)}
      </Script>

      <div className="pointer-events-none fixed inset-0 -z-10 hidden dark:block bg-[radial-gradient(900px_circle_at_20%_10%,rgba(59,130,246,0.18),transparent_55%),radial-gradient(800px_circle_at_80%_20%,rgba(16,185,129,0.12),transparent_55%),linear-gradient(to_bottom,rgba(2,6,23,1),rgba(0,0,0,1))]" />
      <div className="pointer-events-none fixed inset-0 -z-10 dark:hidden bg-[radial-gradient(900px_circle_at_20%_10%,rgba(106,34,179,0.10),transparent_60%),radial-gradient(800px_circle_at_80%_20%,rgba(61,96,141,0.10),transparent_60%),linear-gradient(to_bottom,rgba(244,245,250,1),rgba(244,245,250,1))]" />

      <div className="container mx-auto max-w-4xl p-4 sm:p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <div className="text-xs uppercase tracking-wide text-slate-500 dark:text-white/60">
              Currencies
            </div>
            <h1 className="text-3xl font-bold tracking-tight">{title} Strength</h1>
          </div>
          <Link
            href="/currencies"
            className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline dark:text-blue-300 dark:hover:text-blue-200"
          >
            ← Back to Currencies
          </Link>
        </div>

        <section className="rounded-2xl border border-black/5 bg-white/60 p-6 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5">
          <p className="leading-relaxed text-slate-700 dark:text-white/80">{blurb}</p>
          <p className="mt-4 leading-relaxed text-slate-700 dark:text-white/80">
            Use this page together with the live dashboard. Start from a higher timeframe (4h/12h/1W)
            to read the bias, then drop to 5m/15m/30m for timing.
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            <Link
              href="/"
              className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-white/90"
            >
              Open Live Dashboard
            </Link>
            <Link
              href="/timeframes"
              className="rounded-xl border border-black/10 bg-white/70 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-white dark:border-white/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
            >
              Timeframes Guide
            </Link>
          </div>
        </section>

        <section className="mt-6 rounded-2xl border border-black/5 bg-white/60 p-6 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5">
          <h2 className="text-lg font-semibold">Key major pairs for {code}</h2>
          <p className="mt-2 text-slate-700 dark:text-white/80">
            When {code} is strong, you generally want it as the base currency against a weaker currency
            (e.g., {code}XXX). When {code} is weak, you often look for the opposite direction (XXX{code}).
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {pairs.map((p) => (
              <span
                key={p}
                className="rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/10 dark:text-white/80 dark:ring-white/10"
              >
                {p}
              </span>
            ))}
          </div>
        </section>

        <section className="mt-6 rounded-2xl border border-black/5 bg-white/60 p-6 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5">
          <h2 className="text-lg font-semibold">Explore other currencies</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {CURRENCIES.filter((c) => c !== code).map((c) => (
              <Link
                key={c}
                href={`/currencies/${c.toLowerCase()}`}
                className="rounded-full border border-black/10 bg-white/70 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-white dark:border-white/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
              >
                {c}
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
