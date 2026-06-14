
import { useState } from "react";

const styles = `
  @import url('https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css');

  .sr-page {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2.5rem 1.25rem;
    background: #2B0F02;
    font-family: system-ui, -apple-system, sans-serif;
  }
  .sr-brand {
    text-align: center;
    margin-bottom: 2.25rem;
  }
  .sr-brand-icon {
    width: 68px;
    height: 68px;
    background: #C4520E;
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 1rem;
  }
  .sr-brand-icon i {
    font-size: 30px;
    color: #fff;
  }
  .sr-brand h1 {
    font-size: 26px;
    font-weight: 600;
    color: #fff;
    margin: 0 0 4px;
    letter-spacing: -0.5px;
  }
  .sr-brand p {
    font-size: 11px;
    color: rgba(255,255,255,0.38);
    text-transform: uppercase;
    letter-spacing: 2.5px;
    margin: 0;
  }
  .sr-pill {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    margin-top: 12px;
    border: 1px solid rgba(196,82,14,0.4);
    color: #E07840;
    font-size: 12px;
    padding: 5px 14px;
    border-radius: 999px;
    background: rgba(196,82,14,0.1);
  }
  .sr-card {
    width: 100%;
    max-width: 360px;
    background: #1C0901;
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 20px;
    padding: 1.5rem;
  }
  .sr-tabs {
    display: flex;
    background: rgba(0,0,0,0.35);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 10px;
    padding: 4px;
    margin-bottom: 1.5rem;
    gap: 4px;
  }
  .sr-tab {
    flex: 1;
    padding: 9px 0;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    border-radius: 7px;
    color: rgba(255,255,255,0.55);
    border: none;
    background: transparent;
    transition: all 0.2s;
  }
  .sr-tab.active {
    background: #C4520E;
    color: #fff;
  }
  .sr-tab:not(.active):hover {
    color: #fff;
  }
  .sr-field {
    margin-bottom: 14px;
  }
  .sr-field label {
    display: block;
    font-size: 12px;
    font-weight: 500;
    color: rgba(255,255,255,0.55);
    margin-bottom: 6px;
    letter-spacing: 0.3px;
  }
  .sr-inp-wrap {
    position: relative;
  }
  .sr-inp-wrap i {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 16px;
    color: rgba(255,255,255,0.5);
    pointer-events: none;
  }
  .sr-inp-wrap input {
    width: 100%;
    padding: 11px 12px 11px 38px;
    font-size: 14px;
    border: 1px solid rgba(255,255,255,0.12);
    border-radius: 10px;
    background: rgba(0,0,0,0.3);
    color: #fff;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
    -webkit-appearance: none;
    box-sizing: border-box;
  }
  .sr-inp-wrap input::placeholder {
    color: rgba(255,255,255,0.25);
  }
  .sr-inp-wrap input:focus {
    border-color: #C4520E;
    box-shadow: 0 0 0 3px rgba(196,82,14,0.18);
  }
  .sr-name-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }
  .sr-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 4px 0 16px;
  }
  .sr-remember {
    display: flex;
    align-items: center;
    gap: 7px;
    font-size: 13px;
    color: rgba(255,255,255,0.5);
    cursor: pointer;
    user-select: none;
  }
  .sr-remember input[type="checkbox"] {
    width: 14px;
    height: 14px;
    accent-color: #C4520E;
    cursor: pointer;
  }
  .sr-forgot {
    font-size: 13px;
    color: #E07840;
    cursor: pointer;
    background: none;
    border: none;
    padding: 0;
  }
  .sr-btn {
    width: 100%;
    padding: 12px;
    background: #C4520E;
    color: #fff;
    border: none;
    border-radius: 10px;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s, transform 0.1s;
  }
  .sr-btn:hover { background: #D9601A; }
  .sr-btn:active { transform: scale(0.98); }
  .sr-sep {
    display: flex;
    align-items: center;
    gap: 10px;
    margin: 16px 0;
  }
  .sr-sep span {
    font-size: 12px;
    color: rgba(255,255,255,0.3);
    white-space: nowrap;
  }
  .sr-sep::before, .sr-sep::after {
    content: '';
    flex: 1;
    height: 1px;
    background: rgba(255,255,255,0.08);
  }
  .sr-role-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
  }
  .sr-role-btn {
    padding: 10px 0;
    border: 1px solid rgba(255,255,255,0.12);
    border-radius: 10px;
    font-size: 13px;
    font-weight: 500;
    color: rgba(255,255,255,0.55);
    background: rgba(0,0,0,0.2);
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5px;
    transition: all 0.2s;
  }
  .sr-role-btn i {
    font-size: 18px;
    color: rgba(255,255,255,0.55);
  }
  .sr-role-btn:hover {
    border-color: rgba(196,82,14,0.5);
    color: rgba(255,255,255,0.85);
  }
  .sr-role-btn:hover i { color: rgba(255,255,255,0.85); }
  .sr-role-btn.sel {
    border-color: #C4520E;
    color: #E07840;
    background: rgba(196,82,14,0.1);
  }
  .sr-role-btn.sel i { color: #E07840; }
  .sr-switch {
    text-align: center;
    font-size: 13px;
    color: rgba(255,255,255,0.35);
    margin-top: 16px;
  }
  .sr-switch a {
    color: #E07840;
    cursor: pointer;
    font-weight: 500;
  }
  .sr-foot {
    text-align: center;
    font-size: 11px;
    color: rgba(255,255,255,0.12);
    margin-top: 1.75rem;
  }
  @media (max-width: 400px) {
    .sr-name-row { grid-template-columns: 1fr; }
    .sr-card { padding: 1.25rem; }
  }
`;

export default function LoginPage({ onLogin }) { 
  const [tab, setTab] = useState("in");
  const [role, setRole] = useState({ in: null, up: null });
  const [form, setForm] = useState({
    email: "", password: "",
    firstName: "", lastName: "",
    newEmail: "", newPassword: "",
    remember: false,
  });

  const handleSignIn = (e) => {
  e.preventDefault();
  onLogin({ email: form.email, role: role.in ?? "cashier" });
};
  const handleSignUp = (e) => {
    e.preventDefault();
    console.log("Sign up:", {
      firstName: form.firstName, lastName: form.lastName,
      email: form.newEmail, password: form.newPassword, role: role.up,
    });
  };

  return (
    <>
      <style>{styles}</style>
      <div className="sr-page">
        <div className="sr-brand">
          <div className="sr-brand-icon">
            <i className="ti ti-building-store" aria-hidden="true" />
          </div>
          <h1>Spice Route</h1>
          <p>Point of Sale</p>
          <span className="sr-pill">
            <i className="ti ti-tools" style={{ fontSize: 12 }} aria-hidden="true" />
            Restaurant POS
          </span>
        </div>

        <div className="sr-card">
          <div className="sr-tabs">
            <button className={`sr-tab ${tab === "in" ? "active" : ""}`} onClick={() => setTab("in")}>
              Sign in
            </button>
            <button className={`sr-tab ${tab === "up" ? "active" : ""}`} onClick={() => setTab("up")}>
              Sign up
            </button>
          </div>

          {tab === "in" && (
            <form onSubmit={handleSignIn}>
              <div className="sr-field">
                <label>Email</label>
                <div className="sr-inp-wrap">
                  <i className="ti ti-mail" aria-hidden="true" />
                  <input
                    type="email" placeholder="you@spiceroute.com" autoComplete="email" required
                    value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                  />
                </div>
              </div>
              <div className="sr-field">
                <label>Password</label>
                <div className="sr-inp-wrap">
                  <i className="ti ti-lock" aria-hidden="true" />
                  <input
                    type="password" placeholder="Enter your password" autoComplete="current-password" required
                    value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                  />
                </div>
              </div>
              <div className="sr-meta">
                <label className="sr-remember">
                  <input type="checkbox" checked={form.remember} onChange={e => setForm({ ...form, remember: e.target.checked })} />
                  Keep me signed in
                </label>
                <button type="button" className="sr-forgot">Forgot password?</button>
              </div>
              <button type="submit" className="sr-btn">Sign in</button>
              <div className="sr-sep"><span>or continue as</span></div>
              <div className="sr-role-row">
                {["mgr", "csh"].map(r => (
                  <button key={r} type="button"
                    className={`sr-role-btn ${role.in === r ? "sel" : ""}`}
                    onClick={() => setRole({ ...role, in: r })}>
                    <i className={`ti ${r === "mgr" ? "ti-crown" : "ti-cash-register"}`} aria-hidden="true" />
                    {r === "mgr" ? "Manager" : "Cashier"}
                  </button>
                ))}
              </div>
              <p className="sr-switch">
                New here? <a onClick={() => setTab("up")}>Create an account</a>
              </p>
            </form>
          )}

          {tab === "up" && (
            <form onSubmit={handleSignUp}>
              <div className="sr-name-row">
                <div className="sr-field">
                  <label>First name</label>
                  <div className="sr-inp-wrap">
                    <i className="ti ti-user" aria-hidden="true" />
                    <input
                      type="text" placeholder="Jane" autoComplete="given-name" required
                      value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })}
                    />
                  </div>
                </div>
                <div className="sr-field">
                  <label>Last name</label>
                  <div className="sr-inp-wrap">
                    <i className="ti ti-user" aria-hidden="true" />
                    <input
                      type="text" placeholder="Doe" autoComplete="family-name" required
                      value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              <div className="sr-field">
                <label>Email</label>
                <div className="sr-inp-wrap">
                  <i className="ti ti-mail" aria-hidden="true" />
                  <input
                    type="email" placeholder="you@spiceroute.com" autoComplete="email" required
                    value={form.newEmail} onChange={e => setForm({ ...form, newEmail: e.target.value })}
                  />
                </div>
              </div>
              <div className="sr-field">
                <label>Password</label>
                <div className="sr-inp-wrap">
                  <i className="ti ti-lock" aria-hidden="true" />
                  <input
                    type="password" placeholder="At least 8 characters" autoComplete="new-password" required minLength={8}
                    value={form.newPassword} onChange={e => setForm({ ...form, newPassword: e.target.value })}
                  />
                </div>
              </div>
              <div className="sr-field">
                <label>Your role</label>
                <div className="sr-role-row">
                  {["mgr", "csh"].map(r => (
                    <button key={r} type="button"
                      className={`sr-role-btn ${role.up === r ? "sel" : ""}`}
                      onClick={() => setRole({ ...role, up: r })}>
                      <i className={`ti ${r === "mgr" ? "ti-crown" : "ti-cash-register"}`} aria-hidden="true" />
                      {r === "mgr" ? "Manager" : "Cashier"}
                    </button>
                  ))}
                </div>
              </div>
              <button type="submit" className="sr-btn" style={{ marginTop: 6 }}>Create account</button>
              <p className="sr-switch">
                Already have an account? <a onClick={() => setTab("in")}>Sign in</a>
              </p>
            </form>
          )}
        </div>

        <p className="sr-foot">© 2026 Spice Route POS</p>
      </div>
    </>
  );
}
