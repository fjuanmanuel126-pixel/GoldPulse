import { useMemo, useState } from "react";

type TradeDay = {
  date: string;
  pnl: number;
  trades: number;
  lots: number;
};

type Account = {
  id: string;
  name: string;
  broker: string;
  accountNumber: string;
  status: string;
  phase: string;
  balance: number;
  equity: number;
  todayProfit: number;
  unrealized: number;
  accountSize: number;
  maxDailyLoss: number;
  maxTotalLoss: number;
  visible: boolean;
  days: TradeDay[];
};

const accounts: Account[] = [
  {
    id: "1",
    name: "FTMO Account",
    broker: "FTMO",
    accountNumber: "541241171",
    status: "Activo",
    phase: "2-Step",
    balance: 9709.63,
    equity: 9709.63,
    todayProfit: 55.12,
    unrealized: 0,
    accountSize: 10000,
    maxDailyLoss: 500,
    maxTotalLoss: 1000,
    visible: true,
    days: [
      { date: "2026-05-01", pnl: 39.66, trades: 1, lots: 0.1 },
      { date: "2026-05-04", pnl: 54.66, trades: 1, lots: 0.1 },
      { date: "2026-05-06", pnl: -145.92, trades: 2, lots: 0.2 },
      { date: "2026-05-07", pnl: 64.88, trades: 2, lots: 0.2 },
      { date: "2026-05-11", pnl: 57.04, trades: 1, lots: 0.1 },
      { date: "2026-05-12", pnl: 78.26, trades: 3, lots: 0.25 },
      { date: "2026-05-13", pnl: 89.74, trades: 6, lots: 0.6 },
      { date: "2026-05-14", pnl: 20.76, trades: 4, lots: 0.4 },
      { date: "2026-05-15", pnl: 55.12, trades: 2, lots: 0.2 },
    ],
  },
];

function money(value: number) {
  const sign = value < 0 ? "-" : "";
  return `${sign}$${Math.abs(value).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export default function BitacoraPage() {
  const [selectedId, setSelectedId] = useState(accounts[0].id);
  const selected = accounts.find((a) => a.id === selectedId) || accounts[0];

  const stats = useMemo(() => {
    const totalTrades = selected.days.reduce((a, d) => a + d.trades, 0);
    const totalLots = selected.days.reduce((a, d) => a + d.lots, 0);
    const wins = selected.days.filter((d) => d.pnl > 0);
    const losses = selected.days.filter((d) => d.pnl < 0);
    const pnl = selected.days.reduce((a, d) => a + d.pnl, 0);

    const avgWin =
      wins.length > 0 ? wins.reduce((a, d) => a + d.pnl, 0) / wins.length : 0;

    const avgLoss =
      losses.length > 0
        ? losses.reduce((a, d) => a + d.pnl, 0) / losses.length
        : 0;

    return {
      pnl,
      totalTrades,
      totalLots,
      winrate: selected.days.length
        ? (wins.length / selected.days.length) * 100
        : 0,
      avgWin,
      avgLoss,
      expectancy: selected.days.length ? pnl / selected.days.length : 0,
    };
  }, [selected]);

  const dailyLossUsed = Math.abs(
    Math.min(...selected.days.map((d) => d.pnl), 0)
  );

  const totalLossUsed = Math.max(0, selected.accountSize - selected.balance);

  const calendarDays = Array.from({ length: 31 }, (_, i) => {
    const day = i + 1;
    const found = selected.days.find((d) => {
      const date = new Date(d.date);
      return date.getUTCDate() === day;
    });

    return {
      day,
      data: found,
    };
  });

  return (
    <main className="page">
      <aside className="sidebar">
        <button className="challenge">Nuevo FTMO Challenge</button>

        <h2>Menú principal</h2>

        <nav>
          <a className="active">Resumen de Cuentas</a>
          <a>Premium</a>
          <a>Perfil</a>
          <a>MT5 Accounts</a>
          <a>Importar historial</a>
          <a>Leaderboard</a>
        </nav>
      </aside>

      <section className="content">
        <div className="breadcrumb">Trader / Resumen de Cuentas / Bitácora</div>

        <header className="hero">
          <div>
            <p className="eyebrow">GoldPulse Bitácora</p>
            <h1>Resumen de Cuentas</h1>
          </div>

          <button className="importBtn">Importar historial MT5</button>
        </header>

        <section className="accounts">
          <div className="sectionTitle">
            <span></span>
            <h2>Cuentas activas</h2>
          </div>

          {accounts.map((account) => (
            <article
              key={account.id}
              onClick={() => setSelectedId(account.id)}
              className={`accountCard ${
                selectedId === account.id ? "selected" : ""
              }`}
            >
              <div className="accountTop">
                <div>
                  <span className="badge">En curso</span>
                  <span className="pill">{account.name}</span>
                  <h3>
                    {account.phase}: <strong>{account.accountNumber}</strong>
                  </h3>
                </div>

                <div className="visible">
                  Visible <span></span>
                </div>
              </div>

              <div className="accountMeta">
                <p>
                  Balance: <strong>{money(account.balance)}</strong>
                </p>
                <p>
                  Fin: <strong>-</strong>
                </p>
                <p>
                  Estado: <strong>{account.status}</strong>
                </p>
              </div>

              <div className="miniGrid">
                <div>
                  <small>Beneficio de hoy</small>
                  <strong className="green">{money(account.todayProfit)}</strong>
                </div>
                <div>
                  <small>Capital</small>
                  <strong>{money(account.equity)}</strong>
                </div>
                <div>
                  <small>P&L no realizado</small>
                  <strong>{money(account.unrealized)}</strong>
                </div>
              </div>
            </article>
          ))}
        </section>

        <section className="detailHeader">
          <h2>Account MetriX {selected.accountNumber}</h2>

          <div className="actions">
            <button>Credenciales</button>
            <button>Actualizar</button>
            <button>Compartir</button>
            <button>Modificar cuenta</button>
          </div>
        </section>

        <section className="layout">
          <div className="left">
            <div className="card">
              <h2>Resultados Actuales</h2>

              <div className="resultGrid">
                <div>
                  <small>Balance</small>
                  <strong>{money(selected.balance)}</strong>
                </div>
                <div>
                  <small>Capital</small>
                  <strong>{money(selected.equity)}</strong>
                </div>
                <div>
                  <small>P&L no realizado</small>
                  <strong>{money(selected.unrealized)}</strong>
                </div>
              </div>

              <div className="chartMock">
                <div className="line target">
                  <span>{money(selected.accountSize)}</span>
                </div>
                <div className="bar"></div>
              </div>
            </div>

            <div className="card">
              <h2>Tus estadísticas</h2>

              <div className="statsGrid">
                <Metric title="Capital" value={money(selected.equity)} />
                <Metric title="Balance" value={money(selected.balance)} />
                <Metric
                  title="Tasa de éxito"
                  value={`${stats.winrate.toFixed(2)} %`}
                  positive
                />
                <Metric
                  title="Beneficio promedio"
                  value={money(stats.avgWin)}
                  positive
                />
                <Metric
                  title="Pérdida promedio"
                  value={money(stats.avgLoss)}
                  negative
                />
                <Metric title="Número de trades" value={`${stats.totalTrades}`} />
                <Metric title="Lotes" value={stats.totalLots.toFixed(2)} />
                <Metric title="Expectativa" value={money(stats.expectancy)} />
              </div>
            </div>
          </div>

          <aside className="right">
            <div className="card accountInfo">
              <h2>{selected.name}</h2>

              <Row label="Resultado" value="En curso" badge />
              <Row label="Estado" value={selected.status} />
              <Row label={selected.phase} value={selected.accountNumber} />
              <Row label="Tamaño de cuenta" value={money(selected.accountSize)} />
              <Row label="Balance" value={money(selected.balance)} />
            </div>

            <div className="card objectives">
              <h2>Objetivos</h2>

              <table>
                <tbody>
                  <tr>
                    <td>Pérdida Máxima Diaria</td>
                    <td>{money(-selected.maxDailyLoss)}</td>
                    <td>{money(-dailyLossUsed)}</td>
                  </tr>
                  <tr>
                    <td>Pérdida Máxima</td>
                    <td>{money(-selected.maxTotalLoss)}</td>
                    <td>{money(-totalLossUsed)}</td>
                  </tr>
                  <tr>
                    <td>Beneficio</td>
                    <td>-</td>
                    <td className="green">{money(stats.pnl)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </aside>
        </section>

        <section className="card calendarCard">
          <div className="calendarTop">
            <h2>Diario de Trading</h2>
            <div>
              <span>Estadísticas mensuales:</span>
              <strong className={stats.pnl >= 0 ? "greenBox" : "redBox"}>
                {money(stats.pnl)}
              </strong>
              <strong>Días de Trading: {selected.days.length}</strong>
            </div>
          </div>

          <h3>Mayo 2026</h3>

          <div className="calendar">
            {["LUN", "MAR", "MIE", "JUE", "VIE", "SAB", "DOM"].map((d) => (
              <div key={d} className="week">
                {d}
              </div>
            ))}

            {calendarDays.map((item) => (
              <div key={item.day} className="day">
                <span>{item.day}</span>

                {item.data && (
                  <div
                    className={`dayResult ${
                      item.data.pnl >= 0 ? "positive" : "negative"
                    }`}
                  >
                    <strong>{money(item.data.pnl)}</strong>
                    <small>Operaciones: {item.data.trades}</small>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="card dailyTable">
          <h2>Resumen Diario</h2>

          <table>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Operaciones</th>
                <th>Lotes</th>
                <th>Resultado</th>
              </tr>
            </thead>
            <tbody>
              {selected.days
                .slice()
                .reverse()
                .map((d) => (
                  <tr key={d.date}>
                    <td>{new Date(d.date).getUTCDate()}/5</td>
                    <td>{d.trades}</td>
                    <td>{d.lots}</td>
                    <td className={d.pnl >= 0 ? "green" : "red"}>
                      {money(d.pnl)}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </section>
      </section>

      <style jsx>{`
        .page {
          min-height: 100vh;
          background: #f1f1f2;
          display: flex;
          color: #111827;
          font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont,
            "Segoe UI", sans-serif;
        }

        .sidebar {
          width: 300px;
          background: #ffffff;
          border-right: 1px solid #e5e7eb;
          padding: 24px;
          position: sticky;
          top: 0;
          height: 100vh;
        }

        .challenge {
          width: 100%;
          background: #0b83ff;
          color: white;
          border: 0;
          border-radius: 5px;
          padding: 16px 20px;
          font-size: 18px;
          font-weight: 800;
          text-align: left;
          margin-bottom: 48px;
        }

        .sidebar h2 {
          font-size: 23px;
          margin-bottom: 28px;
        }

        nav {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        nav a {
          padding: 17px 14px;
          border-radius: 10px;
          color: #111;
          font-weight: 600;
          cursor: pointer;
        }

        nav a.active,
        nav a:hover {
          background: #f0f7ff;
          color: #0078ff;
        }

        .content {
          flex: 1;
          padding: 28px 36px 60px;
          max-width: 1500px;
        }

        .breadcrumb {
          color: #718096;
          font-weight: 600;
          margin-bottom: 22px;
        }

        .hero {
          background: white;
          border-radius: 6px;
          padding: 26px 32px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .eyebrow {
          color: #00bfa6;
          font-weight: 800;
          margin: 0 0 6px;
        }

        h1 {
          margin: 0;
          font-size: 32px;
        }

        .importBtn,
        .actions button {
          background: white;
          border: 1px solid #9ca3af;
          border-radius: 5px;
          padding: 14px 24px;
          font-weight: 800;
          font-size: 16px;
          cursor: pointer;
        }

        .sectionTitle {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;
        }

        .sectionTitle span {
          width: 8px;
          height: 8px;
          background: #00c8b5;
          border-radius: 99px;
          box-shadow: 0 0 0 6px rgba(0, 200, 181, 0.12);
        }

        .sectionTitle h2 {
          margin: 0;
        }

        .accountCard,
        .card,
        .detailHeader {
          background: white;
          border-radius: 6px;
          padding: 24px;
          margin-bottom: 24px;
        }

        .accountCard {
          cursor: pointer;
          border: 2px solid transparent;
        }

        .accountCard.selected {
          border-color: #00c8b5;
        }

        .accountTop {
          display: flex;
          justify-content: space-between;
          gap: 20px;
        }

        .badge {
          background: #00c8b5;
          color: white;
          padding: 7px 14px;
          border-radius: 99px;
          font-weight: 800;
          margin-right: 8px;
        }

        .pill {
          border: 1px solid #00a8e8;
          color: #00a8e8;
          padding: 7px 14px;
          border-radius: 99px;
          font-weight: 800;
        }

        .accountTop h3 {
          font-size: 22px;
          margin: 20px 0;
        }

        .visible {
          font-size: 20px;
          color: #6b7280;
          font-weight: 800;
          display: flex;
          gap: 12px;
          align-items: start;
        }

        .visible span {
          width: 54px;
          height: 30px;
          background: #1683ff;
          border-radius: 99px;
          display: block;
        }

        .accountMeta {
          border-top: 1px solid #e5e7eb;
          padding-top: 18px;
          display: flex;
          gap: 42px;
          color: #6b7280;
          font-size: 18px;
        }

        .accountMeta strong {
          color: #111;
        }

        .miniGrid,
        .resultGrid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          margin-top: 20px;
        }

        .miniGrid div,
        .resultGrid div,
        .statsGrid div {
          background: #f0f0f1;
          border-radius: 6px;
          padding: 18px;
          text-align: center;
        }

        small {
          display: block;
          color: #6b7280;
          font-weight: 700;
          margin-bottom: 10px;
          font-size: 15px;
        }

        strong {
          font-size: 18px;
        }

        .green {
          color: #00bfa6;
        }

        .red {
          color: #ff3045;
        }

        .detailHeader h2 {
          font-size: 28px;
          margin: 0 0 24px;
        }

        .actions {
          display: flex;
          gap: 14px;
          flex-wrap: wrap;
        }

        .layout {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 24px;
        }

        .card h2 {
          margin: 0 0 22px;
          font-size: 24px;
        }

        .chartMock {
          height: 240px;
          margin-top: 28px;
          background: linear-gradient(180deg, #fff, #fafafa);
          border-left: 1px solid #d1d5db;
          border-bottom: 1px solid #d1d5db;
          position: relative;
          overflow: hidden;
        }

        .target {
          position: absolute;
          top: 85px;
          left: 0;
          right: 0;
          border-top: 1px dashed #111;
        }

        .target span {
          background: #111;
          color: white;
          padding: 4px 8px;
          font-weight: 800;
        }

        .bar {
          position: absolute;
          left: 90px;
          top: 86px;
          width: 320px;
          height: 154px;
          background: rgba(255, 48, 69, 0.25);
        }

        .statsGrid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }

        .accountInfo .row {
          display: flex;
          justify-content: space-between;
          padding: 20px 0;
          border-bottom: 1px solid #e5e7eb;
          font-size: 18px;
        }

        .rowLabel {
          color: #6b7280;
          font-weight: 700;
        }

        .statusBadge {
          background: #00c8b5;
          color: white;
          padding: 8px 14px;
          border-radius: 99px;
          font-size: 14px;
          font-weight: 900;
        }

        table {
          width: 100%;
          border-collapse: collapse;
        }

        th,
        td {
          padding: 18px 14px;
          border-bottom: 1px solid #e5e7eb;
          text-align: left;
          font-size: 17px;
        }

        th {
          color: #6b7280;
        }

        .objectives td:first-child {
          color: #0078ff;
          font-weight: 700;
        }

        .calendarTop {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
        }

        .calendarTop div {
          display: flex;
          gap: 12px;
          align-items: center;
          flex-wrap: wrap;
        }

        .greenBox {
          background: rgba(0, 200, 181, 0.12);
          color: #00bfa6;
          padding: 8px 12px;
          border-radius: 6px;
        }

        .redBox {
          background: rgba(255, 48, 69, 0.1);
          color: #ff3045;
          padding: 8px 12px;
          border-radius: 6px;
        }

        .calendarCard h3 {
          text-align: center;
          font-size: 24px;
        }

        .calendar {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          border: 1px solid #e5e7eb;
        }

        .week {
          padding: 12px;
          color: #9ca3af;
          font-weight: 900;
          border-right: 1px solid #e5e7eb;
          border-bottom: 1px solid #e5e7eb;
        }

        .day {
          min-height: 110px;
          padding: 12px;
          border-right: 1px solid #e5e7eb;
          border-bottom: 1px solid #e5e7eb;
          color: #6b7280;
        }

        .dayResult {
          margin-top: 20px;
          padding: 10px;
          border-radius: 6px;
        }

        .dayResult.positive {
          background: rgba(0, 200, 181, 0.12);
        }

        .dayResult.negative {
          background: rgba(255, 48, 69, 0.1);
        }

        .dayResult strong {
          display: block;
          color: inherit;
          margin-bottom: 6px;
        }

        .dayResult.positive strong {
          color: #00bfa6;
        }

        .dayResult.negative strong {
          color: #ff3045;
        }

        @media (max-width: 1100px) {
          .page {
            flex-direction: column;
          }

          .sidebar {
            width: auto;
            height: auto;
            position: relative;
          }

          .layout,
          .miniGrid,
          .resultGrid,
          .statsGrid {
            grid-template-columns: 1fr;
          }

          .calendar {
            grid-template-columns: repeat(2, 1fr);
          }

          .hero,
          .accountTop,
          .calendarTop {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>
    </main>
  );
}

function Metric({
  title,
  value,
  positive,
  negative,
}: {
  title: string;
  value: string;
  positive?: boolean;
  negative?: boolean;
}) {
  return (
    <div>
      <small>{title}</small>
      <strong className={positive ? "green" : negative ? "red" : ""}>
        {value}
      </strong>
    </div>
  );
}

function Row({
  label,
  value,
  badge,
}: {
  label: string;
  value: string;
  badge?: boolean;
}) {
  return (
    <div className="row">
      <span className="rowLabel">{label}:</span>
      {badge ? <span className="statusBadge">{value}</span> : <strong>{value}</strong>}
    </div>
  );
}