"use client";

import Link from "next/link";
import { useState } from "react";
import { apiFetch, storeSession } from "../../lib/api";
import { useRouter } from "next/navigation";

export default function Register() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await apiFetch("/auth/register", { method: "POST", body: JSON.stringify(form) });
      storeSession(data);
      router.push("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-shell">
      <div className="auth-art register-art">
        <Link href="/" className="auth-brand"><span className="brand-dot" />TaskFlow</Link>
        <div className="auth-art-content">
          <span className="eyebrow">START SOMETHING CLEAR</span>
          <h1>Build a better <span>work rhythm.</span></h1>
          <p>Create your workspace, add tasks, and move them through the three simple stages.</p>
          <div className="process-line"><div><b>01</b><span>Create</span></div><div><b>02</b><span>Move</span></div><div><b>03</b><span>Finish</span></div></div>
        </div>
      </div>
      <div className="auth-panel">
        <div className="auth-form-wrap">
          <div className="mobile-brand"><span className="brand-dot" />TaskFlow</div>
          <span className="form-kicker">CREATE ACCOUNT</span>
          <h2>Let&apos;s get started</h2>
          <p className="form-subtitle">Create a normal user account to enter your workspace.</p>
          {error && <div className="alert alert-danger py-2 small">{error}</div>}
          <form onSubmit={submit}>
            <label>Full name</label>
            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} type="text" placeholder="Your full name" className="form-control form-control-modern" />
            <label className="mt-3">Email address</label>
            <input required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} type="email" placeholder="you@example.com" className="form-control form-control-modern" />
            <label className="mt-3">Password</label>
            <div className="password-field"><input required minLength={8} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} type={showPassword ? "text" : "password"} placeholder="At least 8 characters" className="form-control form-control-modern" /><button type="button" onClick={() => setShowPassword(!showPassword)}>{showPassword ? "Hide" : "Show"}</button></div>
            <div className="form-check mt-3"><input className="form-check-input" type="checkbox" id="terms" required /><label className="form-check-label" htmlFor="terms">I agree to the workspace terms.</label></div>
            <button disabled={loading} className="btn btn-brand w-100 mt-4 py-3">{loading ? "Creating..." : "Create account"}</button>
          </form>
          <p className="switch-copy mt-4">Already have an account? <Link href="/login">Sign in</Link></p>
        </div>
      </div>
    </main>
  );
}
