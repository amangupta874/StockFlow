import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
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
    <form className="glass-panel w-full max-w-md rounded-lg p-6" onSubmit={submit}>
      <Logo />
      <div className="mt-8">
        <p className="label">Welcome back</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-ink dark:text-white">Login to your store</h1>
      </div>
      <div className="mt-6 space-y-4">
        <label className="block">
          <span className="label">Email</span>
          <input className="input mt-2" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required />
        </label>
        <label className="block">
          <span className="label">Password</span>
          <input className="input mt-2" type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} required />
        </label>
      </div>
      <button className="btn-primary mt-6 w-full py-3" disabled={loading} type="submit">
        {loading ? "Signing in..." : "Login"}
        <FiArrowRight />
      </button>
      <p className="mt-5 text-center text-sm text-slate-600 dark:text-slate-300">
        New to StockFlow?{" "}
        <Link className="font-bold text-ink underline dark:text-white" to="/register">
          Create account
        </Link>
      </p>
    </form>
  );
};

export default Login;
