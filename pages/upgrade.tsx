import Link from "next/link";
import { useRouter } from "next/router";
import { getSupabaseClient } from "../lib/supabaseClient";
import { useEffect, useState } from "react";

type AccessLevel = "free" | "premium" | "vip" | "admin";

type Profile = {
  id: string;
  email: string | null;
  full_name: string | null;
  access_level: AccessLevel;
};

export default function UpgradePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const supabase = getSupabaseClient();

    async function loadUser() {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return;

      const { data: profileData } = await supabase
        .from("profiles")
        .select("id, email, full_name, access_level")
        .eq("id", userData.user.id)
        .single();

      if (profileData) setProfile(profileData as Profile);
    }

    loadUser();
  }, []);

  async function handleLogout() {
    const supabase = getSupabaseClient();
    await supabase.auth.signOut();
    router.push("/login");
  }

  const whatsappMessage = encodeURIComponent(
    `Hola, quiero activar GoldPulse Pro con pago en cripto.
Nombre: ${profile?.full_name || ""}
Email: ${profile?.email || ""}
Plan actual: ${profile?.access_level || "free"}`
  );

  return (
    <div className="gp-page">
      <div className="gp-wrap">
        <div className="gp-topbar">
          <div className="gp-topbarLeft">
            <Link href="/" style={{ display: "inline-block" }}>
              <img src="/branding/logo.png" alt="GoldPulse Pro" className="gp-logo" />
            </Link>

            <div className="gp-topInfo">
              <div className="gp-topTitle">Upgrade</div>
              <div className="gp-topSub">Activación premium por cripto</div>
            </div>
          </div>

          <nav className="gp-topActions">
            <button onClick={() => router.push("/dashboard")} className="gp-softBtn">Dashboard</button>
            <button onClick={() => router.push("/analyze")} className="gp-softBtn">Analyze</button>
            <button onClick={() => router.push("/scalping-goldpulse")} className="gp-softBtn">Estrategia</button>
            <button onClick={handleLogout} className="gp-goldBtn">Cerrar sesión</button>
          </nav>

          <button
            type="button"
            className="gp-menuBtn"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Abrir menú"
            aria-expanded={menuOpen}
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>

        {menuOpen && (
          <div className="gp-mobileMenu">
            <button onClick={() => { setMenuOpen(false); router.push("/dashboard"); }}>Dashboard</button>
            <button onClick={() => { setMenuOpen(false); router.push("/analyze"); }}>Analyze</button>
            <button onClick={() => { setMenuOpen(false); router.push("/diary"); }}>Diario</button>
            <button onClick={() => { setMenuOpen(false); router.push("/scalping-goldpulse"); }}>Estrategia</button>
            <button onClick={() => { setMenuOpen(false); handleLogout(); }}>Cerrar sesión</button>
          </div>
        )}

        <section className="gp-hero">
          <div className="gp-heroCard">
            <div className="gp-pill">ACCESO PREMIUM</div>
            <h1 className="gp-heroTitle">Activa GoldPulse Pro con pago en cripto</h1>
            <p className="gp-heroText">
              Contacta con soporte, recibe las instrucciones de pago en cripto y una vez confirmado,
              activamos tu cuenta.
            </p>

            <div className="gp-mainActions">
              <a
                className="gp-btnPrimary gp-linkBtn"
                href={`https://wa.me/34600000000?text=${whatsappMessage}`}
                target="_blank"
                rel="noreferrer"
              >
                Contactar por WhatsApp
              </a>

              <a
                className="gp-softBtn gp-linkBtn"
                href="https://t.me/tu_usuario_telegram"
                target="_blank"
                rel="noreferrer"
              >
                Contactar por Telegram
              </a>
            </div>
          </div>

          <div className="gp-sideStatus">
            <div className="gp-statBox">
              <div className="gp-statLabel">Plan actual</div>
              <div className="gp-statValue">{profile?.access_level || "free"}</div>
            </div>
            <div className="gp-statBox">
              <div className="gp-statLabel">Usuario</div>
              <div className="gp-statValueSmall">{profile?.full_name || "—"}</div>
            </div>
            <div className="gp-statBox">
              <div className="gp-statLabel">Email</div>
              <div className="gp-statValueSmall">{profile?.email || "—"}</div>
            </div>
          </div>
        </section>

        <div className="gp-grid2">
          <div className="gp-card">
            <div className="gp-cardHeader">
              <div>
                <div className="gp-cardTitle">Qué incluye el acceso</div>
                <div className="gp-cardMeta">Herramientas y estructura premium</div>
              </div>
            </div>
            <div className="gp-cardBody">
              <FeatureCard title="Analyze Premium" text="Acceso al panel premium con señales y estructura operativa." />
              <FeatureCard title="GoldPulse Scalp" text="Acceso a la parte de scalp dentro del ecosistema." />
              <FeatureCard title="Diario Pro" text="Seguimiento de operaciones, resultados y evolución." />
              <FeatureCard title="Estrategia avanzada" text="Acceso a la estrategia Scalping GoldPulse." />
            </div>
          </div>

          <div className="gp-card">
            <div className="gp-cardHeader">
              <div>
                <div className="gp-cardTitle">Cómo funciona la activación</div>
                <div className="gp-cardMeta">Proceso simple por soporte</div>
              </div>
            </div>
            <div className="gp-cardBody">
              <FeatureCard title="01 · Contacta con soporte" text="Solicita la activación por WhatsApp o Telegram." />
              <FeatureCard title="02 · Recibe instrucciones" text="Soporte te enviará la información del pago en cripto." />
              <FeatureCard title="03 · Confirmación" text="Una vez confirmado el pago, se activa tu nivel de acceso." />
            </div>
          </div>
        </div>

        <section className="gp-bottomNav">
          <button onClick={() => router.push("/dashboard")} className="gp-bottomItem">
            <span>🏠</span><span>Dashboard</span>
          </button>
          <button onClick={() => router.push("/analyze")} className="gp-bottomItem">
            <span>📈</span><span>Analyze</span>
          </button>
          <button onClick={() => router.push("/diary")} className="gp-bottomItem">
            <span>📘</span><span>Diario</span>
          </button>
          <button onClick={() => router.push("/scalping-goldpulse")} className="gp-bottomItem">
            <span>⚡</span><span>Estrategia</span>
          </button>
        </section>
      </div>

      <style jsx>{styles}</style>
    </div>
  );
}

function FeatureCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="gp-section">
      <div className="gp-sectionTitle" style={{ fontSize: 18 }}>{title}</div>
      <div className="gp-sectionText">{text}</div>
    </div>
  );
}

const styles = `
  .gp-page {
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

  .gp-page:before {
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

  .gp-wrap {
    max-width: 1180px;
    margin: 0 auto;
    padding: 16px 16px 92px;
    position: relative;
    z-index: 1;
  }

  .gp-topbar {
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

  .gp-topbarLeft {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .gp-logo {
    height: 52px;
    width: auto;
    display: block;
    cursor: pointer;
  }

  .gp-topTitle {
    font-size: 18px;
    font-weight: 800;
  }

  .gp-topSub {
    margin-top: 4px;
    color: rgba(234, 243, 255, 0.72);
    font-size: 13px;
  }

  .gp-topActions {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }

  .gp-menuBtn {
    display: none;
    width: 42px;
    height: 42px;
    border-radius: 12px;
    border: 1px solid rgba(255,255,255,0.12);
    background: rgba(255,255,255,0.05);
    color: white;
    font-size: 20px;
  }

  .gp-mobileMenu {
    display: none;
  }

  .gp-hero {
    margin-top: 18px;
    display: grid;
    grid-template-columns: 1.15fr 0.85fr;
    gap: 16px;
  }

  .gp-heroCard,
  .gp-card {
    border-radius: 22px;
    background: rgba(0, 0, 0, 0.34);
    border: 1px solid rgba(255, 255, 255, 0.08);
    backdrop-filter: blur(14px);
  }

  .gp-heroCard,
  .gp-card {
    padding: 24px;
  }

  .gp-sideStatus {
    display: grid;
    gap: 12px;
  }

  .gp-pill {
    display: inline-block;
    padding: 8px 12px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 700;
    color: rgba(255, 220, 160, 0.92);
    background: rgba(255, 190, 80, 0.10);
    border: 1px solid rgba(255, 210, 120, 0.18);
  }

  .gp-heroTitle {
    margin: 14px 0 0;
    font-size: 38px;
    line-height: 1.08;
  }

  .gp-heroText {
    margin-top: 14px;
    max-width: 760px;
    color: rgba(234, 243, 255, 0.82);
    line-height: 1.7;
  }

  .gp-mainActions {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
    margin-top: 18px;
  }

  .gp-statBox {
    padding: 16px;
    border-radius: 18px;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.07);
  }

  .gp-statLabel {
    color: rgba(234,243,255,0.68);
    font-size: 13px;
  }

  .gp-statValue {
    margin-top: 8px;
    font-size: 28px;
    font-weight: 900;
    text-transform: uppercase;
  }

  .gp-statValueSmall {
    margin-top: 8px;
    font-size: 18px;
    font-weight: 800;
    word-break: break-word;
  }

  .gp-grid2 {
    margin-top: 18px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }

  .gp-cardHeader {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 14px;
  }

  .gp-cardTitle {
    font-size: 22px;
    font-weight: 800;
  }

  .gp-cardMeta {
    margin-top: 4px;
    color: rgba(234,243,255,0.68);
    font-size: 13px;
  }

  .gp-cardBody {
    display: grid;
    gap: 12px;
  }

  .gp-section {
    border-radius: 16px;
    padding: 14px;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.07);
  }

  .gp-sectionTitle {
    font-size: 14px;
    font-weight: 800;
    color: rgba(255,220,160,0.92);
  }

  .gp-sectionText {
    margin-top: 8px;
    color: rgba(234,243,255,0.78);
    line-height: 1.7;
    font-size: 14px;
  }

  .gp-softBtn,
  .gp-goldBtn,
  .gp-btnPrimary,
  .gp-linkBtn {
    padding: 12px 16px;
    border-radius: 12px;
    cursor: pointer;
    font-weight: 800;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .gp-softBtn {
    border: 1px solid rgba(255,255,255,0.12);
    background: rgba(255,255,255,0.05);
    color: white;
  }

  .gp-goldBtn {
    border: 1px solid rgba(255,200,110,0.45);
    background: linear-gradient(180deg, rgba(255,200,110,0.25), rgba(0,0,0,0.18));
    color: white;
  }

  .gp-btnPrimary {
    border: 1px solid rgba(120,190,255,0.35);
    background: linear-gradient(180deg, rgba(60,160,255,0.30), rgba(0,0,0,0.18));
    color: white;
  }

  .gp-bottomNav {
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

  .gp-bottomItem {
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
    .gp-topActions {
      display: none;
    }

    .gp-menuBtn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }

    .gp-mobileMenu {
      display: grid;
      gap: 8px;
      margin-top: 12px;
      padding: 14px;
      border-radius: 18px;
      background: rgba(0,0,0,0.42);
      border: 1px solid rgba(255,255,255,0.08);
      backdrop-filter: blur(14px);
    }

    .gp-mobileMenu button {
      text-align: left;
      padding: 12px 14px;
      border-radius: 12px;
      border: 1px solid rgba(255,255,255,0.08);
      background: rgba(255,255,255,0.04);
      color: white;
    }

    .gp-hero,
    .gp-grid2 {
      grid-template-columns: 1fr;
    }

    .gp-bottomNav {
      display: grid;
    }
  }

  @media (max-width: 680px) {
    .gp-wrap {
      padding: 12px 12px 92px;
    }

    .gp-topbar {
      padding: 10px 12px;
      border-radius: 18px;
    }

    .gp-logo {
      height: 42px;
    }

    .gp-topTitle {
      font-size: 16px;
    }

    .gp-topSub {
      font-size: 12px;
    }

    .gp-heroCard,
    .gp-card {
      border-radius: 18px;
      padding: 18px;
    }

    .gp-heroTitle {
      font-size: 30px;
    }

    .gp-mainActions {
      flex-direction: column;
    }

    .gp-mainActions a {
      width: 100%;
    }
  }
`;