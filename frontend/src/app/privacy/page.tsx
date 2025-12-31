import type { Metadata } from 'next';
import Link from 'next/link';
import Script from 'next/script';

function getSiteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL || 'https://liveforexstrength.com').replace(/\/+$/, '');
}

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy policy for LiveForexStrength.',
  alternates: { canonical: '/privacy' },
};

export default function PrivacyPage() {
  const siteUrl = getSiteUrl();
  const breadcrumbs = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Dashboard', item: `${siteUrl}/` },
      { '@type': 'ListItem', position: 2, name: 'Privacy', item: `${siteUrl}/privacy` },
    ],
  };

  return (
    <main className="min-h-screen text-slate-900 dark:text-white">
      <Script id="privacy-breadcrumbs-jsonld" type="application/ld+json" strategy="beforeInteractive">
        {JSON.stringify(breadcrumbs)}
      </Script>

      <div className="container mx-auto max-w-3xl p-4 sm:p-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Privacy Policy</h1>
          <Link href="/" className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-300">
            ← Back to Dashboard
          </Link>
        </div>

        <section className="space-y-5 rounded-2xl border border-black/5 bg-white/60 p-6 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5">
          <div>
            <h2 className="text-lg font-semibold">What we collect</h2>
            <p className="mt-2 text-slate-700 dark:text-white/80">
              We do not require accounts. We may collect basic technical logs (e.g., IP address, user agent, and request
              timing) for security, abuse prevention, and troubleshooting.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold">Cookies</h2>
            <p className="mt-2 text-slate-700 dark:text-white/80">
              This site may store a preference cookie or local storage value for UI settings (for example, dark/light
              theme). We do not sell personal information.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold">Third parties</h2>
            <p className="mt-2 text-slate-700 dark:text-white/80">
              If analytics or monitoring tools are enabled in the future, they may process aggregated usage data. Any
              such change will be reflected on this page.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold">Contact</h2>
            <p className="mt-2 text-slate-700 dark:text-white/80">
              For questions about privacy, contact the site owner via the repository listed in the footer.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

