export default function BitacoraPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f3f4f6",
        padding: "32px",
        fontFamily: "Arial, sans-serif",
        color: "#111",
      }}
    >
      <h1 style={{ fontSize: 42, marginBottom: 10 }}>
        GoldPulse Bitácora
      </h1>

      <p style={{ color: "#666", marginBottom: 30 }}>
        Vista previa estilo FTMO / Account MetriX
      </p>

      <section
        style={{
          background: "white",
          padding: 24,
          borderRadius: 10,
        }}
      >
        <h2>FTMO Account: 541241171</h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3,1fr)",
            gap: 16,
            marginTop: 20,
          }}
        >
          <Card title="Balance" value="$9,709.63" />
          <Card title="Capital" value="$9,709.63" />
          <Card title="Beneficio Hoy" value="$55.12" green />
        </div>
      </section>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: 24,
          marginTop: 24,
        }}
      >
        <div
          style={{
            background: "white",
            padding: 24,
            borderRadius: 10,
          }}
        >
          <h2>Resultados actuales</h2>

          <div
            style={{
              height: 280,
              background: "#fafafa",
              border: "1px solid #ddd",
              borderRadius: 10,
              marginTop: 20,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: "#777",
              fontSize: 20,
            }}
          >
            Curva de Equity / Balance
          </div>
        </div>

        <div
          style={{
            background: "white",
            padding: 24,
            borderRadius: 10,
          }}
        >
          <h2>Objetivos</h2>

          <div style={{ marginTop: 20 }}>
            <p>
              Pérdida máxima diaria:
              <strong> -$500</strong>
            </p>

            <p>
              Pérdida máxima total:
              <strong> -$1,000</strong>
            </p>

            <p>
              Beneficio actual:
              <strong style={{ color: "#00a884" }}> $314.20</strong>
            </p>
          </div>
        </div>
      </section>

      <section
        style={{
          background: "white",
          padding: 24,
          borderRadius: 10,
          marginTop: 24,
        }}
      >
        <h2>Diario de Trading - Mayo 2026</h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(7,1fr)",
            gap: 10,
            marginTop: 24,
          }}
        >
          {Array.from({ length: 31 }, (_, i) => (
            <div
              key={i}
              style={{
                minHeight: 100,
                border: "1px solid #ddd",
                borderRadius: 8,
                padding: 10,
                background:
                  i === 5
                    ? "#ffecec"
                    : [1, 4, 7, 12, 15].includes(i)
                    ? "#eafff7"
                    : "#fff",
              }}
            >
              <strong>{i + 1}</strong>

              {[1, 4, 7, 12, 15].includes(i) && (
                <p style={{ color: "#00a884" }}>+$55</p>
              )}

              {i === 5 && (
                <p style={{ color: "#e11d48" }}>-$145</p>
              )}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

function Card({
  title,
  value,
  green,
}: {
  title: string;
  value: string;
  green?: boolean;
}) {
  return (
    <div
      style={{
        background: "#f3f4f6",
        padding: 20,
        borderRadius: 10,
      }}
    >
      <p style={{ color: "#666", marginBottom: 8 }}>{title}</p>

      <h2
        style={{
          color: green ? "#00a884" : "#111",
          margin: 0,
        }}
      >
        {value}
      </h2>
    </div>
  );
}