import Link from 'next/link';

const LINKS: Array<{ href: string; label: string }> = [
  { href: '/how-it-works', label: 'How it works' },
  { href: '/heatmap', label: 'Heatmap' },
  { href: '/pairs', label: 'Pairs' },
  { href: '/timeframes', label: 'Timeframes' },
  { href: '/blog', label: 'Blog' },
  { href: '/disclaimer', label: 'Disclaimer' },
  { href: '/privacy', label: 'Privacy' },
  { href: '/terms', label: 'Terms' },
];

export default function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-10 border-t border-black/5 bg-white/70 backdrop-blur dark:border-white/10 dark:bg-black/20">
      <div className="container mx-auto max-w-5xl px-4 py-6 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-slate-600 dark:text-white/70">
            © {year} <span className="font-semibold text-slate-900 dark:text-white">LiveForexStrength</span>
          </div>

          <nav className="flex flex-wrap gap-x-4 gap-y-2">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-sm font-medium text-slate-600 hover:text-slate-900 hover:underline dark:text-white/70 dark:hover:text-white"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>

        <p className="mt-4 text-xs leading-relaxed text-slate-500 dark:text-white/50">
          Forex trading involves risk. This site provides informational tools only and does not provide investment advice.
        </p>
      </div>
    </footer>
  );
}

