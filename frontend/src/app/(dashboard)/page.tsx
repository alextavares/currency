import type { Metadata } from "next";
import { isDashboardTimeframe, type DashboardTimeframe } from "@/lib/dashboardTimeframes";
import DashboardPageClient from "@/components/dashboard/DashboardPageClient";

export const metadata: Metadata = {
  title: "Live Forex Currency Strength Meter (Online Dashboard, 5m–1W)",
  description:
    "Live forex currency strength meter (online dashboard) for the 8 major currencies (USD, EUR, GBP, JPY, CHF, CAD, AUD, NZD) across multiple timeframes.",
  alternates: {
    canonical: "/",
  },
};

type Props = {
  searchParams?: Promise<{ tf?: string | string[] }>;
};

export default async function Home({ searchParams }: Props) {
  const resolved = searchParams ? await searchParams : undefined;
  const tfParam = Array.isArray(resolved?.tf) ? resolved?.tf[0] : resolved?.tf;
  const initialTf: DashboardTimeframe | undefined = isDashboardTimeframe(tfParam) ? tfParam : undefined;

  return <DashboardPageClient initialTf={initialTf} />;
}
