import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getSupabaseClient } from "../lib/supabaseClient";

const REMEMBER_EMAIL_KEY = "goldpulse_remember_email";
const SAVED_EMAIL_KEY = "goldpulse_saved_email";

export default function LoginPage() {
  const router = useRouter();
  const supabase = getSupabaseClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const remembered = localStorage.getItem(REMEMBER_EMAIL_KEY);
    const savedEmail = localStorage.getItem(SAVED_EMAIL_KEY);

    if (remembered === "true") {
      setRememberMe(true);
      if (savedEmail) setEmail(savedEmail);
    } else {
      setRememberMe(false);
    }
  }, []);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const cleanEmail = email.trim().toLowerCase();

      const { error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

      if (error) {
        setError(error.message);
        return;
      }

      if (rememberMe) {
        localStorage.setItem(REMEMBER_EMAIL_KEY, "true");
        localStorage.setItem(SAVED_EMAIL_KEY, cleanEmail);
      } else {
        localStorage.removeItem(REMEMBER_EMAIL_KEY);
        localStorage.removeItem(SAVED_EMAIL_KEY);
      }

      router.push("/dashboard");
    } catch (err: any) {
      setError(err?.message || "Error al iniciar sesión.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <img
          src="/branding/logo.png"
          alt="GoldPulse Pro"
          style={{ height: 54, width: "auto", display: "block", margin: "0 auto 16px" }}
        />

        <h1 style={{ marginTop: 0, textAlign: "center" }}>Iniciar sesión</h1>

        <form onSubmit={handleLogin} style={{ display: "grid", gap: 12 }}>
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
            required
          />

          <div style={passwordWrap}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={passwordInputStyle}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              style={eyeBtn}
            >
              {showPassword ? "🙈" : "👁"}
            </button>
          </div>

          <label style={rememberRow}>
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <span>Recordarme</span>
          </label>

          <button type="submit" disabled={loading} style={goldBtn}>
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        {error ? <p style={{ color: "tomato", marginTop: 12 }}>{error}</p> : null}
      </div>
    </div>
  );
}

const pageStyle = {
  minHeight: "100vh",
  background:
    "radial-gradient(900px 500px at 20% 20%, rgba(60,180,255,0.12), transparent 55%), radial-gradient(900px 600px at 80% 30%, rgba(255,190,80,0.10), transparent 60%), linear-gradient(180deg, #06101a, #08111b 50%, #050b12 100%)",
  color: "white",
  padding: "40px 20px",
  display: "grid",
  placeItems: "center",
} as React.CSSProperties;

const cardStyle = {
  width: "100%",
  maxWidth: 440,
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 20,
  padding: 24,
  boxShadow: "0 25px 80px rgba(0,0,0,0.35)",
  backdropFilter: "blur(10px)",
} as React.CSSProperties;

const inputStyle = {
  padding: 12,
  borderRadius: 12,
  border: "1px solid rgba(255,255,255,0.10)",
  background: "rgba(255,255,255,0.04)",
  color: "white",
  outline: "none",
} as React.CSSProperties;

const passwordWrap = {
  position: "relative",
  display: "flex",
  alignItems: "center",
} as React.CSSProperties;

const passwordInputStyle = {
  width: "100%",
  padding: "12px 52px 12px 12px",
  borderRadius: 12,
  border: "1px solid rgba(255,255,255,0.10)",
  background: "rgba(255,255,255,0.04)",
  color: "white",
  outline: "none",
} as React.CSSProperties;

const eyeBtn = {
  position: "absolute",
  right: 8,
  top: "50%",
  transform: "translateY(-50%)",
  width: 38,
  height: 38,
  borderRadius: 10,
  border: "1px solid rgba(255,255,255,0.08)",
  background: "rgba(255,255,255,0.05)",
  color: "white",
  cursor: "pointer",
} as React.CSSProperties;

const rememberRow = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  color: "rgba(255,255,255,0.85)",
  fontSize: 14,
} as React.CSSProperties;

const goldBtn = {
  padding: 12,
  borderRadius: 12,
  border: "1px solid rgba(255,200,110,0.45)",
  background: "linear-gradient(180deg, rgba(255,200,110,0.25), rgba(0,0,0,0.18))",
  color: "white",
  cursor: "pointer",
  fontWeight: 800,
} as React.CSSProperties;