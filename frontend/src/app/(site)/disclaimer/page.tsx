import type { Metadata } from 'next';
import Link from 'next/link';
import Script from 'next/script';

function getSiteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL || 'https://liveforexstrength.com').replace(/\/+$/, '');
}

export const metadata: Metadata = {
  title: 'Disclaimer',
  description: 'Important legal disclaimer and risk notice for LiveForexStrength.',
  alternates: { canonical: '/disclaimer' },
};

export default function DisclaimerPage() {
  const siteUrl = getSiteUrl();
  const breadcrumbs = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Dashboard', item: `${siteUrl}/` },
      { '@type': 'ListItem', position: 2, name: 'Disclaimer', item: `${siteUrl}/disclaimer` },
    ],
  };

  return (
    <main className="min-h-screen text-slate-900 dark:text-white">
      <Script id="disclaimer-breadcrumbs-jsonld" type="application/ld+json" strategy="beforeInteractive">
        {JSON.stringify(breadcrumbs)}
      </Script>

      <div className="container mx-auto max-w-3xl p-4 sm:p-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Disclaimer</h1>
          <Link href="/" className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-300">
            ← Back to Dashboard
          </Link>
        </div>

        <section className="space-y-4 rounded-2xl border border-black/5 bg-white/60 p-6 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5">
          <p className="text-slate-700 dark:text-white/80">
            LiveForexStrength is an informational tool. It does not constitute investment advice, trading advice, or a
            recommendation to buy or sell any financial instrument.
          </p>
          <p className="text-slate-700 dark:text-white/80">
            Forex and CFD trading involves significant risk and may not be suitable for all investors. You can lose more
            than your initial deposit. Past performance is not indicative of future results.
          </p>
          <p className="text-slate-700 dark:text-white/80">
            Prices and calculated metrics may be delayed, incomplete, or inaccurate due to data source limitations,
            connectivity issues, and market conditions. Always verify quotes and execution conditions with your broker.
          </p>
          <p className="text-slate-700 dark:text-white/80">
            By using this website, you agree that the site owner and contributors are not liable for any losses or
            damages resulting from use of the information provided.
          </p>
        </section>
      </div>
    </main>
  );
}

