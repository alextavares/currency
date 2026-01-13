import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";

function getSiteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL || "https://liveforexstrength.com").replace(/\/+$/, "");
}

export const metadata: Metadata = {
  title: "Forex Heatmap Live (Pairs × Timeframes)",
  description:
    "A live forex heatmap that shows major FX pairs across timeframes (pips / percent) to spot the strongest movers and confirm momentum.",
  alternates: { canonical: "/forex-heatmap-live" },
  openGraph: {
    type: "website",
    url: "/forex-heatmap-live",
    title: "Forex Heatmap Live | LiveForexStrength",
    description:
      "Live forex heatmap across multiple timeframes. Use it to confirm volatility/momentum and find pairs that are actually moving.",
    images: [{ url: "/opengraph-image" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Forex Heatmap Live | LiveForexStrength",
    description:
      "Live forex heatmap across multiple timeframes. Use it to confirm volatility/momentum and find pairs that are actually moving.",
    images: ["/opengraph-image"],
  },
};

export default function ForexHeatmapLivePage() {
  const siteUrl = getSiteUrl();
  const pageUrl = `${siteUrl}/forex-heatmap-live`;

  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Dashboard", item: `${siteUrl}/` },
      { "@type": "ListItem", position: 2, name: "Forex Heatmap Live", item: pageUrl },
    ],
  };

  const webpage = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    url: pageUrl,
    name: "Forex heatmap live",
    description:
      "Live forex heatmap across timeframes (pips/percent) to spot movers and confirm momentum.",
    isPartOf: { "@type": "WebSite", name: "LiveForexStrength", url: siteUrl },
  };

  return (
    <main className="min-h-screen text-slate-900 dark:text-white">
      <Script id="fx-heatmap-live-breadcrumbs" type="application/ld+json" strategy="beforeInteractive">
        {JSON.stringify(breadcrumbs)}
      </Script>
      <Script id="fx-heatmap-live-webpage" type="application/ld+json" strategy="beforeInteractive">
        {JSON.stringify(webpage)}
      </Script>

      <div className="pointer-events-none fixed inset-0 -z-10 hidden dark:block bg-[radial-gradient(900px_circle_at_20%_10%,rgba(59,130,246,0.18),transparent_55%),radial-gradient(800px_circle_at_80%_20%,rgba(16,185,129,0.12),transparent_55%),linear-gradient(to_bottom,rgba(2,6,23,1),rgba(0,0,0,1))]" />
      <div className="pointer-events-none fixed inset-0 -z-10 dark:hidden bg-[radial-gradient(900px_circle_at_20%_10%,rgba(106,34,179,0.10),transparent_60%),radial-gradient(800px_circle_at_80%_20%,rgba(61,96,141,0.10),transparent_60%),linear-gradient(to_bottom,rgba(244,245,250,1),rgba(244,245,250,1))]" />

      <div className="container mx-auto max-w-4xl p-4 sm:p-6">
        <div className="mb-6">
          <div className="text-xs uppercase tracking-wide text-slate-500 dark:text-white/60">
            Tool
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Forex Heatmap Live</h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-white/70">
            A pairs × timeframes heatmap (pips / percent) to spot the strongest movers and confirm
            momentum.
          </p>
        </div>

        <section className="rounded-2xl border border-black/5 bg-white/60 p-6 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5">
          <h2 className="text-lg font-semibold">Open the heatmap</h2>
          <p className="mt-2 text-slate-700 dark:text-white/80">
            Use it alongside currency rankings: strength tells you who’s strong/weak, heatmap tells
            you which pairs are actually moving.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              href="/heatmap"
              className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-white/90"
            >
              Open forex heatmap
            </Link>
            <Link
              href="/"
              className="rounded-xl border border-black/10 bg-white/70 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-white dark:border-white/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
            >
              Open strength dashboard
            </Link>
          </div>
        </section>

        <section className="mt-6 rounded-2xl border border-black/5 bg-white/60 p-6 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5">
          <h2 className="text-lg font-semibold">How to read it quickly</h2>
          <ul className="mt-3 list-disc pl-5 text-slate-700 dark:text-white/80 space-y-1">
            <li>Start from a higher timeframe column to avoid chasing noise.</li>
            <li>Look for consistency across 2–3 adjacent timeframes (momentum “stacking”).</li>
            <li>Use the pairs pages for context and related crosses.</li>
          </ul>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              href="/pairs"
              className="rounded-xl border border-black/10 bg-white/70 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-white dark:border-white/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
            >
              Browse pairs →
            </Link>
            <Link
              href="/timeframes"
              className="rounded-xl border border-black/10 bg-white/70 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-white dark:border-white/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
            >
              Timeframes guide →
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}

