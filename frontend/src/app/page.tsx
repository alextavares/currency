import StrengthDashboard from "@/components/StrengthDashboard";
import HistoryChart from "@/components/HistoryChart";
import AlertManager from "@/components/AlertManager";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Live Forex Strength Meter (5m–1W)",
  description:
    "Live forex currency strength meter for the 8 major currencies (USD, EUR, GBP, JPY, CHF, CAD, AUD, NZD) across multiple timeframes.",
  alternates: {
    canonical: "/",
  },
};

export default function Home() {
  return (
    <main className="min-h-screen text-slate-900 dark:text-white">
      <div className="pointer-events-none fixed inset-0 -z-10 hidden dark:block bg-[radial-gradient(900px_circle_at_20%_10%,rgba(59,130,246,0.18),transparent_55%),radial-gradient(800px_circle_at_80%_20%,rgba(16,185,129,0.12),transparent_55%),linear-gradient(to_bottom,rgba(2,6,23,1),rgba(0,0,0,1))]" />
      <div className="pointer-events-none fixed inset-0 -z-10 dark:hidden bg-[radial-gradient(900px_circle_at_20%_10%,rgba(106,34,179,0.10),transparent_60%),radial-gradient(800px_circle_at_80%_20%,rgba(61,96,141,0.10),transparent_60%),linear-gradient(to_bottom,rgba(244,245,250,1),rgba(244,245,250,1))]" />
      <div className="container mx-auto space-y-8 max-w-5xl p-4 sm:p-6">
        <StrengthDashboard />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <HistoryChart />
          <AlertManager />
        </div>
        <section className="rounded-2xl border border-black/5 bg-white/60 p-6 text-slate-700 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5 dark:text-white/80">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
            What is a Forex Currency Strength Meter?
          </h2>
          <p className="mt-2 leading-relaxed">
            A currency strength meter estimates which major currencies are strongest and weakest relative to each other.
            It aggregates price moves across multiple FX pairs so you can quickly spot strong-vs-weak combinations and pick pairs
            that trend more cleanly.
          </p>
          <p className="mt-3 leading-relaxed">
            Use the timeframe buttons to switch between short-term momentum (e.g., 5m/15m) and higher-timeframe bias (e.g., 4h/1W).
            Strength scores range from 0–100.
          </p>
        </section>
      </div>
    </main>
  );
}
