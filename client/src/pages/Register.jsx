import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import Logo from "../components/Logo.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const Register = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "", storeName: "" });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const update = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      await register(form);
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="glass-panel w-full max-w-md rounded-lg p-6" onSubmit={submit}>
      <Logo />
      <div className="mt-8">
        <p className="label">Launch workspace</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-ink dark:text-white">Create your store</h1>
      </div>
      <div className="mt-6 space-y-4">
        <label className="block">
          <span className="label">Name</span>
          <input className="input mt-2" name="name" value={form.name} onChange={update} required />
        </label>
        <label className="block">
          <span className="label">Email</span>
          <input className="input mt-2" name="email" type="email" value={form.email} onChange={update} required />
        </label>
        <label className="block">
          <span className="label">Store Name</span>
          <input className="input mt-2" name="storeName" value={form.storeName} onChange={update} required />
        </label>
        <label className="block">
          <span className="label">Password</span>
          <input className="input mt-2" minLength="6" name="password" type="password" value={form.password} onChange={update} required />
        </label>
      </div>
      <button className="btn-primary mt-6 w-full py-3" disabled={loading} type="submit">
        {loading ? "Creating..." : "Create Store"}
        <FiArrowRight />
      </button>
      <p className="mt-5 text-center text-sm text-slate-600 dark:text-slate-300">
        Already have an account?{" "}
        <Link className="font-bold text-ink underline dark:text-white" to="/login">
          Login
        </Link>
      </p>
    </form>
  );
};

export default Register;
