import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";

function getSiteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL || "https://liveforexstrength.com").replace(/\/+$/, "");
}

export const metadata: Metadata = {
  title: "Free Currency Strength Meter (Online Dashboard)",
  description:
    "A free currency strength meter online: live rankings (0–100) for the 8 major currencies across multiple timeframes (5m–1W).",
  alternates: { canonical: "/free-currency-strength-meter" },
  openGraph: {
    type: "website",
    url: "/free-currency-strength-meter",
    title: "Free Currency Strength Meter | LiveForexStrength",
    description:
      "Free online currency strength meter: live rankings (0–100), timeframe switching, and a simple workflow for strong-vs-weak pairs.",
    images: [{ url: "/opengraph-image" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Currency Strength Meter | LiveForexStrength",
    description:
      "Free online currency strength meter: live rankings (0–100), timeframe switching, and a simple workflow for strong-vs-weak pairs.",
    images: ["/opengraph-image"],
  },
};

export default function FreeCurrencyStrengthMeterPage() {
  const siteUrl = getSiteUrl();
  const pageUrl = `${siteUrl}/free-currency-strength-meter`;

  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Dashboard", item: `${siteUrl}/` },
      { "@type": "ListItem", position: 2, name: "Free Currency Strength Meter", item: pageUrl },
    ],
  };

  const webpage = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    url: pageUrl,
    name: "Free currency strength meter",
    description:
      "A free online currency strength meter with live rankings across timeframes, plus links to heatmap, pairs, and guides.",
    isPartOf: { "@type": "WebSite", name: "LiveForexStrength", url: siteUrl },
  };

  return (
    <main className="min-h-screen text-slate-900 dark:text-white">
      <Script id="free-csm-breadcrumbs" type="application/ld+json" strategy="beforeInteractive">
        {JSON.stringify(breadcrumbs)}
      </Script>
      <Script id="free-csm-webpage" type="application/ld+json" strategy="beforeInteractive">
        {JSON.stringify(webpage)}
      </Script>

      <div className="pointer-events-none fixed inset-0 -z-10 hidden dark:block bg-[radial-gradient(900px_circle_at_20%_10%,rgba(59,130,246,0.18),transparent_55%),radial-gradient(800px_circle_at_80%_20%,rgba(16,185,129,0.12),transparent_55%),linear-gradient(to_bottom,rgba(2,6,23,1),rgba(0,0,0,1))]" />
      <div className="pointer-events-none fixed inset-0 -z-10 dark:hidden bg-[radial-gradient(900px_circle_at_20%_10%,rgba(106,34,179,0.10),transparent_60%),radial-gradient(800px_circle_at_80%_20%,rgba(61,96,141,0.10),transparent_60%),linear-gradient(to_bottom,rgba(244,245,250,1),rgba(244,245,250,1))]" />

      <div className="container mx-auto max-w-4xl p-4 sm:p-6">
        <div className="mb-6">
          <div className="text-xs uppercase tracking-wide text-slate-500 dark:text-white/60">
            Tool
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Free Currency Strength Meter</h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-white/70">
            A free online dashboard that ranks the 8 major currencies (0–100) across timeframes so
            you can focus on strong-vs-weak FX pairs.
          </p>
        </div>

        <section className="rounded-2xl border border-black/5 bg-white/60 p-6 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5">
          <h2 className="text-lg font-semibold">Open the dashboard</h2>
          <p className="mt-2 text-slate-700 dark:text-white/80">
            Start with a bias timeframe (4h/12h/1W), then use a lower timeframe (15m/30m) for entry
            timing.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              href="/?tf=4h"
              className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-white/90"
            >
              Dashboard (4h)
            </Link>
            <Link
              href="/?tf=15m"
              className="rounded-xl border border-black/10 bg-white/70 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-white dark:border-white/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
            >
              Dashboard (15m)
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
          <h2 className="text-lg font-semibold">Use the heatmap to confirm movers</h2>
          <p className="mt-2 text-slate-700 dark:text-white/80">
            Rankings show who’s strong/weak. Heatmap shows which pairs are actually moving across
            timeframes.
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

