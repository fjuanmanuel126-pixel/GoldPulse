import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getSupabaseClient } from "../lib/supabaseClient";

export default function ResetPasswordPage() {
  const router = useRouter();
  const supabase = getSupabaseClient();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const hash = window.location.hash;
    if (hash.includes("access_token")) {
      setReady(true);
    } else {
      setError("El enlace no es válido o ha expirado.");
    }
  }, []);

  async function handleUpdatePassword(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      if (password.length < 6) {
        setError("La contraseña debe tener al menos 6 caracteres.");
        return;
      }

      if (password !== confirmPassword) {
        setError("Las contraseñas no coinciden.");
        return;
      }

      const { error } = await supabase.auth.updateUser({
        password,
      });

      if (error) {
        setError(error.message);
        return;
      }

      setMessage("Contraseña actualizada correctamente.");
      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (err: any) {
      setError(err?.message || "No se pudo actualizar la contraseña.");
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

        <h1 style={{ marginTop: 0, textAlign: "center" }}>Nueva contraseña</h1>

        {!ready && !error ? (
          <p style={{ color: "rgba(255,255,255,0.78)", textAlign: "center" }}>Cargando...</p>
        ) : null}

        {ready ? (
          <form onSubmit={handleUpdatePassword} style={{ display: "grid", gap: 12 }}>
            <div style={passwordWrap}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Nueva contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={passwordInputStyle}
                required
              />
              <button type="button" onClick={() => setShowPassword((v) => !v)} style={eyeBtn}>
                {showPassword ? "🙈" : "👁"}
              </button>
            </div>

            <div style={passwordWrap}>
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Repite la nueva contraseña"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={passwordInputStyle}
                required
              />
              <button type="button" onClick={() => setShowConfirmPassword((v) => !v)} style={eyeBtn}>
                {showConfirmPassword ? "🙈" : "👁"}
              </button>
            </div>

            <button type="submit" disabled={loading} style={goldBtn}>
              {loading ? "Guardando..." : "Guardar nueva contraseña"}
            </button>
          </form>
        ) : null}

        {error ? <p style={{ color: "tomato", marginTop: 12 }}>{error}</p> : null}
        {message ? <p style={{ color: "#7ee787", marginTop: 12 }}>{message}</p> : null}
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

const passwordWrap: React.CSSProperties = {
  position: "relative",
  display: "flex",
  alignItems: "center",
};

const passwordInputStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px 52px 12px 12px",
  borderRadius: 12,
  border: "1px solid rgba(255,255,255,0.10)",
  background: "rgba(255,255,255,0.04)",
  color: "white",
  outline: "none",
};

const eyeBtn: React.CSSProperties = {
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