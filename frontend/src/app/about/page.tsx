import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About',
  description:
    'About LiveForexStrength: a live forex currency strength meter for major currencies across multiple timeframes.',
  alternates: { canonical: '/about' },
  openGraph: {
    type: 'website',
    url: '/about',
    title: 'About LiveForexStrength',
    description:
      'A live forex currency strength meter for major currencies across multiple timeframes.',
    images: [{ url: '/opengraph-image' }],
  },
};

export default function AboutPage() {
  return (
    <main className="min-h-screen text-slate-900 dark:text-white">
      <div className="pointer-events-none fixed inset-0 -z-10 hidden dark:block bg-[radial-gradient(900px_circle_at_20%_10%,rgba(59,130,246,0.18),transparent_55%),radial-gradient(800px_circle_at_80%_20%,rgba(16,185,129,0.12),transparent_55%),linear-gradient(to_bottom,rgba(2,6,23,1),rgba(0,0,0,1))]" />
      <div className="pointer-events-none fixed inset-0 -z-10 dark:hidden bg-[radial-gradient(900px_circle_at_20%_10%,rgba(106,34,179,0.10),transparent_60%),radial-gradient(800px_circle_at_80%_20%,rgba(61,96,141,0.10),transparent_60%),linear-gradient(to_bottom,rgba(244,245,250,1),rgba(244,245,250,1))]" />

      <div className="container mx-auto max-w-4xl p-4 sm:p-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">About</h1>
          <Link
            href="/"
            className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline dark:text-blue-300 dark:hover:text-blue-200"
          >
            ← Back to Dashboard
          </Link>
        </div>

        <section className="rounded-2xl border border-black/5 bg-white/60 p-6 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5">
          <p className="leading-relaxed text-slate-700 dark:text-white/80">
            LiveForexStrength is a simple, fast way to view relative strength (0–100) for the 8 major
            currencies: USD, EUR, GBP, JPY, CHF, CAD, AUD and NZD. The goal is to help you quickly
            spot strong-versus-weak combinations across multiple timeframes.
          </p>
          <p className="mt-4 leading-relaxed text-slate-700 dark:text-white/80">
            The dashboard updates live and aggregates FX moves across a basket of pairs. It is meant
            for analysis and education — not as a trading signal by itself.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/faq"
              className="rounded-xl border border-black/10 bg-white/70 px-4 py-2 text-sm font-medium text-slate-900 hover:bg-white dark:border-white/10 dark:bg-white/10 dark:text-white"
            >
              Read the FAQ
            </Link>
            <Link
              href="/blog"
              className="rounded-xl border border-black/10 bg-white/70 px-4 py-2 text-sm font-medium text-slate-900 hover:bg-white dark:border-white/10 dark:bg-white/10 dark:text-white"
            >
              Market Analysis Blog
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}

