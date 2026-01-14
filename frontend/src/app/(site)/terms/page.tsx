import type { Metadata } from 'next';
import Link from 'next/link';
import Script from 'next/script';

function getSiteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL || 'https://liveforexstrength.com').replace(/\/+$/, '');
}

export const metadata: Metadata = {
  title: 'Terms of Use',
  description: 'Terms of use for LiveForexStrength.',
  alternates: { canonical: '/terms' },
};

export default function TermsPage() {
  const siteUrl = getSiteUrl();
  const breadcrumbs = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Dashboard', item: `${siteUrl}/` },
      { '@type': 'ListItem', position: 2, name: 'Terms', item: `${siteUrl}/terms` },
    ],
  };

  return (
    <main className="min-h-screen text-slate-900 dark:text-white">
      <Script id="terms-breadcrumbs-jsonld" type="application/ld+json" strategy="beforeInteractive">
        {JSON.stringify(breadcrumbs)}
      </Script>

      <div className="container mx-auto max-w-3xl p-4 sm:p-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Terms of Use</h1>
          <Link href="/" className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-300">
            ← Back to Dashboard
          </Link>
        </div>

        <section className="space-y-4 rounded-2xl border border-black/5 bg-white/60 p-6 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5">
          <p className="text-slate-700 dark:text-white/80">
            By accessing or using LiveForexStrength, you agree to these Terms.
          </p>
          <p className="text-slate-700 dark:text-white/80">
            You may use this site for personal informational purposes. You agree not to abuse the service, attempt to
            disrupt availability, or scrape at a rate that harms performance.
          </p>
          <p className="text-slate-700 dark:text-white/80">
            The service is provided “as is” without warranties of any kind. We do not guarantee availability, accuracy,
            or fitness for a particular purpose.
          </p>
          <p className="text-slate-700 dark:text-white/80">
            Liability is limited to the maximum extent permitted by law. See the <Link href="/disclaimer" className="text-blue-600 hover:underline dark:text-blue-300">Disclaimer</Link>.
          </p>
        </section>
      </div>
    </main>
  );
}

