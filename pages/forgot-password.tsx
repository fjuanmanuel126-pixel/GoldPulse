import Link from "next/link";
import { useState } from "react";
import { getSupabaseClient } from "../lib/supabaseClient";

export default function ForgotPasswordPage() {
  const supabase = getSupabaseClient();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function handleResetRequest(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const cleanEmail = email.trim().toLowerCase();

      const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
        redirectTo: "https://gold-pulse-nine.vercel.app/reset-password",
      });

      if (error) {
        setError(error.message);
        return;
      }

      setMessage("Te hemos enviado un correo para restablecer la contraseña.");
    } catch (err: any) {
      setError(err?.message || "No se pudo enviar el correo.");
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

        <h1 style={{ marginTop: 0, textAlign: "center" }}>Recuperar contraseña</h1>
        <p style={{ color: "rgba(255,255,255,0.78)", textAlign: "center", lineHeight: 1.6 }}>
          Introduce tu correo y te enviaremos un enlace para cambiar tu contraseña.
        </p>

        <form onSubmit={handleResetRequest} style={{ display: "grid", gap: 12, marginTop: 16 }}>
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
            required
          />

          <button type="submit" disabled={loading} style={goldBtn}>
            {loading ? "Enviando..." : "Enviar enlace"}
          </button>
        </form>

        {error ? <p style={{ color: "tomato", marginTop: 12 }}>{error}</p> : null}
        {message ? <p style={{ color: "#7ee787", marginTop: 12 }}>{message}</p> : null}

        <div style={{ marginTop: 16, textAlign: "center" }}>
          <Link href="/login" style={{ color: "rgba(255,220,160,0.95)", textDecoration: "none", fontWeight: 700 }}>
            Volver al login
          </Link>
        </div>
      </div>
    </div>
  );
}

const pageStyle: React.CSSProperties = {
  minHeight: "100vh",
  background:
    "radial-gradient(900px 500px at 20% 20%, rgba(60,180,255,0.12), transparent 55%), radial-gradient(900px 600px at 80% 30%, rgba(255,190,80,0.10), transparent 60%), linear-gradient(180deg, #06101a, #08111b 50%, #050b12 100%)",
  color: "white",
  padding: "40px 20px",
  display: "grid",
  placeItems: "center",
};

const cardStyle: React.CSSProperties = {
  width: "100%",
  maxWidth: 440,
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 20,
  padding: 24,
  boxShadow: "0 25px 80px rgba(0,0,0,0.35)",
  backdropFilter: "blur(10px)",
};

const inputStyle: React.CSSProperties = {
  padding: 12,
  borderRadius: 12,
  border: "1px solid rgba(255,255,255,0.10)",
  background: "rgba(255,255,255,0.04)",
  color: "white",
  outline: "none",
};

const goldBtn: React.CSSProperties = {
  padding: 12,
  borderRadius: 12,
  border: "1px solid rgba(255,200,110,0.45)",
  background: "linear-gradient(180deg, rgba(255,200,110,0.25), rgba(0,0,0,0.18))",
  color: "white",
  cursor: "pointer",
  fontWeight: 800,
};