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
    <footer className="mt-10 border-t border-border/70 bg-background/70 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-muted-foreground">
            © {year} <span className="font-semibold text-foreground">LiveForexStrength</span>
          </div>

          <nav className="flex flex-wrap gap-x-4 gap-y-2">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground hover:underline"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>

        <p className="mt-4 text-xs leading-relaxed text-muted-foreground/80">
          Forex trading involves risk. This site provides informational tools only and does not provide investment advice.
        </p>
      </div>
    </footer>
  );
}
