import Link from "next/link";
import { useRouter } from "next/router";

export default function ScalpingGoldPulsePage() {
  const router = useRouter();

  return (
    <div className="sg-page">
      <div className="sg-wrap">
        <header className="sg-topbar">
          <div className="sg-brand">
            <Link href="/" style={{ display: "inline-block" }}>
              <img
                className="sg-logo"
                src="/branding/logo.png"
                alt="GoldPulse Pro"
              />
            </Link>
            <div className="sg-sub">
              Estrategia Scalping GoldPulse · Bot Hedge · Gestión operativa
            </div>
          </div>

          <div className="sg-actions">
            <button className="sg-btnOutline" onClick={() => router.push("/dashboard")}>
              Dashboard
            </button>
            <button className="sg-btnOutline" onClick={() => router.push("/analyze")}>
              Analyze
            </button>
            <button className="sg-btnGold" onClick={() => router.push("/upgrade")}>
              Soporte / Acceso
            </button>
          </div>
        </header>

        <main className="sg-hero">
          <section className="sg-left">
            <div className="sg-badge">ESTRATEGIA OPERATIVA</div>

            <h1 className="sg-h1">
              Estrategia <span className="sg-gold">Scalping GoldPulse</span>
            </h1>

            <p className="sg-p">
              Esta estrategia está diseñada para combinar la dirección del mercado
              obtenida desde <b>GoldPulse Analyze</b> con la ejecución y gestión del
              <b> bot de hedge</b>. La idea no es operar al azar, sino utilizar una
              dirección operativa filtrada y apoyarla con una estructura de gestión
              preparada para cubrir y sostener el movimiento.
            </p>

            <div className="sg-ctaRow">
              <a
                className="sg-btnBlue"
                href="https://wa.me/34600000000?text=Hola,%20quiero%20informaci%C3%B3n%20sobre%20la%20Estrategia%20Scalping%20GoldPulse%20y%20el%20bot%20hedge"
                target="_blank"
                rel="noreferrer"
              >
                Solicitar bot por WhatsApp
              </a>

              <a
                className="sg-btnOutline"
                href="https://t.me/tu_usuario_telegram"
                target="_blank"
                rel="noreferrer"
              >
                Solicitar por Telegram
              </a>
            </div>

            <div className="sg-miniRow">
              <div className="sg-mini">
                <div className="sg-dot" />
                Estrategia basada en dirección operativa + bot de hedge
              </div>
              <div className="sg-mini">
                <div className="sg-dotBlue" />
                Requiere conexión y activación desde soporte
              </div>
            </div>
          </section>

          <section className="sg-right">
            <div className="sg-card">
              <div className="sg-cardTop">
                <div className="sg-cardTitle">Requisitos principales</div>
              </div>

              <ul className="sg-list">
                <li>La estrategia funciona únicamente con el bot de hedge.</li>
                <li>El bot debe solicitarse directamente a soporte.</li>
                <li>La conexión también debe solicitarse a soporte.</li>
                <li>Para cuentas menores de 10k se recomienda cuenta en cents.</li>
                <li>Monto mínimo recomendado: <b>400 USD</b>.</li>
              </ul>

              <div className="sg-tag">Uso recomendado con gestión disciplinada</div>
            </div>
          </section>
        </main>

        <section className="sg-section">
          <h2 className="sg-h2">Cómo funciona la idea principal</h2>

          <div className="sg-grid3">
            <div className="sg-box">
              <div className="sg-boxTitle">1. Dirección desde Analyze</div>
              <div className="sg-boxText">
                La página <b>Analyze</b> nos da una dirección operativa o bias del mercado.
                Ese sesgo sirve como referencia principal para decidir si buscamos compras
                o ventas.
              </div>
            </div>

            <div className="sg-box">
              <div className="sg-boxTitle">2. Ejecución con el bot</div>
              <div className="sg-boxText">
                El bot de hedge no sustituye la lectura del mercado. Su función es gestionar
                la operación dentro de la estructura para ayudar a sostener el movimiento y
                controlar mejor el comportamiento de la posición.
              </div>
            </div>

            <div className="sg-box">
              <div className="sg-boxTitle">3. Mezcla de análisis + gestión</div>
              <div className="sg-boxText">
                La base de esta estrategia es mezclar la dirección dada por GoldPulse con
                la lógica operativa del bot, buscando una ejecución más ordenada y adaptada
                al scalping.
              </div>
            </div>
          </div>
        </section>

        <section className="sg-section">
          <h2 className="sg-h2">Explicación del bot</h2>

          <div className="sg-grid2">
            <div className="sg-box">
              <div className="sg-boxTitle">Bot de hedge</div>
              <div className="sg-boxText">
                El bot está pensado para trabajar junto a esta estrategia. No está planteado
                como un robot independiente que opere sin criterio, sino como una herramienta
                de gestión que acompaña la entrada cuando ya existe una dirección definida.
              </div>
            </div>

            <div className="sg-box">
              <div className="sg-boxTitle">Conexión y activación</div>
              <div className="sg-boxText">
                Para obtener el bot y dejarlo funcionando correctamente, debes solicitar a
                soporte tanto el acceso al bot como la conexión. De esta forma se revisa
                que la configuración esté alineada con la estrategia.
              </div>
            </div>
          </div>
        </section>

        <section className="sg-section">
          <h2 className="sg-h2">Recomendación para cuentas pequeñas</h2>

          <div className="sg-note">
            Para cuentas menores de <b>10.000 USD</b>, la recomendación es trabajar con
            <b> cuenta en cents</b>. El monto mínimo recomendado para esta estrategia es
            de <b>400 USD</b>. Esto permite una mejor adaptación operativa dentro de la
            estructura del bot.
          </div>
        </section>

        <section className="sg-section">
          <h2 className="sg-h2">Proceso para empezar</h2>

          <div className="sg-grid3">
            <div className="sg-box">
              <div className="sg-boxTitle">Paso 1</div>
              <div className="sg-boxText">
                Solicitar a soporte el bot de hedge y la conexión.
              </div>
            </div>

            <div className="sg-box">
              <div className="sg-boxTitle">Paso 2</div>
              <div className="sg-boxText">
                Usar la dirección o bias que entrega la página Analyze.
              </div>
            </div>

            <div className="sg-box">
              <div className="sg-boxTitle">Paso 3</div>
              <div className="sg-boxText">
                Ejecutar siguiendo la lógica de la estrategia y la estructura del bot.
              </div>
            </div>
          </div>
        </section>

        <section className="sg-section">
          <h2 className="sg-h2">Soporte</h2>

          <div className="sg-grid2">
            <a
              className="sg-contactCard"
              href="https://wa.me/34600000000?text=Hola,%20quiero%20solicitar%20el%20bot%20de%20hedge%20y%20la%20conexi%C3%B3n%20para%20la%20Estrategia%20Scalping%20GoldPulse"
              target="_blank"
              rel="noreferrer"
            >
              <div className="sg-boxTitle">WhatsApp Soporte</div>
              <div className="sg-boxText">
                Solicita el bot, la conexión y la información operativa.
              </div>
            </a>

            <a
              className="sg-contactCard"
              href="https://t.me/tu_usuario_telegram"
              target="_blank"
              rel="noreferrer"
            >
              <div className="sg-boxTitle">Telegram Soporte</div>
              <div className="sg-boxText">
                Atención directa para activación, instalación y dudas.
              </div>
            </a>
          </div>
        </section>

        <footer className="sg-footer">
          © {new Date().getFullYear()} GoldPulse Pro · Estrategia Scalping GoldPulse
        </footer>
      </div>

      <style jsx>{`
        .sg-page {
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

        .sg-page:before {
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

        .sg-wrap {
          max-width: 1180px;
          margin: 0 auto;
          padding: 26px 18px 60px;
          position: relative;
          z-index: 1;
        }

        .sg-topbar {
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
          flex-wrap: wrap;
        }

        .sg-logo {
          height: 54px;
          width: auto;
          display: block;
        }

        .sg-sub {
          margin-top: 8px;
          color: rgba(234, 243, 255, 0.72);
          font-size: 13px;
        }

        .sg-actions {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .sg-btnGold,
        .sg-btnOutline,
        .sg-btnBlue {
          text-decoration: none;
          padding: 11px 16px;
          border-radius: 12px;
          font-weight: 800;
          cursor: pointer;
        }

        .sg-btnGold {
          border: 1px solid rgba(255, 200, 110, 0.45);
          background: linear-gradient(180deg, rgba(255, 200, 110, 0.25), rgba(0, 0, 0, 0.18));
          color: white;
        }

        .sg-btnOutline {
          border: 1px solid rgba(255, 255, 255, 0.14);
          background: rgba(0, 0, 0, 0.18);
          color: rgba(234, 243, 255, 0.9);
        }

        .sg-btnBlue {
          border: 1px solid rgba(120, 190, 255, 0.35);
          background: linear-gradient(180deg, rgba(60, 160, 255, 0.3), rgba(0, 0, 0, 0.18));
          color: white;
        }

        .sg-hero {
          margin-top: 20px;
          display: grid;
          grid-template-columns: 1.15fr 0.85fr;
          gap: 20px;
          align-items: start;
        }

        .sg-left,
        .sg-card,
        .sg-section {
          border-radius: 22px;
          padding: 24px;
          background: rgba(0, 0, 0, 0.32);
          border: 1px solid rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(10px);
        }

        .sg-badge {
          display: inline-block;
          padding: 8px 12px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 700;
          color: rgba(255, 220, 160, 0.92);
          background: rgba(255, 190, 80, 0.1);
          border: 1px solid rgba(255, 210, 120, 0.18);
        }

        .sg-h1 {
          margin: 16px 0 0;
          font-size: 46px;
          line-height: 1.06;
        }

        .sg-gold {
          color: rgba(255, 210, 120, 0.96);
        }

        .sg-p {
          margin-top: 16px;
          color: rgba(234, 243, 255, 0.82);
          font-size: 16px;
          line-height: 1.7;
          max-width: 760px;
        }

        .sg-ctaRow {
          display: flex;
          gap: 12px;
          margin-top: 20px;
          flex-wrap: wrap;
        }

        .sg-miniRow {
          display: grid;
          gap: 10px;
          margin-top: 22px;
          max-width: 620px;
        }

        .sg-mini {
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

        .sg-dot,
        .sg-dotBlue {
          width: 10px;
          height: 10px;
          border-radius: 99px;
        }

        .sg-dot {
          background: rgba(255, 190, 80, 0.95);
          box-shadow: 0 0 24px rgba(255, 190, 80, 0.35);
        }

        .sg-dotBlue {
          background: rgba(60, 180, 255, 0.95);
          box-shadow: 0 0 24px rgba(60, 180, 255, 0.35);
        }

        .sg-cardTop {
          display: flex;
          justify-content: space-between;
          gap: 10px;
        }

        .sg-cardTitle,
        .sg-boxTitle {
          font-size: 22px;
          font-weight: 800;
          color: rgba(255, 220, 160, 0.95);
        }

        .sg-list {
          margin: 16px 0 0;
          padding-left: 18px;
          line-height: 1.8;
          color: rgba(234, 243, 255, 0.86);
        }

        .sg-tag {
          margin-top: 16px;
          padding: 10px 12px;
          border-radius: 12px;
          text-align: center;
          border: 1px solid rgba(255, 210, 120, 0.22);
          background: rgba(255, 190, 80, 0.12);
          color: rgba(255, 230, 190, 0.92);
          font-weight: 700;
        }

        .sg-section {
          margin-top: 20px;
        }

        .sg-h2 {
          margin: 0 0 14px;
          font-size: 24px;
        }

        .sg-grid3 {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
        }

        .sg-grid2 {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 14px;
        }

        .sg-box,
        .sg-contactCard {
          border-radius: 18px;
          padding: 18px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.07);
        }

        .sg-contactCard {
          text-decoration: none;
          display: block;
        }

        .sg-boxText {
          margin-top: 8px;
          color: rgba(234, 243, 255, 0.78);
          line-height: 1.65;
          font-size: 14px;
        }

        .sg-note {
          border-radius: 18px;
          padding: 18px;
          background: rgba(255, 190, 80, 0.1);
          border: 1px solid rgba(255, 210, 120, 0.18);
          color: rgba(255, 240, 210, 0.92);
          line-height: 1.7;
        }

        .sg-footer {
          margin-top: 24px;
          text-align: center;
          color: rgba(234, 243, 255, 0.55);
          font-size: 13px;
        }

        @media (max-width: 980px) {
          .sg-hero,
          .sg-grid3,
          .sg-grid2 {
            grid-template-columns: 1fr;
          }

          .sg-h1 {
            font-size: 36px;
          }
        }
      `}</style>
    </div>
  );
}