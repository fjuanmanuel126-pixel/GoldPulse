export default function BitacoraPage() {
  return (
    <main className="page">
      <section className="hero">
        <div>
          <p className="badge">GOLDPULSE BITÁCORA PRO</p>
          <h1>Account MetriX</h1>
          <p className="sub">
            Panel manual para cargar historial MT5, revisar cuentas independientes,
            métricas, drawdown, calendario y resultados.
          </p>
        </div>

        <button>Importar historial MT5</button>
      </section>

      <section className="cards">
        <Card title="Balance" value="$9,709.63" />
        <Card title="Equity" value="$9,709.63" />
        <Card title="Profit Hoy" value="+$55.12" green />
        <Card title="Drawdown" value="-2.9%" red />
      </section>

      <section className="grid">
        <div className="panel big">
          <div className="top">
            <div>
              <p className="mini">Cuenta activa</p>
              <h2>FTMO Challenge 10K</h2>
            </div>
            <span className="active">ACTIVA</span>
          </div>

          <div className="chart">
            <div className="curve" />
          </div>
        </div>

        <div className="panel">
          <p className="mini">Objetivos</p>
          <h2>Estado de cuenta</h2>

          <Row label="Pérdida diaria" value="-$500" />
          <Row label="Pérdida total" value="-$1,000" />
          <Row label="Profit actual" value="+$314.22" green />
          <Row label="Cuenta inicial" value="$10,000" />
        </div>
      </section>

      <section className="panel">
        <div className="top">
          <div>
            <p className="mini">Trading Calendar</p>
            <h2>Mayo 2026</h2>
          </div>
          <strong className="green">+$314.22</strong>
        </div>

        <div className="calendar">
          {Array.from({ length: 31 }, (_, i) => {
            const day = i + 1;
            const positive = [1, 4, 7, 12, 15].includes(day);
            const negative = day === 6;

            return (
              <div
                key={day}
                className={`day ${positive ? "pos" : ""} ${negative ? "neg" : ""}`}
              >
                <b>{day}</b>
                {positive && <span>+$55</span>}
                {negative && <span>-$145</span>}
              </div>
            );
          })}
        </div>
      </section>

      <style jsx>{`
        .page {
          min-height: 100vh;
          padding: 40px;
          color: white;
          background:
            radial-gradient(circle at 20% 20%, rgba(245, 195, 107, 0.18), transparent 28%),
            radial-gradient(circle at 80% 10%, rgba(36, 214, 255, 0.16), transparent 30%),
            radial-gradient(circle at 50% 100%, rgba(0, 255, 180, 0.08), transparent 35%),
            #050816;
          font-family: Inter, Arial, sans-serif;
        }

        .hero {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 24px;
          padding: 32px;
          border-radius: 28px;
          background: rgba(255, 255, 255, 0.045);
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 20px 80px rgba(0, 0, 0, 0.45);
          backdrop-filter: blur(18px);
          margin-bottom: 24px;
        }

        .badge {
          color: #f5c36b;
          letter-spacing: 2px;
          font-size: 12px;
          font-weight: 900;
        }

        h1 {
          font-size: 58px;
          margin: 0;
          line-height: 1;
        }

        .sub {
          max-width: 650px;
          color: rgba(255, 255, 255, 0.68);
          line-height: 1.6;
          font-size: 17px;
        }

        button {
          border: 0;
          padding: 16px 22px;
          border-radius: 16px;
          font-weight: 900;
          cursor: pointer;
          background: linear-gradient(135deg, #f5c36b, #24d6ff);
          color: #050816;
          box-shadow: 0 0 36px rgba(245, 195, 107, 0.22);
        }

        .cards {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 24px;
        }

        .card,
        .panel {
          background: rgba(255, 255, 255, 0.045);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 24px;
          padding: 24px;
          box-shadow: 0 20px 70px rgba(0, 0, 0, 0.32);
          backdrop-filter: blur(18px);
        }

        .card p,
        .mini {
          color: rgba(255, 255, 255, 0.55);
          margin: 0 0 8px;
        }

        .card h2 {
          font-size: 32px;
          margin: 0;
        }

        .grid {
          display: grid;
          grid-template-columns: 1.5fr 0.9fr;
          gap: 24px;
          margin-bottom: 24px;
        }

        .top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          margin-bottom: 20px;
        }

        h2 {
          margin: 0;
          font-size: 28px;
        }

        .active {
          color: #3ee089;
          background: rgba(62, 224, 137, 0.12);
          border: 1px solid rgba(62, 224, 137, 0.24);
          padding: 10px 14px;
          border-radius: 999px;
          font-weight: 900;
          font-size: 12px;
        }

        .chart {
          height: 310px;
          position: relative;
          overflow: hidden;
          border-radius: 20px;
          background:
            linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px);
          background-size: 42px 42px;
        }

        .curve {
          position: absolute;
          left: 28px;
          right: 28px;
          bottom: 28px;
          height: 68%;
          border-radius: 18px;
          background:
            linear-gradient(180deg, rgba(245,195,107,.40), transparent),
            linear-gradient(90deg, #f5c36b, #24d6ff);
          clip-path: polygon(0% 100%, 8% 82%, 16% 88%, 25% 58%, 34% 64%, 44% 35%, 55% 48%, 66% 18%, 78% 30%, 88% 8%, 100% 0, 100% 100%);
        }

        .row {
          display: flex;
          justify-content: space-between;
          padding: 16px 0;
          border-bottom: 1px solid rgba(255,255,255,0.09);
          color: rgba(255,255,255,0.68);
        }

        .row b {
          color: white;
        }

        .green {
          color: #3ee089 !important;
        }

        .red {
          color: #ff6b81 !important;
        }

        .calendar {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 12px;
        }

        .day {
          min-height: 86px;
          padding: 12px;
          border-radius: 16px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .day b {
          color: rgba(255,255,255,0.7);
        }

        .day span {
          font-weight: 900;
        }

        .day.pos {
          background: rgba(62,224,137,0.11);
          border-color: rgba(62,224,137,0.24);
        }

        .day.pos span {
          color: #3ee089;
        }

        .day.neg {
          background: rgba(255,107,129,0.11);
          border-color: rgba(255,107,129,0.24);
        }

        .day.neg span {
          color: #ff6b81;
        }

        @media (max-width: 900px) {
          .hero,
          .top {
            flex-direction: column;
            align-items: flex-start;
          }

          .cards,
          .grid {
            grid-template-columns: 1fr;
          }

          .calendar {
            grid-template-columns: repeat(2, 1fr);
          }

          h1 {
            font-size: 40px;
          }

          .page {
            padding: 20px;
          }
        }
      `}</style>
    </main>
  );
}

function Card({
  title,
  value,
  green,
  red,
}: {
  title: string;
  value: string;
  green?: boolean;
  red?: boolean;
}) {
  return (
    <div className="card">
      <p>{title}</p>
      <h2 className={green ? "green" : red ? "red" : ""}>{value}</h2>
    </div>
  );
}

function Row({
  label,
  value,
  green,
}: {
  label: string;
  value: string;
  green?: boolean;
}) {
  return (
    <div className="row">
      <span>{label}</span>
      <b className={green ? "green" : ""}>{value}</b>
    </div>
  );
}