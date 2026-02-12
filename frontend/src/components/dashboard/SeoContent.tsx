import Link from "next/link";

export default function SeoContent() {
    return (
        <div className="mt-12 border-t border-border/60 bg-card/30 backdrop-blur-sm">
            <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
                <article className="prose prose-slate dark:prose-invert max-w-none">
                    <h2 className="text-3xl font-bold tracking-tight mb-6">
                        The #1 Live Forex Currency Strength Meter
                    </h2>
                    <p className="text-lg leading-relaxed text-muted-foreground">
                        Welcome to <strong>LiveForexStrength</strong>, the most accurate real-time tool for monitoring global currency flows.
                        Unlike static charts, our <strong>live currency strength meter</strong> aggregates data from thousands of price ticks per second
                        to rank the 8 major currencies (USD, EUR, GBP, JPY, CHF, CAD, AUD, NZD) from strongest (0) to weakest (100).
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-12 not-prose">
                        <div className="rounded-2xl border border-border/50 bg-background/50 p-6">
                            <h3 className="text-xl font-semibold mb-3">🚀 Identify Trends Instantly</h3>
                            <p className="text-muted-foreground">
                                Stop guessing. See exactly which currencies are being bought (Strong) and sold (Weak) by institutions in real-time.
                            </p>
                        </div>
                        <div className="rounded-2xl border border-border/50 bg-background/50 p-6">
                            <h3 className="text-xl font-semibold mb-3">⏱️ Multi-Timeframe Analysis</h3>
                            <p className="text-muted-foreground">
                                From scalping (5m) to swing trading (4h/Daily). Align your trades with the dominant market momentum.
                            </p>
                        </div>
                    </div>

                    <h2 className="text-2xl font-bold mb-4">How to Read the Currency Strength Meter</h2>
                    <p>
                        The concept is simple: <strong>Buy Strength, Sell Weakness.</strong>
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                        <li>
                            <strong>0-20 (Weak):</strong> The currency is being heavily sold. Look for short opportunities.
                        </li>
                        <li>
                            <strong>40-60 (Neutral):</strong> The market is undecided or ranging. Avoid trading these pairs.
                        </li>
                        <li>
                            <strong>80-100 (Strong):</strong> The currency is being heavily bought. Look for long opportunities.
                        </li>
                    </ul>
                    <p className="mt-4">
                        <strong>Pro Tip:</strong> Look for a spread of at least 30 points. For example, if <Link href="/currencies/usd">USD</Link> is 85 and <Link href="/currencies/jpy">JPY</Link> is 15, the <strong>USD/JPY</strong> pair has a high probability of trending up.
                    </p>

                    <h2 className="text-2xl font-bold mt-12 mb-4">Mastering Forex Correlation</h2>
                    <p>
                        Don't just trade one pair in isolation. Use our <Link href="/heatmap">Forex Heatmap</Link> to visualize total market performance.
                        Check how <Link href="/pairs/eur-usd">EUR/USD</Link>, <Link href="/pairs/gbp-jpy">GBP/JPY</Link>, and other major pairs are moving relative to each other.
                    </p>

                    <h2 className="text-2xl font-bold mt-12 mb-6">Latest Market Analysis & Guides</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 not-prose">
                        <Link href="/blog/what-is-currency-strength" className="group block p-4 rounded-xl border border-border/40 hover:bg-muted/50 transition-colors">
                            <h3 className="font-semibold group-hover:text-blue-500 transition-colors">What Is Currency Strength?</h3>
                            <p className="text-sm text-muted-foreground mt-1">The complete guide for beginners.</p>
                        </Link>
                        <Link href="/blog/how-to-read-currency-strength-meter" className="group block p-4 rounded-xl border border-border/40 hover:bg-muted/50 transition-colors">
                            <h3 className="font-semibold group-hover:text-blue-500 transition-colors">How to Read a Strength Meter</h3>
                            <p className="text-sm text-muted-foreground mt-1">Step-by-step tutorial for traders.</p>
                        </Link>
                        <Link href="/blog/strongest-currencies-in-the-world-2025" className="group block p-4 rounded-xl border border-border/40 hover:bg-muted/50 transition-colors">
                            <h3 className="font-semibold group-hover:text-blue-500 transition-colors">Strongest Currencies (2025)</h3>
                            <p className="text-sm text-muted-foreground mt-1">Current global rankings explained.</p>
                        </Link>
                        <Link href="/blog/best-forex-pairs-to-trade" className="group block p-4 rounded-xl border border-border/40 hover:bg-muted/50 transition-colors">
                            <h3 className="font-semibold group-hover:text-blue-500 transition-colors">Best Forex Pairs to Trade</h3>
                            <p className="text-sm text-muted-foreground mt-1">How to pick winning pairs.</p>
                        </Link>
                    </div>
                </article>

                <footer className="mt-24 border-t border-border/40 pt-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
                        <div>
                            <h4 className="font-semibold mb-3">Tools</h4>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li><Link href="/" className="hover:text-foreground">Dashboard</Link></li>
                                <li><Link href="/heatmap" className="hover:text-foreground">Heatmap</Link></li>
                                <li><Link href="/pairs" className="hover:text-foreground">Pairs</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-3">Analysis</h4>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li><Link href="/blog" className="hover:text-foreground">Blog</Link></li>
                                <li><Link href="/currencies" className="hover:text-foreground">Currencies</Link></li>
                                <li><Link href="/timeframes" className="hover:text-foreground">Timeframes</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-3">Company</h4>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li><Link href="/about" className="hover:text-foreground">About</Link></li>
                                <li><Link href="/contact" className="hover:text-foreground">Contact</Link></li>
                                <li><Link href="/faq" className="hover:text-foreground">FAQ</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-3">Legal</h4>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li><Link href="/privacy" className="hover:text-foreground">Privacy Policy</Link></li>
                                <li><Link href="/terms" className="hover:text-foreground">Terms of Service</Link></li>
                                <li><Link href="/disclaimer" className="hover:text-foreground">Disclaimer</Link></li>
                            </ul>
                        </div>
                    </div>
                    <div className="text-center text-xs text-muted-foreground">
                        &copy; {new Date().getFullYear()} LiveForexStrength. All rights reserved. Trading forex involves significant risk.
                    </div>
                </footer>
            </div>
        </div>
    );
}
