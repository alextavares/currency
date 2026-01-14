import type { Metadata } from 'next';
import Link from 'next/link';
import Script from 'next/script';
import { notFound } from 'next/navigation';
import { MAJOR_PAIRS, getPairParts, getPairPageSlug, normalizeMajorPair, type MajorPair } from '@/lib/majorPairs';

function getSiteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL || 'https://liveforexstrength.com').replace(/\/+$/, '');
}

type Props = { params: Promise<{ pair: string }> };

export function generateStaticParams(): Array<{ pair: string }> {
  // Keep static generation limited to the supported major/cross set.
  return MAJOR_PAIRS.map((pair) => ({ pair: getPairPageSlug(pair) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { pair: raw } = await params;
  const normalized = normalizeMajorPair(raw);
  if (!normalized) {
    return { title: 'Pair Not Found', robots: { index: false, follow: false } };
  }

  const { base, quote } = getPairParts(normalized);
  const title = `${normalized} Strength Context`;
  const description = `How to use currency strength to analyze ${normalized} (${base}/${quote}) across timeframes and pick strong-vs-weak setups.`;

  return {
    title,
    description,
    alternates: { canonical: `/pairs/${getPairPageSlug(normalized)}` },
    openGraph: {
      type: 'website',
      url: `/pairs/${getPairPageSlug(normalized)}`,
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

function getPairNotes(pair: MajorPair): { summary: string; whatToWatch: string[] } {
  const { base, quote } = getPairParts(pair);
  const summary = `${pair} is quoted as ${base}/${quote}. When ${base} is strong and ${quote} is weak, the pair typically has a bullish bias. When ${base} is weak and ${quote} is strong, the bias is often bearish.`;

  const whatToWatch = [
    'Check alignment on higher timeframes first (4h/12h/1W) before drilling down.',
    'Prefer wide strength spreads (clear top vs bottom) over clustered scores around 50.',
    'Use structure for timing (pullback + continuation) instead of chasing spikes.',
  ];

  return { summary, whatToWatch };
}

export default async function PairPage({ params }: Props) {
  const { pair: raw } = await params;
  const normalized = normalizeMajorPair(raw);
  if (!normalized) notFound();

  const siteUrl = getSiteUrl();
  const { base, quote } = getPairParts(normalized);
  const slug = getPairPageSlug(normalized);
  const pageUrl = `${siteUrl}/pairs/${slug}`;
  const { summary, whatToWatch } = getPairNotes(normalized);

  const breadcrumbs = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Dashboard', item: `${siteUrl}/` },
      { '@type': 'ListItem', position: 2, name: 'Pairs', item: `${siteUrl}/pairs` },
      { '@type': 'ListItem', position: 3, name: normalized, item: pageUrl },
    ],
  };

  const webpage = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    url: pageUrl,
    name: `${normalized} strength context`,
    description: `How to apply currency strength to ${normalized} across multiple timeframes.`,
    isPartOf: { '@type': 'WebSite', name: 'LiveForexStrength', url: siteUrl },
  };

  return (
    <main className="min-h-screen text-slate-900 dark:text-white">
      <Script id={`pair-breadcrumbs-${normalized}`} type="application/ld+json" strategy="beforeInteractive">
        {JSON.stringify(breadcrumbs)}
      </Script>
      <Script id={`pair-webpage-${normalized}`} type="application/ld+json" strategy="beforeInteractive">
        {JSON.stringify(webpage)}
      </Script>

      <div className="pointer-events-none fixed inset-0 -z-10 hidden dark:block bg-[radial-gradient(900px_circle_at_20%_10%,rgba(59,130,246,0.18),transparent_55%),radial-gradient(800px_circle_at_80%_20%,rgba(16,185,129,0.12),transparent_55%),linear-gradient(to_bottom,rgba(2,6,23,1),rgba(0,0,0,1))]" />
      <div className="pointer-events-none fixed inset-0 -z-10 dark:hidden bg-[radial-gradient(900px_circle_at_20%_10%,rgba(106,34,179,0.10),transparent_60%),radial-gradient(800px_circle_at_80%_20%,rgba(61,96,141,0.10),transparent_60%),linear-gradient(to_bottom,rgba(244,245,250,1),rgba(244,245,250,1))]" />

      <div className="container mx-auto max-w-4xl p-4 sm:p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <div className="text-xs uppercase tracking-wide text-slate-500 dark:text-white/60">Pairs</div>
            <h1 className="text-3xl font-bold tracking-tight">{normalized}</h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-white/70">
              {base}/{quote} • currency strength context
            </p>
          </div>
          <Link
            href="/pairs"
            className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline dark:text-blue-300 dark:hover:text-blue-200"
          >
            ← Back to Pairs
          </Link>
        </div>

        <section className="rounded-2xl border border-black/5 bg-white/60 p-6 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5">
          <p className="leading-relaxed text-slate-700 dark:text-white/80">{summary}</p>

          <div className="mt-5 flex flex-wrap gap-2">
            <Link
              href="/?tf=4h"
              className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-white/90"
            >
              Open dashboard (4h)
            </Link>
            <Link
              href="/timeframes"
              className="rounded-xl border border-black/10 bg-white/70 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-white dark:border-white/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
            >
              Timeframes guide
            </Link>
          </div>
        </section>

        <section className="mt-6 rounded-2xl border border-black/5 bg-white/60 p-6 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5">
          <h2 className="text-lg font-semibold">Currency context</h2>
          <p className="mt-2 text-slate-700 dark:text-white/80">
            Learn how each side behaves in the basket:
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              href={`/currencies/${base.toLowerCase()}`}
              className="rounded-full border border-black/10 bg-white/70 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-white dark:border-white/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
            >
              {base} strength page
            </Link>
            <Link
              href={`/currencies/${quote.toLowerCase()}`}
              className="rounded-full border border-black/10 bg-white/70 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-white dark:border-white/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
            >
              {quote} strength page
            </Link>
          </div>
        </section>

        <section className="mt-6 rounded-2xl border border-black/5 bg-white/60 p-6 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5">
          <h2 className="text-lg font-semibold">What to watch</h2>
          <ul className="mt-3 list-disc pl-5 text-slate-700 dark:text-white/80 space-y-1">
            {whatToWatch.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
          <p className="mt-4 text-slate-700 dark:text-white/80">
            Related reading:{' '}
            <Link
              href="/blog/2025-12-31-strong-vs-weak-pairs-how-to-pick"
              className="text-blue-600 hover:underline dark:text-blue-300"
            >
              how to pick strong vs weak pairs
            </Link>
            .
          </p>
        </section>
      </div>
    </main>
  );
}
