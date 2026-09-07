"use client";

import Link from "next/link";
import { useState } from "react";
import { apiFetch, storeSession } from "../../lib/api";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await apiFetch("/auth/login", { method: "POST", body: JSON.stringify(form) });
      storeSession(data);
      router.push(data.user.role === "admin" ? "/admin" : "/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-shell">
      <div className="auth-art">
        <Link href="/" className="auth-brand"><span className="brand-dot" />TaskFlow</Link>
        <div className="auth-art-content"><span className="eyebrow">WELCOME BACK</span><h1>Make work feel <span>lighter.</span></h1><p>Pick up where you left off and keep your workflow moving.</p><div className="floating-note note-one">✓ API integration</div><div className="floating-note note-two">→ Dashboard ready</div></div>
      </div>
      <div className="auth-panel">
        <div className="auth-form-wrap">
          <div className="mobile-brand"><span className="brand-dot" />TaskFlow</div>
          <span className="form-kicker">SIGN IN</span><h2>Welcome back</h2><p className="form-subtitle">Use your account details to enter the workspace.</p>
          {error && <div className="alert alert-danger py-2 small">{error}</div>}
          <form onSubmit={submit}>
            <label>Email address</label>
            <input required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} type="email" placeholder="you@example.com" className="form-control form-control-modern" />
            <div className="d-flex justify-content-between align-items-center mt-3"><label className="mb-0">Password</label><span className="text-button">Secure sign in</span></div>
            <div className="password-field"><input required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} type={showPassword ? "text" : "password"} placeholder="Enter your password" className="form-control form-control-modern" /><button type="button" onClick={() => setShowPassword(!showPassword)}>{showPassword ? "Hide" : "Show"}</button></div>
            <div className="form-check mt-3"><input className="form-check-input" type="checkbox" id="remember" /><label className="form-check-label" htmlFor="remember">Keep me signed in</label></div>
            <button disabled={loading} className="btn btn-brand w-100 mt-4 py-3">{loading ? "Signing in..." : "Sign in"}</button>
          </form>
          <div className="auth-divider"><span>or</span></div><p className="switch-copy">Don&apos;t have an account? <Link href="/register">Create one</Link></p>
        </div>
      </div>
    </main>
  );
}
