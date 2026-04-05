import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { getSupabaseClient } from "../lib/supabaseClient";

type AccessLevel = "free" | "premium" | "vip" | "admin";

type Profile = {
  id: string;
  email: string | null;
  full_name: string | null;
  access_level: AccessLevel;
  created_at?: string | null;
};

function formatDate(dateStr?: string | null) {
  if (!dateStr) return "No disponible";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return "No disponible";
  return d.toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function DashboardPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [error, setError] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const supabase = getSupabaseClient();

    async function loadUser() {
      const { data: userData, error: userError } = await supabase.auth.getUser();

      if (userError || !userData.user) {
        router.replace("/login");
        return;
      }

      const user = userData.user;

      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("id, email, full_name, access_level, created_at")
        .eq("id", user.id)
        .single();

      if (profileError) {
        setError(profileError.message);
        setLoading(false);
        return;
      }

      setProfile(profileData as Profile);
      setLoading(false);
    }

    loadUser();
  }, [router]);

  async function handleLogout() {
    const supabase = getSupabaseClient();
    await supabase.auth.signOut();
    router.push("/login");
  }

  const planLabel = useMemo(() => {
    if (profile?.access_level === "premium") return "Premium";
    if (profile?.access_level === "vip") return "VIP";
    if (profile?.access_level === "admin") return "Admin";
    return "Free";
  }, [profile]);

  const premiumAccess = useMemo(() => {
    return (
      profile?.access_level === "premium" ||
      profile?.access_level === "vip" ||
      profile?.access_level === "admin"
    );
  }, [profile]);

  if (loading) {
    return (
      <div className="db-page">
        <div className="db-loading">Cargando dashboard...</div>
        <style jsx>{styles}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div className="db-page">
        <div className="db-wrap">
          <div className="db-card db-errorCard">
            <div className="db-cardTitle">Error</div>
            <div className="db-cardText">{error}</div>
            <div style={{ marginTop: 16 }}>
              <button onClick={() => router.push("/")} className="db-softBtn">
                Volver al inicio
              </button>
            </div>
          </div>
        </div>
        <style jsx>{styles}</style>
      </div>
    );
  }

  return (
    <div className="db-page">
      <div className="db-wrap">
        <header className="db-topbar">
          <div className="db-topbarLeft">
            <Link href="/" style={{ display: "inline-block" }}>
              <img src="/branding/logo.png" alt="GoldPulse Pro" className="db-logo" />
            </Link>

            <div className="db-topInfo">
              <div className="db-topTitle">Dashboard</div>
              <div className="db-topSub">Centro de control GoldPulse Pro</div>
            </div>
          </div>

          <nav className="db-topActions">
            <button onClick={() => router.push("/analyze")} className="db-softBtn">
              Analyze
            </button>
            <button onClick={() => router.push("/diary")} className="db-softBtn">
              Diario
            </button>
            <button onClick={() => router.push("/scalping-goldpulse")} className="db-softBtn">
              Estrategia
            </button>
            <button onClick={() => router.push("/upgrade")} className="db-softBtn">
              Upgrade
            </button>
            <button onClick={handleLogout} className="db-goldBtn">
              Cerrar sesión
            </button>
          </nav>

          <button
            type="button"
            className="db-menuBtn"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Abrir menú"
            aria-expanded={menuOpen}
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </header>

        {menuOpen && (
          <div className="db-mobileMenu">
            <button onClick={() => { setMenuOpen(false); router.push("/analyze"); }}>Analyze</button>
            <button onClick={() => { setMenuOpen(false); router.push("/diary"); }}>Diario</button>
            <button onClick={() => { setMenuOpen(false); router.push("/scalping-goldpulse"); }}>Estrategia</button>
            <button onClick={() => { setMenuOpen(false); router.push("/upgrade"); }}>Upgrade</button>
            <button onClick={() => { setMenuOpen(false); handleLogout(); }}>Cerrar sesión</button>
          </div>
        )}

        <section className="db-hero">
          <div className="db-heroMain">
            <div className="db-pill">TU CUENTA</div>
            <h1 className="db-heroTitle">
              Bienvenido{profile?.full_name ? `, ${profile.full_name}` : ""}
            </h1>
            <p className="db-heroText">
              Aquí puedes revisar la información principal de tu cuenta dentro del ecosistema GoldPulse Pro.
            </p>
          </div>

          <div className="db-heroSide">
            <StatCard label="Plan" value={planLabel} />
            <StatCard label="Acceso premium" value={premiumAccess ? "Sí" : "No"} />
            <StatCard label="Registro" value={formatDate(profile?.created_at)} />
          </div>
        </section>

        <section className="db-mainGrid">
          <div className="db-card">
            <div className="db-cardHeader">
              <div>
                <div className="db-cardTitle">Tu cuenta</div>
                <div className="db-cardMeta">Información principal</div>
              </div>
            </div>

            <div className="db-infoList">
              <InfoRow label="Nombre" value={profile?.full_name || "Sin nombre"} />
              <InfoRow label="Email" value={profile?.email || "Sin email"} />
              <InfoRow label="Nivel de acceso" value={profile?.access_level || "free"} />
              <InfoRow label="Plan visible" value={planLabel} />
              <InfoRow label="Fecha de registro" value={formatDate(profile?.created_at)} />
            </div>
          </div>

          <div className="db-sideColumn">
            <div className="db-card">
              <div className="db-cardHeader">
                <div>
                  <div className="db-cardTitle">Estado de acceso</div>
                  <div className="db-cardMeta">Resumen simple</div>
                </div>
              </div>

              <div className={`db-statusBox ${premiumAccess ? "db-statusPremium" : "db-statusFree"}`}>
                {premiumAccess ? (
                  <>
                    Tu cuenta tiene acceso al ecosistema premium. Puedes utilizar Analyze, el Diario
                    y la Estrategia dentro de GoldPulse Pro.
                  </>
                ) : (
                  <>
                    Tu cuenta actual es <b>free</b>. Para usar el panel premium necesitas mejorar el plan.
                  </>
                )}
              </div>
            </div>

            <div className="db-card">
              <div className="db-cardHeader">
                <div>
                  <div className="db-cardTitle">Soporte</div>
                  <div className="db-cardMeta">Gestión rápida de cuenta</div>
                </div>
              </div>

              <div className="db-cardText">
                Si necesitas activar tu cuenta, revisar acceso o solicitar ayuda sobre GoldPulse,
                utiliza la sección Upgrade o contacta con soporte.
              </div>

              <div style={{ marginTop: 16 }}>
                <button onClick={() => router.push("/upgrade")} className="db-goldBtn">
                  Ir a Upgrade / Soporte
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="db-bottomNav">
          <button onClick={() => router.push("/")} className="db-bottomItem">
            <span>🏠</span>
            <span>Inicio</span>
          </button>
          <button onClick={() => router.push("/analyze")} className="db-bottomItem">
            <span>📈</span>
            <span>Analyze</span>
          </button>
          <button onClick={() => router.push("/diary")} className="db-bottomItem">
            <span>📘</span>
            <span>Diario</span>
          </button>
          <button onClick={() => router.push("/scalping-goldpulse")} className="db-bottomItem">
            <span>⚡</span>
            <span>Estrategia</span>
          </button>
        </section>
      </div>

      <style jsx>{styles}</style>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="db-statCard">
      <div className="db-statLabel">{label}</div>
      <div className="db-statValue">{value}</div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="db-infoRow">
      <div className="db-infoLabel">{label}</div>
      <div className="db-infoValue">{value}</div>
    </div>
  );
}

const styles = `
  .db-page {
    min-height: 100vh;
    color: #eaf3ff;
    background:
      radial-gradient(1200px 800px at 70% 35%, rgba(255, 190, 80, 0.12), transparent 60%),
      radial-gradient(900px 600px at 30% 30%, rgba(60, 180, 255, 0.1), transparent 55%),
      linear-gradient(180deg, rgba(0, 0, 0, 0.55), rgba(0, 0, 0, 0.92)),
      url("/landing/hero-bg.jpg");
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
  }

  .db-page:before {
    content: "";
    position: fixed;
    inset: 0;
    pointer-events: none;
    background: url("/landing/sparkles.png");
    background-size: cover;
    background-position: center;
    opacity: 0.55;
    mix-blend-mode: screen;
  }

  .db-wrap {
    max-width: 1180px;
    margin: 0 auto;
    padding: 16px 16px 92px;
    position: relative;
    z-index: 1;
  }

  .db-topbar {
    position: sticky;
    top: 8px;
    z-index: 20;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 14px;
    padding: 12px 14px;
    border-radius: 20px;
    background: rgba(0, 0, 0, 0.42);
    border: 1px solid rgba(255, 255, 255, 0.08);
    box-shadow: 0 18px 60px rgba(0, 0, 0, 0.35);
    backdrop-filter: blur(14px);
  }

  .db-topbarLeft {
    display: flex;
    align-items: center;
    gap: 12px;
    min-width: 0;
  }

  .db-logo {
    height: 52px;
    width: auto;
    display: block;
    cursor: pointer;
  }

  .db-topTitle {
    font-size: 18px;
    font-weight: 800;
  }

  .db-topSub {
    margin-top: 4px;
    color: rgba(234, 243, 255, 0.72);
    font-size: 13px;
  }

  .db-topActions {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }

  .db-menuBtn {
    display: none;
    width: 42px;
    height: 42px;
    border-radius: 12px;
    border: 1px solid rgba(255,255,255,0.12);
    background: rgba(255,255,255,0.05);
    color: white;
    font-size: 20px;
  }

  .db-mobileMenu {
    display: none;
  }

  .db-hero {
    margin-top: 18px;
    display: grid;
    grid-template-columns: 1.2fr 0.8fr;
    gap: 16px;
  }

  .db-heroMain,
  .db-card,
  .db-statCard {
    border-radius: 22px;
    background: rgba(0, 0, 0, 0.34);
    border: 1px solid rgba(255, 255, 255, 0.08);
    backdrop-filter: blur(14px);
  }

  .db-heroMain,
  .db-card {
    padding: 24px;
  }

  .db-heroSide {
    display: grid;
    gap: 12px;
  }

  .db-pill {
    display: inline-block;
    padding: 8px 12px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 700;
    color: rgba(255, 220, 160, 0.92);
    background: rgba(255, 190, 80, 0.10);
    border: 1px solid rgba(255, 210, 120, 0.18);
  }

  .db-heroTitle {
    margin: 14px 0 0;
    font-size: 38px;
    line-height: 1.08;
  }

  .db-heroText {
    margin-top: 14px;
    max-width: 760px;
    color: rgba(234, 243, 255, 0.82);
    line-height: 1.7;
  }

  .db-statCard {
    padding: 16px;
  }

  .db-statLabel {
    color: rgba(234,243,255,0.68);
    font-size: 13px;
  }

  .db-statValue {
    margin-top: 8px;
    font-size: 26px;
    font-weight: 900;
  }

  .db-mainGrid {
    margin-top: 18px;
    display: grid;
    grid-template-columns: 1fr 0.9fr;
    gap: 16px;
  }

  .db-sideColumn {
    display: grid;
    gap: 16px;
  }

  .db-cardHeader {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 14px;
  }

  .db-cardTitle {
    font-size: 22px;
    font-weight: 800;
  }

  .db-cardMeta {
    margin-top: 4px;
    color: rgba(234,243,255,0.68);
    font-size: 13px;
  }

  .db-cardText {
    color: rgba(234,243,255,0.78);
    line-height: 1.7;
  }

  .db-infoList {
    display: grid;
    gap: 12px;
  }

  .db-infoRow {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    padding: 12px 14px;
    border-radius: 14px;
    background: rgba(0,0,0,0.24);
    border: 1px solid rgba(255,255,255,0.06);
    flex-wrap: wrap;
  }

  .db-infoLabel {
    color: rgba(234,243,255,0.66);
  }

  .db-infoValue {
    font-weight: 800;
  }

  .db-statusBox {
    padding: 16px;
    border-radius: 16px;
    line-height: 1.7;
    color: rgba(234,243,255,0.88);
  }

  .db-statusPremium {
    border: 1px solid rgba(255, 210, 120, 0.22);
    background: rgba(255, 190, 80, 0.10);
  }

  .db-statusFree {
    border: 1px solid rgba(255,255,255,0.08);
    background: rgba(255,255,255,0.04);
  }

  .db-softBtn,
  .db-goldBtn,
  .db-primaryBtn {
    padding: 12px 16px;
    border-radius: 12px;
    cursor: pointer;
    font-weight: 800;
  }

  .db-softBtn {
    border: 1px solid rgba(255,255,255,0.12);
    background: rgba(255,255,255,0.05);
    color: white;
  }

  .db-goldBtn {
    border: 1px solid rgba(255,200,110,0.45);
    background: linear-gradient(180deg, rgba(255,200,110,0.25), rgba(0,0,0,0.18));
    color: white;
  }

  .db-primaryBtn {
    border: 1px solid rgba(120,190,255,0.35);
    background: linear-gradient(180deg, rgba(60,160,255,0.30), rgba(0,0,0,0.18));
    color: white;
  }

  .db-errorCard {
    max-width: 560px;
    margin: 40px auto 0;
  }

  .db-loading {
    font-size: 18px;
  }

  .db-bottomNav {
    position: fixed;
    left: 12px;
    right: 12px;
    bottom: 12px;
    z-index: 30;
    display: none;
    grid-template-columns: repeat(4, 1fr);
    gap: 8px;
    padding: 8px;
    border-radius: 18px;
    background: rgba(0,0,0,0.55);
    border: 1px solid rgba(255,255,255,0.08);
    backdrop-filter: blur(14px);
    box-shadow: 0 18px 60px rgba(0,0,0,0.35);
  }

  .db-bottomItem {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 4px;
    min-height: 56px;
    border-radius: 14px;
    border: 1px solid rgba(255,255,255,0.06);
    background: rgba(255,255,255,0.04);
    color: white;
    font-size: 12px;
  }

  @media (max-width: 980px) {
    .db-topActions {
      display: none;
    }

    .db-menuBtn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }

    .db-mobileMenu {
      display: grid;
      gap: 8px;
      margin-top: 12px;
      padding: 14px;
      border-radius: 18px;
      background: rgba(0,0,0,0.42);
      border: 1px solid rgba(255,255,255,0.08);
      backdrop-filter: blur(14px);
    }

    .db-mobileMenu button {
      text-align: left;
      padding: 12px 14px;
      border-radius: 12px;
      border: 1px solid rgba(255,255,255,0.08);
      background: rgba(255,255,255,0.04);
      color: white;
    }

    .db-hero,
    .db-mainGrid {
      grid-template-columns: 1fr;
    }

    .db-bottomNav {
      display: grid;
    }
  }

  @media (max-width: 680px) {
    .db-wrap {
      padding: 12px 12px 92px;
    }

    .db-topbar {
      padding: 10px 12px;
      border-radius: 18px;
    }

    .db-logo {
      height: 42px;
    }

    .db-topTitle {
      font-size: 16px;
    }

    .db-topSub {
      font-size: 12px;
    }

    .db-heroMain,
    .db-card,
    .db-statCard {
      border-radius: 18px;
    }

    .db-heroMain,
    .db-card {
      padding: 18px;
    }

    .db-heroTitle {
      font-size: 30px;
    }
  }
`;