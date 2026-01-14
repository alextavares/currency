import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";

function getSiteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL || "https://liveforexstrength.com").replace(/\/+$/, "");
}

export const metadata: Metadata = {
  title: "Currency Strength Dashboard (Live Rankings by Timeframe)",
  description:
    "A currency strength dashboard that ranks USD, EUR, GBP, JPY, CHF, CAD, AUD, NZD (0–100) across timeframes to find strong-vs-weak pairs faster.",
  alternates: { canonical: "/currency-strength-dashboard" },
  openGraph: {
    type: "website",
    url: "/currency-strength-dashboard",
    title: "Currency Strength Dashboard | LiveForexStrength",
    description:
      "Live currency strength dashboard: rankings (0–100), timeframes (5m–1W), and a simple process to build a strong-vs-weak watchlist.",
    images: [{ url: "/opengraph-image" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Currency Strength Dashboard | LiveForexStrength",
    description:
      "Live currency strength dashboard: rankings (0–100), timeframes (5m–1W), and a simple process to build a strong-vs-weak watchlist.",
    images: ["/opengraph-image"],
  },
};

export default function CurrencyStrengthDashboardPage() {
  const siteUrl = getSiteUrl();
  const pageUrl = `${siteUrl}/currency-strength-dashboard`;

  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Dashboard", item: `${siteUrl}/` },
      { "@type": "ListItem", position: 2, name: "Currency Strength Dashboard", item: pageUrl },
    ],
  };

  const webpage = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    url: pageUrl,
    name: "Currency strength dashboard",
    description:
      "A currency strength dashboard with live rankings by timeframe, plus links to the heatmap, pairs pages, and strategy guides.",
    isPartOf: { "@type": "WebSite", name: "LiveForexStrength", url: siteUrl },
  };

  return (
    <main className="min-h-screen text-slate-900 dark:text-white">
      <Script id="csd-breadcrumbs" type="application/ld+json" strategy="beforeInteractive">
        {JSON.stringify(breadcrumbs)}
      </Script>
      <Script id="csd-webpage" type="application/ld+json" strategy="beforeInteractive">
        {JSON.stringify(webpage)}
      </Script>

      <div className="pointer-events-none fixed inset-0 -z-10 hidden dark:block bg-[radial-gradient(900px_circle_at_20%_10%,rgba(59,130,246,0.18),transparent_55%),radial-gradient(800px_circle_at_80%_20%,rgba(16,185,129,0.12),transparent_55%),linear-gradient(to_bottom,rgba(2,6,23,1),rgba(0,0,0,1))]" />
      <div className="pointer-events-none fixed inset-0 -z-10 dark:hidden bg-[radial-gradient(900px_circle_at_20%_10%,rgba(106,34,179,0.10),transparent_60%),radial-gradient(800px_circle_at_80%_20%,rgba(61,96,141,0.10),transparent_60%),linear-gradient(to_bottom,rgba(244,245,250,1),rgba(244,245,250,1))]" />

      <div className="container mx-auto max-w-4xl p-4 sm:p-6">
        <div className="mb-6">
          <div className="text-xs uppercase tracking-wide text-slate-500 dark:text-white/60">
            Tool
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Currency Strength Dashboard</h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-white/70">
            Live rankings (0–100) across timeframes (5m–1W) to filter for strong-vs-weak FX pairs.
          </p>
        </div>

        <section className="rounded-2xl border border-black/5 bg-white/60 p-6 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5">
          <h2 className="text-lg font-semibold">Quick start (bias → timing)</h2>
          <ol className="mt-3 list-decimal pl-5 text-slate-700 dark:text-white/80 space-y-1">
            <li>Pick bias on 4h/12h/1W (top vs bottom currencies).</li>
            <li>Create a shortlist of strong-vs-weak pair ideas.</li>
            <li>Use 15m/30m for timing and confirm movers on the heatmap.</li>
          </ol>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              href="/?tf=12h"
              className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-white/90"
            >
              Dashboard (12h)
            </Link>
            <Link
              href="/?tf=4h"
              className="rounded-xl border border-black/10 bg-white/70 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-white dark:border-white/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
            >
              Dashboard (4h)
            </Link>
            <Link
              href="/?tf=15m"
              className="rounded-xl border border-black/10 bg-white/70 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-white dark:border-white/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
            >
              Dashboard (15m)
            </Link>
          </div>
        </section>

        <section className="mt-6 rounded-2xl border border-black/5 bg-white/60 p-6 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5">
          <h2 className="text-lg font-semibold">Learn the strategy</h2>
          <p className="mt-2 text-slate-700 dark:text-white/80">
            If you’re getting false signals, the fix is usually timeframe roles and spread.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              href="/blog/2026-01-13-currency-strength-meter-strategy"
              className="rounded-xl border border-black/10 bg-white/70 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-white dark:border-white/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
            >
              Strength strategy →
            </Link>
            <Link
              href="/blog/2026-01-13-best-timeframe-for-currency-strength"
              className="rounded-xl border border-black/10 bg-white/70 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-white dark:border-white/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
            >
              Best timeframe →
            </Link>
            <Link
              href="/heatmap"
              className="rounded-xl border border-black/10 bg-white/70 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-white dark:border-white/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
            >
              Open heatmap →
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}

