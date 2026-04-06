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
            <a href="#como-funciona">Cómo funciona</a>
            <a href="#planes">Planes</a>
            <a href="#contacto">Contacto</a>
          </nav>

          <div className="lp-actions">
            <Link className="lp-btnGold" href="/login">
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
            <a href="#como-funciona" onClick={() => setMenuOpen(false)}>Cómo funciona</a>
            <a href="#planes" onClick={() => setMenuOpen(false)}>Planes</a>
            <a href="#contacto" onClick={() => setMenuOpen(false)}>Contacto</a>
            <Link href="/register" onClick={() => setMenuOpen(false)}>Crear cuenta</Link>
            <Link href="/login" onClick={() => setMenuOpen(false)}>Ingresar</Link>
          </div>
        )}

        <main id="inicio" className="lp-hero">
          <section className="lp-left">
            <div className="lp-badgeHero">PLATAFORMA PREMIUM DE TRADING</div>

            <h1 className="lp-h1">
              Señales <span className="lp-gold">premium</span>, análisis institucional y ejecución más clara para Oro, Forex y BTC
            </h1>

            <p className="lp-p">
              GoldPulse Pro reúne análisis premium, señal flash, panel operativo, diario de trading
              y estrategia de scalping en una experiencia visual elegante, clara y enfocada en ayudar
              al trader a tomar decisiones con más contexto.
            </p>

            <div className="lp-ctaRow">
              <Link className="lp-btnGoldHero" href="/register">
                Crear cuenta
              </Link>
              <Link className="lp-btnOutline" href="/login">
                Ingresar
              </Link>
            </div>

            <div className="lp-miniRow">
              <div className="lp-mini">
                <div className="lp-dot" />
                Señales premium con IA para oro, forex y BTC
              </div>
              <div className="lp-mini">
                <div className="lp-dotBlue" />
                TradingView integrado y análisis operativo claro
              </div>
              <div className="lp-mini">
                <div className="lp-dot" />
                Sesgo del día, entrada, SL y take profits estructurados
              </div>
            </div>

            <div className="lp-statsRow">
              <div className="lp-statCard">
                <div className="lp-statNum">3</div>
                <div className="lp-statText">Módulos premium en una sola plataforma</div>
              </div>
              <div className="lp-statCard">
                <div className="lp-statNum">1</div>
                <div className="lp-statText">Señal clara por ejecución, sin ruido visual</div>
              </div>
              <div className="lp-statCard">
                <div className="lp-statNum">24/7</div>
                <div className="lp-statText">Acceso digital y experiencia optimizada</div>
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
                <div>
                  <div className="lp-cardEyebrow">ACCESO PREMIUM</div>
                  <div className="lp-cardTitle">Plan Premium GoldPulse</div>
                </div>
                <div className="lp-cardStrike">$90/mes</div>
              </div>

              <div className="lp-price">
                <span className="lp-priceMain">$45</span>
                <span className="lp-priceSub">/mes</span>
              </div>

              <div className="lp-tag">50% OFF · 3 PRIMEROS MESES</div>

              <ul className="lp-list">
                <li>Panel Analyze con señal premium y señal flash</li>
                <li>Diario PRO para registrar y revisar operaciones</li>
                <li>Estrategia Scalping GoldPulse</li>
                <li>Interfaz dark premium optimizada</li>
                <li>Soporte directo para activación y acceso</li>
              </ul>

              <div className="lp-cardButtons">
                <Link className="lp-cardBtn" href="/register">
                  REGÍSTRATE YA
                </Link>
                <Link className="lp-cardBtnSecondary" href="/login">
                  YA TENGO CUENTA
                </Link>
              </div>
            </div>
          </section>
        </main>

        <section id="caracteristicas" className="lp-section">
          <div className="lp-sectionHead">
            <div>
              <div className="lp-sectionEyebrow">CARACTERÍSTICAS</div>
              <h2 className="lp-h2">Un ecosistema más serio para operar con más claridad</h2>
            </div>
            <p className="lp-sectionLead">
              La plataforma está diseñada para presentar información útil de forma limpia,
              premium y orientada a la toma de decisiones.
            </p>
          </div>

          <div className="lp-features">
            <div className="lp-box">
              <div className="lp-boxTitle">Analyze Premium</div>
              <div className="lp-boxText">
                Bias del día, entrada, stop loss y take profits con estructura clara y presentación profesional.
              </div>
            </div>

            <div className="lp-box">
              <div className="lp-boxTitle">GoldPulse Scalp</div>
              <div className="lp-boxText">
                Señal rápida y operativa para traders que buscan una idea más directa y visualmente limpia.
              </div>
            </div>

            <div className="lp-box">
              <div className="lp-boxTitle">Diario PRO</div>
              <div className="lp-boxText">
                Registro y seguimiento de operaciones para revisar ejecución, consistencia y evolución.
              </div>
            </div>

            <div className="lp-box">
              <div className="lp-boxTitle">TradingView Integrado</div>
              <div className="lp-boxText">
                Visualiza el activo directamente en la plataforma y combina el gráfico con el análisis.
              </div>
            </div>

            <div className="lp-box">
              <div className="lp-boxTitle">Diseño Premium</div>
              <div className="lp-boxText">
                Interfaz dark UI con una estética más exclusiva, moderna y enfocada en experiencia de usuario.
              </div>
            </div>

            <div className="lp-box">
              <div className="lp-boxTitle">Acceso Centralizado</div>
              <div className="lp-boxText">
                Todo reunido en un entorno más ordenado: señal, contexto, estrategia y seguimiento.
              </div>
            </div>
          </div>
        </section>

        <section id="como-funciona" className="lp-section">
          <div className="lp-sectionHead">
            <div>
              <div className="lp-sectionEyebrow">CÓMO FUNCIONA</div>
              <h2 className="lp-h2">Una experiencia simple, rápida y enfocada</h2>
            </div>
            <p className="lp-sectionLead">
              Menos ruido, más estructura. Así está pensada la experiencia dentro de GoldPulse Pro.
            </p>
          </div>

          <div className="lp-steps">
            <div className="lp-step">
              <div className="lp-stepNum">01</div>
              <div className="lp-stepTitle">Crea tu cuenta</div>
              <div className="lp-stepText">
                Regístrate gratis y entra en la plataforma.
              </div>
            </div>

            <div className="lp-step">
              <div className="lp-stepNum">02</div>
              <div className="lp-stepTitle">Activa premium si quieres Analyze</div>
              <div className="lp-stepText">
                El acceso premium desbloquea la página Analyze y las funciones avanzadas.
              </div>
            </div>

            <div className="lp-step">
              <div className="lp-stepNum">03</div>
              <div className="lp-stepTitle">Revisa tu operativa</div>
              <div className="lp-stepText">
                Usa el diario y el entorno de la plataforma para seguir mejorando tu ejecución.
              </div>
            </div>
          </div>
        </section>

        <section className="lp-section">
          <div className="lp-sectionHead">
            <div>
              <div className="lp-sectionEyebrow">VENTAJAS</div>
              <h2 className="lp-h2">Por qué GoldPulse Pro se siente diferente</h2>
            </div>
            <p className="lp-sectionLead">
              No es solo una señal. Es una forma más elegante y estructurada de presentar la información.
            </p>
          </div>

          <div className="lp-advantages">
            <div className="lp-advCard">
              <div className="lp-advTitle">Más claridad visual</div>
              <div className="lp-advText">
                Niveles importantes presentados de forma limpia y fácil de entender.
              </div>
            </div>

            <div className="lp-advCard">
              <div className="lp-advTitle">Mejor experiencia premium</div>
              <div className="lp-advText">
                Interfaz oscura con estilo profesional, ideal para una marca más seria.
              </div>
            </div>

            <div className="lp-advCard">
              <div className="lp-advTitle">Todo más centralizado</div>
              <div className="lp-advText">
                Análisis, diario y estrategia dentro de un mismo ecosistema.
              </div>
            </div>
          </div>
        </section>

        <section className="lp-section">
          <div className="lp-sectionHead">
            <div>
              <div className="lp-sectionEyebrow">PRUEBA SOCIAL</div>
              <h2 className="lp-h2">Pensado para traders que valoran estructura y presentación</h2>
            </div>
          </div>

          <div className="lp-testimonials">
            <div className="lp-testimonial">
              <div className="lp-testimonialText">
                “La plataforma se siente mucho más premium y el análisis se entiende rápido.”
              </div>
              <div className="lp-testimonialAuthor">Trader GoldPulse</div>
            </div>

            <div className="lp-testimonial">
              <div className="lp-testimonialText">
                “Me gusta ver entrada, SL y TP de una forma más clara y visual.”
              </div>
              <div className="lp-testimonialAuthor">Usuario Premium</div>
            </div>

            <div className="lp-testimonial">
              <div className="lp-testimonialText">
                “Se nota más serio, más limpio y más profesional que una página simple.”
              </div>
              <div className="lp-testimonialAuthor">Miembro de la comunidad</div>
            </div>
          </div>
        </section>

        <section id="contacto" className="lp-section lp-ctaFinal">
          <div className="lp-ctaFinalInner">
            <div>
              <div className="lp-sectionEyebrow">CONTACTO Y ACCESO</div>
              <h2 className="lp-h2">Entra al ecosistema completo GoldPulse Pro</h2>
              <p className="lp-sectionLead">
                Regístrate gratis. El acceso a Analyze se desbloquea solo para usuarios premium.
              </p>
            </div>

            <div className="lp-ctaFinalActions">
              <Link className="lp-cardBtn" href="/register">
                CREAR CUENTA
              </Link>
              <Link className="lp-btnOutline" href="/login">
                INGRESAR
              </Link>
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
          transition: color 0.18s ease;
        }

        .lp-nav a:hover {
          color: #fff;
        }

        .lp-btnGold,
        .lp-btnGoldHero,
        .lp-btnOutline,
        .lp-cardBtn,
        .lp-cardBtnSecondary {
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 14px;
          font-weight: 800;
          transition: transform 0.18s ease, box-shadow 0.18s ease, opacity 0.18s ease;
        }

        .lp-btnGold:hover,
        .lp-btnGoldHero:hover,
        .lp-btnOutline:hover,
        .lp-cardBtn:hover,
        .lp-cardBtnSecondary:hover {
          transform: translateY(-1px);
        }

        .lp-btnGold {
          padding: 10px 14px;
          border: 1px solid rgba(255, 200, 110, 0.55);
          background: linear-gradient(180deg, rgba(255, 200, 110, 0.25), rgba(0, 0, 0, 0.15));
          color: rgba(255, 220, 160, 0.95);
        }

        .lp-btnGoldHero {
          padding: 13px 18px;
          border: 1px solid rgba(255, 205, 112, 0.4);
          background: linear-gradient(180deg, rgba(255, 214, 130, 0.96), rgba(205, 150, 42, 0.96));
          color: #0f1114;
          box-shadow:
            0 14px 34px rgba(255, 190, 80, 0.18),
            inset 0 1px 0 rgba(255,255,255,0.28);
        }

        .lp-btnOutline {
          padding: 13px 18px;
          border: 1px solid rgba(255, 255, 255, 0.14);
          background: rgba(0, 0, 0, 0.18);
          color: rgba(234, 243, 255, 0.9);
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
          margin-top: 24px;
          display: grid;
          grid-template-columns: 1.08fr 0.92fr;
          gap: 28px;
          align-items: start;
        }

        .lp-left {
          padding: 40px 10px 10px 10px;
          position: relative;
        }

        .lp-badgeHero {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 9px 14px;
          border-radius: 999px;
          background: rgba(255, 190, 80, 0.1);
          border: 1px solid rgba(255, 210, 120, 0.18);
          color: rgba(255, 220, 160, 0.92);
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .lp-h1 {
          font-size: 60px;
          line-height: 1.02;
          margin: 18px 0 0;
          letter-spacing: -1px;
          max-width: 760px;
        }

        .lp-gold {
          color: rgba(255, 210, 120, 0.96);
        }

        .lp-p {
          margin-top: 18px;
          max-width: 620px;
          color: rgba(234, 243, 255, 0.82);
          font-size: 17px;
          line-height: 1.65;
        }

        .lp-ctaRow {
          display: flex;
          gap: 12px;
          margin-top: 22px;
          flex-wrap: wrap;
        }

        .lp-miniRow {
          display: grid;
          gap: 10px;
          margin-top: 24px;
          max-width: 620px;
        }

        .lp-mini {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 14px;
          border-radius: 14px;
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.08);
          color: rgba(234, 243, 255, 0.85);
          font-size: 14px;
        }

        .lp-dot,
        .lp-dotBlue {
          width: 10px;
          height: 10px;
          border-radius: 99px;
          flex: 0 0 auto;
        }

        .lp-dot {
          background: rgba(255, 190, 80, 0.95);
        }

        .lp-dotBlue {
          background: rgba(60, 180, 255, 0.95);
        }

        .lp-statsRow {
          margin-top: 24px;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          max-width: 760px;
        }

        .lp-statCard {
          padding: 16px;
          border-radius: 18px;
          background: rgba(255,255,255,0.035);
          border: 1px solid rgba(255,255,255,0.08);
          backdrop-filter: blur(10px);
        }

        .lp-statNum {
          font-size: 28px;
          font-weight: 900;
          color: rgba(255, 220, 160, 0.95);
        }

        .lp-statText {
          margin-top: 8px;
          color: rgba(234, 243, 255, 0.76);
          font-size: 13px;
          line-height: 1.5;
        }

        .lp-orbsLeft {
          margin-top: 24px;
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
          box-shadow: 0 16px 40px rgba(0,0,0,0.22);
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
          font-weight: 800;
          letter-spacing: 0.06em;
        }

        .lp-right {
          position: relative;
          min-height: 580px;
          display: flex;
          justify-content: flex-end;
          align-items: center;
          padding-top: 18px;
        }

        .lp-robotWrap {
          position: absolute;
          right: -12px;
          top: 10px;
          width: 430px;
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
          width: min(440px, 100%);
          border-radius: 22px;
          padding: 22px 20px 18px;
          background: rgba(0, 0, 0, 0.38);
          border: 1px solid rgba(255, 210, 120, 0.22);
          backdrop-filter: blur(12px);
          z-index: 2;
          margin-right: 120px;
          box-shadow:
            0 24px 80px rgba(0,0,0,0.28),
            inset 0 1px 0 rgba(255,255,255,0.03);
        }

        .lp-cardEyebrow {
          font-size: 11px;
          font-weight: 800;
          color: rgba(255, 220, 160, 0.85);
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .lp-cardTop {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          gap: 10px;
        }

        .lp-cardTitle {
          margin-top: 6px;
          font-size: 24px;
          font-weight: 800;
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
          margin-top: 14px;
        }

        .lp-priceMain {
          font-size: 56px;
          font-weight: 900;
          color: rgba(200, 240, 255, 0.95);
        }

        .lp-priceSub {
          color: rgba(234, 243, 255, 0.75);
          font-size: 18px;
        }

        .lp-tag {
          margin-top: 12px;
          padding: 10px 12px;
          border-radius: 12px;
          text-align: center;
          border: 1px solid rgba(255, 210, 120, 0.22);
          background: rgba(255, 190, 80, 0.12);
          color: rgba(255, 230, 190, 0.92);
          font-weight: 700;
        }

        .lp-list {
          margin: 16px 0 0;
          padding: 0 0 0 18px;
          color: rgba(234, 243, 255, 0.86);
          line-height: 1.8;
        }

        .lp-cardButtons {
          display: grid;
          gap: 10px;
          margin-top: 16px;
        }

        .lp-cardBtn {
          padding: 13px 14px;
          color: #101010;
          border: 1px solid rgba(255, 205, 112, 0.45);
          background: linear-gradient(180deg, rgba(255, 214, 130, 0.96), rgba(205, 150, 42, 0.96));
          box-shadow:
            0 14px 32px rgba(255, 190, 80, 0.16),
            inset 0 1px 0 rgba(255,255,255,0.24);
        }

        .lp-cardBtnSecondary {
          padding: 12px 14px;
          color: rgba(234, 243, 255, 0.95);
          border: 1px solid rgba(255,255,255,0.14);
          background: rgba(255,255,255,0.04);
        }

        .lp-section {
          margin-top: 28px;
          padding: 22px;
          border-radius: 22px;
          background: rgba(0, 0, 0, 0.32);
          border: 1px solid rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(10px);
        }

        .lp-sectionHead {
          display: flex;
          justify-content: space-between;
          gap: 20px;
          align-items: end;
          margin-bottom: 16px;
          flex-wrap: wrap;
        }

        .lp-sectionEyebrow {
          font-size: 11px;
          font-weight: 800;
          color: rgba(255, 220, 160, 0.85);
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .lp-h2 {
          margin: 6px 0 0;
          font-size: 32px;
          line-height: 1.1;
        }

        .lp-sectionLead {
          max-width: 440px;
          color: rgba(234, 243, 255, 0.76);
          line-height: 1.6;
          font-size: 14px;
        }

        .lp-features {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }

        .lp-box {
          border-radius: 18px;
          padding: 16px;
          background: rgba(0, 0, 0, 0.28);
          border: 1px solid rgba(255, 255, 255, 0.08);
        }

        .lp-boxTitle {
          font-weight: 800;
          color: rgba(255, 220, 160, 0.9);
          font-size: 16px;
        }

        .lp-boxText {
          margin-top: 8px;
          color: rgba(234, 243, 255, 0.78);
          font-size: 14px;
          line-height: 1.65;
        }

        .lp-steps {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }

        .lp-step {
          border-radius: 18px;
          padding: 18px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
        }

        .lp-stepNum {
          font-size: 28px;
          font-weight: 900;
          color: rgba(255, 210, 120, 0.96);
        }

        .lp-stepTitle {
          margin-top: 10px;
          font-size: 18px;
          font-weight: 800;
        }

        .lp-stepText {
          margin-top: 8px;
          color: rgba(234, 243, 255, 0.76);
          line-height: 1.6;
          font-size: 14px;
        }

        .lp-advantages {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }

        .lp-advCard {
          border-radius: 18px;
          padding: 18px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
        }

        .lp-advTitle {
          font-size: 18px;
          font-weight: 800;
          color: rgba(255, 220, 160, 0.92);
        }

        .lp-advText {
          margin-top: 8px;
          color: rgba(234, 243, 255, 0.76);
          line-height: 1.6;
          font-size: 14px;
        }

        .lp-testimonials {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }

        .lp-testimonial {
          border-radius: 18px;
          padding: 18px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
        }

        .lp-testimonialText {
          color: rgba(234, 243, 255, 0.86);
          line-height: 1.7;
          font-size: 14px;
        }

        .lp-testimonialAuthor {
          margin-top: 12px;
          color: rgba(255, 220, 160, 0.92);
          font-weight: 800;
          font-size: 13px;
        }

        .lp-ctaFinal {
          overflow: hidden;
        }

        .lp-ctaFinalInner {
          display: flex;
          justify-content: space-between;
          gap: 20px;
          align-items: center;
          flex-wrap: wrap;
        }

        .lp-ctaFinalActions {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .lp-footer {
          margin-top: 26px;
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
            font-size: 44px;
          }

          .lp-statsRow,
          .lp-features,
          .lp-steps,
          .lp-advantages,
          .lp-testimonials {
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

          .lp-ctaRow a,
          .lp-ctaFinalActions a {
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

          .lp-h2 {
            font-size: 26px;
          }
        }
      `}</style>
    </div>
  );
}