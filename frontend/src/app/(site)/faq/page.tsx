import type { Metadata } from 'next';
import Link from 'next/link';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'FAQ',
  description:
    'Frequently asked questions about the LiveForexStrength currency strength meter, timeframes, and interpretation.',
  alternates: { canonical: '/faq' },
  openGraph: {
    type: 'website',
    url: '/faq',
    title: 'LiveForexStrength FAQ',
    description:
      'Frequently asked questions about the LiveForexStrength currency strength meter, timeframes, and interpretation.',
    images: [{ url: '/opengraph-image' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LiveForexStrength FAQ',
    description:
      'Frequently asked questions about the LiveForexStrength currency strength meter, timeframes, and interpretation.',
    images: ['/opengraph-image'],
  },
};

const FAQ_ENTRIES: Array<{ q: string; a: string }> = [
  {
    q: 'What does the 0–100 score mean?',
    a: 'The score is a normalized strength ranking for each currency within the selected timeframe. Higher values mean the currency has been stronger relative to the others in the basket.',
  },
  {
    q: 'Which currencies are included?',
    a: 'The meter focuses on the 8 major currencies: USD, EUR, GBP, JPY, CHF, CAD, AUD and NZD.',
  },
  {
    q: 'How often does it update?',
    a: 'It updates live on the dashboard. If the market is quiet (no ticks), the UI can still refresh with the latest computed snapshot.',
  },
  {
    q: 'How should I use multiple timeframes?',
    a: 'Use higher timeframes (4h/12h/1W) to identify the broader bias, and lower timeframes (5m/15m/30m) to time entries. Many traders look for strong-vs-weak pairs that align across timeframes.',
  },
  {
    q: 'Is this financial advice or a trade signal?',
    a: 'No. This is an analysis tool. Always validate with your own strategy, risk management, and market context (news, sessions, liquidity).',
  },
];

export default function FaqPage() {
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://liveforexstrength.com').replace(
    /\/+$/,
    '',
  );

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${siteUrl}/faq#faq`,
    url: `${siteUrl}/faq`,
    mainEntity: FAQ_ENTRIES.map((e) => ({
      '@type': 'Question',
      name: e.q,
      acceptedAnswer: { '@type': 'Answer', text: e.a },
    })),
  };

  return (
    <>
      <Script id="faq-jsonld" type="application/ld+json" strategy="beforeInteractive">
        {JSON.stringify(schema)}
      </Script>

      <main className="min-h-screen text-slate-900 dark:text-white">
        <div className="pointer-events-none fixed inset-0 -z-10 hidden dark:block bg-[radial-gradient(900px_circle_at_20%_10%,rgba(59,130,246,0.18),transparent_55%),radial-gradient(800px_circle_at_80%_20%,rgba(16,185,129,0.12),transparent_55%),linear-gradient(to_bottom,rgba(2,6,23,1),rgba(0,0,0,1))]" />
        <div className="pointer-events-none fixed inset-0 -z-10 dark:hidden bg-[radial-gradient(900px_circle_at_20%_10%,rgba(106,34,179,0.10),transparent_60%),radial-gradient(800px_circle_at_80%_20%,rgba(61,96,141,0.10),transparent_60%),linear-gradient(to_bottom,rgba(244,245,250,1),rgba(244,245,250,1))]" />

        <div className="container mx-auto max-w-4xl p-4 sm:p-6">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight">FAQ</h1>
            <Link
              href="/"
              className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline dark:text-blue-300 dark:hover:text-blue-200"
            >
              ← Back to Dashboard
            </Link>
          </div>

          <div className="space-y-4">
            {FAQ_ENTRIES.map((e) => (
              <FaqItem key={e.q} q={e.q}>
                {e.a}
              </FaqItem>
            ))}

            <section className="rounded-2xl border border-black/5 bg-white/60 p-6 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5">
              <p className="text-slate-700 dark:text-white/80">
                Want more context and examples? Read the{' '}
                <Link href="/blog" className="text-blue-600 hover:underline dark:text-blue-300">
                  market analysis blog
                </Link>
                .
              </p>
            </section>
          </div>
        </div>
      </main>
    </>
  );
}

function FaqItem({ q, children }: { q: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-black/5 bg-white/60 p-6 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5">
      <h2 className="text-lg font-semibold">{q}</h2>
      <p className="mt-2 leading-relaxed text-slate-700 dark:text-white/80">{children}</p>
    </section>
  );
}
