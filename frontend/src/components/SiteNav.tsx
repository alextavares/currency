import Link from 'next/link';

const LINKS: Array<{ href: string; label: string }> = [
  { href: '/', label: 'Dashboard' },
  { href: '/currencies', label: 'Currencies' },
  { href: '/timeframes', label: 'Timeframes' },
  { href: '/blog', label: 'Blog' },
  { href: '/about', label: 'About' },
  { href: '/faq', label: 'FAQ' },
];

export default function SiteNav() {
  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-white/70 backdrop-blur dark:border-white/10 dark:bg-black/20">
      <div className="container mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="font-semibold tracking-tight text-slate-900 dark:text-white">
          LiveForexStrength
        </Link>

        <nav className="flex items-center gap-1">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-black/5 hover:text-slate-900 dark:text-white/80 dark:hover:bg-white/10 dark:hover:text-white"
            >
              {l.label}
            </Link>
          ))}
          <a
            href="/rss.xml"
            className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-black/5 hover:text-slate-900 dark:text-white/80 dark:hover:bg-white/10 dark:hover:text-white"
          >
            RSS
          </a>
        </nav>
      </div>
    </header>
  );
}
