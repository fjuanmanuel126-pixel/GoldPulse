import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";

type Account = {
  id: string;
  name: string;
  broker: string;
  accountNumber: string;
  initialBalance: number;
  balance: number;
  equity: number;
  maxDailyLoss: number;
  maxTotalLoss: number;
  createdAt: number;
};

const KEY = "goldpulse_mt5_accounts_v1";

const demo: Account[] = [
  {
    id: "ftmo-demo",
    name: "FTMO Challenge 10K",
    broker: "FTMO",
    accountNumber: "541241171",
    initialBalance: 10000,
    balance: 9709.63,
    equity: 9709.63,
    maxDailyLoss: 500,
    maxTotalLoss: 1000,
    createdAt: Date.now(),
  },
];

const daily = [
  { day: 1, pnl: 39.66, trades: 1 },
  { day: 4, pnl: 54.66, trades: 1 },
  { day: 6, pnl: -145.92, trades: 2 },
  { day: 7, pnl: 64.88, trades: 2 },
  { day: 11, pnl: 57.04, trades: 1 },
  { day: 12, pnl: 78.26, trades: 3 },
  { day: 13, pnl: 89.74, trades: 6 },
  { day: 14, pnl: 20.76, trades: 4 },
  { day: 15, pnl: 55.12, trades: 2 },
];

function money(v: number) {
  const sign = v > 0 ? "+" : v < 0 ? "-" : "";
  return `${sign}$${Math.abs(v).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export default function BitacoraPage() {
  const router = useRouter();
  const [accounts, setAccounts] = useState<Account[]>(demo);
  const [selectedId, setSelectedId] = useState("ftmo-demo");
  const [showNew, setShowNew] = useState(false);

  const selected = accounts.find((a) => a.id === selectedId) || accounts[0];

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length) {
          setAccounts(parsed);
          setSelectedId(parsed[0].id);
        }
      }
    } catch {}
  }, []);

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(accounts));
  }, [accounts]);

  const stats = useMemo(() => {
    const profit = selected.balance - selected.initialBalance;
    const dd = selected.initialBalance - selected.balance;
    const wins = daily.filter((d) => d.pnl > 0).length;
    const losses = daily.filter((d) => d.pnl < 0).length;
    const trades = daily.reduce((a, b) => a + b.trades, 0);

    return {
      profit,
      dd,
      wins,
      losses,
      trades,
      winrate: daily.length ? (wins / daily.length) * 100 : 0,
    };
  }, [selected]);

  function addAccount(e: any) {
    e.preventDefault();

    const form = new FormData(e.currentTarget);

    const newAccount: Account = {
      id: crypto.randomUUID(),
      name: String(form.get("name") || "Nueva cuenta"),
      broker: String(form.get("broker") || "MT5"),
      accountNumber: String(form.get("accountNumber") || ""),
      initialBalance: Number(form.get("initialBalance") || 0),
      balance: Number(form.get("initialBalance") || 0),
      equity: Number(form.get("initialBalance") || 0),
      maxDailyLoss: Number(form.get("maxDailyLoss") || 0),
      maxTotalLoss: Number(form.get("maxTotalLoss") || 0),
      createdAt: Date.now(),
    };

    setAccounts((prev) => [newAccount, ...prev]);
    setSelectedId(newAccount.id);
    setShowNew(false);
  }

  return (
    <main className="gp-page">
      <div className="gp-bg" />

      <div className="gp-wrap">
        <header className="gp-topbar">
          <div className="gp-brand">
            <img src="/branding/logo.png" />
            <div>
              <strong>GoldPulse Bitácora</strong>
              <span>MT5 Account MetriX</span>
            </div>
          </div>

          <nav>
            <button onClick={() => router.push("/dashboard")}>Dashboard</button>
            <button onClick={() => router.push("/analyze")}>Analyze</button>
            <button onClick={() => router.push("/diary")}>Diario</button>
          </nav>
        </header>

        <section className="gp-hero">
          <div>
            <span className="gp-badge">CONTROL REAL DE CUENTAS MT5</span>
            <h1>Bitácora PRO</h1>
            <p>
              Crea cuentas, carga historial manualmente y prepara la estructura
              para automatizar después desde MetaTrader 5.
            </p>
          </div>

          <div className="gp-actions">
            <button className="gold" onClick={() => setShowNew(true)}>
              + Nueva cuenta
            </button>
            <button className="blue">Importar historial MT5</button>
          </div>
        </section>

        {showNew && (
          <form className="gp-card gp-form" onSubmit={addAccount}>
            <h2>Nueva cuenta MT5</h2>

            <input name="name" placeholder="Nombre: FTMO 10K" required />
            <input name="broker" placeholder="Broker / Prop firm" required />
            <input name="accountNumber" placeholder="Número de cuenta" />
            <input name="initialBalance" type="number" placeholder="Balance inicial" required />
            <input name="maxDailyLoss" type="number" placeholder="Pérdida máxima diaria" />
            <input name="maxTotalLoss" type="number" placeholder="Pérdida máxima total" />

            <div className="gp-actions">
              <button className="gold" type="submit">Guardar cuenta</button>
              <button type="button" onClick={() => setShowNew(false)}>Cancelar</button>
            </div>
          </form>
        )}

        <section className="gp-accountList">
          {accounts.map((acc) => (
            <button
              key={acc.id}
              className={acc.id === selectedId ? "active" : ""}
              onClick={() => setSelectedId(acc.id)}
            >
              <span>{acc.name}</span>
              <small>{acc.broker} · {acc.accountNumber || "Sin número"}</small>
            </button>
          ))}
        </section>

        <section className="gp-grid4">
          <Metric title="Balance" value={money(selected.balance).replace("+", "")} />
          <Metric title="Equity" value={money(selected.equity).replace("+", "")} />
          <Metric title="Profit actual" value={money(stats.profit)} green={stats.profit >= 0} red={stats.profit < 0} />
          <Metric title="Drawdown" value={money(-stats.dd)} red />
        </section>

        <section className="gp-layout">
          <div className="gp-left">
            <div className="gp-card">
              <div className="gp-cardTop">
                <div>
                  <span className="gp-mini">Cuenta activa</span>
                  <h2>{selected.name}</h2>
                  <p>{selected.broker} · {selected.accountNumber}</p>
                </div>
                <strong className="status">ACTIVA</strong>
              </div>

              <div className="gp-chart">
                <div className="curve" />
              </div>
            </div>

            <div className="gp-card">
              <div className="gp-cardTop">
                <div>
                  <span className="gp-mini">Trading Calendar</span>
                  <h2>Mayo 2026</h2>
                </div>
                <strong className="green">{money(daily.reduce((a, b) => a + b.pnl, 0))}</strong>
              </div>

              <div className="calendar">
                {Array.from({ length: 31 }, (_, i) => {
                  const day = i + 1;
                  const found = daily.find((d) => d.day === day);

                  return (
                    <div
                      key={day}
                      className={`day ${
                        found?.pnl && found.pnl > 0 ? "pos" : found?.pnl && found.pnl < 0 ? "neg" : ""
                      }`}
                    >
                      <b>{day}</b>
                      {found && (
                        <>
                          <strong>{money(found.pnl)}</strong>
                          <small>{found.trades} ops</small>
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
              <span className="gp-mini">Objetivos</span>
              <h2>Estado de cuenta</h2>

              <Row label="Balance inicial" value={money(selected.initialBalance).replace("+", "")} />
              <Row label="Pérdida máxima diaria" value={money(-selected.maxDailyLoss)} />
              <Row label="Pérdida máxima total" value={money(-selected.maxTotalLoss)} />
              <Row label="Profit actual" value={money(stats.profit)} green={stats.profit >= 0} />
            </div>

            <div className="gp-card">
              <span className="gp-mini">Estadísticas</span>
              <h2>Métricas</h2>

              <div className="stats">
                <Stat label="Winrate" value={`${stats.winrate.toFixed(1)}%`} />
                <Stat label="Trades" value={String(stats.trades)} />
                <Stat label="Días ganados" value={String(stats.wins)} green />
                <Stat label="Días perdidos" value={String(stats.losses)} red />
              </div>
            </div>
          </aside>
        </section>
      </div>

      <style jsx>{`
        .gp-page {
          min-height: 100vh;
          background: #050816;
          color: #eaf3ff;
          font-family: Inter, Arial, sans-serif;
          position: relative;
          overflow-x: hidden;
        }

        .gp-bg {
          position: fixed;
          inset: 0;
          background:
            radial-gradient(circle at 20% 10%, rgba(245,195,107,.22), transparent 28%),
            radial-gradient(circle at 75% 20%, rgba(36,214,255,.18), transparent 30%),
            radial-gradient(circle at 50% 100%, rgba(0,255,180,.10), transparent 35%),
            linear-gradient(180deg, #07111f, #02040b);
          pointer-events: none;
        }

        .gp-wrap {
          max-width: 1180px;
          margin: 0 auto;
          padding: 18px 16px 90px;
          position: relative;
          z-index: 1;
        }

        .gp-topbar,
        .gp-card,
        .gp-hero {
          background: rgba(0,0,0,.38);
          border: 1px solid rgba(255,255,255,.09);
          backdrop-filter: blur(16px);
          box-shadow: 0 20px 70px rgba(0,0,0,.35);
        }

        .gp-topbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-radius: 22px;
          padding: 12px 14px;
          margin-bottom: 20px;
        }

        .gp-brand {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .gp-brand img {
          height: 52px;
        }

        .gp-brand strong {
          display: block;
          font-size: 18px;
        }

        .gp-brand span,
        .gp-card p,
        .gp-mini,
        small {
          color: rgba(234,243,255,.62);
        }

        nav,
        .gp-actions {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        button {
          border: 1px solid rgba(255,255,255,.12);
          background: rgba(255,255,255,.06);
          color: white;
          padding: 12px 16px;
          border-radius: 14px;
          font-weight: 800;
          cursor: pointer;
        }

        .gold {
          background: linear-gradient(135deg, #f5c36b, #24d6ff);
          color: #050816;
          border: 0;
        }

        .blue {
          background: rgba(36,214,255,.12);
          border-color: rgba(36,214,255,.25);
        }

        .gp-hero {
          border-radius: 28px;
          padding: 32px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 24px;
          margin-bottom: 18px;
        }

        .gp-badge {
          color: #f5c36b;
          letter-spacing: 2px;
          font-size: 12px;
          font-weight: 900;
        }

        h1 {
          font-size: 54px;
          margin: 8px 0;
          line-height: 1;
        }

        h2 {
          margin: 6px 0;
          font-size: 26px;
        }

        .gp-hero p {
          max-width: 650px;
          line-height: 1.6;
          color: rgba(234,243,255,.7);
        }

        .gp-form {
          display: grid;
          gap: 12px;
          margin-bottom: 18px;
        }

        input {
          background: rgba(255,255,255,.06);
          border: 1px solid rgba(255,255,255,.12);
          color: white;
          padding: 14px;
          border-radius: 14px;
          outline: none;
        }

        .gp-accountList {
          display: flex;
          gap: 12px;
          overflow-x: auto;
          margin-bottom: 18px;
          padding-bottom: 4px;
        }

        .gp-accountList button {
          min-width: 230px;
          text-align: left;
        }

        .gp-accountList button span {
          display: block;
          font-weight: 900;
        }

        .gp-accountList button.active {
          border-color: rgba(245,195,107,.55);
          background: rgba(245,195,107,.12);
        }

        .gp-grid4 {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 18px;
        }

        .metric {
          border-radius: 22px;
          padding: 20px;
          background: rgba(0,0,0,.38);
          border: 1px solid rgba(255,255,255,.09);
        }

        .metric span {
          color: rgba(234,243,255,.62);
        }

        .metric strong {
          display: block;
          font-size: 30px;
          margin-top: 8px;
        }

        .gp-layout {
          display: grid;
          grid-template-columns: 1.45fr .85fr;
          gap: 18px;
        }

        .gp-left,
        .gp-right {
          display: grid;
          gap: 18px;
        }

        .gp-card {
          border-radius: 24px;
          padding: 22px;
        }

        .gp-cardTop {
          display: flex;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 18px;
        }

        .status {
          color: #3ee089;
          background: rgba(62,224,137,.12);
          border: 1px solid rgba(62,224,137,.25);
          padding: 10px 14px;
          border-radius: 999px;
          height: fit-content;
        }

        .gp-chart {
          height: 300px;
          position: relative;
          overflow: hidden;
          border-radius: 20px;
          background:
            linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px);
          background-size: 42px 42px;
        }

        .curve {
          position: absolute;
          left: 26px;
          right: 26px;
          bottom: 26px;
          height: 68%;
          background:
            linear-gradient(180deg, rgba(245,195,107,.40), transparent),
            linear-gradient(90deg, #f5c36b, #24d6ff);
          clip-path: polygon(0% 100%, 8% 82%, 16% 88%, 25% 58%, 34% 64%, 44% 35%, 55% 48%, 66% 18%, 78% 30%, 88% 8%, 100% 0, 100% 100%);
          border-radius: 18px;
        }

        .calendar {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 10px;
        }

        .day {
          min-height: 82px;
          border-radius: 16px;
          padding: 12px;
          background: rgba(255,255,255,.04);
          border: 1px solid rgba(255,255,255,.08);
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .day.pos {
          background: rgba(62,224,137,.10);
          border-color: rgba(62,224,137,.22);
        }

        .day.neg {
          background: rgba(255,107,129,.10);
          border-color: rgba(255,107,129,.22);
        }

        .green { color: #3ee089 !important; }
        .red { color: #ff6b81 !important; }

        .row {
          display: flex;
          justify-content: space-between;
          padding: 15px 0;
          border-bottom: 1px solid rgba(255,255,255,.08);
        }

        .stats {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-top: 16px;
        }

        .stat {
          background: rgba(255,255,255,.05);
          border: 1px solid rgba(255,255,255,.08);
          border-radius: 16px;
          padding: 14px;
        }

        .stat b {
          display: block;
          font-size: 22px;
          margin-top: 8px;
        }

        @media(max-width: 900px) {
          .gp-topbar,
          .gp-hero,
          .gp-cardTop {
            flex-direction: column;
            align-items: flex-start;
          }

          nav {
            display: none;
          }

          .gp-grid4,
          .gp-layout {
            grid-template-columns: 1fr;
          }

          .calendar {
            grid-template-columns: repeat(2, 1fr);
          }

          h1 {
            font-size: 38px;
          }
        }
      `}</style>
    </main>
  );
}

function Metric({ title, value, green, red }: any) {
  return (
    <div className="metric">
      <span>{title}</span>
      <strong className={green ? "green" : red ? "red" : ""}>{value}</strong>
    </div>
  );
}

function Row({ label, value, green }: any) {
  return (
    <div className="row">
      <span>{label}</span>
      <b className={green ? "green" : ""}>{value}</b>
    </div>
  );
}

function Stat({ label, value, green, red }: any) {
  return (
    <div className="stat">
      <span>{label}</span>
      <b className={green ? "green" : red ? "red" : ""}>{value}</b>
    </div>
  );
}