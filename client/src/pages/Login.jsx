import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiArrowRight, FiLock, FiMail } from "react-icons/fi";
import Logo from "../components/Logo.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      await login(form);
      navigate(location.state?.from?.pathname || "/dashboard");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="mb-8 lg:hidden">
        <Logo />
      </div>
      <form className="glass-panel overflow-hidden rounded-3xl p-8 shadow-2xl sm:p-10" onSubmit={submit}>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-mint">Welcome back</p>
          <h1 className="mt-3 text-3xl font-black tracking-tight text-ink dark:text-white">Login to your store</h1>
        </div>
        
        <div className="mt-8 space-y-5">
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Email Address</label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                <FiMail />
              </div>
              <input 
                className="input pl-11" 
                type="email" 
                placeholder="store@example.com"
                value={form.email} 
                onChange={(event) => setForm({ ...form, email: event.target.value })} 
                required 
              />
            </div>
          </div>
          
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Password</label>
              <Link className="text-xs font-bold text-brand-mint hover:underline" to="#">Forgot?</Link>
            </div>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                <FiLock />
              </div>
              <input 
                className="input pl-11" 
                type="password" 
                placeholder="••••••••"
                value={form.password} 
                onChange={(event) => setForm({ ...form, password: event.target.value })} 
                required 
              />
            </div>
          </div>
        </div>
        
        <button className="btn-primary mt-8 w-full py-3.5 text-base" disabled={loading} type="submit">
          {loading ? "Signing in..." : "Access Dashboard"}
          <FiArrowRight className="ml-2" />
        </button>
        
        <p className="mt-6 text-center text-sm font-medium text-slate-600 dark:text-slate-400">
          New to StockFlow?{" "}
          <Link className="font-bold text-brand-mint hover:underline" to="/register">
            Create an account
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
