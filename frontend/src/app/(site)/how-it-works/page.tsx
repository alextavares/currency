import type { Metadata } from 'next';
import Link from 'next/link';
import Script from 'next/script';

function getSiteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL || 'https://liveforexstrength.com').replace(/\/+$/, '');
}

export const metadata: Metadata = {
  title: 'How It Works (Currency Strength Method)',
  description:
    'Learn how LiveForexStrength computes a 0–100 currency strength score, how to use timeframes, and how to turn rankings into strong-vs-weak pair selection.',
  alternates: { canonical: '/how-it-works' },
  openGraph: {
    type: 'article',
    url: '/how-it-works',
    title: 'How Currency Strength Works | LiveForexStrength',
    description:
      'A practical guide to currency strength: score meaning, timeframe alignment, and strong-vs-weak pair selection.',
    images: [{ url: '/opengraph-image' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'How Currency Strength Works | LiveForexStrength',
    description: 'Score meaning, timeframe alignment, and strong-vs-weak pair selection.',
    images: ['/opengraph-image'],
  },
};

export default function HowItWorksPage() {
  const siteUrl = getSiteUrl();

  const breadcrumbs = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Dashboard', item: `${siteUrl}/` },
      { '@type': 'ListItem', position: 2, name: 'How it works', item: `${siteUrl}/how-it-works` },
    ],
  };

  return (
    <main className="min-h-screen text-slate-900 dark:text-white">
      <Script id="howitworks-breadcrumbs-jsonld" type="application/ld+json" strategy="beforeInteractive">
        {JSON.stringify(breadcrumbs)}
      </Script>

      <div className="pointer-events-none fixed inset-0 -z-10 hidden dark:block bg-[radial-gradient(900px_circle_at_20%_10%,rgba(59,130,246,0.18),transparent_55%),radial-gradient(800px_circle_at_80%_20%,rgba(16,185,129,0.12),transparent_55%),linear-gradient(to_bottom,rgba(2,6,23,1),rgba(0,0,0,1))]" />
      <div className="pointer-events-none fixed inset-0 -z-10 dark:hidden bg-[radial-gradient(900px_circle_at_20%_10%,rgba(106,34,179,0.10),transparent_60%),radial-gradient(800px_circle_at_80%_20%,rgba(61,96,141,0.10),transparent_60%),linear-gradient(to_bottom,rgba(244,245,250,1),rgba(244,245,250,1))]" />

      <div className="container mx-auto max-w-4xl p-4 sm:p-6">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">How Currency Strength Works</h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-white/70">
              A practical guide to interpreting the 0–100 score and turning rankings into strong-vs-weak FX pair ideas.
            </p>
          </div>
          <Link
            href="/"
            className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline dark:text-blue-300 dark:hover:text-blue-200"
          >
            ← Back to Dashboard
          </Link>
        </div>

        <section className="rounded-2xl border border-black/5 bg-white/60 p-6 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5">
          <h2 className="text-lg font-semibold">1) What the score means</h2>
          <p className="mt-2 leading-relaxed text-slate-700 dark:text-white/80">
            Currency strength is <strong>relative</strong>. A currency cannot be “strong” by itself — it’s only strong
            compared to other currencies over a chosen timeframe. The meter aggregates price movement across multiple FX
            pairs to estimate a ranking for the 8 majors: USD, EUR, GBP, JPY, CHF, CAD, AUD, NZD.
          </p>
          <p className="mt-3 leading-relaxed text-slate-700 dark:text-white/80">
            The score is normalized to <strong>0–100</strong> so you can read it quickly. It’s not a prediction, and it
            does not guarantee that a move will continue — it’s a structured snapshot of which currencies have
            outperformed or underperformed over that window.
          </p>
        </section>

        <section className="mt-6 rounded-2xl border border-black/5 bg-white/60 p-6 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5">
          <h2 className="text-lg font-semibold">2) Why timeframes matter</h2>
          <p className="mt-2 leading-relaxed text-slate-700 dark:text-white/80">
            Short timeframes (5m/15m/30m) measure <strong>momentum</strong>. Higher timeframes (4h/12h/24h/1W) measure
            <strong> bias</strong>. If you mix them, you often get chopped.
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-black/5 bg-white/70 p-4 dark:border-white/10 dark:bg-white/5">
              <div className="text-sm font-semibold">Bias first</div>
              <p className="mt-1 text-sm text-slate-700 dark:text-white/75">
                Pick the direction using 4h/12h/1W. Look for clear top vs bottom separation.
              </p>
            </div>
            <div className="rounded-xl border border-black/5 bg-white/70 p-4 dark:border-white/10 dark:bg-white/5">
              <div className="text-sm font-semibold">Timing second</div>
              <p className="mt-1 text-sm text-slate-700 dark:text-white/75">
                Use 5m/15m to time entries with structure (pullbacks, breakouts).
              </p>
            </div>
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            <Link
              href="/timeframes"
              className="rounded-xl border border-black/10 bg-white/70 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-white dark:border-white/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
            >
              Timeframes guide →
            </Link>
            <Link
              href="/?tf=4h"
              className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-white/90"
            >
              Open dashboard (4h)
            </Link>
          </div>
        </section>

        <section className="mt-6 rounded-2xl border border-black/5 bg-white/60 p-6 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5">
          <h2 className="text-lg font-semibold">3) Strong vs weak pair selection</h2>
          <p className="mt-2 leading-relaxed text-slate-700 dark:text-white/80">
            The cleanest way to use a strength meter is as a <strong>filter</strong>:
          </p>
          <ol className="mt-3 list-decimal pl-5 text-slate-700 dark:text-white/80 space-y-2">
            <li>
              Identify the top 1–2 currencies (strongest) and bottom 1–2 currencies (weakest) on a higher timeframe.
            </li>
            <li>
              Build pairs using strong-as-base vs weak-as-quote (example: strong EUR + weak JPY → EURJPY bias up).
            </li>
            <li>Confirm with price structure before taking trades. Avoid chasing spikes.</li>
          </ol>
          <div className="mt-5 flex flex-wrap gap-2">
            <Link
              href="/pairs"
              className="rounded-xl border border-black/10 bg-white/70 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-white dark:border-white/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
            >
              Browse major pairs →
            </Link>
            <Link
              href="/blog/2025-12-31-strong-vs-weak-pairs-how-to-pick"
              className="rounded-xl border border-black/10 bg-white/70 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-white dark:border-white/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
            >
              Read the method →
            </Link>
          </div>
        </section>

        <section className="mt-6 rounded-2xl border border-black/5 bg-white/60 p-6 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5">
          <h2 className="text-lg font-semibold">4) Use the heatmap to spot movers</h2>
          <p className="mt-2 leading-relaxed text-slate-700 dark:text-white/80">
            Strength rankings answer “who is strong vs weak”. The heatmap answers “which pairs are actually moving” on
            each timeframe. Combine both:
          </p>
          <ul className="mt-3 list-disc pl-5 text-slate-700 dark:text-white/80 space-y-2">
            <li>Strength spread for direction</li>
            <li>Heatmap for volatility/momentum confirmation</li>
            <li>Price structure for timing</li>
          </ul>
          <div className="mt-5">
            <Link
              href="/heatmap"
              className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-white/90"
            >
              Open heatmap →
            </Link>
          </div>
        </section>

        <section className="mt-6 rounded-2xl border border-black/5 bg-white/60 p-6 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5">
          <h2 className="text-lg font-semibold">Notes & limitations</h2>
          <p className="mt-2 leading-relaxed text-slate-700 dark:text-white/80">
            Scores depend on the quality and continuity of the price feed. If the feed is interrupted, some timeframes
            may show “waiting for history” until enough data is collected for that window.
          </p>
          <p className="mt-3 leading-relaxed text-slate-700 dark:text-white/80">
            Read the <Link href="/disclaimer" className="text-blue-600 hover:underline dark:text-blue-300">Disclaimer</Link>{' '}
            before using these tools for live trading.
          </p>
        </section>
      </div>
    </main>
  );
}

