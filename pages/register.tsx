import { useState } from "react";
import { useRouter } from "next/router";
import { getSupabaseClient } from "../lib/supabaseClient";

export default function RegisterPage() {
  const router = useRouter();
  const supabase = getSupabaseClient();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const cleanName = name.trim();
      const cleanEmail = email.trim().toLowerCase();

      const { error: signUpError } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          data: {
            full_name: cleanName,
          },
        },
      });

      if (signUpError) {
        setError(signUpError.message);
        setLoading(false);
        return;
      }

      setMessage("Cuenta creada correctamente. Si tu proyecto usa confirmación por correo, revisa tu email antes de iniciar sesión.");

      setTimeout(() => {
        router.push("/login");
      }, 1200);
    } catch (err: any) {
      setError(err?.message || "Ocurrió un error al crear la cuenta.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(900px 500px at 20% 20%, rgba(60,180,255,0.12), transparent 55%), radial-gradient(900px 600px at 80% 30%, rgba(255,190,80,0.10), transparent 60%), linear-gradient(180deg, #06101a, #08111b 50%, #050b12 100%)",
        color: "white",
        padding: "40px 20px",
        display: "grid",
        placeItems: "center",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 440,
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 20,
          padding: 24,
          boxShadow: "0 25px 80px rgba(0,0,0,0.35)",
          backdropFilter: "blur(10px)",
        }}
      >
        <img
          src="/branding/logo.png"
          alt="GoldPulse Pro"
          style={{ height: 54, width: "auto", display: "block", margin: "0 auto 16px" }}
        />

        <h1 style={{ marginTop: 0, textAlign: "center" }}>Crear cuenta</h1>

        <form onSubmit={handleRegister} style={{ display: "grid", gap: 12 }}>
          <input
            type="text"
            placeholder="Nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={inputStyle}
          />

          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
            required
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
            minLength={6}
            required
          />

          <button type="submit" disabled={loading} style={goldBtn}>
            {loading ? "Creando cuenta..." : "Registrarme"}
          </button>
        </form>

        {error ? <p style={{ color: "tomato", marginTop: 12 }}>{error}</p> : null}
        {message ? <p style={{ color: "#7ee787", marginTop: 12 }}>{message}</p> : null}
      </div>
    </div>
  );
}

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