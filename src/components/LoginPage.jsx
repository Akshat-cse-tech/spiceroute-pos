import { useState } from "react";
import { COLORS } from "../../constants";

export default function LoginPage({ onLogin }) {
  const [tab, setTab] = useState("signin"); // "signin" | "signup"

  // Sign-in state
  const [siEmail, setSiEmail] = useState("");
  const [siPassword, setSiPassword] = useState("");
  const [siError, setSiError] = useState("");

  // Sign-up state
  const [suName, setSuName] = useState("");
  const [suEmail, setSuEmail] = useState("");
  const [suPassword, setSuPassword] = useState("");
  const [suConfirm, setSuConfirm] = useState("");
  const [suRole, setSuRole] = useState("cashier");
  const [suError, setSuError] = useState("");
  const [suSuccess, setSuSuccess] = useState(false);

  const [showSiPass, setShowSiPass] = useState(false);
  const [showSuPass, setShowSuPass] = useState(false);

  // ── Demo credentials ──────────────────────────────────────────────────────
  // In a real app these would come from your backend.
  const DEMO_USERS = [
    { email: "admin@spiceroute.in", password: "admin123", name: "Admin", role: "admin" },
    { email: "cashier@spiceroute.in", password: "cashier123", name: "Cashier", role: "cashier" },
  ];

  function handleSignIn(e) {
    e.preventDefault();
    setSiError("");
    if (!siEmail || !siPassword) { setSiError("Please fill in all fields."); return; }

    // Check registered users stored in sessionStorage + demo users
    const stored = JSON.parse(sessionStorage.getItem("sr_users") || "[]");
    const allUsers = [...DEMO_USERS, ...stored];
    const user = allUsers.find(
      u => u.email.toLowerCase() === siEmail.toLowerCase() && u.password === siPassword
    );
    if (!user) { setSiError("Invalid email or password."); return; }
    onLogin(user);
  }

  function handleSignUp(e) {
    e.preventDefault();
    setSuError("");
    if (!suName || !suEmail || !suPassword || !suConfirm) {
      setSuError("Please fill in all fields."); return;
    }
    if (suPassword.length < 6) { setSuError("Password must be at least 6 characters."); return; }
    if (suPassword !== suConfirm) { setSuError("Passwords do not match."); return; }

    const stored = JSON.parse(sessionStorage.getItem("sr_users") || "[]");
    const allUsers = [...DEMO_USERS, ...stored];
    if (allUsers.find(u => u.email.toLowerCase() === suEmail.toLowerCase())) {
      setSuError("An account with this email already exists."); return;
    }

    const newUser = { name: suName, email: suEmail, password: suPassword, role: suRole };
    sessionStorage.setItem("sr_users", JSON.stringify([...stored, newUser]));
    setSuSuccess(true);
    setSuName(""); setSuEmail(""); setSuPassword(""); setSuConfirm("");
    setTimeout(() => { setSuSuccess(false); setTab("signin"); }, 1800);
  }

  // ── Shared styles ─────────────────────────────────────────────────────────
  const inputStyle = {
    width: "100%", padding: "10px 14px", fontSize: 14,
    border: `1.5px solid ${COLORS.border}`, borderRadius: 10,
    outline: "none", background: "#fff", color: COLORS.dark,
    transition: "border-color 0.15s",
  };
  const labelStyle = { fontSize: 13, fontWeight: 600, color: COLORS.dark, marginBottom: 6, display: "block" };
  const btnPrimary = {
    width: "100%", padding: "11px", borderRadius: 10, border: "none",
    background: COLORS.primary, color: "#fff", fontSize: 15, fontWeight: 700,
    cursor: "pointer", letterSpacing: 0.3, marginTop: 4,
    transition: "opacity 0.15s",
  };

  return (
    <div style={{
      minHeight: "100vh", background: `linear-gradient(135deg, #fff8f5 0%, #fff 50%, #fff8f5 100%)`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'Inter', system-ui, sans-serif", padding: 16,
    }}>
      {/* Background decorative circles */}
      <div style={{
        position: "fixed", top: -120, right: -120, width: 400, height: 400,
        borderRadius: "50%", background: `${COLORS.primary}12`, pointerEvents: "none",
      }} />
      <div style={{
        position: "fixed", bottom: -80, left: -80, width: 300, height: 300,
        borderRadius: "50%", background: `${COLORS.primary}0D`, pointerEvents: "none",
      }} />

      <div style={{
        width: "100%", maxWidth: 420, background: "#fff",
        borderRadius: 20, boxShadow: "0 8px 40px rgba(0,0,0,0.10)",
        padding: "36px 32px", position: "relative", zIndex: 1,
        animation: "fadeInUp 0.35s ease",
      }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16, background: COLORS.primary,
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            fontSize: 28, marginBottom: 12, boxShadow: `0 4px 14px ${COLORS.primary}40`,
          }}>🍽️</div>
          <div style={{ fontWeight: 800, fontSize: 22, color: COLORS.dark, lineHeight: 1 }}>
            SpiceRoute POS
          </div>
          <div style={{ fontSize: 13, color: COLORS.gray, marginTop: 4 }}>
            Restaurant Management System
          </div>
        </div>

        {/* Tab switcher */}
        <div style={{
          display: "flex", background: COLORS.lightGray,
          borderRadius: 12, padding: 4, marginBottom: 28,
        }}>
          {[["signin", "Sign In"], ["signup", "Sign Up"]].map(([key, label]) => (
            <button key={key} onClick={() => { setTab(key); setSiError(""); setSuError(""); }} style={{
              flex: 1, padding: "8px 0", borderRadius: 9, border: "none",
              background: tab === key ? "#fff" : "transparent",
              color: tab === key ? COLORS.primary : COLORS.gray,
              fontWeight: tab === key ? 700 : 500, fontSize: 14, cursor: "pointer",
              boxShadow: tab === key ? "0 2px 8px rgba(0,0,0,0.08)" : "none",
              transition: "all 0.2s",
            }}>{label}</button>
          ))}
        </div>

        {/* ── SIGN IN ── */}
        {tab === "signin" && (
          <form onSubmit={handleSignIn} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div>
              <label style={labelStyle}>Email</label>
              <input
                type="email" value={siEmail} onChange={e => setSiEmail(e.target.value)}
                placeholder="you@restaurant.com" style={inputStyle}
                onFocus={e => (e.target.style.borderColor = COLORS.primary)}
                onBlur={e => (e.target.style.borderColor = COLORS.border)}
              />
            </div>
            <div>
              <label style={labelStyle}>Password</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showSiPass ? "text" : "password"} value={siPassword}
                  onChange={e => setSiPassword(e.target.value)}
                  placeholder="••••••••" style={{ ...inputStyle, paddingRight: 44 }}
                  onFocus={e => (e.target.style.borderColor = COLORS.primary)}
                  onBlur={e => (e.target.style.borderColor = COLORS.border)}
                />
                <button type="button" onClick={() => setShowSiPass(p => !p)} style={{
                  position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                  background: "none", border: "none", cursor: "pointer", color: COLORS.gray,
                  fontSize: 16, padding: 0,
                }}>{showSiPass ? "🙈" : "👁️"}</button>
              </div>
            </div>
            {siError && (
              <div style={{
                background: "#FEF2F2", border: "1px solid #FECACA", color: "#DC2626",
                borderRadius: 8, padding: "8px 12px", fontSize: 13,
              }}>{siError}</div>
            )}
            <button type="submit" style={btnPrimary}
              onMouseOver={e => (e.target.style.opacity = 0.9)}
              onMouseOut={e => (e.target.style.opacity = 1)}
            >Sign In →</button>

            {/* Demo credentials hint */}
            <div style={{
              background: COLORS.primaryLight, borderRadius: 10, padding: "10px 14px", fontSize: 12,
            }}>
              <div style={{ fontWeight: 600, color: COLORS.primary, marginBottom: 4 }}>Demo Credentials</div>
              <div style={{ color: COLORS.dark }}>Admin: <strong>admin@spiceroute.in</strong> / <strong>admin123</strong></div>
              <div style={{ color: COLORS.dark }}>Cashier: <strong>cashier@spiceroute.in</strong> / <strong>cashier123</strong></div>
            </div>
          </form>
        )}

        {/* ── SIGN UP ── */}
        {tab === "signup" && (
          <form onSubmit={handleSignUp} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label style={labelStyle}>Full Name</label>
              <input
                type="text" value={suName} onChange={e => setSuName(e.target.value)}
                placeholder="Your full name" style={inputStyle}
                onFocus={e => (e.target.style.borderColor = COLORS.primary)}
                onBlur={e => (e.target.style.borderColor = COLORS.border)}
              />
            </div>
            <div>
              <label style={labelStyle}>Email</label>
              <input
                type="email" value={suEmail} onChange={e => setSuEmail(e.target.value)}
                placeholder="you@restaurant.com" style={inputStyle}
                onFocus={e => (e.target.style.borderColor = COLORS.primary)}
                onBlur={e => (e.target.style.borderColor = COLORS.border)}
              />
            </div>
            <div>
              <label style={labelStyle}>Role</label>
              <select value={suRole} onChange={e => setSuRole(e.target.value)} style={{
                ...inputStyle, appearance: "none", backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%2364748B' d='M6 8L1 3h10z'/%3E%3C/svg%3E\")",
                backgroundRepeat: "no-repeat", backgroundPosition: "right 14px center", paddingRight: 36,
              }}
                onFocus={e => (e.target.style.borderColor = COLORS.primary)}
                onBlur={e => (e.target.style.borderColor = COLORS.border)}
              >
                <option value="admin">Admin</option>
                <option value="manager">Manager</option>
                <option value="cashier">Cashier</option>
                <option value="waiter">Waiter</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Password</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showSuPass ? "text" : "password"} value={suPassword}
                  onChange={e => setSuPassword(e.target.value)}
                  placeholder="Min. 6 characters" style={{ ...inputStyle, paddingRight: 44 }}
                  onFocus={e => (e.target.style.borderColor = COLORS.primary)}
                  onBlur={e => (e.target.style.borderColor = COLORS.border)}
                />
                <button type="button" onClick={() => setShowSuPass(p => !p)} style={{
                  position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                  background: "none", border: "none", cursor: "pointer", color: COLORS.gray,
                  fontSize: 16, padding: 0,
                }}>{showSuPass ? "🙈" : "👁️"}</button>
              </div>
            </div>
            <div>
              <label style={labelStyle}>Confirm Password</label>
              <input
                type="password" value={suConfirm} onChange={e => setSuConfirm(e.target.value)}
                placeholder="Repeat password" style={inputStyle}
                onFocus={e => (e.target.style.borderColor = COLORS.primary)}
                onBlur={e => (e.target.style.borderColor = COLORS.border)}
              />
            </div>
            {suError && (
              <div style={{
                background: "#FEF2F2", border: "1px solid #FECACA", color: "#DC2626",
                borderRadius: 8, padding: "8px 12px", fontSize: 13,
              }}>{suError}</div>
            )}
            {suSuccess && (
              <div style={{
                background: "#F0FDF4", border: "1px solid #BBF7D0", color: "#16A34A",
                borderRadius: 8, padding: "8px 12px", fontSize: 13, fontWeight: 600,
              }}>Account created! Redirecting to Sign In…</div>
            )}
            <button type="submit" style={btnPrimary}
              onMouseOver={e => (e.target.style.opacity = 0.9)}
              onMouseOut={e => (e.target.style.opacity = 1)}
            >Create Account</button>
          </form>
        )}
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: none; }
        }
        * { box-sizing: border-box; }
      `}</style>
    </div>
  );
}
