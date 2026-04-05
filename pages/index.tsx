import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="lp-page">
      <div className="lp-wrap">
        <header className="lp-topbar">
          <div className="lp-brand">
            <Link href="/" style={{ display: "inline-block" }}>
              <img className="lp-logo" src="/branding/logo.png" alt="GoldPulse Pro" />
            </Link>
          </div>

          <nav className="lp-nav">
            <a href="#inicio">Inicio</a>
            <a href="#caracteristicas">Características</a>
            <a href="#planes">Planes</a>
            <a href="#contacto">Contacto</a>
          </nav>

          <div className="lp-actions">
            <Link className="lp-btnGold" href="/analyze">
              Ingresar
            </Link>
          </div>

          <button
            type="button"
            className="lp-menuBtn"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Abrir menú"
            aria-expanded={menuOpen}
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </header>

        {menuOpen && (
          <div className="lp-mobileMenu">
            <a href="#inicio" onClick={() => setMenuOpen(false)}>Inicio</a>
            <a href="#caracteristicas" onClick={() => setMenuOpen(false)}>Características</a>
            <a href="#planes" onClick={() => setMenuOpen(false)}>Planes</a>
            <a href="#contacto" onClick={() => setMenuOpen(false)}>Contacto</a>
            <Link href="/login" onClick={() => setMenuOpen(false)}>Ingresar</Link>
          </div>
        )}

        <main id="inicio" className="lp-hero">
          <section className="lp-left">
            <h1 className="lp-h1">
              Accede a <span className="lp-gold">señales premium</span> de Oro, Forex y BTC
            </h1>

            <p className="lp-p">
              Potencia tus trades con nuestro ecosistema GoldPulse Pro, análisis institucional,
              panel premium, diario operativo y estrategia de scalping.
            </p>

            <div className="lp-ctaRow">
              <a className="lp-btnBlue" href="#planes">
                Ver planes
              </a>
              <Link className="lp-btnOutline" href="/login">
                Ingresar
              </Link>
            </div>

            <div className="lp-miniRow">
              <div className="lp-mini">
                <div className="lp-dot" />
                Señales IA · Multipar · Premium Dark UI
              </div>
              <div className="lp-mini">
                <div className="lp-dotBlue" />
                Modo DARK · TradingView + Análisis
              </div>
            </div>

            <div className="lp-orbsLeft">
              <div className="lp-orb">
                <img src="/landing/orb-gold.png" alt="Gold" />
                <div className="lp-orbLabel">GOLD</div>
              </div>
              <div className="lp-orb">
                <img src="/landing/orb-forex.png" alt="Forex" />
                <div className="lp-orbLabel">FOREX</div>
              </div>
              <div className="lp-orb">
                <img src="/landing/orb-btc.png" alt="Bitcoin" />
                <div className="lp-orbLabel">BITCOIN</div>
              </div>
            </div>
          </section>

          <section className="lp-right">
            <div className="lp-robotWrap" aria-hidden="true">
              <div className="lp-robotGlow" />
              <img className="lp-robotImg" src="/landing/robot-forex.png" alt="" />
            </div>

            <div id="planes" className="lp-card">
              <div className="lp-cardTop">
                <div className="lp-cardTitle">Plan Premium</div>
                <div className="lp-cardStrike">$90/mes</div>
              </div>

              <div className="lp-price">
                <span className="lp-priceMain">$45</span>
                <span className="lp-priceSub">/mes</span>
              </div>

              <div className="lp-tag">50% OFF · 3 PRIMEROS MESES</div>

              <ul className="lp-list">
                <li>Panel Analyze</li>
                <li>Diario PRO</li>
                <li>Estrategia Scalping GoldPulse</li>
                <li>Soporte directo</li>
              </ul>

              <Link className="lp-cardBtn" href="/upgrade">
                REGÍSTRATE YA
              </Link>
            </div>
          </section>
        </main>

        <section id="caracteristicas" className="lp-section">
          <h2 className="lp-h2">Características</h2>
          <div className="lp-features">
            <div className="lp-box">
              <div className="lp-boxTitle">Analyze Premium</div>
              <div className="lp-boxText">Bias, entradas, stop loss y take profits con estructura clara.</div>
            </div>
            <div className="lp-box">
              <div className="lp-boxTitle">GoldPulse Scalp</div>
              <div className="lp-boxText">Señal rápida y operativa para ejecución más directa.</div>
            </div>
            <div className="lp-box">
              <div className="lp-boxTitle">Diario PRO</div>
              <div className="lp-boxText">Control del rendimiento y seguimiento de operaciones.</div>
            </div>
          </div>
        </section>

        <section id="contacto" className="lp-section">
          <h2 className="lp-h2">Contacto</h2>
          <div className="lp-contact">
            <div className="lp-box">
              <div className="lp-boxTitle">Soporte</div>
              <div className="lp-boxText">WhatsApp / Telegram para activaciones, ayuda y soporte.</div>
            </div>
            <div className="lp-box">
              <div className="lp-boxTitle">Acceso</div>
              <div className="lp-boxText">Activa tu cuenta y entra al ecosistema completo GoldPulse.</div>
            </div>
          </div>
        </section>

        <footer className="lp-footer">© {new Date().getFullYear()} GoldPulse Pro</footer>
      </div>

      <style jsx>{`
        .lp-page {
          min-height: 100vh;
          color: #eaf3ff;
          overflow-x: hidden;
          background:
            radial-gradient(1200px 800px at 70% 35%, rgba(255, 190, 80, 0.12), transparent 60%),
            radial-gradient(900px 600px at 30% 30%, rgba(60, 180, 255, 0.1), transparent 55%),
            linear-gradient(180deg, rgba(0, 0, 0, 0.55), rgba(0, 0, 0, 0.92)),
            url("/landing/hero-bg.jpg");
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
        }

        .lp-page:before {
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

        .lp-wrap {
          max-width: 1180px;
          margin: 0 auto;
          padding: 20px 16px 40px;
          position: relative;
          z-index: 1;
        }

        .lp-topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          padding: 14px 18px;
          border-radius: 18px;
          background: rgba(0, 0, 0, 0.35);
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 0 18px 60px rgba(0, 0, 0, 0.35);
          backdrop-filter: blur(10px);
        }

        .lp-logo {
          height: 54px;
          width: auto;
          display: block;
        }

        .lp-nav {
          display: flex;
          gap: 18px;
          align-items: center;
        }

        .lp-nav a {
          color: rgba(234, 243, 255, 0.85);
          text-decoration: none;
          font-size: 14px;
        }

        .lp-nav a:hover {
          color: #fff;
        }

        .lp-btnGold,
        .lp-btnBlue,
        .lp-btnOutline,
        .lp-cardBtn {
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
          font-weight: 800;
        }

        .lp-btnGold {
          padding: 10px 14px;
          border: 1px solid rgba(255, 200, 110, 0.55);
          background: linear-gradient(180deg, rgba(255, 200, 110, 0.25), rgba(0, 0, 0, 0.15));
          color: rgba(255, 220, 160, 0.95);
        }

        .lp-menuBtn {
          display: none;
          width: 42px;
          height: 42px;
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.12);
          background: rgba(255,255,255,0.05);
          color: #fff;
          font-size: 20px;
        }

        .lp-mobileMenu {
          display: none;
        }

        .lp-hero {
          margin-top: 18px;
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: 28px;
          align-items: start;
        }

        .lp-left {
          padding: 38px 10px 10px 10px;
          position: relative;
        }

        .lp-h1 {
          font-size: 56px;
          line-height: 1.04;
          margin: 0;
          letter-spacing: -0.8px;
          max-width: 720px;
        }

        .lp-gold {
          color: rgba(255, 210, 120, 0.96);
        }

        .lp-p {
          margin-top: 16px;
          max-width: 560px;
          color: rgba(234, 243, 255, 0.82);
          font-size: 16px;
          line-height: 1.55;
        }

        .lp-ctaRow {
          display: flex;
          gap: 12px;
          margin-top: 18px;
          flex-wrap: wrap;
        }

        .lp-btnBlue {
          padding: 11px 16px;
          border: 1px solid rgba(120, 190, 255, 0.35);
          background: linear-gradient(180deg, rgba(60, 160, 255, 0.35), rgba(0, 0, 0, 0.15));
          color: rgba(220, 245, 255, 0.95);
        }

        .lp-btnOutline {
          padding: 11px 16px;
          border: 1px solid rgba(255, 255, 255, 0.14);
          background: rgba(0, 0, 0, 0.18);
          color: rgba(234, 243, 255, 0.9);
        }

        .lp-miniRow {
          display: grid;
          gap: 10px;
          margin-top: 22px;
          max-width: 560px;
        }

        .lp-mini {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 12px;
          border-radius: 14px;
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.08);
          color: rgba(234, 243, 255, 0.85);
          font-size: 13px;
        }

        .lp-dot,
        .lp-dotBlue {
          width: 10px;
          height: 10px;
          border-radius: 99px;
        }

        .lp-dot {
          background: rgba(255, 190, 80, 0.95);
        }

        .lp-dotBlue {
          background: rgba(60, 180, 255, 0.95);
        }

        .lp-orbsLeft {
          margin-top: 22px;
          display: flex;
          gap: 14px;
          align-items: center;
          flex-wrap: wrap;
        }

        .lp-orb {
          width: 112px;
          height: 112px;
          border-radius: 999px;
          position: relative;
          overflow: hidden;
          background: rgba(0, 0, 0, 0.25);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .lp-orb img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .lp-orbLabel {
          position: absolute;
          bottom: 6px;
          left: 0;
          right: 0;
          text-align: center;
          font-size: 11px;
          color: rgba(255, 220, 160, 0.9);
        }

        .lp-right {
          position: relative;
          min-height: 520px;
          display: flex;
          justify-content: flex-end;
          align-items: center;
          padding-top: 18px;
        }

        .lp-robotWrap {
          position: absolute;
          right: -12px;
          top: 10px;
          width: 420px;
          max-width: 55vw;
          pointer-events: none;
          z-index: 1;
          opacity: 0.98;
          transform: translate(0px, -60px);
        }

        .lp-robotImg {
          width: 100%;
          height: auto;
        }

        .lp-robotGlow {
          position: absolute;
          right: 80px;
          top: 120px;
          width: 240px;
          height: 240px;
          border-radius: 999px;
          background: radial-gradient(circle, rgba(60, 180, 255, 0.20), transparent 60%);
        }

        .lp-card {
          width: min(420px, 100%);
          border-radius: 20px;
          padding: 18px 18px 16px;
          background: rgba(0, 0, 0, 0.35);
          border: 1px solid rgba(255, 210, 120, 0.22);
          backdrop-filter: blur(12px);
          z-index: 2;
          margin-right: 120px;
        }

        .lp-cardTop {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          gap: 10px;
        }

        .lp-cardTitle {
          font-size: 22px;
          font-weight: 700;
          color: rgba(255, 220, 160, 0.95);
        }

        .lp-cardStrike {
          color: rgba(234, 243, 255, 0.55);
          text-decoration: line-through;
        }

        .lp-price {
          display: flex;
          align-items: baseline;
          justify-content: center;
          gap: 8px;
          margin-top: 10px;
        }

        .lp-priceMain {
          font-size: 52px;
          font-weight: 800;
          color: rgba(200, 240, 255, 0.95);
        }

        .lp-priceSub {
          color: rgba(234, 243, 255, 0.75);
        }

        .lp-tag {
          margin-top: 10px;
          padding: 10px 12px;
          border-radius: 12px;
          text-align: center;
          border: 1px solid rgba(255, 210, 120, 0.22);
          background: rgba(255, 190, 80, 0.12);
          color: rgba(255, 230, 190, 0.92);
          font-weight: 700;
        }

        .lp-list {
          margin: 12px 0 0;
          padding: 0 0 0 18px;
          color: rgba(234, 243, 255, 0.86);
          line-height: 1.7;
        }

        .lp-cardBtn {
          margin-top: 14px;
          padding: 12px 14px;
          color: rgba(255, 230, 190, 0.95);
          border: 1px solid rgba(255, 200, 110, 0.55);
          background: linear-gradient(180deg, rgba(255, 200, 110, 0.25), rgba(0, 0, 0, 0.18));
        }

        .lp-section {
          margin-top: 26px;
          padding: 18px;
          border-radius: 18px;
          background: rgba(0, 0, 0, 0.32);
          border: 1px solid rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(10px);
        }

        .lp-h2 {
          margin: 0;
          font-size: 22px;
        }

        .lp-features {
          margin-top: 12px;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }

        .lp-contact {
          margin-top: 12px;
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }

        .lp-box {
          border-radius: 16px;
          padding: 14px;
          background: rgba(0, 0, 0, 0.28);
          border: 1px solid rgba(255, 255, 255, 0.08);
        }

        .lp-boxTitle {
          font-weight: 800;
          color: rgba(255, 220, 160, 0.9);
        }

        .lp-boxText {
          margin-top: 6px;
          color: rgba(234, 243, 255, 0.78);
          font-size: 14px;
          line-height: 1.6;
        }

        .lp-footer {
          margin-top: 24px;
          text-align: center;
          color: rgba(234, 243, 255, 0.55);
          font-size: 13px;
        }

        @media (max-width: 980px) {
          .lp-hero {
            grid-template-columns: 1fr;
            gap: 18px;
          }

          .lp-right {
            justify-content: flex-start;
            min-height: 0;
            padding-top: 0;
          }

          .lp-card {
            margin-right: 0;
          }

          .lp-robotWrap {
            position: relative;
            right: auto;
            top: auto;
            width: min(360px, 92%);
            max-width: none;
            margin: 0 auto 10px;
            transform: none;
          }

          .lp-nav,
          .lp-actions {
            display: none;
          }

          .lp-menuBtn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
          }

          .lp-mobileMenu {
            display: grid;
            gap: 8px;
            margin-top: 12px;
            padding: 14px;
            border-radius: 18px;
            background: rgba(0,0,0,0.42);
            border: 1px solid rgba(255,255,255,0.08);
            backdrop-filter: blur(14px);
          }

          .lp-mobileMenu a {
            text-decoration: none;
            text-align: left;
            padding: 12px 14px;
            border-radius: 12px;
            border: 1px solid rgba(255,255,255,0.08);
            background: rgba(255,255,255,0.04);
            color: white;
          }

          .lp-h1 {
            font-size: 42px;
          }

          .lp-features,
          .lp-contact {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 680px) {
          .lp-wrap {
            padding: 12px 12px 28px;
          }

          .lp-topbar {
            padding: 10px 12px;
            border-radius: 18px;
          }

          .lp-logo {
            height: 42px;
          }

          .lp-left {
            padding: 14px 2px 0;
          }

          .lp-h1 {
            font-size: 34px;
            line-height: 1.08;
          }

          .lp-p {
            font-size: 15px;
          }

          .lp-ctaRow {
            flex-direction: column;
          }

          .lp-ctaRow a {
            width: 100%;
          }

          .lp-orb {
            width: 92px;
            height: 92px;
          }

          .lp-card {
            border-radius: 18px;
          }

          .lp-priceMain {
            font-size: 42px;
          }
        }
      `}</style>
    </div>
  );
}