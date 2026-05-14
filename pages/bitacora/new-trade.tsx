import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getSupabaseClient } from "../../lib/supabaseClient";

type Account = {
  id: string;
  name: string;
  broker: string | null;
};

export default function NewTradePage() {
  const router = useRouter();

  const [accounts, setAccounts] = useState<Account[]>([]);
  const [accountId, setAccountId] = useState("");

  const [symbol, setSymbol] = useState("XAUUSD");
  const [tradeType, setTradeType] = useState("BUY");
  const [entryPrice, setEntryPrice] = useState("");
  const [stopLoss, setStopLoss] = useState("");
  const [tp1, setTp1] = useState("");
  const [tp2, setTp2] = useState("");
  const [tp3, setTp3] = useState("");
  const [lotSize, setLotSize] = useState("");
  const [result, setResult] = useState("Manual");
  const [profit, setProfit] = useState("");
  const [tradeDate, setTradeDate] = useState("");
  const [notes, setNotes] = useState("");

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadAccounts();

    const now = new Date();
    const localDate = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);

    setTradeDate(localDate);
  }, []);

  async function loadAccounts() {
    const supabase = getSupabaseClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.replace("/login");
      return;
    }

    const { data, error } = await supabase
      .from("trading_accounts")
      .select("id, name, broker")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      setMessage(error.message);
      return;
    }

    setAccounts(data || []);

    if (data && data.length > 0) {
      setAccountId(data[0].id);
    }
  }

  async function saveTrade() {
    setMessage("");

    if (!accountId) {
      setMessage("Primero debes crear o seleccionar una cuenta.");
      return;
    }

    if (!symbol || !tradeType) {
      setMessage("Falta símbolo o tipo de operación.");
      return;
    }

    setSaving(true);

    const supabase = getSupabaseClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.replace("/login");
      return;
    }

    const { error } = await supabase.from("trading_operations").insert({
      user_id: user.id,
      account_id: accountId,
      symbol,
      trade_type: tradeType,
      entry_price: Number(entryPrice || 0),
      stop_loss: Number(stopLoss || 0),
      tp1: Number(tp1 || 0),
      tp2: Number(tp2 || 0),
      tp3: Number(tp3 || 0),
      lot_size: Number(lotSize || 0),
      result,
      profit: Number(profit || 0),
      notes,
      trade_date: tradeDate ? new Date(tradeDate).toISOString() : new Date().toISOString(),
    });

    setSaving(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("Operación guardada correctamente.");

    setEntryPrice("");
    setStopLoss("");
    setTp1("");
    setTp2("");
    setTp3("");
    setLotSize("");
    setProfit("");
    setNotes("");
  }

  return (
    <div className="page">
      <div className="wrap">
        <header className="topbar">
          <div className="topLeft">
            <Link href="/">
              <img src="/branding/logo.png" alt="GoldPulse Pro" className="logo" />
            </Link>

            <div>
              <div className="topTitle">Nueva operación</div>
              <div className="topSub">Bitácora PRO · Registro manual</div>
            </div>
          </div>

          <nav className="actions">
            <button onClick={() => router.push("/bitacora")} className="softBtn">
              Bitácora
            </button>
            <button onClick={() => router.push("/bitacora/accounts")} className="softBtn">
              Cuentas
            </button>
            <button onClick={() => router.push("/dashboard")} className="goldBtn">
              Dashboard
            </button>
          </nav>
        </header>

        <section className="hero">
          <div className="heroMain">
            <div className="pill">REGISTRO MANUAL</div>
            <h1>Guardar operación en tu Bitácora</h1>
            <p>
              Registra tus entradas, salidas, resultado, lote y notas para medir tu
              rendimiento real por cuenta.
            </p>
          </div>
        </section>

        <section className="card">
          <div className="cardHeader">
            <div>
              <h2>Datos de la operación</h2>
              <p>Completa la información principal del trade.</p>
            </div>
          </div>

          {message && <div className="message">{message}</div>}

          <div className="grid">
            <Field label="Cuenta">
              <select value={accountId} onChange={(e) => setAccountId(e.target.value)}>
                {accounts.length === 0 && <option value="">No tienes cuentas creadas</option>}
                {accounts.map((acc) => (
                  <option key={acc.id} value={acc.id}>
                    {acc.name} {acc.broker ? `· ${acc.broker}` : ""}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Fecha y hora">
              <input
                type="datetime-local"
                value={tradeDate}
                onChange={(e) => setTradeDate(e.target.value)}
              />
            </Field>

            <Field label="Símbolo">
              <select value={symbol} onChange={(e) => setSymbol(e.target.value)}>
                <option value="XAUUSD">XAUUSD</option>
                <option value="NAS100">NAS100</option>
                <option value="EURUSD">EURUSD</option>
                <option value="GBPUSD">GBPUSD</option>
                <option value="BTCUSDT">BTCUSDT</option>
                <option value="ETHUSDT">ETHUSDT</option>
              </select>
            </Field>

            <Field label="Tipo">
              <select value={tradeType} onChange={(e) => setTradeType(e.target.value)}>
                <option value="BUY">BUY</option>
                <option value="SELL">SELL</option>
              </select>
            </Field>

            <Field label="Entrada">
              <input value={entryPrice} onChange={(e) => setEntryPrice(e.target.value)} />
            </Field>

            <Field label="Stop Loss">
              <input value={stopLoss} onChange={(e) => setStopLoss(e.target.value)} />
            </Field>

            <Field label="TP1">
              <input value={tp1} onChange={(e) => setTp1(e.target.value)} />
            </Field>

            <Field label="TP2">
              <input value={tp2} onChange={(e) => setTp2(e.target.value)} />
            </Field>

            <Field label="TP3">
              <input value={tp3} onChange={(e) => setTp3(e.target.value)} />
            </Field>

            <Field label="Lote">
              <input value={lotSize} onChange={(e) => setLotSize(e.target.value)} />
            </Field>

            <Field label="Resultado">
              <select value={result} onChange={(e) => setResult(e.target.value)}>
                <option value="TP">TP</option>
                <option value="TP1">TP1</option>
                <option value="TP2">TP2</option>
                <option value="TP3">TP3</option>
                <option value="SL">SL</option>
                <option value="BE">Break Even</option>
                <option value="Manual">Manual</option>
              </select>
            </Field>

            <Field label="Profit / pérdida USD">
              <input value={profit} onChange={(e) => setProfit(e.target.value)} />
            </Field>
          </div>

          <div className="notesBox">
            <label>Notas del trade</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="¿Qué viste? ¿Por qué entraste? ¿Qué error cometiste? ¿Cómo gestionaste?"
            />
          </div>

          <div className="footer">
            <button onClick={saveTrade} disabled={saving} className="goldBtn big">
              {saving ? "Guardando..." : "Guardar operación"}
            </button>

            <button onClick={() => router.push("/bitacora")} className="softBtn big">
              Volver a Bitácora
            </button>
          </div>
        </section>
      </div>

      <style jsx>{styles}</style>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="field">
      <label>{label}</label>
      {children}
    </div>
  );
}

const styles = `
  .page {
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

  .page:before {
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

  .wrap {
    max-width: 1180px;
    margin: 0 auto;
    padding: 16px 16px 92px;
    position: relative;
    z-index: 1;
  }

  .topbar {
    position: sticky;
    top: 8px;
    z-index: 20;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 14px;
    padding: 12px 14px;
    border-radius: 20px;
    background: rgba(0, 0, 0, 0.42);
    border: 1px solid rgba(255, 255, 255, 0.08);
    backdrop-filter: blur(14px);
  }

  .topLeft {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .logo {
    height: 52px;
    width: auto;
  }

  .topTitle {
    font-size: 18px;
    font-weight: 800;
  }

  .topSub {
    margin-top: 4px;
    color: rgba(234, 243, 255, 0.72);
    font-size: 13px;
  }

  .actions {
    display: flex;
    gap: 10px;
  }

  .hero {
    margin-top: 18px;
  }

  .heroMain,
  .card {
    border-radius: 22px;
    background: rgba(0, 0, 0, 0.34);
    border: 1px solid rgba(255, 255, 255, 0.08);
    backdrop-filter: blur(14px);
    padding: 24px;
  }

  .pill {
    display: inline-block;
    padding: 8px 12px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 700;
    color: rgba(255, 220, 160, 0.92);
    background: rgba(255, 190, 80, 0.10);
    border: 1px solid rgba(255, 210, 120, 0.18);
  }

  h1 {
    margin: 14px 0 0;
    font-size: 34px;
    line-height: 1.08;
    font-weight: 800;
  }

  p {
    margin-top: 14px;
    color: rgba(234, 243, 255, 0.82);
    line-height: 1.7;
    font-size: 15px;
  }

  .card {
    margin-top: 18px;
  }

  .cardHeader {
    margin-bottom: 18px;
  }

  h2 {
    margin: 0;
    font-size: 24px;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 14px;
  }

  .field {
    display: grid;
    gap: 8px;
  }

  label {
    color: rgba(234,243,255,0.72);
    font-size: 13px;
    font-weight: 700;
  }

  input,
  select,
  textarea {
    width: 100%;
    border-radius: 14px;
    border: 1px solid rgba(255,255,255,0.10);
    background: rgba(0,0,0,0.35);
    color: white;
    padding: 13px 14px;
    outline: none;
  }

  select option {
    background: #050816;
    color: white;
  }

  textarea {
    min-height: 130px;
    resize: vertical;
  }

  .notesBox {
    margin-top: 18px;
    display: grid;
    gap: 8px;
  }

  .message {
    margin-bottom: 16px;
    padding: 14px 16px;
    border-radius: 16px;
    border: 1px solid rgba(255,210,120,0.22);
    background: rgba(255,190,80,0.10);
    color: rgba(255,235,190,0.95);
  }

  .footer {
    margin-top: 20px;
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
  }

  .softBtn,
  .goldBtn {
    padding: 12px 16px;
    border-radius: 12px;
    cursor: pointer;
    font-weight: 800;
    color: white;
  }

  .softBtn {
    border: 1px solid rgba(255,255,255,0.12);
    background: rgba(255,255,255,0.05);
  }

  .goldBtn {
    border: 1px solid rgba(255,200,110,0.45);
    background: linear-gradient(180deg, rgba(255,200,110,0.25), rgba(0,0,0,0.18));
  }

  .big {
    padding: 14px 20px;
  }

  button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  @media (max-width: 980px) {
    .actions {
      display: none;
    }

    .grid {
      grid-template-columns: 1fr 1fr;
    }
  }

  @media (max-width: 680px) {
    .grid {
      grid-template-columns: 1fr;
    }

    .logo {
      height: 42px;
    }

    .topLeft > div {
      display: none;
    }

    h1 {
      font-size: 28px;
    }

    .heroMain,
    .card {
      padding: 18px;
    }
  }
`;