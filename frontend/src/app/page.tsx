import StrengthDashboard from "@/components/StrengthDashboard";
import HistoryChart from "@/components/HistoryChart";
import AlertManager from "@/components/AlertManager";

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
      </div>
    </main>
  );
}
