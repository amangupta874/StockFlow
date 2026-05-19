import { useEffect, useMemo, useState } from "react";
import { FiAlertTriangle, FiBox, FiDollarSign, FiTrendingUp } from "react-icons/fi";
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
            <h3 className="font-black text-ink dark:text-white">Recent Activity</h3>
            <div className="mt-4 space-y-3">
              {stats.recentActivity.length === 0 && <p className="text-sm text-slate-500">No product movement yet.</p>}
              {stats.recentActivity.map((item) => (
                <div key={item._id} className="flex items-center justify-between rounded-lg bg-slate-50 p-3 dark:bg-white/[0.04]">
                  <div>
                    <p className="font-bold text-ink dark:text-white">{item.title}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{item.category}</p>
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
