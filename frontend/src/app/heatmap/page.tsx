import type { Metadata } from 'next';
import Link from 'next/link';
import Script from 'next/script';
import ForexHeatmap from '@/components/ForexHeatmap';

function getSiteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL || 'https://liveforexstrength.com').replace(/\/+$/, '');
}

function getInternalBackendBaseUrl(): string {
  if (process.env.INTERNAL_BACKEND_URL) return process.env.INTERNAL_BACKEND_URL.replace(/\/+$/, '');
  if (process.env.NODE_ENV === 'production') return 'http://backend:3001';
  return 'http://localhost:3001';
}

export const metadata: Metadata = {
  title: 'Forex Heatmap (Pairs x Timeframes)',
  description:
    'Heatmap of major FX pairs across multiple timeframes. View pips or percent change for each pair to spot momentum and reversals.',
  alternates: { canonical: '/heatmap' },
  openGraph: {
    type: 'website',
    url: '/heatmap',
    title: 'Forex Heatmap | LiveForexStrength',
    description:
      'Heatmap of major FX pairs across timeframes (pips/percent) to quickly spot the strongest movers.',
    images: [{ url: '/opengraph-image' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Forex Heatmap | LiveForexStrength',
    description: 'Major FX pair heatmap across timeframes (pips/percent).',
    images: ['/opengraph-image'],
  },
};

type HeatmapRow = { pair: string; pips: number; percent: number };
type DashboardTimeframe = '5m' | '15m' | '30m' | '1h' | '4h' | '12h' | '24h' | '1w';
type HeatmapPayload = { at: number; valuesByTf: Record<DashboardTimeframe, HeatmapRow[] | null> };

async function getHeatmap(): Promise<HeatmapPayload | null> {
  try {
    const base = getInternalBackendBaseUrl();
    const res = await fetch(`${base}/api/heatmap`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    return (await res.json()) as HeatmapPayload | null;
  } catch {
    return null;
  }
}

export default async function HeatmapPage() {
  const siteUrl = getSiteUrl();
  const initial = await getHeatmap();

  const breadcrumbs = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Dashboard', item: `${siteUrl}/` },
      { '@type': 'ListItem', position: 2, name: 'Heatmap', item: `${siteUrl}/heatmap` },
    ],
  };

  return (
    <main className="min-h-screen text-slate-900 dark:text-white">
      <Script id="heatmap-breadcrumbs-jsonld" type="application/ld+json" strategy="beforeInteractive">
        {JSON.stringify(breadcrumbs)}
      </Script>

      <div className="pointer-events-none fixed inset-0 -z-10 hidden dark:block bg-[radial-gradient(900px_circle_at_20%_10%,rgba(59,130,246,0.18),transparent_55%),radial-gradient(800px_circle_at_80%_20%,rgba(16,185,129,0.12),transparent_55%),linear-gradient(to_bottom,rgba(2,6,23,1),rgba(0,0,0,1))]" />
      <div className="pointer-events-none fixed inset-0 -z-10 dark:hidden bg-[radial-gradient(900px_circle_at_20%_10%,rgba(106,34,179,0.10),transparent_60%),radial-gradient(800px_circle_at_80%_20%,rgba(61,96,141,0.10),transparent_60%),linear-gradient(to_bottom,rgba(244,245,250,1),rgba(244,245,250,1))]" />

      <div className="container mx-auto max-w-6xl p-4 sm:p-6">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Forex Heatmap</h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-white/70">
              Pair moves across timeframes (pips or percent).
            </p>
          </div>
          <Link
            href="/"
            className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline dark:text-blue-300 dark:hover:text-blue-200"
          >
            ← Back to Dashboard
          </Link>
        </div>

        <ForexHeatmap initial={initial} />
      </div>
    </main>
  );
}

