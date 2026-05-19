import { Outlet } from "react-router-dom";
import Logo from "../components/Logo.jsx";

const AuthLayout = () => (
  <main className="grid min-h-screen lg:grid-cols-[0.95fr_1.05fr]">
    <section className="hidden min-h-screen border-r border-white/60 p-8 dark:border-white/10 lg:flex lg:flex-col">
      <Logo />
      <div className="flex flex-1 items-center">
        <div className="max-w-xl">
          <p className="label">Modern inventory command center</p>
          <h1 className="mt-4 text-5xl font-black tracking-tight text-ink dark:text-white">
            Run stock, pricing, and operations from one calm dashboard.
          </h1>
          <div className="mt-8 grid grid-cols-3 gap-3">
            {["Live stock", "Smart alerts", "Store analytics"].map((item) => (
              <div key={item} className="surface rounded-lg p-4 text-sm font-bold text-slate-700 dark:text-slate-200">
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
    <section className="flex min-h-screen items-center justify-center p-4 sm:p-8">
      <Outlet />
    </section>
  </main>
);

export default AuthLayout;
