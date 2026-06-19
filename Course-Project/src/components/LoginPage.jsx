// [CO2: ES6 Modules / Modular Design] - Importing dependencies
import { useState, useEffect } from "react";

const LS_USERS_KEY = "tripforge_users";
const LS_SESSION_KEY = "tripforge_session";

// [CO4: State Management Strategies] - Utilizing localStorage and sessionStorage for auth session persistence
function loadUsers() { try { return JSON.parse(localStorage.getItem(LS_USERS_KEY)) || []; } catch { return []; } }
function persistUsers(arr) { localStorage.setItem(LS_USERS_KEY, JSON.stringify(arr)); }
function saveSession(user) { sessionStorage.setItem(LS_SESSION_KEY, JSON.stringify(user)); }
export function loadSession() { try { return JSON.parse(sessionStorage.getItem(LS_SESSION_KEY)); } catch { return null; } }
export function clearSession() { sessionStorage.removeItem(LS_SESSION_KEY); }

/* ─── Floating destination cards ─── */
const DESTINATIONS = [
  { emoji: "🗼", city: "Paris", price: "$420" },
  { emoji: "🗽", city: "New York", price: "$380" },
  { emoji: "🏯", city: "Tokyo", price: "$650" },
  { emoji: "🌉", city: "San Francisco", price: "$340" },
  { emoji: "🕌", city: "Dubai", price: "$510" },
  { emoji: "🏖️", city: "Bali", price: "$470" },
  { emoji: "🏔️", city: "Swiss Alps", price: "$590" },
  { emoji: "🦘", city: "Sydney", price: "$720" },
];

function FloatingCard({ dest, style }) {
  return (
    <div style={{
      position: "absolute",
      background: "rgba(255,255,255,0.12)",
      backdropFilter: "blur(12px)",
      border: "1px solid rgba(255,255,255,0.18)",
      borderRadius: 16,
      padding: "12px 16px",
      display: "flex",
      alignItems: "center",
      gap: 10,
      boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
      pointerEvents: "none",
      ...style,
    }}>
      <span style={{ fontSize: 24 }}>{dest.emoji}</span>
      <div>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#fff" }}>{dest.city}</div>
        <div style={{ fontSize: 10, color: "rgba(255,255,255,0.7)" }}>from {dest.price}</div>
      </div>
    </div>
  );
}

export default function LoginPage({ onLogin }) {
  // [CO3: Controlled UI Patterns / Hooks] - Managing login form inputs and animation flags locally
  const [mode, setMode] = useState("login"); // "login" | "signup"
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => { requestAnimationFrame(() => setMounted(true)); }, []);

  // [CO5: Form Engineering] - Client-side validation mechanism verifying constraints before form submission
  function validate() {
    const errs = {};
    if (mode === "signup" && !name.trim()) errs.name = "Name is required";
    if (!email.trim() || !email.includes("@") || !email.includes(".")) errs.email = "Valid email required";
    if (!password || password.length < 6) errs.password = "Min 6 characters";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function triggerShake() {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) { triggerShake(); return; }

    setLoading(true);
    // Simulate network delay
    setTimeout(() => {
      if (mode === "signup") {
        const users = loadUsers();
        if (users.find(u => u.email === email)) {
          setErrors({ email: "Email already registered" });
          setLoading(false);
          triggerShake();
          return;
        }
        const user = { id: Date.now(), name: name.trim(), email, password, createdAt: new Date().toISOString() };
        users.push(user);
        persistUsers(users);
        const session = { id: user.id, name: user.name, email: user.email };
        saveSession(session);
        setLoading(false);
        onLogin(session);
      } else {
        const users = loadUsers();
        const user = users.find(u => u.email === email && u.password === password);
        if (!user) {
          setErrors({ email: "Invalid email or password" });
          setLoading(false);
          triggerShake();
          return;
        }
        const session = { id: user.id, name: user.name, email: user.email };
        saveSession(session);
        setLoading(false);
        onLogin(session);
      }
    }, 900);
  }

  function handleSocialLogin(provider) {
    setLoading(true);
    setTimeout(() => {
      const session = { id: Date.now(), name: provider + " User", email: `user@${provider.toLowerCase()}.com` };
      saveSession(session);
      setLoading(false);
      onLogin(session);
    }, 1100);
  }

  function switchMode() {
    setMode(m => m === "login" ? "signup" : "login");
    setErrors({});
    setSuccessMsg("");
  }

  const inputStyle = (hasError) => ({
    width: "100%",
    padding: "14px 16px",
    paddingLeft: 44,
    borderRadius: 14,
    border: `1.5px solid ${hasError ? "#ef4444" : "rgba(255,140,0,0.18)"}`,
    background: "rgba(255,255,255,0.06)",
    backdropFilter: "blur(8px)",
    fontSize: 14,
    fontFamily: "inherit",
    fontWeight: 500,
    color: "#0F172A",
    outline: "none",
    transition: "all 0.25s ease",
    boxSizing: "border-box",
  });

  const socialBtnStyle = {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: "12px 16px",
    borderRadius: 13,
    border: "1.5px solid rgba(255,140,0,0.12)",
    background: "rgba(255,255,255,0.85)",
    backdropFilter: "blur(8px)",
    fontSize: 13,
    fontWeight: 700,
    color: "#0F172A",
    cursor: "pointer",
    fontFamily: "inherit",
    transition: "all 0.2s ease",
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      background: "#FAFAFA",
      overflow: "hidden",
      position: "relative",
    }}>
      {/* ─── LEFT PANEL: Branding & Visual ─── */}
      <div style={{
        flex: "0 0 52%",
        background: "linear-gradient(145deg, #FF8C00 0%, #FF6B00 35%, #FF4500 70%, #E03E00 100%)",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "60px 70px",
        opacity: mounted ? 1 : 0,
        transform: mounted ? "translateX(0)" : "translateX(-30px)",
        transition: "all 0.8s cubic-bezier(0.22, 1, 0.36, 1)",
      }}>
        {/* Background pattern */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: `radial-gradient(circle at 20% 80%, rgba(255,255,255,0.08) 0%, transparent 50%),
                            radial-gradient(circle at 80% 20%, rgba(255,255,255,0.06) 0%, transparent 50%),
                            radial-gradient(circle at 50% 50%, rgba(0,0,0,0.05) 0%, transparent 60%)`,
        }} />

        {/* Animated orbs */}
        {[
          { t: "-10%", l: "-8%", w: 340, d: "0s" },
          { t: "60%", l: "70%", w: 280, d: "-5s" },
          { t: "30%", l: "50%", w: 200, d: "-10s" },
        ].map((o, i) => (
          <div key={i} style={{
            position: "absolute",
            top: o.t, left: o.l,
            width: o.w, height: o.w,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(255,255,255,0.1), transparent 70%)",
            animation: `orbFloat 18s ease-in-out ${o.d} infinite`,
            pointerEvents: "none",
          }} />
        ))}

        {/* Floating destination cards */}
        <FloatingCard dest={DESTINATIONS[0]} style={{ top: "12%", right: "8%", animation: "orbFloat 14s ease-in-out 0s infinite" }} />
        <FloatingCard dest={DESTINATIONS[1]} style={{ top: "28%", left: "5%", animation: "orbFloat 16s ease-in-out -3s infinite" }} />
        <FloatingCard dest={DESTINATIONS[2]} style={{ bottom: "25%", right: "12%", animation: "orbFloat 15s ease-in-out -6s infinite" }} />
        <FloatingCard dest={DESTINATIONS[3]} style={{ bottom: "10%", left: "8%", animation: "orbFloat 17s ease-in-out -9s infinite" }} />
        <FloatingCard dest={DESTINATIONS[4]} style={{ top: "48%", left: "55%", animation: "orbFloat 13s ease-in-out -4s infinite" }} />

        {/* Content */}
        <div style={{ position: "relative", zIndex: 2 }}>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 48 }}>
            <div style={{
              width: 52, height: 52, borderRadius: 16,
              background: "rgba(255,255,255,0.2)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.25)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 26,
              boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
            }}>✈</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: "#fff", letterSpacing: "-0.03em" }}>
              TripForge
            </div>
          </div>

          <h1 style={{
            fontSize: 46,
            fontWeight: 800,
            color: "#fff",
            lineHeight: 1.15,
            letterSpacing: "-0.035em",
            marginBottom: 20,
            maxWidth: 480,
          }}>
            Your journey<br />
            starts with a<br />
            <span style={{
              background: "rgba(255,255,255,0.2)",
              backdropFilter: "blur(8px)",
              padding: "2px 16px",
              borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.25)",
            }}>single step</span>
          </h1>

          <p style={{
            fontSize: 16,
            color: "rgba(255,255,255,0.8)",
            lineHeight: 1.7,
            maxWidth: 400,
            marginBottom: 40,
          }}>
            Plan multi-city trips, compare airlines, estimate costs, and forge unforgettable travel experiences — all in one place.
          </p>

          {/* Stats row */}
          <div style={{ display: "flex", gap: 36 }}>
            {[
              { num: "50+", label: "Destinations" },
              { num: "10", label: "Airlines" },
              { num: "15+", label: "Currencies" },
            ].map(s => (
              <div key={s.label}>
                <div style={{ fontSize: 28, fontWeight: 800, color: "#fff" }}>{s.num}</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.65)", fontWeight: 600, marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom decoration */}
        <div style={{
          position: "absolute",
          bottom: 30,
          left: 70,
          display: "flex",
          alignItems: "center",
          gap: 8,
          color: "rgba(255,255,255,0.5)",
          fontSize: 12,
          fontWeight: 500,
        }}>
          <span>🌍</span> Trusted by travelers worldwide
        </div>
      </div>

      {/* ─── RIGHT PANEL: Login Form ─── */}
      <div style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 60px",
        position: "relative",
        opacity: mounted ? 1 : 0,
        transform: mounted ? "translateY(0)" : "translateY(20px)",
        transition: "all 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.2s",
      }}>
        {/* Subtle background orbs */}
        <div style={{ position: "absolute", top: "-10%", right: "-15%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,140,0,0.08), transparent 70%)", filter: "blur(80px)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "-10%", left: "-10%", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,69,0,0.06), transparent 70%)", filter: "blur(60px)", pointerEvents: "none" }} />

        <div style={{
          width: "100%",
          maxWidth: 420,
          position: "relative",
          animation: shake ? "shakeX 0.5s ease" : "none",
        }}>
          {/* Header */}
          <div style={{ marginBottom: 32 }}>
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              background: "rgba(255,140,0,0.08)",
              border: "1px solid rgba(255,140,0,0.15)",
              padding: "5px 14px",
              borderRadius: 99,
              fontSize: 11,
              fontWeight: 700,
              color: "#FF8C00",
              textTransform: "uppercase",
              letterSpacing: "0.07em",
              marginBottom: 20,
            }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#FF8C00", display: "inline-block" }} />
              {mode === "login" ? "Welcome Back" : "Get Started"}
            </div>

            <h2 style={{
              fontSize: 30,
              fontWeight: 800,
              letterSpacing: "-0.03em",
              color: "#0F172A",
              lineHeight: 1.2,
              marginBottom: 8,
            }}>
              {mode === "login" ? (
                <>Sign in to <span style={{ background: "linear-gradient(135deg,#FF8C00,#FF4500)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>TripForge</span></>
              ) : (
                <>Create your <span style={{ background: "linear-gradient(135deg,#FF8C00,#FF4500)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>account</span></>
              )}
            </h2>
            <p style={{ fontSize: 14, color: "#64748B", lineHeight: 1.6 }}>
              {mode === "login"
                ? "Enter your credentials to access your travel dashboard."
                : "Join thousands of travelers planning smarter trips."}
            </p>
          </div>

          {/* Social Login */}
          <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
            <button onClick={() => handleSocialLogin("Google")} style={socialBtnStyle}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#FF8C00"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(255,140,0,0.15)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,140,0,0.12)"; e.currentTarget.style.boxShadow = "none"; }}>
              <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
              Google
            </button>
            <button onClick={() => handleSocialLogin("GitHub")} style={socialBtnStyle}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#FF8C00"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(255,140,0,0.15)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,140,0,0.12)"; e.currentTarget.style.boxShadow = "none"; }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#0F172A"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
              GitHub
            </button>
            <button onClick={() => handleSocialLogin("Apple")} style={socialBtnStyle}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#FF8C00"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(255,140,0,0.15)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,140,0,0.12)"; e.currentTarget.style.boxShadow = "none"; }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#0F172A"><path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg>
              Apple
            </button>
          </div>

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
            <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, transparent, rgba(255,140,0,0.15), transparent)" }} />
            <span style={{ fontSize: 11, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.08em" }}>or continue with email</span>
            <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, transparent, rgba(255,140,0,0.15), transparent)" }} />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {/* Name field (signup only) */}
            {mode === "signup" && (
              <div style={{ marginBottom: 16, position: "relative", transition: "all 0.3s" }}>
                <div style={{ position: "absolute", left: 15, top: "50%", transform: "translateY(-50%)", fontSize: 16, opacity: 0.4, pointerEvents: "none" }}>👤</div>
                <input
                  id="login-name"
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Full name"
                  style={inputStyle(errors.name)}
                  onFocus={e => { e.target.style.borderColor = "#FF8C00"; e.target.style.boxShadow = "0 0 0 3px rgba(255,140,0,0.08)"; }}
                  onBlur={e => { e.target.style.borderColor = errors.name ? "#ef4444" : "rgba(255,140,0,0.18)"; e.target.style.boxShadow = "none"; }}
                />
                {errors.name && <div style={{ fontSize: 11, color: "#ef4444", marginTop: 5, fontWeight: 600 }}>{errors.name}</div>}
              </div>
            )}

            {/* Email */}
            <div style={{ marginBottom: 16, position: "relative" }}>
              <div style={{ position: "absolute", left: 15, top: errors.email ? "35%" : "50%", transform: "translateY(-50%)", fontSize: 16, opacity: 0.4, pointerEvents: "none" }}>✉️</div>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Email address"
                style={inputStyle(errors.email)}
                onFocus={e => { e.target.style.borderColor = "#FF8C00"; e.target.style.boxShadow = "0 0 0 3px rgba(255,140,0,0.08)"; }}
                onBlur={e => { e.target.style.borderColor = errors.email ? "#ef4444" : "rgba(255,140,0,0.18)"; e.target.style.boxShadow = "none"; }}
              />
              {errors.email && <div style={{ fontSize: 11, color: "#ef4444", marginTop: 5, fontWeight: 600 }}>{errors.email}</div>}
            </div>

            {/* Password */}
            <div style={{ marginBottom: 8, position: "relative" }}>
              <div style={{ position: "absolute", left: 15, top: errors.password ? "35%" : "50%", transform: "translateY(-50%)", fontSize: 16, opacity: 0.4, pointerEvents: "none" }}>🔒</div>
              <input
                id="login-password"
                type={showPass ? "text" : "password"}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Password"
                style={{ ...inputStyle(errors.password), paddingRight: 48 }}
                onFocus={e => { e.target.style.borderColor = "#FF8C00"; e.target.style.boxShadow = "0 0 0 3px rgba(255,140,0,0.08)"; }}
                onBlur={e => { e.target.style.borderColor = errors.password ? "#ef4444" : "rgba(255,140,0,0.18)"; e.target.style.boxShadow = "none"; }}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                style={{
                  position: "absolute", right: 14, top: errors.password ? "35%" : "50%", transform: "translateY(-50%)",
                  background: "none", border: "none", cursor: "pointer", fontSize: 15, opacity: 0.5, padding: 4,
                }}
              >{showPass ? "🙈" : "👁️"}</button>
              {errors.password && <div style={{ fontSize: 11, color: "#ef4444", marginTop: 5, fontWeight: 600 }}>{errors.password}</div>}
            </div>

            {/* Forgot password / Remember me row */}
            {mode === "login" && (
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, marginTop: 12 }}>
                <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12.5, color: "#475569", cursor: "pointer", fontWeight: 500 }}>
                  <input type="checkbox" style={{ accentColor: "#FF8C00", width: 15, height: 15, cursor: "pointer" }} />
                  Remember me
                </label>
                <button type="button" style={{ background: "none", border: "none", color: "#FF8C00", fontSize: 12.5, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                  Forgot password?
                </button>
              </div>
            )}

            {mode === "signup" && <div style={{ height: 16 }} />}

            {/* Success message */}
            {successMsg && (
              <div style={{
                background: "rgba(34,197,94,0.08)",
                border: "1px solid rgba(34,197,94,0.2)",
                borderRadius: 12,
                padding: "10px 14px",
                marginBottom: 16,
                fontSize: 12.5,
                fontWeight: 600,
                color: "#16a34a",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}>
                <span>✅</span> {successMsg}
              </div>
            )}

            {/* Submit button */}
            <button
              id="login-submit"
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "15px 24px",
                borderRadius: 14,
                border: "none",
                background: loading
                  ? "linear-gradient(135deg, #FFB366, #FF8C00)"
                  : "linear-gradient(135deg, #FF8C00, #FF4500)",
                color: "#fff",
                fontSize: 15,
                fontWeight: 800,
                cursor: loading ? "wait" : "pointer",
                fontFamily: "inherit",
                letterSpacing: "-0.01em",
                boxShadow: "0 8px 32px rgba(255,140,0,0.35)",
                transition: "all 0.3s ease",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                position: "relative",
                overflow: "hidden",
              }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 12px 40px rgba(255,140,0,0.45)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(255,140,0,0.35)"; }}
            >
              {loading ? (
                <>
                  <div style={{
                    width: 18, height: 18,
                    border: "2.5px solid rgba(255,255,255,0.3)",
                    borderTopColor: "#fff",
                    borderRadius: "50%",
                    animation: "spin 0.8s linear infinite",
                  }} />
                  {mode === "login" ? "Signing in…" : "Creating account…"}
                </>
              ) : (
                <>
                  {mode === "login" ? "Sign In" : "Create Account"}
                  <span style={{ fontSize: 18 }}>→</span>
                </>
              )}
            </button>
          </form>

          {/* Switch mode */}
          <div style={{ textAlign: "center", marginTop: 24, fontSize: 13, color: "#64748B" }}>
            {mode === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              onClick={switchMode}
              style={{
                background: "none", border: "none",
                color: "#FF8C00", fontWeight: 800,
                cursor: "pointer", fontFamily: "inherit",
                fontSize: 13,
                transition: "color 0.2s",
              }}
              onMouseEnter={e => e.currentTarget.style.color = "#FF4500"}
              onMouseLeave={e => e.currentTarget.style.color = "#FF8C00"}
            >
              {mode === "login" ? "Sign up free" : "Sign in"}
            </button>
          </div>

          {/* Terms */}
          <div style={{
            textAlign: "center",
            marginTop: 32,
            fontSize: 11,
            color: "#94A3B8",
            lineHeight: 1.6,
          }}>
            By continuing, you agree to TripForge's{" "}
            <span style={{ color: "#FF8C00", fontWeight: 600, cursor: "pointer" }}>Terms of Service</span>
            {" "}and{" "}
            <span style={{ color: "#FF8C00", fontWeight: 600, cursor: "pointer" }}>Privacy Policy</span>.
          </div>
        </div>
      </div>

      {/* Inline styles for animations */}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes shakeX {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-6px); }
          20%, 40%, 60%, 80% { transform: translateX(6px); }
        }
        input::placeholder {
          color: #94A3B8;
          font-weight: 500;
        }
        input:focus {
          border-color: #FF8C00 !important;
          box-shadow: 0 0 0 3px rgba(255,140,0,0.08) !important;
        }
      `}</style>
    </div>
  );
}
