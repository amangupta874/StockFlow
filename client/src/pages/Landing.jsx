import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FiArrowRight, FiBarChart2, FiCheck, FiLayers, FiShield } from "react-icons/fi";
import Logo from "../components/Logo.jsx";

const features = [
  { icon: FiLayers, title: "Inventory OS", text: "Products, categories, quantities, and stock status in one protected workspace." },
  { icon: FiBarChart2, title: "Live Analytics", text: "Track inventory value, category spread, low stock, and operational movement." },
  { icon: FiShield, title: "Secure by Design", text: "JWT sessions, hashed passwords, protected APIs, and store-level data isolation." }
];

const Landing = () => (
  <div className="min-h-screen">
    <header className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
      <Logo />
      <nav className="hidden items-center gap-2 sm:flex">
        <Link className="btn-secondary" to="/login">
          Login
        </Link>
        <Link className="btn-primary" to="/register">
          Start Free
          <FiArrowRight />
        </Link>
      </nav>
    </header>

    <main>
      <section className="mx-auto grid max-w-7xl items-center gap-10 px-4 pb-14 pt-10 sm:px-6 md:grid-cols-[1.03fr_0.97fr] lg:px-8">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
          <div className="mb-5 inline-flex rounded-full border border-slate-200 bg-white/70 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-slate-600 backdrop-blur dark:border-white/10 dark:bg-white/[0.06] dark:text-slate-300">
            Built for modern local stores
          </div>
          <h1 className="max-w-4xl text-5xl font-black tracking-tight text-ink dark:text-white sm:text-6xl lg:text-7xl">
            StockFlow
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
            A real full-stack inventory platform with store authentication, product management, stock tracking, analytics, and a premium SaaS interface.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link className="btn-primary px-6 py-3" to="/register">
              Create store
              <FiArrowRight />
            </Link>
            <Link className="btn-secondary px-6 py-3" to="/login">
              Open dashboard
            </Link>
          </div>
          <div className="mt-8 grid max-w-xl grid-cols-3 gap-3">
            {["Products", "Inventory", "Analytics"].map((item) => (
              <div key={item} className="surface rounded-lg p-3 text-center text-sm font-bold text-slate-700 dark:text-slate-200">
                {item}
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="glass-panel rounded-lg p-3"
        >
          <div className="rounded-lg bg-ink p-4 text-white dark:bg-white dark:text-ink">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] opacity-70">Today</p>
                <h2 className="mt-2 text-2xl font-black">North Star Grocers</h2>
              </div>
              <span className="rounded-lg bg-brand-mint px-3 py-1 text-sm font-black text-ink">Live</span>
            </div>
            <div className="mt-6 grid grid-cols-3 gap-3">
              {[
                ["Products", "248"],
                ["Value", "₹8.4L"],
                ["Low Stock", "12"]
              ].map(([label, value]) => (
                <div key={label} className="rounded-lg bg-white/10 p-3 dark:bg-ink/5">
                  <p className="text-xs opacity-70">{label}</p>
                  <p className="mt-2 text-2xl font-black">{value}</p>
                </div>
              ))}
            </div>
            <div className="mt-5 rounded-lg bg-white/10 p-4 dark:bg-ink/5">
              <div className="flex h-40 items-end gap-2">
                {[44, 72, 56, 88, 62, 100, 84, 68].map((height, index) => (
                  <div key={index} className="flex-1 rounded-t bg-brand-mint" style={{ height: `${height}%` }} />
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-3">
          {features.map((feature) => (
            <motion.div key={feature.title} whileHover={{ y: -5 }} className="surface rounded-lg p-6">
              <span className="grid h-11 w-11 place-items-center rounded-lg bg-brand-mint/15 text-teal-700 dark:text-teal-200">
                <feature.icon />
              </span>
              <h3 className="mt-5 text-xl font-black text-ink dark:text-white">{feature.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{feature.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-4 px-4 py-10 sm:px-6 md:grid-cols-3 lg:px-8">
        {["Starter", "Growth", "Scale"].map((plan, index) => (
          <div key={plan} className="glass-panel rounded-lg p-6">
            <p className="label">{plan}</p>
            <p className="mt-3 text-3xl font-black text-ink dark:text-white">{index === 0 ? "Free" : `₹${(index + 1) * 999}`}</p>
            <div className="mt-5 space-y-3 text-sm text-slate-600 dark:text-slate-300">
              {["Protected store workspace", "Product and inventory CRUD", "Analytics dashboard"].map((item) => (
                <p key={item} className="flex items-center gap-2">
                  <FiCheck className="text-teal-500" />
                  {item}
                </p>
              ))}
            </div>
          </div>
        ))}
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="glass-panel rounded-lg p-8 text-center">
          <p className="label">Ready for launch</p>
          <h2 className="mt-3 text-3xl font-black text-ink dark:text-white">Give your store a real inventory command center.</h2>
          <Link className="btn-primary mt-6 px-6 py-3" to="/register">
            Build my store
            <FiArrowRight />
          </Link>
        </div>
      </section>
    </main>

    <footer className="mx-auto max-w-7xl px-4 py-8 text-sm text-slate-500 sm:px-6 lg:px-8">
      StockFlow. Full-stack inventory management for small businesses.
    </footer>
  </div>
);

export default Landing;
