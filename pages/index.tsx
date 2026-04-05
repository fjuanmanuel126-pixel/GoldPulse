import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="lp-page">
      <div className="lp-wrap">
        <header className="lp-topbar">
          <div className="lp-brand">
            <img className="lp-logo" src="/branding/logo.png" alt="GoldPulse Pro" />
          </div>

          <nav className="lp-nav">
            <a href="#inicio">Inicio</a>
            <a href="#caracteristicas">Características</a>
            <a href="#como-funciona">Cómo funciona</a>
            <a href="#contacto">Contacto</a>
          </nav>

          <div className="lp-actions">
            <Link className="lp-btnOutline lp-hideTablet" href="/scalping-goldpulse">
              Estrategia Scalping
            </Link>

            <Link className="lp-btnOutline lp-hideMobile" href="/dashboard">
              Dashboard
            </Link>

            <Link className="lp-btnGold" href="/login">
              Ingresar
            </Link>

            <button
              type="button"
              className="lp-menuBtn"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Abrir menú"
              aria-expanded={menuOpen}
            >
              {menuOpen ? "✕" : "☰"}
            </button>
          </div>
        </header>

        {menuOpen && (
          <div className="lp-mobileMenu">
            <a href="#inicio" onClick={() => setMenuOpen(false)}>
              Inicio
            </a>
            <a href="#caracteristicas" onClick={() => setMenuOpen(false)}>
              Características
            </a>
            <a href="#como-funciona" onClick={() => setMenuOpen(false)}>
              Cómo funciona
            </a>
            <a href="#contacto" onClick={() => setMenuOpen(false)}>
              Contacto
            </a>
            <Link href="/dashboard" onClick={() => setMenuOpen(false)}>
              Dashboard
            </Link>
            <Link href="/scalping-goldpulse" onClick={() => setMenuOpen(false)}>
              Estrategia Scalping
            </Link>
          </div>
        )}

        <main id="inicio" className="lp-hero">
          <section className="lp-left">
            <div className="lp-badge">ECOSISTEMA GOLDPULSE PRO</div>

            <h1 className="lp-h1">
              Accede a <span className="lp-gold">señales premium</span>, análisis operativo y
              estrategia avanzada para Oro, Forex y BTC
            </h1>

            <p className="lp-p">
              GoldPulse Pro está diseñado para traders que buscan una lectura más clara del mercado,
              una dirección operativa más precisa y una estructura premium para tomar decisiones con
              mayor orden. Combina análisis, ejecución, diario y estrategia en un mismo ecosistema.
            </p>

            <div className="lp-ctaRow">
              <Link className="lp-btnBlue" href="/register">
                Regístrate Ahora
              </Link>

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
                Analyze · Diario · Estrategia Scalping · Gestión
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
                <li>Acceso completo al panel de análisis</li>
                <li>Señales premium institucionales</li>
                <li>GoldPulse Scalp</li>
                <li>Diario de trading profesional</li>
                <li>Estrategia Scalping GoldPulse</li>
                <li>Soporte y activación personalizada</li>
              </ul>

              <Link className="lp-cardBtn" href="/register">
                REGÍSTRATE YA
              </Link>

              <div className="lp-payText">
                Activación y soporte premium dentro del ecosistema GoldPulse Pro.
              </div>
            </div>
          </section>
        </main>

        <section id="caracteristicas" className="lp-section">
          <h2 className="lp-h2">Características principales</h2>
          <p className="lp-sectionLead">
            GoldPulse no es solo una página de señales. Es una estructura pensada para ayudarte a leer
            mejor el mercado, ejecutar con más claridad y organizar tu proceso operativo.
          </p>

          <div className="lp-features">
            <div className="lp-box">
              <div className="lp-boxTitle">Premium Institucional</div>
              <div className="lp-boxText">
                Análisis con enfoque más estructurado: liquidez, barridos, zonas clave, sesgo direccional
                y contexto de mercado para mejorar la calidad de tus decisiones.
              </div>
            </div>

            <div className="lp-box">
              <div className="lp-boxTitle">GoldPulse Scalp</div>
              <div className="lp-boxText">
                Ideas rápidas y directas para ejecución ágil, con niveles claros de entrada, stop y objetivos.
              </div>
            </div>

            <div className="lp-box">
              <div className="lp-boxTitle">Multipar</div>
              <div className="lp-boxText">
                Diseñado para trabajar sobre Oro, Forex, índices y crypto, permitiendo una visión más amplia.
              </div>
            </div>

            <Link className="lp-box lp-boxLink" href="/scalping-goldpulse">
              <div className="lp-boxTitle">Estrategia Scalping GoldPulse</div>
              <div className="lp-boxText">
                Estrategia basada en la dirección de Analyze y la integración con el bot hedge.
              </div>
            </Link>
          </div>
        </section>

        <section id="como-funciona" className="lp-section">
          <h2 className="lp-h2">Cómo funciona GoldPulse</h2>
          <p className="lp-sectionLead">
            El objetivo es que el usuario no tenga solo una señal, sino una ruta más clara para interpretar,
            ejecutar y revisar su operativa.
          </p>

          <div className="lp-steps">
            <div className="lp-step">
              <div className="lp-stepNumber">01</div>
              <div className="lp-stepTitle">Analiza la dirección</div>
              <div className="lp-stepText">
                En Analyze obtienes una dirección operativa o bias del mercado como base principal.
              </div>
            </div>

            <div className="lp-step">
              <div className="lp-stepNumber">02</div>
              <div className="lp-stepTitle">Ejecuta con criterio</div>
              <div className="lp-stepText">
                Usa señales premium, scalp o estrategia con bot según tu estilo y estructura de cuenta.
              </div>
            </div>

            <div className="lp-step">
              <div className="lp-stepNumber">03</div>
              <div className="lp-stepTitle">Registra y mejora</div>
              <div className="lp-stepText">
                El diario te ayuda a revisar resultados, distribución de TP y evolución de rendimiento.
              </div>
            </div>
          </div>
        </section>

        <section className="lp-section">
          <h2 className="lp-h2">Qué obtienes dentro del ecosistema</h2>

          <div className="lp-benefits">
            <div className="lp-benefit">
              <div className="lp-benefitTitle">Mayor claridad operativa</div>
              <div className="lp-benefitText">
                Menos improvisación y más estructura al leer el mercado.
              </div>
            </div>

            <div className="lp-benefit">
              <div className="lp-benefitTitle">Mejor organización</div>
              <div className="lp-benefitText">
                Un entorno donde puedes analizar, revisar resultados y mantener continuidad.
              </div>
            </div>

            <div className="lp-benefit">
              <div className="lp-benefitTitle">Estrategia escalable</div>
              <div className="lp-benefitText">
                Desde señales simples hasta estrategia con bot y soporte especializado.
              </div>
            </div>

            <div className="lp-benefit">
              <div className="lp-benefitTitle">Experiencia premium</div>
              <div className="lp-benefitText">
                Interfaz cuidada, visual potente y entorno pensado para traders exigentes.
              </div>
            </div>
          </div>
        </section>

        <section id="contacto" className="lp-section">
          <h2 className="lp-h2">Contacto y soporte</h2>
          <p className="lp-sectionLead">
            El acceso al ecosistema, la estrategia de scalping y la activación del bot se coordinan con soporte.
          </p>

          <div className="lp-contact">
            <div className="lp-box">
              <div className="lp-boxTitle">Soporte</div>
              <div className="lp-boxText">
                Atención para acceso, activación, estrategia, bot hedge y dudas operativas.
              </div>
            </div>
            <div className="lp-box">
              <div className="lp-boxTitle">Acceso</div>
              <div className="lp-boxText">
                Regístrate, entra a tu dashboard y solicita la activación del plan o de la estrategia.
              </div>
            </div>
          </div>
        </section>

        <section className="lp-section lp-finalCta">
          <h2 className="lp-h2">Da el siguiente paso con GoldPulse Pro</h2>
          <p className="lp-sectionLead">
            Accede a una estructura más completa para analizar, ejecutar y evolucionar tu operativa.
          </p>

          <div className="lp-ctaRow">
            <Link className="lp-btnBlue" href="/register">
              Crear cuenta
            </Link>
            <Link className="lp-btnOutline" href="/scalping-goldpulse">
              Ver estrategia Scalping
            </Link>
          </div>
        </section>

        <footer className="lp-footer">© {new Date().getFullYear()} GoldPulse Pro</footer>
      </div>

      <style jsx>{`
        .lp-page {
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
          padding: 18px 16px 50px;
          position: relative;
          z-index: 1;
        }

        .lp-topbar {
          position: sticky;
          top: 12px;
          z-index: 20;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          padding: 12px 14px;
          border-radius: 18px;
          background: rgba(0, 0, 0, 0.42);
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 0 18px 60px rgba(0, 0, 0, 0.35);
          backdrop-filter: blur(12px);
        }

        .lp-logo {
          height: 52px;
          width: auto;
          display: block;
          filter: drop-shadow(0 14px 34px rgba(255, 190, 80, 0.18));
        }

        .lp-nav {
          display: flex;
          gap: 18px;
          align-items: center;
          justify-content: center;
          flex: 1 1 auto;
        }

        .lp-nav a {
          color: rgba(234, 243, 255, 0.85);
          text-decoration: none;
          font-size: 14px;
          white-space: nowrap;
        }

        .lp-nav a:hover {
          color: #fff;
        }

        .lp-actions {
          display: flex;
          gap: 10px;
          align-items: center;
          flex: 0 0 auto;
        }

        .lp-btnGold,
        .lp-btnOutline,
        .lp-btnBlue {
          text-decoration: none;
          white-space: nowrap;
        }

        .lp-btnGold {
          padding: 10px 14px;
          border-radius: 12px;
          border: 1px solid rgba(255, 200, 110, 0.55);
          background: linear-gradient(180deg, rgba(255, 200, 110, 0.25), rgba(0, 0, 0, 0.15));
          color: rgba(255, 220, 160, 0.95);
          box-shadow: 0 10px 26px rgba(255, 190, 80, 0.12);
        }

        .lp-btnOutline {
          padding: 10px 14px;
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.14);
          background: rgba(0, 0, 0, 0.18);
          color: rgba(234, 243, 255, 0.9);
          box-shadow: 0 16px 40px rgba(0, 0, 0, 0.25);
        }

        .lp-btnBlue {
          padding: 12px 16px;
          border-radius: 12px;
          border: 1px solid rgba(120, 190, 255, 0.35);
          background: linear-gradient(180deg, rgba(60, 160, 255, 0.35), rgba(0, 0, 0, 0.15));
          color: rgba(220, 245, 255, 0.95);
          box-shadow: 0 16px 40px rgba(0, 160, 255, 0.12);
        }

        .lp-menuBtn {
          display: none;
          width: 42px;
          height: 42px;
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.12);
          background: rgba(255,255,255,0.05);
          color: white;
          font-size: 20px;
        }

        .lp-mobileMenu {
          display: none;
        }

        .lp-hero {
          margin-top: 18px;
          display: grid;
          grid-template-columns: 1.08fr 0.92fr;
          gap: 22px;
          align-items: start;
        }

        .lp-left {
          padding: 30px 6px 8px;
        }

        .lp-badge {
          display: inline-block;
          padding: 8px 12px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 700;
          color: rgba(255, 220, 160, 0.92);
          background: rgba(255, 190, 80, 0.10);
          border: 1px solid rgba(255, 210, 120, 0.18);
        }

        .lp-h1 {
          font-size: 56px;
          line-height: 1.03;
          margin: 14px 0 0;
          letter-spacing: -0.8px;
          text-shadow: 0 18px 60px rgba(0, 0, 0, 0.55);
          max-width: 760px;
        }

        .lp-gold {
          color: rgba(255, 210, 120, 0.96);
        }

        .lp-p {
          margin-top: 16px;
          max-width: 620px;
          color: rgba(234, 243, 255, 0.82);
          font-size: 16px;
          line-height: 1.65;
        }

        .lp-ctaRow {
          display: flex;
          gap: 12px;
          margin-top: 18px;
          flex-wrap: wrap;
        }

        .lp-miniRow {
          display: grid;
          gap: 10px;
          margin-top: 22px;
          max-width: 620px;
        }

        .lp-mini {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 12px;
          border-radius: 14px;
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(10px);
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
          box-shadow: 0 0 24px rgba(255, 190, 80, 0.35);
        }

        .lp-dotBlue {
          background: rgba(60, 180, 255, 0.95);
          box-shadow: 0 0 24px rgba(60, 180, 255, 0.35);
        }

        .lp-orbsLeft {
          margin-top: 22px;
          display: flex;
          gap: 14px;
          align-items: center;
          flex-wrap: wrap;
        }

        .lp-orb {
          width: 104px;
          height: 104px;
          border-radius: 999px;
          position: relative;
          overflow: hidden;
          background: rgba(0, 0, 0, 0.25);
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 18px 60px rgba(0, 0, 0, 0.35);
        }

        .lp-orb img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transform: scale(1.05);
        }

        .lp-orbLabel {
          position: absolute;
          bottom: 6px;
          left: 0;
          right: 0;
          text-align: center;
          font-size: 11px;
          letter-spacing: 1.2px;
          color: rgba(255, 220, 160, 0.9);
          text-shadow: 0 10px 30px rgba(0, 0, 0, 0.7);
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
          right: -10px;
          top: 10px;
          width: 410px;
          max-width: 55vw;
          pointer-events: none;
          z-index: 1;
          opacity: 0.98;
          transform: translate(0px, -40px);
        }

        .lp-robotImg {
          width: 100%;
          height: auto;
          filter:
            drop-shadow(0 26px 70px rgba(0, 160, 255, 0.18))
            drop-shadow(0 22px 70px rgba(255, 190, 80, 0.12));
        }

        .lp-robotGlow {
          position: absolute;
          right: 80px;
          top: 120px;
          width: 240px;
          height: 240px;
          border-radius: 999px;
          background: radial-gradient(circle, rgba(60, 180, 255, 0.20), transparent 60%);
          filter: blur(1px);
          opacity: 0.9;
        }

        .lp-card {
          position: relative;
          overflow: hidden;
          width: min(420px, 100%);
          border-radius: 22px;
          padding: 20px 18px 18px;
          background: rgba(0, 0, 0, 0.38);
          border: 1px solid rgba(255, 210, 120, 0.22);
          box-shadow: 0 22px 80px rgba(255, 190, 80, 0.1), 0 18px 60px rgba(0, 0, 0, 0.35);
          backdrop-filter: blur(14px);
          z-index: 2;
          margin-right: 110px;
        }

        .lp-card:before {
          content: "";
          position: absolute;
          inset: -40%;
          background: linear-gradient(
            120deg,
            transparent 35%,
            rgba(255, 220, 160, 0.18) 50%,
            transparent 65%
          );
          transform: translateX(-60%) rotate(10deg);
          animation: lpShine 4.8s ease-in-out infinite;
          pointer-events: none;
        }

        @keyframes lpShine {
          0% { transform: translateX(-70%) rotate(10deg); opacity: 0; }
          18% { opacity: 0.9; }
          45% { transform: translateX(30%) rotate(10deg); opacity: 0.15; }
          100% { transform: translateX(30%) rotate(10deg); opacity: 0; }
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
          letter-spacing: 0.6px;
        }

        .lp-list {
          margin: 12px 0 0;
          padding: 0 0 0 18px;
          color: rgba(234, 243, 255, 0.86);
          line-height: 1.8;
        }

        .lp-cardBtn {
          margin-top: 14px;
          display: block;
          text-align: center;
          padding: 13px 14px;
          border-radius: 12px;
          color: rgba(255, 230, 190, 0.95);
          border: 1px solid rgba(255, 200, 110, 0.55);
          background: linear-gradient(180deg, rgba(255, 200, 110, 0.25), rgba(0, 0, 0, 0.18));
          box-shadow: 0 16px 40px rgba(255, 190, 80, 0.12);
          font-weight: 800;
          letter-spacing: 0.6px;
        }

        .lp-payText {
          margin-top: 12px;
          text-align: center;
          color: rgba(234, 243, 255, 0.72);
          font-size: 13px;
          line-height: 1.6;
        }

        .lp-section {
          margin-top: 24px;
          padding: 22px;
          border-radius: 20px;
          background: rgba(0, 0, 0, 0.34);
          border: 1px solid rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(12px);
        }

        .lp-h2 {
          margin: 0;
          font-size: 24px;
          color: rgba(234, 243, 255, 0.94);
        }

        .lp-sectionLead {
          margin-top: 10px;
          color: rgba(234, 243, 255, 0.78);
          line-height: 1.7;
          max-width: 840px;
        }

        .lp-features {
          margin-top: 16px;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
        }

        .lp-contact {
          margin-top: 14px;
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }

        .lp-box {
          border-radius: 18px;
          padding: 16px;
          background: rgba(0, 0, 0, 0.28);
          border: 1px solid rgba(255, 255, 255, 0.08);
        }

        .lp-boxTitle,
        .lp-benefitTitle,
        .lp-stepTitle {
          font-weight: 800;
          color: rgba(255, 220, 160, 0.9);
        }

        .lp-boxText,
        .lp-benefitText,
        .lp-stepText {
          margin-top: 8px;
          color: rgba(234, 243, 255, 0.78);
          font-size: 14px;
          line-height: 1.7;
        }

        .lp-boxLink {
          text-decoration: none;
          display: block;
        }

        .lp-boxLink:hover {
          transform: translateY(-2px);
          transition: 0.2s ease;
          border-color: rgba(255, 210, 120, 0.18);
        }

        .lp-steps {
          margin-top: 16px;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
        }

        .lp-step {
          border-radius: 18px;
          padding: 18px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.07);
        }

        .lp-stepNumber {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 42px;
          height: 42px;
          border-radius: 12px;
          background: rgba(255, 190, 80, 0.12);
          border: 1px solid rgba(255, 210, 120, 0.16);
          color: rgba(255, 220, 160, 0.95);
          font-weight: 900;
          margin-bottom: 12px;
        }

        .lp-benefits {
          margin-top: 16px;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 14px;
        }

        .lp-benefit {
          border-radius: 18px;
          padding: 18px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.07);
        }

        .lp-finalCta {
          text-align: center;
        }

        .lp-finalCta .lp-sectionLead {
          margin-left: auto;
          margin-right: auto;
        }

        .lp-finalCta .lp-ctaRow {
          justify-content: center;
        }

        .lp-footer {
          margin-top: 24px;
          text-align: center;
          color: rgba(234, 243, 255, 0.55);
          font-size: 13px;
        }

        @media (max-width: 1180px) {
          .lp-hideTablet {
            display: none;
          }
        }

        @media (max-width: 1100px) {
          .lp-features,
          .lp-benefits {
            grid-template-columns: repeat(2, 1fr);
          }

          .lp-steps {
            grid-template-columns: 1fr;
          }

          .lp-h1 {
            font-size: 48px;
          }

          .lp-card {
            margin-right: 40px;
          }
        }

        @media (max-width: 920px) {
          .lp-nav {
            display: none;
          }

          .lp-hideMobile {
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
            border-radius: 16px;
            background: rgba(0, 0, 0, 0.42);
            border: 1px solid rgba(255,255,255,0.08);
            backdrop-filter: blur(12px);
          }

          .lp-mobileMenu a {
            text-decoration: none;
            color: rgba(234,243,255,0.92);
            padding: 10px 12px;
            border-radius: 12px;
            background: rgba(255,255,255,0.04);
            border: 1px solid rgba(255,255,255,0.06);
          }

          .lp-hero {
            grid-template-columns: 1fr;
            gap: 18px;
          }

          .lp-left {
            padding-top: 22px;
          }

          .lp-right {
            min-height: 0;
            justify-content: flex-start;
            padding-top: 0;
          }

          .lp-card {
            margin-right: 0;
            width: 100%;
          }

          .lp-robotWrap {
            position: relative;
            right: auto;
            top: auto;
            width: min(360px, 92%);
            max-width: none;
            margin: 0 auto 14px;
            transform: none;
          }

          .lp-robotGlow {
            right: 40px;
            top: 90px;
          }
        }

        @media (max-width: 680px) {
          .lp-wrap {
            padding: 14px 12px 40px;
          }

          .lp-topbar {
            top: 8px;
            padding: 10px 12px;
            border-radius: 16px;
          }

          .lp-logo {
            height: 42px;
          }

          .lp-actions {
            gap: 8px;
          }

          .lp-btnGold,
          .lp-btnOutline {
            padding: 9px 12px;
            font-size: 13px;
          }

          .lp-badge {
            font-size: 11px;
          }

          .lp-h1 {
            font-size: 34px;
            line-height: 1.08;
            letter-spacing: -0.4px;
          }

          .lp-p {
            font-size: 15px;
            line-height: 1.65;
          }

          .lp-mini {
            font-size: 12px;
          }

          .lp-orb {
            width: 84px;
            height: 84px;
          }

          .lp-card {
            padding: 16px 14px 14px;
            border-radius: 18px;
          }

          .lp-cardTitle {
            font-size: 20px;
          }

          .lp-priceMain {
            font-size: 42px;
          }

          .lp-section {
            padding: 18px 16px;
            border-radius: 18px;
          }

          .lp-h2 {
            font-size: 22px;
          }

          .lp-features,
          .lp-contact,
          .lp-benefits {
            grid-template-columns: 1fr;
          }

          .lp-step,
          .lp-benefit,
          .lp-box {
            padding: 16px;
          }

          .lp-ctaRow {
            flex-direction: column;
          }

          .lp-ctaRow :global(a) {
            width: 100%;
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
}