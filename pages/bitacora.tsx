export default function BitacoraPage() {
  return (
    <main className="page">
      <div className="overlay" />

      <section className="hero">
        <div>
          <p className="eyebrow">GOLDPULSE BITÁCORA</p>

          <h1>
            Trading Journal <span>PRO</span>
          </h1>

          <p className="sub">
            Panel avanzado de métricas, estadísticas y seguimiento
            profesional para cuentas MT5.
          </p>
        </div>

        <button className="connectBtn">
          Conectar cuenta MT5
        </button>
      </section>

      <section className="topGrid">
        <Card
          title="Balance"
          value="$9,709.63"
        />

        <Card
          title="Equity"
          value="$9,709.63"
        />

        <Card
          title="Beneficio Hoy"
          value="+$55.12"
          green
        />

        <Card
          title="Drawdown"
          value="-3.1%"
          red
        />
      </section>

      <section className="layout">
        <div className="left">
          <div className="panel">
            <div className="panelTop">
              <div>
                <p className="mini">Cuenta activa</p>

                <h2>FTMO Challenge 10K</h2>
              </div>

              <div className="status">
                ACTIVA
              </div>
            </div>

            <div className="chart">
              <div className="line line1"></div>
              <div className="line line2"></div>

              <div className="fakeChart">
                <div className="curve"></div>
              </div>
            </div>
          </div>

          <div className="panel">
            <div className="panelTop">
              <div>
                <p className="mini">Trading Calendar</p>
                <h2>Mayo 2026</h2>
              </div>

              <div className="profitMonth">
                +$314.22
              </div>
            </div>

            <div className="calendar">
              {Array.from({ length: 31 }, (_, i) => (
                <div
                  key={i}
                  className={`day ${
                    i === 5
                      ? "negative"
                      : [1, 4, 7, 12, 15].includes(i)
                      ? "positive"
                      : ""
                  }`}
                >
                  <strong>{i + 1}</strong>

                  {[1, 4, 7, 12, 15].includes(i) && (
                    <span>+$55</span>
                  )}

                  {i === 5 && (
                    <span>-$145</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside className="right">
          <div className="panel">
            <p className="mini">
              Objetivos
            </p>

            <h2>Estado de cuenta</h2>

            <div className="objective">
              <span>Pérdida máxima diaria</span>
              <strong>-$500</strong>
            </div>

            <div className="objective">
              <span>Pérdida máxima total</span>
              <strong>-$1,000</strong>
            </div>

            <div className="objective">
              <span>Profit actual</span>

              <strong className="green">
                +$314.22
              </strong>
            </div>
          </div>

          <div className="panel">
            <p className="mini">
              Estadísticas
            </p>

            <h2>Métricas</h2>

            <div className="stats">
              <Stat
                label="Winrate"
                value="68%"
              />

              <Stat
                label="Trades"
                value="42"
              />

              <Stat
                label="Profit Factor"
                value="2.3"
              />

              <Stat
                label="Lotes"
                value="4.21"
              />

              <Stat
                label="Avg Win"
                value="+$72"
                green
              />

              <Stat
                label="Avg Loss"
                value="-$31"
                red
              />
            </div>
          </div>
        </aside>
      </section>

      <style jsx>{`
        .page {
          min-height: 100vh;
          background:
            radial-gradient(circle at top left, rgba(0,255,200,0.08), transparent 30%),
            radial-gradient(circle at top right, rgba(0,140,255,0.10), transparent 30%),
            #050816;

          color: white;
          padding: 40px;
          position: relative;
          overflow: hidden;
          font-family: Inter, sans-serif;
        }

        .overlay {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);

          background-size: 40px 40px;
          opacity: 0.2;
          pointer-events: none;
        }

        .hero {
          position: relative;
          z-index: 2;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 35px;
          gap: 30px;
        }

        .eyebrow {
          color: #00ffd0;
          letter-spacing: 2px;
          font-size: 13px;
          font-weight: 800;
          margin-bottom: 12px;
        }

        h1 {
          font-size: 58px;
          margin: 0;
          font-weight: 900;
          line-height: 1;
        }

        h1 span {
          color: #00ffd0;
        }

        .sub {
          max-width: 620px;
          color: rgba(255,255,255,0.65);
          margin-top: 18px;
          font-size: 18px;
          line-height: 1.6;
        }

        .connectBtn {
          background: linear-gradient(135deg,#00ffd0,#0095ff);
          border: none;
          color: black;
          font-weight: 800;
          padding: 18px 28px;
          border-radius: 16px;
          font-size: 16px;
          cursor: pointer;
          box-shadow: 0 0 30px rgba(0,255,208,0.25);
        }

        .topGrid {
          position: relative;
          z-index: 2;
          display: grid;
          grid-template-columns: repeat(4,1fr);
          gap: 20px;
          margin-bottom: 24px;
        }

        .card,
        .panel {
          background: rgba(15,23,42,0.72);
          border: 1px solid rgba(255,255,255,0.08);
          backdrop-filter: blur(18px);
          border-radius: 24px;
          padding: 24px;
          box-shadow:
            0 10px 40px rgba(0,0,0,0.35),
            inset 0 1px rgba(255,255,255,0.06);
        }

        .card p {
          color: rgba(255,255,255,0.55);
          margin-bottom: 12px;
        }

        .card h2 {
          margin: 0;
          font-size: 34px;
        }

        .green {
          color: #00ffbf;
        }

        .red {
          color: #ff4d6d;
        }

        .layout {
          position: relative;
          z-index: 2;
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 24px;
        }

        .left,
        .right {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .panelTop {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 28px;
        }

        .mini {
          color: rgba(255,255,255,0.45);
          text-transform: uppercase;
          letter-spacing: 1px;
          font-size: 12px;
          margin-bottom: 8px;
        }

        .panel h2 {
          margin: 0;
          font-size: 28px;
        }

        .status {
          background: rgba(0,255,191,0.15);
          color: #00ffbf;
          padding: 12px 18px;
          border-radius: 999px;
          font-weight: 800;
          border: 1px solid rgba(0,255,191,0.25);
        }

        .chart {
          height: 320px;
          border-radius: 18px;
          position: relative;
          overflow: hidden;
          background:
            linear-gradient(180deg, rgba(255,255,255,0.03), transparent);
        }

        .line {
          position: absolute;
          left: 0;
          right: 0;
          height: 1px;
          background: rgba(255,255,255,0.08);
        }

        .line1 {
          top: 35%;
        }

        .line2 {
          top: 70%;
        }

        .fakeChart {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: flex-end;
          padding: 30px;
        }

        .curve {
          width: 100%;
          height: 70%;
          border-radius: 18px;
          background:
            linear-gradient(180deg, rgba(0,255,208,0.35), transparent),
            linear-gradient(90deg,#00ffd0,#008cff);

          clip-path: polygon(
            0% 100%,
            5% 85%,
            10% 88%,
            18% 60%,
            25% 64%,
            32% 40%,
            40% 50%,
            48% 20%,
            58% 35%,
            66% 10%,
            75% 18%,
            82% 5%,
            100% 0,
            100% 100%
          );

          opacity: 0.95;
        }

        .profitMonth {
          color: #00ffbf;
          font-size: 24px;
          font-weight: 800;
        }

        .calendar {
          display: grid;
          grid-template-columns: repeat(7,1fr);
          gap: 12px;
        }

        .day {
          min-height: 90px;
          border-radius: 16px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.05);
          padding: 12px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .day strong {
          color: rgba(255,255,255,0.65);
        }

        .day span {
          font-size: 14px;
          font-weight: 800;
        }

        .day.positive {
          background: rgba(0,255,191,0.08);
          border-color: rgba(0,255,191,0.15);
        }

        .day.positive span {
          color: #00ffbf;
        }

        .day.negative {
          background: rgba(255,77,109,0.08);
          border-color: rgba(255,77,109,0.18);
        }

        .day.negative span {
          color: #ff4d6d;
        }

        .objective {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 18px 0;
          border-bottom: 1px solid rgba(255,255,255,0.08);
        }

        .objective span {
          color: rgba(255,255,255,0.65);
        }

        .objective strong {
          font-size: 18px;
        }

        .stats {
          display: grid;
          grid-template-columns: repeat(2,1fr);
          gap: 16px;
          margin-top: 20px;
        }

        .stat {
          background: rgba(255,255,255,0.03);
          border-radius: 18px;
          padding: 18px;
        }

        .stat p {
          color: rgba(255,255,255,0.45);
          margin-bottom: 10px;
        }

        .stat h3 {
          margin: 0;
          font-size: 24px;
        }

        @media(max-width:1100px){
          .topGrid{
            grid-template-columns:1fr 1fr;
          }

          .layout{
            grid-template-columns:1fr;
          }

          .calendar{
            grid-template-columns:repeat(3,1fr);
          }
        }

        @media(max-width:700px){
          .page{
            padding:20px;
          }

          h1{
            font-size:42px;
          }

          .hero{
            flex-direction:column;
            align-items:flex-start;
          }

          .topGrid{
            grid-template-columns:1fr;
          }

          .calendar{
            grid-template-columns:repeat(2,1fr);
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

      <h2
        className={
          green
            ? "green"
            : red
            ? "red"
            : ""
        }
      >
        {value}
      </h2>
    </div>
  );
}

function Stat({
  label,
  value,
  green,
  red,
}: {
  label: string;
  value: string;
  green?: boolean;
  red?: boolean;
}) {
  return (
    <div className="stat">
      <p>{label}</p>

      <h3
        className={
          green
            ? "green"
            : red
            ? "red"
            : ""
        }
      >
        {value}
      </h3>
    </div>
  );
}