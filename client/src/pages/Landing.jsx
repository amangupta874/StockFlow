import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FiArrowRight, FiBarChart2, FiBell, FiCheck, FiLayers, FiShield, FiUploadCloud, FiTrendingUp } from "react-icons/fi";
import Logo from "../components/Logo.jsx";

const fadeUp = { hidden: { opacity: 0, y: 28 }, show: { opacity: 1, y: 0 } };
const stagger = { show: { transition: { staggerChildren: 0.1 } } };

const features = [
  { icon: FiLayers, title: "Product catalog", text: "Add, edit, categorize and search all your products with an intuitive card-based interface." },
  { icon: FiTrendingUp, title: "Real-time tracking", text: "Monitor stock levels live. Get instant alerts when products run low or go out of stock." },
  { icon: FiBarChart2, title: "Revenue insights", text: "Track revenue, profit margins and product costs with beautiful analytics dashboards." },
  { icon: FiUploadCloud, title: "Fast bulk importing", text: "Upload CSV, Excel or Google Sheets — auto-detect columns and generate images automatically." },
  { icon: FiBell, title: "Smart notifications", text: "Automatic alerts for low stock, new products, and import results — never miss a beat." },
  { icon: FiShield, title: "Secure & reliable", text: "JWT authentication, encrypted passwords, cloud storage with 99.9% uptime guarantee." },
];

const stats = [
  { label: "Total Profit", value: "₹3,50,240", pct: 72 },
  { label: "Total Revenue", value: "₹4,00,690", pct: 85 },
  { label: "Product Cost", value: "₹2,00,000", pct: 55 },
];

const workflow = [
  { icon: "📄", title: "Upload Sheet", sub: "CSV, XLS, XLSX file" },
  { icon: "🔍", title: "Auto Detect", sub: "Columns mapped automatically" },
  { icon: "🖼️", title: "Generate Images", sub: "Auto-fetch product photos" },
  { icon: "✅", title: "Products Live", sub: "Catalog ready instantly" },
];

const Landing = () => (
  <div className="min-h-screen">
    {/* ═══════ NAVBAR ═══════ */}
    <header className="sticky top-0 z-50 border-b border-white/60 bg-white/70 backdrop-blur-2xl dark:border-white/10 dark:bg-ink/70">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Logo />
        <nav className="flex items-center gap-4">
          <Link className="text-sm font-bold text-slate-600 transition hover:text-ink dark:text-slate-300 dark:hover:text-white" to="/login">
            Login
          </Link>
          <Link className="btn-primary" to="/register">
            Get Started <FiArrowRight />
          </Link>
        </nav>
      </div>
    </header>

    <main>
      {/* ═══════ HERO ═══════ */}
      <section className="px-4 pb-16 pt-24 text-center sm:px-6 lg:px-8">
        <motion.div initial="hidden" animate="show" variants={stagger} className="mx-auto max-w-3xl">
          <motion.span variants={fadeUp} className="inline-block rounded-full border border-brand-mint/30 bg-brand-mint/10 px-4 py-1.5 text-xs font-bold text-teal-700 dark:border-brand-mint/20 dark:text-teal-300">
            ⚡ Trusted by 500+ local store owners
          </motion.span>
          <motion.h1 variants={fadeUp} className="mt-6 text-4xl font-black tracking-tight text-ink dark:text-white sm:text-6xl sm:leading-tight">
            The Operating System for<br />
            <span className="text-brand-mint">Smart Inventory</span> Management
          </motion.h1>
          <motion.p variants={fadeUp} className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-slate-600 dark:text-slate-300">
            Move beyond spreadsheets — StockFlow automatically organizes, tracks stock, and keeps your entire store running smoothly in sync.
          </motion.p>
          <motion.div variants={fadeUp} className="mt-8 flex flex-wrap justify-center gap-4">
            <Link className="btn-primary !px-6 !py-3 !text-base" to="/register">
              Get Started <FiArrowRight />
            </Link>
            <Link className="btn-secondary !px-6 !py-3 !text-base" to="/login">
              See How It Works
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════ DASHBOARD MOCKUP ═══════ */}
      <section className="px-4 pb-24 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="mx-auto max-w-5xl">
          <p className="mb-4 text-center text-sm font-bold text-slate-500 dark:text-slate-400">
            Introducing StockFlow · <Link to="/login" className="text-brand-mint hover:underline">Open Dashboard →</Link>
          </p>
          <div className="glass-panel overflow-hidden rounded-2xl border border-slate-200/80 shadow-2xl dark:border-white/10">
            <div className="flex items-center gap-2 border-b border-slate-200/80 bg-slate-50/50 px-4 py-3 dark:border-white/10 dark:bg-white/[0.02]">
              <span className="h-3 w-3 rounded-full bg-rose-500" />
              <span className="h-3 w-3 rounded-full bg-amber-500" />
              <span className="h-3 w-3 rounded-full bg-emerald-500" />
              <span className="ml-2 text-xs font-bold text-slate-500 dark:text-slate-400">StockFlow Dashboard</span>
            </div>
            <div className="p-6 sm:p-8">
              <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((s) => (
                  <div key={s.label} className="rounded-xl border border-slate-200/80 bg-white p-5 dark:border-white/5 dark:bg-white/[0.02]">
                    <span className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">{s.label}</span>
                    <span className="mt-2 block text-2xl font-black text-ink dark:text-white">{s.value}</span>
                    <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
                      <div className="h-full rounded-full bg-brand-mint" style={{ width: `${s.pct}%` }} />
                    </div>
                  </div>
                ))}
                <div className="rounded-xl border-2 border-brand-mint bg-white p-5 shadow-lg shadow-brand-mint/10 dark:bg-ink">
                  <span className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Performance</span>
                  <span className="mt-2 block text-2xl font-black text-brand-mint">49.65%</span>
                  <span className="mt-4 block text-xs font-bold text-teal-600 dark:text-teal-400">↑ 14% vs last month</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ═══════ FEATURES SPLIT ═══════ */}
      <section className="px-4 py-24 sm:px-6 lg:px-8">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger} className="mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-2">
          <div>
            <motion.h2 variants={fadeUp} className="text-3xl font-black tracking-tight text-ink dark:text-white sm:text-4xl">
              Self-serve management for <span className="text-brand-mint">modern store owners</span>
            </motion.h2>
            <div className="mt-12 grid gap-8 sm:grid-cols-2">
              {features.map((f) => (
                <motion.div key={f.title} variants={fadeUp} className="flex gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-mint/15 text-xl text-teal-600 dark:text-teal-400">
                    <f.icon />
                  </span>
                  <div>
                    <h4 className="font-bold text-ink dark:text-white">{f.title}</h4>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{f.text}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          <motion.div variants={fadeUp} className="relative mx-auto w-full max-w-sm">
            <div className="relative z-10 overflow-hidden rounded-[2.5rem] border-8 border-ink bg-ink shadow-2xl dark:border-slate-800">
              <div className="bg-white pb-8 dark:bg-ink">
                <div className="bg-brand-mint px-6 py-8 text-center text-ink">
                  <h3 className="font-bold">📱 StockFlow Mobile</h3>
                </div>
                <div className="px-4 pt-4">
                  {[
                    ["🥛 Amul Milk 1L", "In Stock", "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"],
                    ["🧂 Tata Salt 1kg", "In Stock", "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"],
                    ["🍜 Maggi Noodles", "Low Stock", "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"],
                    ["🧹 Surf Excel 1kg", "Out", "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400"],
                  ].map(([name, status, colors]) => (
                    <div key={name} className="flex items-center justify-between border-b border-slate-100 py-4 dark:border-white/5">
                      <span className="text-sm font-bold text-ink dark:text-white">{name}</span>
                      <span className={`rounded-lg px-2.5 py-1 text-xs font-bold ${colors}`}>{status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* Decorative blob behind phone */}
            <div className="absolute -inset-4 z-0 rounded-full bg-brand-mint/20 blur-3xl" />
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════ WORKFLOW ═══════ */}
      <section className="border-y border-slate-200/80 bg-slate-50/50 px-4 py-24 dark:border-white/5 dark:bg-white/[0.02] sm:px-6 lg:px-8">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger} className="mx-auto max-w-7xl">
          <motion.div variants={fadeUp} className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-black tracking-tight text-ink dark:text-white sm:text-4xl">
              Import products to automate <span className="text-brand-mint">inventory setup</span>
            </h2>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
              Upload your Google Sheet or CSV and StockFlow handles the rest — column detection, data validation, and automatic image generation.
            </p>
          </motion.div>
          <motion.div variants={fadeUp} className="mt-16 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6 lg:gap-8">
            <div className="rounded-full bg-ink px-6 py-3 text-sm font-bold text-white dark:bg-white dark:text-ink">Start</div>
            <span className="rotate-90 text-slate-300 dark:text-slate-600 sm:rotate-0">→</span>
            {workflow.map((w, i) => (
              <div key={w.title} className="flex flex-col items-center gap-4 sm:flex-row sm:gap-6 lg:gap-8">
                <div className={`surface flex w-48 flex-col items-center rounded-2xl p-6 text-center ${i === workflow.length - 1 ? "border-brand-mint/50 bg-brand-mint/5 dark:bg-brand-mint/10" : ""}`}>
                  <span className="text-3xl">{w.icon}</span>
                  <strong className="mt-3 block text-sm text-ink dark:text-white">{w.title}</strong>
                  <span className="mt-1 block text-xs text-slate-500 dark:text-slate-400">{w.sub}</span>
                </div>
                {i < workflow.length - 1 && <span className="rotate-90 text-slate-300 dark:text-slate-600 sm:rotate-0">→</span>}
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════ CTA ═══════ */}
      <section className="px-4 pb-24 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="premium-band mx-auto max-w-4xl p-12 text-center sm:p-16">
          <p className="text-xs font-bold uppercase tracking-wider text-teal-200">Ready for launch</p>
          <h2 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-4xl">
            Give your store a real inventory command center.
          </h2>
          <div className="mt-10 flex justify-center">
            <Link className="btn-primary !bg-white !text-ink hover:!bg-slate-100" to="/register">
              Build my store <FiArrowRight />
            </Link>
          </div>
        </motion.div>
      </section>
    </main>

    <footer className="border-t border-slate-200/80 px-4 py-8 text-center text-sm text-slate-500 dark:border-white/5 dark:text-slate-400 sm:px-6 lg:px-8">
      StockFlow. Full-stack inventory management for small businesses.
    </footer>
  </div>
);

export default Landing;
