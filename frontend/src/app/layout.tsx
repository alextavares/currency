import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from 'sonner';
import { Inter, JetBrains_Mono } from "next/font/google";

const fontUi = Inter({
  subsets: ["latin"],
  variable: "--font-ui",
  display: "swap",
});

const fontMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

function getSiteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL || 'https://liveforexstrength.com').replace(/\/+$/, '');
}

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: "Live Forex Currency Strength Meter (Online, 5m–1W)",
    template: "%s | LiveForexStrength",
  },
  description:
    "Live forex currency strength meter (online dashboard) for the 8 major currencies across multiple timeframes.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "LiveForexStrength",
    title: "Live Forex Currency Strength Meter (Online, 5m–1W)",
    description:
      "Live forex currency strength meter (online dashboard) for the 8 major currencies across multiple timeframes.",
    images: [{ url: "/opengraph-image" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Live Forex Currency Strength Meter (Online, 5m–1W)",
    description:
      "Live forex currency strength meter (online dashboard) for the 8 major currencies across multiple timeframes.",
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const siteUrl = getSiteUrl();
  const schemaOrg = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "LiveForexStrength",
      url: siteUrl,
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "LiveForexStrength",
      url: siteUrl,
      potentialAction: {
        "@type": "SearchAction",
        target: `${siteUrl}/blog?q={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    },
  ];

  return (
    <html lang="en">
      <head>
        <link
          rel="alternate"
          type="application/rss+xml"
          title="LiveForexStrength RSS"
          href="/rss.xml"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `(() => {
  try {
    const theme = localStorage.getItem('theme');
    const isDark = theme === 'dark';
    document.documentElement.classList.toggle('dark', isDark);
  } catch {}
})();`,
          }}
        />
      </head>
      <body className={`${fontUi.variable} ${fontMono.variable} font-sans antialiased`}>
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
