import { useState } from "react";
import QueryPreview from "./QueryPreview.jsx";

const PRESETS = [
  { label: "Bežné prihlásenie", username: "admin", password: "admin123" },
  { label: "Obísť prihlásenie", username: "' OR '1'='1' --", password: "x" },
  {
    label: "Vytiahnuť heslo (UNION)",
    username: "' UNION SELECT password FROM users WHERE username='admin' -- ",
    password: "x",
  },
  {
    label: "Zmeniť cudzie heslo (stacked query)",
    username:
      "admin'; UPDATE users SET password='hacked123' WHERE username='jan'; SELECT username FROM users WHERE username='admin'; --",
    password: "x",
  },
];

export default function LoginForm({ onLogin }) {
  const [secure, setSecure] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [result, setResult] = useState(null);
  const [dbState, setDbState] = useState(null);

  async function loadDbState() {
    try {
      const res = await fetch("/api/users");
      const data = await res.json();
      setDbState(data.rows);
    } catch {
      setDbState(null);
    }
  }

  async function runQuery(e) {
    e.preventDefault();
    const endpoint = secure ? "/api/login/secure" : "/api/login/unsecure";
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setResult({ ok: true, message: `Server vrátil: username = '${data.username}'`, matchedUser: data.username });
      } else {
        setResult({ ok: false, message: data.detail || "Žiadny riadok sa nezhoduje" });
      }
    } catch {
      setResult({ ok: false, message: "Server neodpovedal" });
    }
    loadDbState();
  }

  function enterApp() {
    if (result && result.ok) {
      onLogin(result.matchedUser);
    }
  }

  function applyPreset(preset) {
    setUsername(preset.username);
    setPassword(preset.password);
    setResult(null);
  }

  const sql = secure
    ? "SELECT username FROM users\nWHERE username = $1\n  AND password = $2"
    : `SELECT username FROM users\nWHERE username = '${username}'\n  AND password = '${password}'`;

  return (
    <div className="lab">
      <header className="lab-top">
        <div className="lab-brand">SQL INJECTION LAB</div>
        <div className="lab-switch">
          <button
            className={!secure ? "lab-switch-btn active" : "lab-switch-btn"}
            onClick={() => setSecure(false)}
            type="button"
          >
            Unsecure
          </button>
          <button
            className={secure ? "lab-switch-btn active" : "lab-switch-btn"}
            onClick={() => setSecure(true)}
            type="button"
          >
            Secure
          </button>
        </div>
      </header>

      

      <form className="lab-form" onSubmit={runQuery}>
        <label>
          Používateľské meno
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="napr. admin"
            autoComplete="off"
          />
        </label>

        <label>
          Heslo
          <input
            type="text"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="ľubovoľné heslo"
            autoComplete="off"
          />
        </label>

        <div className="lab-presets">
          {PRESETS.map((p) => (
            <button
              key={p.label}
              type="button"
              className="lab-preset-btn"
              onClick={() => applyPreset(p)}
            >
              {p.label}
            </button>
          ))}
        </div>

        <button className="lab-run" type="submit">
          Prihlásiť sa
        </button>
      </form>

      <QueryPreview sql={sql} />

      <div className={`lab-result ${result ? (result.ok ? "ok" : "fail") : ""}`}>
        <div className="lab-result-message">
          {result ? result.message : "Spusti dotaz a výsledok sa zobrazí tu."}
        </div>
        {result && result.ok && (
          <button className="lab-enter" onClick={enterApp} type="button">
            Vstúpiť do účtu →
          </button>
        )}
      </div>

      {dbState && (
        <div className="lab-dbstate">
          <div className="lab-dbstate-label">aktuálny stav databázy</div>
          <table className="lab-table">
            <thead>
              <tr>
                <th>id</th>
                <th>username</th>
                <th>password</th>
              </tr>
            </thead>
            <tbody>
              {dbState.map((row) => (
                <tr key={row.id}>
                  <td>{row.id}</td>
                  <td>{row.username}</td>
                  <td>{row.password}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
