import { useState } from "react";
import { useRouter } from "next/router";
import { getSupabaseClient } from "../lib/supabaseClient";

export default function LoginPage() {
  const router = useRouter();
  const supabase = getSupabaseClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (loginError) {
      setLoading(false);
      setError(loginError.message);
      return;
    }

    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError || !userData.user) {
      setLoading(false);
      setError("No se pudo obtener el usuario.");
      return;
    }

    const user = userData.user;

    const { data: existingProfile, error: existingProfileError } = await supabase
      .from("profiles")
      .select("id, access_level")
      .eq("id", user.id)
      .maybeSingle();

    if (existingProfileError) {
      setLoading(false);
      setError(existingProfileError.message);
      return;
    }

    if (!existingProfile) {
      const { error: insertError } = await supabase.from("profiles").insert({
        id: user.id,
        email: user.email ?? "",
        full_name: user.user_metadata?.full_name ?? "",
        access_level: "free",
      });

      if (insertError) {
        setLoading(false);
        setError(insertError.message);
        return;
      }
    } else {
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          email: user.email ?? "",
          full_name: user.user_metadata?.full_name ?? "",
        })
        .eq("id", user.id);

      if (updateError) {
        setLoading(false);
        setError(updateError.message);
        return;
      }
    }

    setLoading(false);
    router.push("/dashboard");
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

        <h1 style={{ marginTop: 0, textAlign: "center" }}>Iniciar sesión</h1>

        <form onSubmit={handleLogin} style={{ display: "grid", gap: 12 }}>
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
          />

          <button type="submit" disabled={loading} style={goldBtn}>
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        {error ? <p style={{ color: "tomato", marginTop: 12 }}>{error}</p> : null}
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