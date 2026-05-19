import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  FiBarChart2,
  FiBox,
  FiGrid,
  FiLogOut,
  FiMenu,
  FiMoon,
  FiSun,
  FiX
} from "react-icons/fi";
import { useState } from "react";
import Logo from "../components/Logo.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useTheme } from "../context/ThemeContext.jsx";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: FiGrid },
  { to: "/products", label: "Products", icon: FiBox },
  { to: "/inventory", label: "Inventory", icon: FiBarChart2 }
];

const AppShell = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { logout, user } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-white/60 bg-white/70 backdrop-blur-2xl dark:border-white/10 dark:bg-ink/70">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <Logo to="/dashboard" />
          <nav className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-bold transition ${
                    isActive
                      ? "bg-ink text-white dark:bg-white dark:text-ink"
                      : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10"
                  }`
                }
              >
                <item.icon />
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="hidden items-center gap-2 md:flex">
            <button className="btn-secondary !h-10 !w-10 !p-0" onClick={toggleTheme} aria-label="Toggle theme">
              {isDark ? <FiSun /> : <FiMoon />}
            </button>
            <div className="rounded-lg border border-slate-200 bg-white/70 px-3 py-2 text-sm dark:border-white/10 dark:bg-white/[0.05]">
              <span className="font-bold text-ink dark:text-white">{user?.storeName}</span>
            </div>
            <button className="btn-secondary !h-10 !w-10 !p-0" onClick={handleLogout} aria-label="Logout">
              <FiLogOut />
            </button>
          </div>
          <button className="btn-secondary !h-10 !w-10 !p-0 md:hidden" onClick={() => setMenuOpen((open) => !open)}>
            {menuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
        {menuOpen && (
          <div className="border-t border-slate-200 bg-white/95 p-3 dark:border-white/10 dark:bg-ink/95 md:hidden">
            <div className="grid gap-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `inline-flex items-center gap-2 rounded-lg px-3 py-3 text-sm font-bold ${
                      isActive ? "bg-ink text-white dark:bg-white dark:text-ink" : "text-slate-700 dark:text-slate-200"
                    }`
                  }
                >
                  <item.icon />
                  {item.label}
                </NavLink>
              ))}
              <div className="flex gap-2 pt-2">
                <button className="btn-secondary flex-1" onClick={toggleTheme}>
                  {isDark ? <FiSun /> : <FiMoon />}
                  Theme
                </button>
                <button className="btn-secondary flex-1" onClick={handleLogout}>
                  <FiLogOut />
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AppShell;
