import type { Metadata } from 'next';
import Link from 'next/link';
import Script from 'next/script';
import { notFound } from 'next/navigation';

const TIMEFRAMES = [
  { key: '5m', label: '5m', heading: '5-minute', role: 'timing' },
  { key: '15m', label: '15m', heading: '15-minute', role: 'timing' },
  { key: '30m', label: '30m', heading: '30-minute', role: 'timing' },
  { key: '1h', label: '1h', heading: '1-hour', role: 'context' },
  { key: '4h', label: '4h', heading: '4-hour', role: 'bias' },
  { key: '12h', label: '12h', heading: '12-hour', role: 'bias' },
  { key: '24h', label: '24h', heading: '24-hour (Daily)', role: 'bias' },
  { key: '1w', label: '1W', heading: '1-week', role: 'bias' },
] as const;

type TfKey = (typeof TIMEFRAMES)[number]['key'];

function getSiteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL || 'https://liveforexstrength.com').replace(/\/+$/, '');
}

function normalizeTf(raw: string): TfKey | null {
  const v = raw.trim().toLowerCase();
  return (TIMEFRAMES as readonly { key: string }[]).some((t) => t.key === v) ? (v as TfKey) : null;
}

function getTfInfo(tf: TfKey) {
  const info = TIMEFRAMES.find((t) => t.key === tf);
  if (!info) throw new Error('Unexpected timeframe');
  return info;
}

type Props = { params: Promise<{ tf: string }> };

export function generateStaticParams(): Array<{ tf: string }> {
  return TIMEFRAMES.map((t) => ({ tf: t.key }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tf: raw } = await params;
  const tf = normalizeTf(raw);
  if (!tf) {
    return {
      title: 'Timeframe Not Found',
      robots: { index: false, follow: false },
    };
  }

  const info = getTfInfo(tf);
  const title = `${info.label} Timeframe Guide`;
  const description = `How to use the ${info.heading} timeframe (${info.label}) for currency strength analysis: bias vs timing and practical examples.`;

  return {
    title,
    description,
    alternates: { canonical: `/timeframes/${tf}` },
    openGraph: {
      type: 'website',
      url: `/timeframes/${tf}`,
      title: `${title} | LiveForexStrength`,
      description,
      images: [{ url: '/opengraph-image' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | LiveForexStrength`,
      description,
      images: ['/opengraph-image'],
    },
  };
}

export default async function TimeframePage({ params }: Props) {
  const { tf: raw } = await params;
  const tf = normalizeTf(raw);
  if (!tf) notFound();

  const siteUrl = getSiteUrl();
  const info = getTfInfo(tf);
  const pageUrl = `${siteUrl}/timeframes/${tf}`;

  const breadcrumbs = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Dashboard', item: `${siteUrl}/` },
      { '@type': 'ListItem', position: 2, name: 'Timeframes', item: `${siteUrl}/timeframes` },
      { '@type': 'ListItem', position: 3, name: info.label, item: pageUrl },
    ],
  };

  const webpage = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    url: pageUrl,
    name: `${info.label} timeframe guide`,
    description: `How to interpret currency strength on the ${info.heading} timeframe.`,
    isPartOf: { '@type': 'WebSite', name: 'LiveForexStrength', url: siteUrl },
  };

  const dashboardLink = `/?tf=${encodeURIComponent(tf)}`;

  return (
    <main className="min-h-screen text-slate-900 dark:text-white">
      <Script id={`timeframe-breadcrumbs-${tf}`} type="application/ld+json" strategy="beforeInteractive">
        {JSON.stringify(breadcrumbs)}
      </Script>
      <Script id={`timeframe-webpage-${tf}`} type="application/ld+json" strategy="beforeInteractive">
        {JSON.stringify(webpage)}
      </Script>

      <div className="pointer-events-none fixed inset-0 -z-10 hidden dark:block bg-[radial-gradient(900px_circle_at_20%_10%,rgba(59,130,246,0.18),transparent_55%),radial-gradient(800px_circle_at_80%_20%,rgba(16,185,129,0.12),transparent_55%),linear-gradient(to_bottom,rgba(2,6,23,1),rgba(0,0,0,1))]" />
      <div className="pointer-events-none fixed inset-0 -z-10 dark:hidden bg-[radial-gradient(900px_circle_at_20%_10%,rgba(106,34,179,0.10),transparent_60%),radial-gradient(800px_circle_at_80%_20%,rgba(61,96,141,0.10),transparent_60%),linear-gradient(to_bottom,rgba(244,245,250,1),rgba(244,245,250,1))]" />

      <div className="container mx-auto max-w-4xl p-4 sm:p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <div className="text-xs uppercase tracking-wide text-slate-500 dark:text-white/60">
              Timeframes
            </div>
            <h1 className="text-3xl font-bold tracking-tight">{info.label} timeframe guide</h1>
          </div>
          <Link
            href="/timeframes"
            className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline dark:text-blue-300 dark:hover:text-blue-200"
          >
            ← Back to Timeframes
          </Link>
        </div>

        <section className="rounded-2xl border border-black/5 bg-white/60 p-6 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5">
          <p className="leading-relaxed text-slate-700 dark:text-white/80">
            The <strong>{info.heading}</strong> timeframe is best used for{' '}
            <strong>{info.role === 'bias' ? 'bias / direction' : info.role === 'context' ? 'context' : 'timing'}</strong>.
            Combine it with at least one higher timeframe and one lower timeframe to avoid false signals.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Link
              href={dashboardLink}
              className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-white/90"
            >
              Open dashboard on {info.label}
            </Link>
            <Link
              href="/currencies"
              className="rounded-xl border border-black/10 bg-white/70 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-white dark:border-white/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
            >
              Currency pages
            </Link>
          </div>
        </section>

        <section className="mt-6 rounded-2xl border border-black/5 bg-white/60 p-6 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5">
          <h2 className="text-lg font-semibold">Practical workflow</h2>
          <ol className="mt-3 list-decimal pl-5 text-slate-700 dark:text-white/80 space-y-1">
            <li>Start at 4h/12h/1W to identify the strongest and weakest currencies.</li>
            <li>Confirm structure on 1h (session context) if you trade intraday.</li>
            <li>Use {info.label} to pick an entry when the strength alignment remains consistent.</li>
          </ol>
        </section>

        <section className="mt-6 rounded-2xl border border-black/5 bg-white/60 p-6 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5">
          <h2 className="text-lg font-semibold">Explore other timeframes</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {TIMEFRAMES.filter((t) => t.key !== tf).map((t) => (
              <Link
                key={t.key}
                href={`/timeframes/${t.key}`}
                className="rounded-full border border-black/10 bg-white/70 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-white dark:border-white/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
              >
                {t.label}
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
