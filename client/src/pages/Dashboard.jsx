import { useEffect, useMemo, useState } from "react";
import {
  FiActivity,
  FiAlertTriangle,
  FiBox,
  FiCheckCircle,
  FiDollarSign,
  FiTrendingUp,
  FiZap
} from "react-icons/fi";
import ChartPanel from "../components/ChartPanel.jsx";
import EmptyState from "../components/EmptyState.jsx";
import PageHeader from "../components/PageHeader.jsx";
import StatCard from "../components/StatCard.jsx";
import { useTheme } from "../context/ThemeContext.jsx";
import { dashboardService } from "../services/api.js";
import { currency } from "../utils/formatters.js";

const emptyStats = {
  totalProducts: 0,
  inventoryValue: 0,
  totalUnits: 0,
  lowStockProducts: 0,
  outOfStockProducts: 0,
  categoryDistribution: [],
  stockLevels: [],
  monthlySales: [],
  recentActivity: []
};

const Dashboard = () => {
  const [stats, setStats] = useState(emptyStats);
  const [loading, setLoading] = useState(true);
  const { isDark } = useTheme();
  const textColor = isDark ? "#e2e8f0" : "#334155";
  const gridColor = isDark ? "rgba(255,255,255,0.08)" : "rgba(15,23,42,0.08)";
  const inventoryHealth = stats.totalProducts
    ? Math.max(0, Math.round(((stats.totalProducts - stats.lowStockProducts - (stats.outOfStockProducts || 0)) / stats.totalProducts) * 100))
    : 100;
  const topCategory = stats.categoryDistribution[0]?._id || "No category yet";
  const riskLabel = inventoryHealth > 84 ? "Excellent" : inventoryHealth > 64 ? "Stable" : "Needs action";

  useEffect(() => {
    const loadStats = async () => {
      setLoading(true);
      try {
        const data = await dashboardService.stats();
        setStats({ ...emptyStats, ...data });
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { labels: { color: textColor } } },
    scales: {
      x: { ticks: { color: textColor }, grid: { color: gridColor } },
      y: { ticks: { color: textColor }, grid: { color: gridColor } }
    }
  };

  const pieConfig = useMemo(
    () => ({
      type: "doughnut",
      data: {
        labels: stats.categoryDistribution.map((item) => item._id || "Uncategorized"),
        datasets: [
          {
            data: stats.categoryDistribution.map((item) => item.value),
            backgroundColor: ["#2dd4bf", "#ff6b6b", "#3b82f6", "#f59e0b", "#a78bfa", "#22c55e"],
            borderWidth: 0
          }
        ]
      },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: "bottom", labels: { color: textColor } } } }
    }),
    [stats.categoryDistribution, textColor]
  );

  const lineConfig = useMemo(
    () => ({
      type: "line",
      data: {
        labels: stats.monthlySales.map((item) => item.month),
        datasets: [
          {
            label: "Monthly sales",
            data: stats.monthlySales.map((item) => item.value),
            borderColor: "#2dd4bf",
            backgroundColor: "rgba(45, 212, 191, 0.16)",
            fill: true,
            tension: 0.4
          }
        ]
      },
      options: chartOptions
    }),
    [stats.monthlySales, textColor, gridColor]
  );

  const barConfig = useMemo(
    () => ({
      type: "bar",
      data: {
        labels: stats.stockLevels.map((item) => item.title),
        datasets: [
          {
            label: "Units",
            data: stats.stockLevels.map((item) => item.quantity),
            backgroundColor: "#3b82f6",
            borderRadius: 8
          }
        ]
      },
      options: chartOptions
    }),
    [stats.stockLevels, textColor, gridColor]
  );

  return (
    <>
      <PageHeader
        eyebrow="Dashboard"
        title="Inventory analytics"
        subtitle="A real-time view of stock health, inventory value, category mix, and recent movement."
      />

      <section className="premium-band mb-5 p-5 md:p-6">
        <div className="relative grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-teal-100">
              <FiZap />
              Live command center
            </div>
            <h2 className="mt-4 max-w-2xl text-3xl font-black tracking-tight md:text-5xl">
              Your store is operating at {loading ? "..." : `${inventoryHealth}%`} inventory health.
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-200">
              Track the signals that matter most: stock coverage, category concentration, low-stock risk, and recent product movement.
            </p>
            <div className="mt-5 grid max-w-2xl gap-3 sm:grid-cols-3">
              {[
                ["Health", loading ? "..." : `${inventoryHealth}%`],
                ["Top Category", topCategory],
                ["Risk", loading ? "..." : riskLabel]
              ].map(([label, value]) => (
                <div key={label} className="rounded-lg border border-white/10 bg-white/10 p-3 backdrop-blur">
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-300">{label}</p>
                  <p className="mt-2 truncate text-xl font-black">{value}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/10 p-4 backdrop-blur">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-300">Stock Health</p>
                <p className="mt-1 text-4xl font-black">{loading ? "..." : `${inventoryHealth}%`}</p>
              </div>
              <span className="grid h-12 w-12 place-items-center rounded-lg bg-brand-mint text-ink">
                <FiActivity className="text-xl" />
              </span>
            </div>
            <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/15">
              <div className="h-full rounded-full bg-brand-mint transition-all duration-700" style={{ width: `${loading ? 0 : inventoryHealth}%` }} />
            </div>
            <div className="mt-5 grid grid-cols-3 gap-2">
              {[
                ["Products", stats.totalProducts],
                ["Units", stats.totalUnits],
                ["Low", stats.lowStockProducts]
              ].map(([label, value]) => (
                <div key={label} className="rounded-lg bg-ink/35 p-3">
                  <p className="text-xs text-slate-300">{label}</p>
                  <p className="mt-1 text-2xl font-black">{loading ? "..." : value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={FiBox} label="Total Products" value={loading ? "..." : stats.totalProducts} />
        <StatCard icon={FiDollarSign} label="Inventory Value" tone="bg-brand-gold/15 text-amber-700" value={loading ? "..." : currency(stats.inventoryValue)} />
        <StatCard icon={FiAlertTriangle} label="Low Stock" tone="bg-brand-coral/15 text-rose-700" value={loading ? "..." : stats.lowStockProducts} />
        <StatCard icon={FiTrendingUp} label="Total Units" tone="bg-brand-blue/15 text-blue-700" value={loading ? "..." : stats.totalUnits} />
      </div>

      {!loading && stats.totalProducts === 0 ? (
        <div className="mt-6">
          <EmptyState title="Dashboard is waiting for products" text="Add products with quantity and price to light up the analytics panels." />
        </div>
      ) : (
        <div className="mt-6 grid gap-4 xl:grid-cols-2">
          <ChartPanel title="Inventory Distribution" subtitle="Quantity by category" config={pieConfig} />
          <ChartPanel title="Monthly Sales" subtitle="Modeled trend until order data is enabled" config={lineConfig} />
          <ChartPanel title="Stock Levels" subtitle="Top stocked products" config={barConfig} />
          <div className="surface rounded-lg p-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-black text-ink dark:text-white">Recent Activity</h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Latest stock movement from your catalog</p>
              </div>
              <FiCheckCircle className="text-2xl text-teal-500" />
            </div>
            <div className="mt-4 space-y-3">
              {stats.recentActivity.length === 0 && <p className="text-sm text-slate-500">No product movement yet.</p>}
              {stats.recentActivity.map((item) => (
                <div key={item._id} className="flex items-center justify-between rounded-lg bg-slate-50 p-3 dark:bg-white/[0.04]">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-lg bg-brand-mint/15 text-teal-700 dark:text-teal-200">
                      {item.image ? (
                        <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
                      ) : (
                        <FiBox />
                      )}
                    </span>
                    <div className="min-w-0">
                    <p className="font-bold text-ink dark:text-white">{item.title}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{item.category}</p>
                    </div>
                  </div>
                  <span className="text-sm font-black">{item.quantity} units</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Dashboard;
