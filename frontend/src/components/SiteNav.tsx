import Link from 'next/link';

const LINKS: Array<{ href: string; label: string }> = [
  { href: '/', label: 'Dashboard' },
  { href: '/heatmap', label: 'Heatmap' },
  { href: '/currencies', label: 'Currencies' },
  { href: '/timeframes', label: 'Timeframes' },
  { href: '/pairs', label: 'Pairs' },
  { href: '/blog', label: 'Blog' },
  { href: '/about', label: 'About' },
  { href: '/faq', label: 'FAQ' },
];

export default function SiteNav() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/70 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="font-semibold tracking-tight text-foreground">
          LiveForexStrength
        </Link>

        <nav className="flex items-center gap-1 overflow-x-auto">
          <div className="flex items-center gap-1">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="shrink-0 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted/40 hover:text-foreground"
              >
                {l.label}
              </Link>
            ))}
            <a
              href="/rss.xml"
              className="shrink-0 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted/40 hover:text-foreground"
            >
              RSS
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}
