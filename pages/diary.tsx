import Link from "next/link";
import { useRouter } from "next/router";

function money(v: number) {
  const sign = v > 0 ? "+" : v < 0 ? "-" : "";
  return `${sign}$${Math.abs(v).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

const days = [
  { d: 1, pnl: 39.66, ops: 1 },
  { d: 4, pnl: 54.66, ops: 1 },
  { d: 6, pnl: -145.92, ops: 2 },
  { d: 7, pnl: 64.88, ops: 2 },
  { d: 11, pnl: 57.04, ops: 1 },
  { d: 12, pnl: 78.26, ops: 3 },
  { d: 13, pnl: 89.74, ops: 6 },
  { d: 14, pnl: 20.76, ops: 4 },
  { d: 15, pnl: 55.12, ops: 2 },
];

export default function BitacoraPage() {
  const router = useRouter();

  const monthProfit = days.reduce((a, b) => a + b.pnl, 0);
  const wins = days.filter((x) => x.pnl > 0).length;
  const losses = days.filter((x) => x.pnl < 0).length;
  const winrate = (wins / days.length) * 100;

  return (
    <div className="gp-page">
      <div className="gp-wrap">
        <div className="gp-topbar">
          <div className="gp-topbarLeft">
            <Link href="/">
              <img src="/branding/logo.png" alt="GoldPulse Pro" className="gp-logo" />
            </Link>

            <div>
              <div className="gp-topTitle">Bitácora PRO</div>
              <div className="gp-topSub">Cuentas MT5 · Métricas · Calendario</div>
            </div>
          </div>

          <nav className="gp-topActions">
            <button onClick={() => router.push("/dashboard")} className="gp-softBtn">Dashboard</button>
            <button onClick={() => router.push("/analyze")} className="gp-softBtn">Analyze</button>
            <button onClick={() => router.push("/diary")} className="gp-softBtn">Diario</button>
          </nav>
        </div>

        <section className="gp-hero">
          <div>
            <div className="gp-badge">GOLDPULSE ACCOUNT METRIX</div>
            <h1>Bitácora de cuentas MT5</h1>
            <p>
              Vista previa manual para importar historial completo de cada cuenta y generar
              métricas tipo FTMO dentro de GoldPulse.
            </p>
          </div>

          <button className="gp-mainBtn">Importar historial MT5</button>
        </section>

        <section className="gp-grid4">
          <Metric title="Balance" value="$9,709.63" />
          <Metric title="Equity" value="$9,709.63" />
          <Metric title="Profit mensual" value={money(monthProfit)} green />
          <Metric title="Drawdown" value="-2.90%" red />
        </section>

        <section className="gp-layout">
          <div className="gp-left">
            <div className="gp-card">
              <div className="gp-cardHeader">
                <div>
                  <div className="gp-cardTitle">FTMO Challenge 10K</div>
                  <div className="gp-cardMeta">Cuenta 541241171 · Estado activo</div>
                </div>
                <div className="gp-status">ACTIVA</div>
              </div>

              <div className="gp-chart">
                <div className="gp-chartLine l1" />
                <div className="gp-chartLine l2" />
                <div className="gp-curve" />
              </div>
            </div>

            <div className="gp-card">
              <div className="gp-cardHeader">
                <div>
                  <div className="gp-cardTitle">Trading Calendar</div>
                  <div className="gp-cardMeta">Mayo 2026 · Resultado diario</div>
                </div>
                <strong className="gp-green">{money(monthProfit)}</strong>
              </div>

              <div className="gp-calendar">
                {Array.from({ length: 31 }, (_, i) => {
                  const n = i + 1;
                  const found = days.find((x) => x.d === n);

                  return (
                    <div
                      key={n}
                      className={`gp-day ${
                        found?.pnl && found.pnl > 0
                          ? "pos"
                          : found?.pnl && found.pnl < 0
                          ? "neg"
                          : ""
                      }`}
                    >
                      <b>{n}</b>
                      {found && (
                        <>
                          <span>{money(found.pnl)}</span>
                          <small>{found.ops} ops</small>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <aside className="gp-right">
            <div className="gp-card">
              <div className="gp-cardTitle">Objetivos</div>
              <div className="gp-cardMeta">Estado de la cuenta</div>

              <KV label="Pérdida máxima diaria" value="-$500.00" />
              <KV label="Pérdida máxima total" value="-$1,000.00" />
              <KV label="Profit actual" value={money(monthProfit)} green />
              <KV label="Cuenta inicial" value="$10,000.00" />
            </div>

            <div className="gp-card">
              <div className="gp-cardTitle">Estadísticas</div>
              <div className="gp-cardMeta">Resumen del mes</div>

              <div className="gp-stats">
                <Stat label="Winrate" value={`${winrate.toFixed(1)}%`} green />
                <Stat label="Días positivos" value={`${wins}`} green />
                <Stat label="Días negativos" value={`${losses}`} red />
                <Stat label="Trades" value="22" />
                <Stat label="Lotes" value="1.95" />
                <Stat label="Profit factor" value="2.30" green />
              </div>
            </div>
          </aside>
        </section>

        <div className="gp-card">
          <div className="gp-cardHeader">
            <div>
              <div className="gp-cardTitle">Resumen diario</div>
              <div className="gp-cardMeta">Historial importado manualmente desde MT5</div>
            </div>
          </div>

          <div className="gp-table">
            {days.map((x) => (
              <div className="gp-row" key={x.d}>
                <span>2026-05-{String(x.d).padStart(2, "0")}</span>
                <span>{x.ops} operaciones</span>
                <b className={x.pnl >= 0 ? "gp-green" : "gp-red"}>{money(x.pnl)}</b>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
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
        }

        .gp-page:before {
          content: "";
          position: fixed;
          inset: 0;
          pointer-events: none;
          background: url("/landing/sparkles.png");
          background-size: cover;
          opacity: 0.45;
          mix-blend-mode: screen;
        }

        .gp-wrap {
          max-width: 1180px;
          margin: 0 auto;
          padding: 16px 16px 90px;
          position: relative;
          z-index: 1;
        }

        .gp-topbar {
          position: sticky;
          top: 8px;
          z-index: 20;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 14px;
          padding: 12px 14px;
          border-radius: 20px;
          background: rgba(0, 0, 0, 0.42);
          border: 1px solid rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(14px);
        }

        .gp-topbarLeft {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .gp-logo {
          height: 52px;
        }

        .gp-topTitle {
          font-size: 18px;
          font-weight: 900;
        }

        .gp-topSub,
        .gp-cardMeta {
          color: rgba(234, 243, 255, 0.68);
          font-size: 13px;
          margin-top: 4px;
        }

        .gp-topActions {
          display: flex;
          gap: 10px;
        }

        .gp-softBtn,
        .gp-mainBtn {
          border-radius: 14px;
          cursor: pointer;
          font-weight: 900;
          border: 1px solid rgba(255,255,255,0.12);
        }

        .gp-softBtn {
          padding: 12px 16px;
          background: rgba(255,255,255,0.05);
          color: white;
        }

        .gp-mainBtn {
          padding: 15px 20px;
          background: linear-gradient(135deg, #f5c36b, #24d6ff);
          color: #050816;
          border: 0;
          box-shadow: 0 0 35px rgba(245, 195, 107, 0.18);
        }

        .gp-hero {
          margin: 22px 0 18px;
          padding: 28px;
          border-radius: 26px;
          background: rgba(0, 0, 0, 0.34);
          border: 1px solid rgba(255,255,255,0.08);
          backdrop-filter: blur(14px);
          display: flex;
          justify-content: space-between;
          gap: 20px;
          align-items: center;
        }

        .gp-badge {
          color: #f5c36b;
          font-size: 12px;
          letter-spacing: 2px;
          font-weight: 900;
          margin-bottom: 10px;
        }

        h1 {
          margin: 0;
          font-size: 46px;
          line-height: 1;
        }

        .gp-hero p {
          max-width: 660px;
          color: rgba(234,243,255,.7);
          line-height: 1.6;
          margin-bottom: 0;
        }

        .gp-card,
        .gp-metric {
          border-radius: 22px;
          background: rgba(0, 0, 0, 0.34);
          border: 1px solid rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(14px);
          padding: 20px;
        }

        .gp-grid4 {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 18px;
        }

        .gp-metric p {
          color: rgba(234,243,255,.64);
          margin: 0 0 8px;
        }

        .gp-metric h2 {
          margin: 0;
          font-size: 28px;
        }

        .gp-layout {
          display: grid;
          grid-template-columns: 1.45fr 0.85fr;
          gap: 16px;
          margin-bottom: 18px;
        }

        .gp-left,
        .gp-right {
          display: grid;
          gap: 16px;
        }

        .gp-cardHeader {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 12px;
          margin-bottom: 14px;
        }

        .gp-cardTitle {
          font-size: 22px;
          font-weight: 900;
        }

        .gp-status {
          background: rgba(62,224,137,.12);
          color: #3ee089;
          border: 1px solid rgba(62,224,137,.25);
          padding: 9px 14px;
          border-radius: 999px;
          font-weight: 900;
          font-size: 12px;
        }

        .gp-chart {
          height: 280px;
          position: relative;
          border-radius: 18px;
          overflow: hidden;
          background: rgba(255,255,255,.03);
          border: 1px solid rgba(255,255,255,.06);
        }

        .gp-chartLine {
          position: absolute;
          left: 0;
          right: 0;
          height: 1px;
          background: rgba(255,255,255,.08);
        }

        .l1 { top: 35%; }
        .l2 { top: 70%; }

        .gp-curve {
          position: absolute;
          left: 24px;
          right: 24px;
          bottom: 24px;
          height: 70%;
          background:
            linear-gradient(180deg, rgba(245,195,107,.35), transparent),
            linear-gradient(90deg, #f5c36b, #24d6ff);
          clip-path: polygon(0% 100%, 8% 82%, 16% 88%, 25% 58%, 34% 64%, 44% 35%, 55% 48%, 66% 18%, 78% 30%, 88% 8%, 100% 0, 100% 100%);
          border-radius: 16px;
        }

        .gp-calendar {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 10px;
        }

        .gp-day {
          min-height: 78px;
          border-radius: 16px;
          padding: 12px;
          background: rgba(255,255,255,.03);
          border: 1px solid rgba(255,255,255,.07);
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .gp-day b {
          color: rgba(234,243,255,.72);
        }

        .gp-day span {
          font-weight: 900;
        }

        .gp-day small {
          color: rgba(234,243,255,.55);
        }

        .gp-day.pos {
          background: linear-gradient(180deg, rgba(62,224,137,.12), rgba(0,0,0,.18));
          border-color: rgba(62,224,137,.22);
        }

        .gp-day.neg {
          background: linear-gradient(180deg, rgba(255,107,129,.12), rgba(0,0,0,.18));
          border-color: rgba(255,107,129,.22);
        }

        .gp-green { color: #3ee089; }
        .gp-red { color: #ff6b81; }

        .gp-kv {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          padding: 13px 0;
          border-bottom: 1px solid rgba(255,255,255,.08);
          color: rgba(234,243,255,.72);
        }

        .gp-kv b {
          color: white;
        }

        .gp-stats {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin-top: 14px;
        }

        .gp-stat {
          border-radius: 16px;
          background: rgba(255,255,255,.04);
          border: 1px solid rgba(255,255,255,.07);
          padding: 14px;
        }

        .gp-stat span {
          color: rgba(234,243,255,.6);
          font-size: 13px;
        }

        .gp-stat b {
          display: block;
          font-size: 22px;
          margin-top: 8px;
        }

        .gp-table {
          display: grid;
          gap: 10px;
        }

        .gp-row {
          display: grid;
          grid-template-columns: 1fr 1fr auto;
          gap: 12px;
          padding: 14px;
          border-radius: 16px;
          background: rgba(255,255,255,.04);
          border: 1px solid rgba(255,255,255,.07);
          color: rgba(234,243,255,.72);
        }

        @media(max-width: 980px) {
          .gp-topActions { display: none; }
          .gp-hero { flex-direction: column; align-items: flex-start; }
          .gp-grid4 { grid-template-columns: 1fr 1fr; }
          .gp-layout { grid-template-columns: 1fr; }
          .gp-calendar { grid-template-columns: repeat(4, 1fr); }
        }

        @media(max-width: 640px) {
          .gp-wrap { padding: 12px 12px 80px; }
          h1 { font-size: 34px; }
          .gp-grid4 { grid-template-columns: 1fr; }
          .gp-calendar { grid-template-columns: repeat(2, 1fr); }
          .gp-row { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}

function Metric({ title, value, green, red }: any) {
  return (
    <div className="gp-metric">
      <p>{title}</p>
      <h2 className={green ? "gp-green" : red ? "gp-red" : ""}>{value}</h2>
    </div>
  );
}

function KV({ label, value, green }: any) {
  return (
    <div className="gp-kv">
      <span>{label}</span>
      <b className={green ? "gp-green" : ""}>{value}</b>
    </div>
  );
}

function Stat({ label, value, green, red }: any) {
  return (
    <div className="gp-stat">
      <span>{label}</span>
      <b className={green ? "gp-green" : red ? "gp-red" : ""}>{value}</b>
    </div>
  );
}