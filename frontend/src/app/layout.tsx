import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from 'sonner';

export const metadata: Metadata = {
  title: "Currency Strength Meter",
  description: "Real-time forex strength meter",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(() => {
  try {
    const theme = localStorage.getItem('theme');
    const isDark = theme !== 'light';
    document.documentElement.classList.toggle('dark', isDark);
  } catch {}
})();`,
          }}
        />
      </head>
      <body className="antialiased">
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
