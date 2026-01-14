import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";

function getSiteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL || "https://liveforexstrength.com").replace(/\/+$/, "");
}

export const metadata: Metadata = {
  title: "Forex Currency Strength Meter (Live Online Dashboard)",
  description:
    "A live forex currency strength meter that ranks the 8 major currencies across timeframes (5m–1W) to help you find strong-vs-weak pair setups.",
  alternates: { canonical: "/forex-currency-strength-meter" },
  openGraph: {
    type: "website",
    url: "/forex-currency-strength-meter",
    title: "Forex Currency Strength Meter | LiveForexStrength",
    description:
      "Live forex currency strength meter (online): rankings (0–100), multi-timeframe analysis, and a workflow for strong-vs-weak pairs.",
    images: [{ url: "/opengraph-image" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Forex Currency Strength Meter | LiveForexStrength",
    description:
      "Live forex currency strength meter (online): rankings (0–100), multi-timeframe analysis, and a workflow for strong-vs-weak pairs.",
    images: ["/opengraph-image"],
  },
};

export default function ForexCurrencyStrengthMeterPage() {
  const siteUrl = getSiteUrl();
  const pageUrl = `${siteUrl}/forex-currency-strength-meter`;

  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Dashboard", item: `${siteUrl}/` },
      { "@type": "ListItem", position: 2, name: "Forex Currency Strength Meter", item: pageUrl },
    ],
  };

  const webpage = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    url: pageUrl,
    name: "Forex currency strength meter",
    description:
      "Live forex currency strength meter across timeframes, plus a practical bias/timing workflow and heatmap confirmation.",
    isPartOf: { "@type": "WebSite", name: "LiveForexStrength", url: siteUrl },
  };

  return (
    <main className="min-h-screen text-slate-900 dark:text-white">
      <Script id="fx-csm-breadcrumbs" type="application/ld+json" strategy="beforeInteractive">
        {JSON.stringify(breadcrumbs)}
      </Script>
      <Script id="fx-csm-webpage" type="application/ld+json" strategy="beforeInteractive">
        {JSON.stringify(webpage)}
      </Script>

      <div className="pointer-events-none fixed inset-0 -z-10 hidden dark:block bg-[radial-gradient(900px_circle_at_20%_10%,rgba(59,130,246,0.18),transparent_55%),radial-gradient(800px_circle_at_80%_20%,rgba(16,185,129,0.12),transparent_55%),linear-gradient(to_bottom,rgba(2,6,23,1),rgba(0,0,0,1))]" />
      <div className="pointer-events-none fixed inset-0 -z-10 dark:hidden bg-[radial-gradient(900px_circle_at_20%_10%,rgba(106,34,179,0.10),transparent_60%),radial-gradient(800px_circle_at_80%_20%,rgba(61,96,141,0.10),transparent_60%),linear-gradient(to_bottom,rgba(244,245,250,1),rgba(244,245,250,1))]" />

      <div className="container mx-auto max-w-4xl p-4 sm:p-6">
        <div className="mb-6">
          <div className="text-xs uppercase tracking-wide text-slate-500 dark:text-white/60">
            Tool
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Forex Currency Strength Meter</h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-white/70">
            Live currency rankings (0–100) across timeframes to help you focus on strong-vs-weak FX
            pair opportunities.
          </p>
        </div>

        <section className="rounded-2xl border border-black/5 bg-white/60 p-6 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5">
          <h2 className="text-lg font-semibold">Open the live rankings</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              href="/"
              className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-white/90"
            >
              Open dashboard
            </Link>
            <Link
              href="/currency-strength-meter-online"
              className="rounded-xl border border-black/10 bg-white/70 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-white dark:border-white/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
            >
              Online meter overview →
            </Link>
            <Link
              href="/currency-strength-dashboard"
              className="rounded-xl border border-black/10 bg-white/70 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-white dark:border-white/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
            >
              Strength dashboard →
            </Link>
          </div>
          <p className="mt-4 text-slate-700 dark:text-white/80">
            If you’re new, start with:{" "}
            <Link
              href="/blog/2026-01-13-currency-strength-for-beginners"
              className="text-blue-600 hover:underline dark:text-blue-300"
            >
              currency strength for beginners
            </Link>
            .
          </p>
        </section>

        <section className="mt-6 rounded-2xl border border-black/5 bg-white/60 p-6 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5">
          <h2 className="text-lg font-semibold">Confirm pair movement</h2>
          <p className="mt-2 text-slate-700 dark:text-white/80">
            Use the heatmap to confirm which pairs are actually moving across timeframes (pips /
            percent).
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              href="/heatmap"
              className="rounded-xl border border-black/10 bg-white/70 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-white dark:border-white/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
            >
              Open heatmap →
            </Link>
            <Link
              href="/forex-heatmap-live"
              className="rounded-xl border border-black/10 bg-white/70 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-white dark:border-white/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
            >
              Heatmap guide →
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}

