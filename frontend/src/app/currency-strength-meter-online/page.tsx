import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";

function getSiteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL || "https://liveforexstrength.com").replace(/\/+$/, "");
}

export const metadata: Metadata = {
  title: "Currency Strength Meter Online (Live Dashboard)",
  description:
    "Use a live currency strength meter online to rank USD, EUR, GBP, JPY, CHF, CAD, AUD, NZD across timeframes and find strong-vs-weak pairs.",
  alternates: { canonical: "/currency-strength-meter-online" },
  openGraph: {
    type: "website",
    url: "/currency-strength-meter-online",
    title: "Currency Strength Meter Online | LiveForexStrength",
    description:
      "A live currency strength meter online: rankings (0–100), timeframes (5m–1W), and a workflow for strong-vs-weak pairs.",
    images: [{ url: "/opengraph-image" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Currency Strength Meter Online | LiveForexStrength",
    description:
      "A live currency strength meter online: rankings (0–100), timeframes (5m–1W), and a workflow for strong-vs-weak pairs.",
    images: ["/opengraph-image"],
  },
};

export default function CurrencyStrengthMeterOnlinePage() {
  const siteUrl = getSiteUrl();
  const pageUrl = `${siteUrl}/currency-strength-meter-online`;

  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Dashboard", item: `${siteUrl}/` },
      { "@type": "ListItem", position: 2, name: "Currency Strength Meter Online", item: pageUrl },
    ],
  };

  const webpage = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    url: pageUrl,
    name: "Currency strength meter online",
    description:
      "Live currency strength rankings (0–100) across timeframes, with a practical workflow to select strong-vs-weak FX pairs.",
    isPartOf: { "@type": "WebSite", name: "LiveForexStrength", url: siteUrl },
  };

  return (
    <main className="min-h-screen text-slate-900 dark:text-white">
      <Script id="csm-online-breadcrumbs" type="application/ld+json" strategy="beforeInteractive">
        {JSON.stringify(breadcrumbs)}
      </Script>
      <Script id="csm-online-webpage" type="application/ld+json" strategy="beforeInteractive">
        {JSON.stringify(webpage)}
      </Script>

      <div className="pointer-events-none fixed inset-0 -z-10 hidden dark:block bg-[radial-gradient(900px_circle_at_20%_10%,rgba(59,130,246,0.18),transparent_55%),radial-gradient(800px_circle_at_80%_20%,rgba(16,185,129,0.12),transparent_55%),linear-gradient(to_bottom,rgba(2,6,23,1),rgba(0,0,0,1))]" />
      <div className="pointer-events-none fixed inset-0 -z-10 dark:hidden bg-[radial-gradient(900px_circle_at_20%_10%,rgba(106,34,179,0.10),transparent_60%),radial-gradient(800px_circle_at_80%_20%,rgba(61,96,141,0.10),transparent_60%),linear-gradient(to_bottom,rgba(244,245,250,1),rgba(244,245,250,1))]" />

      <div className="container mx-auto max-w-4xl p-4 sm:p-6">
        <div className="mb-6">
          <div className="text-xs uppercase tracking-wide text-slate-500 dark:text-white/60">
            Tool
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Currency Strength Meter Online</h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-white/70">
            A live dashboard that ranks the 8 major currencies (0–100) across timeframes so you can
            focus on strong-vs-weak FX pairs.
          </p>
        </div>

        <section className="rounded-2xl border border-black/5 bg-white/60 p-6 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5">
          <h2 className="text-lg font-semibold">Open the live strength meter</h2>
          <p className="mt-2 text-slate-700 dark:text-white/80">
            Start with a higher timeframe to set bias, then drop to a lower timeframe for timing.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              href="/?tf=4h"
              className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-white/90"
            >
              Open dashboard (4h)
            </Link>
            <Link
              href="/?tf=15m"
              className="rounded-xl border border-black/10 bg-white/70 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-white dark:border-white/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
            >
              Open dashboard (15m)
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
          <h2 className="text-lg font-semibold">What you do with the rankings</h2>
          <ol className="mt-3 list-decimal pl-5 text-slate-700 dark:text-white/80 space-y-1">
            <li>Write down the top 2–3 and bottom 2–3 currencies on your bias timeframe.</li>
            <li>Build pair ideas by combining top vs bottom (strong / weak).</li>
            <li>Confirm with price structure and use a timing timeframe for entries.</li>
          </ol>
          <p className="mt-4 text-slate-700 dark:text-white/80">
            Learn the basics:{" "}
            <Link
              href="/blog/2025-12-31-how-to-read-strength-score-0-100"
              className="text-blue-600 hover:underline dark:text-blue-300"
            >
              how to read the 0–100 score
            </Link>
            .
          </p>
        </section>

        <section className="mt-6 rounded-2xl border border-black/5 bg-white/60 p-6 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5">
          <h2 className="text-lg font-semibold">Confirm moves with the heatmap</h2>
          <p className="mt-2 text-slate-700 dark:text-white/80">
            Rankings answer “who is strong vs weak”. The heatmap answers “which pairs are actually
            moving” across timeframes.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              href="/heatmap"
              className="rounded-xl border border-black/10 bg-white/70 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-white dark:border-white/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
            >
              Open forex heatmap →
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

