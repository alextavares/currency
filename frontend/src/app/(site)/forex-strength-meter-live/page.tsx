import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";

function getSiteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL || "https://liveforexstrength.com").replace(/\/+$/, "");
}

export const metadata: Metadata = {
  title: "Forex Strength Meter Live (Currency Rankings 0–100)",
  description:
    "A live forex strength meter that ranks the 8 major currencies (0–100) across timeframes so you can find strong-vs-weak pair setups faster.",
  alternates: { canonical: "/forex-strength-meter-live" },
  openGraph: {
    type: "website",
    url: "/forex-strength-meter-live",
    title: "Forex Strength Meter Live | LiveForexStrength",
    description:
      "Live currency strength rankings (0–100) across timeframes. Use it to filter for strong-vs-weak FX pairs and avoid low-conviction chop.",
    images: [{ url: "/opengraph-image" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Forex Strength Meter Live | LiveForexStrength",
    description:
      "Live currency strength rankings (0–100) across timeframes. Use it to filter for strong-vs-weak FX pairs and avoid low-conviction chop.",
    images: ["/opengraph-image"],
  },
};

export default function ForexStrengthMeterLivePage() {
  const siteUrl = getSiteUrl();
  const pageUrl = `${siteUrl}/forex-strength-meter-live`;

  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Dashboard", item: `${siteUrl}/` },
      { "@type": "ListItem", position: 2, name: "Forex Strength Meter Live", item: pageUrl },
    ],
  };

  const webpage = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    url: pageUrl,
    name: "Forex strength meter live",
    description:
      "Live forex currency rankings across timeframes, with practical guidance to turn strength into pair ideas.",
    isPartOf: { "@type": "WebSite", name: "LiveForexStrength", url: siteUrl },
  };

  return (
    <main className="min-h-screen text-slate-900 dark:text-white">
      <Script id="fx-strength-live-breadcrumbs" type="application/ld+json" strategy="beforeInteractive">
        {JSON.stringify(breadcrumbs)}
      </Script>
      <Script id="fx-strength-live-webpage" type="application/ld+json" strategy="beforeInteractive">
        {JSON.stringify(webpage)}
      </Script>

      <div className="pointer-events-none fixed inset-0 -z-10 hidden dark:block bg-[radial-gradient(900px_circle_at_20%_10%,rgba(59,130,246,0.18),transparent_55%),radial-gradient(800px_circle_at_80%_20%,rgba(16,185,129,0.12),transparent_55%),linear-gradient(to_bottom,rgba(2,6,23,1),rgba(0,0,0,1))]" />
      <div className="pointer-events-none fixed inset-0 -z-10 dark:hidden bg-[radial-gradient(900px_circle_at_20%_10%,rgba(106,34,179,0.10),transparent_60%),radial-gradient(800px_circle_at_80%_20%,rgba(61,96,141,0.10),transparent_60%),linear-gradient(to_bottom,rgba(244,245,250,1),rgba(244,245,250,1))]" />

      <div className="container mx-auto max-w-4xl p-4 sm:p-6">
        <div className="mb-6">
          <div className="text-xs uppercase tracking-wide text-slate-500 dark:text-white/60">
            Tool
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Forex Strength Meter Live</h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-white/70">
            Use live currency rankings (0–100) to filter for strong-vs-weak environments and avoid
            trading “middle vs middle” noise.
          </p>
        </div>

        <section className="rounded-2xl border border-black/5 bg-white/60 p-6 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5">
          <h2 className="text-lg font-semibold">Start here</h2>
          <p className="mt-2 text-slate-700 dark:text-white/80">
            The simplest workflow is bias → timing: pick direction from a higher timeframe and use a
            lower timeframe to time entries.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              href="/?tf=12h"
              className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-white/90"
            >
              Open dashboard (12h)
            </Link>
            <Link
              href="/?tf=4h"
              className="rounded-xl border border-black/10 bg-white/70 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-white dark:border-white/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
            >
              Open dashboard (4h)
            </Link>
            <Link
              href="/?tf=15m"
              className="rounded-xl border border-black/10 bg-white/70 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-white dark:border-white/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
            >
              Open dashboard (15m)
            </Link>
          </div>
        </section>

        <section className="mt-6 rounded-2xl border border-black/5 bg-white/60 p-6 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5">
          <h2 className="text-lg font-semibold">Make it tradeable (strong vs weak)</h2>
          <p className="mt-2 text-slate-700 dark:text-white/80">
            The goal is not to trade the “strongest currency”. The goal is to pair a strong currency
            against a weak currency so the imbalance is clear.
          </p>
          <p className="mt-3 text-slate-700 dark:text-white/80">
            Next reading:{" "}
            <Link
              href="/blog/2026-01-13-strong-vs-weak-currency-pairs"
              className="text-blue-600 hover:underline dark:text-blue-300"
            >
              strong vs weak currency pairs (watchlist method)
            </Link>
            .
          </p>
        </section>

        <section className="mt-6 rounded-2xl border border-black/5 bg-white/60 p-6 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5">
          <h2 className="text-lg font-semibold">Confirm movers with the heatmap</h2>
          <p className="mt-2 text-slate-700 dark:text-white/80">
            Strength ranks currencies. The heatmap shows which pairs are actually moving across
            timeframes (pips / percent).
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              href="/heatmap"
              className="rounded-xl border border-black/10 bg-white/70 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-white dark:border-white/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
            >
              Open heatmap →
            </Link>
            <Link
              href="/pairs"
              className="rounded-xl border border-black/10 bg-white/70 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-white dark:border-white/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
            >
              Browse pairs →
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}

