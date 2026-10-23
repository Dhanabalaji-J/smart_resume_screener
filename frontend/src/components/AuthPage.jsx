import { useState } from "react";
import api from "../services/session";

function AuthPage({ onAuthenticated }) {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const endpoint = mode === "signup" ? "/auth/signup" : "/auth/login";
      const response = await api.post(endpoint, {
        ...(mode === "signup" ? { name } : {}),
        email,
        password
      });
      onAuthenticated(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "We couldn't complete that request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-shell">
      <div className="auth-background-glow glow-a" />
      <div className="auth-background-glow glow-b" />
      <header className="auth-brandbar">
        <a className="auth-brand" href="/" aria-label="ResumeAI home">
          <span className="auth-brand-mark">✦</span>
          <span>Resume<span>AI</span><small>SMART SCREENING</small></span>
        </a>
        <span className="auth-secure"><span /> Private workspace</span>
      </header>

      <section className="auth-layout">
        <div className="auth-story">
          <div className="auth-eyebrow"><span /> INTELLIGENT RECRUITMENT WORKSPACE</div>
          <h1>Better matches.<br /><em>Clearer decisions.</em></h1>
          <p>Screen resumes, uncover relevant skills, and make confident hiring decisions — all in one thoughtful workspace.</p>
          <div className="auth-feature-stack">
            <div className="auth-feature">
              <span className="auth-feature-icon">⌕</span>
              <span><strong>AI-assisted screening</strong><small>Compare resumes against real job requirements.</small></span>
            </div>
            <div className="auth-feature">
              <span className="auth-feature-icon">◈</span>
              <span><strong>Your history, ready when you are</strong><small>Return to your saved screening results after signing in.</small></span>
            </div>
            <div className="auth-feature">
              <span className="auth-feature-icon">⛨</span>
              <span><strong>Control over your data</strong><small>Clear your screening history or delete your account.</small></span>
            </div>
          </div>
          <div className="auth-orb-stage" aria-hidden="true">
            <div className="auth-orb-ring ring-a" />
            <div className="auth-orb-ring ring-b" />
            <div className="auth-orb"><span>✦</span></div>
            <div className="auth-orb-chip chip-top">✧ &nbsp; Resume intelligence</div>
            <div className="auth-orb-chip chip-bottom"><span /> Insights, made clear</div>
          </div>
        </div>

        <div className="auth-card">
          <div className="auth-card-heading">
            <div className="auth-card-icon">✦</div>
            <p className="auth-overline">{mode === "login" ? "WELCOME BACK" : "YOUR WORKSPACE STARTS HERE"}</p>
            <h2>{mode === "login" ? "Sign in to ResumeAI" : "Create your account"}</h2>
            <p className="auth-subtitle">{mode === "login" ? "Pick up where your hiring workflow left off." : "A few details and you're ready to screen smarter."}</p>
          </div>

          <div className="auth-tabs" role="tablist" aria-label="Account access">
            <button type="button" role="tab" aria-selected={mode === "login"} className={mode === "login" ? "selected" : ""} onClick={() => { setMode("login"); setError(""); }}>Sign in</button>
            <button type="button" role="tab" aria-selected={mode === "signup"} className={mode === "signup" ? "selected" : ""} onClick={() => { setMode("signup"); setError(""); }}>Create account</button>
          </div>

          <form className="auth-form" onSubmit={submit}>
            {mode === "signup" && (
              <label>Full name
                <span className="auth-input-wrap"><span>♙</span><input autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" minLength={2} maxLength={80} required /></span>
              </label>
            )}
            <label>Email address
              <span className="auth-input-wrap"><span>✉</span><input type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" maxLength={254} required /></span>
            </label>
            <label>Password
              <span className="auth-input-wrap"><span>⌑</span><input type={showPassword ? "text" : "password"} autoComplete={mode === "login" ? "current-password" : "new-password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder={mode === "login" ? "Enter your password" : "At least 8 characters"} minLength={mode === "signup" ? 8 : undefined} maxLength={128} required /><button className="password-toggle" type="button" onClick={() => setShowPassword(v => !v)}>{showPassword ? "Hide" : "Show"}</button></span>
            </label>
            {mode === "signup" && <p className="auth-password-note">Use at least 8 characters. Your password is stored as a salted hash, not plain text.</p>}
            {error && <div className="auth-error" role="alert">{error}</div>}
            <button className="auth-submit" type="submit" disabled={loading}>{loading ? <><span className="auth-spinner" /> Please wait…</> : mode === "login" ? "Sign in to workspace  ↗" : "Create my workspace  ↗"}</button>
          </form>

          <div className="auth-card-footer"><span className="auth-footer-lock">⛨</span><span>Your screening history is private to your account.</span></div>
        </div>
      </section>
      <footer className="auth-footer"><span>© {new Date().getFullYear()} ResumeAI</span><span>Thoughtful tools for better hiring</span></footer>
    </main>
  );
}

export default AuthPage;
