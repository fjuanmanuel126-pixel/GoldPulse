import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { getSupabaseClient } from "../lib/supabaseClient";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
} from "date-fns";
import { es } from "date-fns/locale";

type Account = {
  id: string;
  name: string;
  broker: string | null;
  account_type: string | null;
  initial_balance: number | null;
};

type Trade = {
  id: string;
  account_id: string;
  symbol: string;
  trade_type: string;
  entry_price: number | null;
  stop_loss: number | null;
  tp1: number | null;
  tp2: number | null;
  tp3: number | null;
  lot_size: number | null;
  result: string | null;
  profit: number | null;
  trade_date: string;
  notes: string | null;
};

export default function BitacoraPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedAccount, setSelectedAccount] = useState("all");
  const [trades, setTrades] = useState<Trade[]>([]);
  const [message, setMessage] = useState("");

  const [accountName, setAccountName] = useState("");
  const [broker, setBroker] = useState("");
  const [accountType, setAccountType] = useState("");
  const [initialBalance, setInitialBalance] = useState("");

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

  useEffect(() => {
    loadData();

    const now = new Date();
    const localDate = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);

    setTradeDate(localDate);
  }, []);

  async function loadData() {
    const supabase = getSupabaseClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.replace("/login");
      return;
    }

    const { data: accountsData } = await supabase
      .from("trading_accounts")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    const { data: tradesData } = await supabase
      .from("trading_operations")
      .select("*")
      .eq("user_id", user.id)
      .order("trade_date", { ascending: true });

    setAccounts(accountsData || []);
    setTrades(tradesData || []);
    setLoading(false);
  }

  async function createAccount() {
    setMessage("");

    if (!accountName) {
      setMessage("Escribe el nombre de la cuenta.");
      return;
    }

    const supabase = getSupabaseClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { error } = await supabase.from("trading_accounts").insert({
      user_id: user.id,
      name: accountName,
      broker,
      account_type: accountType,
      initial_balance: Number(initialBalance || 0),
      current_balance: Number(initialBalance || 0),
    });

    if (error) {
      setMessage(error.message);
      return;
    }

    setAccountName("");
    setBroker("");
    setAccountType("");
    setInitialBalance("");
    setMessage("Cuenta creada correctamente.");
    await loadData();
  }

  async function saveTrade() {
    setMessage("");

    if (selectedAccount === "all") {
      setMessage("Selecciona una cuenta concreta para guardar la operación.");
      return;
    }

    const supabase = getSupabaseClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { error } = await supabase.from("trading_operations").insert({
      user_id: user.id,
      account_id: selectedAccount,
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

    if (error) {
      setMessage(error.message);
      return;
    }

    setEntryPrice("");
    setStopLoss("");
    setTp1("");
    setTp2("");
    setTp3("");
    setLotSize("");
    setProfit("");
    setNotes("");
    setMessage("Operación guardada correctamente.");
    await loadData();
  }

  const filteredTrades = useMemo(() => {
    if (selectedAccount === "all") return trades;
    return trades.filter((t) => t.account_id === selectedAccount);
  }, [trades, selectedAccount]);

  const selectedAccountData =
    selectedAccount === "all"
      ? null
      : accounts.find((a) => a.id === selectedAccount);

  const baseBalance =
    selectedAccount === "all"
      ? accounts.reduce((acc, a) => acc + Number(a.initial_balance || 0), 0)
      : Number(selectedAccountData?.initial_balance || 0);

  const totalProfit = filteredTrades.reduce(
    (acc, t) => acc + Number(t.profit || 0),
    0
  );

  const currentBalance = baseBalance + totalProfit;

  const wins = filteredTrades.filter((t) => Number(t.profit || 0) > 0).length;

  const winrate =
    filteredTrades.length > 0 ? Math.round((wins / filteredTrades.length) * 100) : 0;

  const chartData = useMemo(() => {
    let runningBalance = baseBalance;

    return filteredTrades.map((trade) => {
      runningBalance += Number(trade.profit || 0);

      return {
        date: format(new Date(trade.trade_date), "dd/MM"),
        balance: Number(runningBalance.toFixed(2)),
      };
    });
  }, [filteredTrades, baseBalance]);

  const monthDays = useMemo(() => {
    return eachDayOfInterval({
      start: startOfMonth(selectedDate),
      end: endOfMonth(selectedDate),
    });
  }, [selectedDate]);

  const selectedTrades = filteredTrades.filter((trade) =>
    isSameDay(new Date(trade.trade_date), selectedDate)
  );

  function getDayProfit(day: Date) {
    return filteredTrades
      .filter((trade) => isSameDay(new Date(trade.trade_date), day))
      .reduce((acc, trade) => acc + Number(trade.profit || 0), 0);
  }

  if (loading) {
    return (
      <div className="db-page">
        <div className="db-wrap">
          <div className="db-card">Cargando Bitácora...</div>
        </div>
        <style jsx>{styles}</style>
      </div>
    );
  }

  return (
    <div className="db-page">
      <div className="db-wrap">
        <header className="db-topbar">
          <div className="db-topbarLeft">
            <Link href="/">
              <img src="/branding/logo.png" alt="GoldPulse Pro" className="db-logo" />
            </Link>

            <div className="db-topInfo">
              <div className="db-topTitle">Bitácora PRO</div>
              <div className="db-topSub">Cuentas · Trades · Calendario · Gráficos</div>
            </div>
          </div>

          <nav className="db-topActions">
            <button onClick={() => router.push("/dashboard")} className="db-softBtn">
              Dashboard
            </button>
            <button onClick={() => router.push("/analyze")} className="db-softBtn">
              Analyze
            </button>
            <button onClick={() => router.push("/upgrade")} className="db-goldBtn">
              Upgrade
            </button>
          </nav>
        </header>

        <section className="db-hero">
          <div className="db-heroMain">
            <div className="db-pill">BITÁCORA DE TRADING</div>
            <h1 className="db-heroTitle">Todo tu rendimiento en un solo panel</h1>
            <p className="db-heroText">
              Crea cuentas, registra operaciones manuales, revisa el calendario y analiza tu curva de balance.
            </p>

            <div className="filterBox">
              <label>Cuenta activa</label>
              <select value={selectedAccount} onChange={(e) => setSelectedAccount(e.target.value)}>
                <option value="all">Todas las cuentas</option>
                {accounts.map((acc) => (
                  <option key={acc.id} value={acc.id}>
                    {acc.name} {acc.broker ? `· ${acc.broker}` : ""}
                  </option>
                ))}
              </select>
            </div>

            {message && <div className="message">{message}</div>}
          </div>

          <div className="db-heroSide">
            <StatCard label="Balance" value={`$${currentBalance.toFixed(2)}`} />
            <StatCard label="Profit total" value={`$${totalProfit.toFixed(2)}`} />
            <StatCard label="Winrate" value={`${winrate}%`} />
            <StatCard label="Trades" value={`${filteredTrades.length}`} />
          </div>
        </section>

        <section className="db-mainGrid">
          <div className="db-card">
            <div className="db-cardHeader">
              <div>
                <div className="db-cardTitle">Registrar operación</div>
                <div className="db-cardMeta">Guarda tus trades manualmente</div>
              </div>
            </div>

            <div className="formGrid">
              <Field label="Fecha y hora">
                <input type="datetime-local" value={tradeDate} onChange={(e) => setTradeDate(e.target.value)} />
              </Field>

              <Field label="Símbolo">
                <select value={symbol} onChange={(e) => setSymbol(e.target.value)}>
                  <option value="XAUUSD">XAUUSD</option>
                  <option value="NAS100">NAS100</option>
                  <option value="EURUSD">EURUSD</option>
                  <option value="GBPUSD">GBPUSD</option>
                  <option value="BTCUSDT">BTCUSDT</option>
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

              <Field label="Lote">
                <input value={lotSize} onChange={(e) => setLotSize(e.target.value)} />
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
                placeholder="¿Por qué entraste? ¿Qué viste? ¿Cómo gestionaste?"
              />
            </div>

            <button onClick={saveTrade} className="db-goldBtn bigBtn">
              Guardar operación
            </button>
          </div>

          <div className="db-card">
            <div className="db-cardHeader">
              <div>
                <div className="db-cardTitle">Crear cuenta</div>
                <div className="db-cardMeta">FTMO, personal, challenge, swing...</div>
              </div>
            </div>

            <div className="formStack">
              <Field label="Nombre de cuenta">
                <input value={accountName} onChange={(e) => setAccountName(e.target.value)} placeholder="FTMO 10K" />
              </Field>

              <Field label="Broker">
                <input value={broker} onChange={(e) => setBroker(e.target.value)} placeholder="FTMO, IC Markets..." />
              </Field>

              <Field label="Tipo de cuenta">
                <input value={accountType} onChange={(e) => setAccountType(e.target.value)} placeholder="Challenge, Real, Personal..." />
              </Field>

              <Field label="Balance inicial">
                <input value={initialBalance} onChange={(e) => setInitialBalance(e.target.value)} placeholder="10000" />
              </Field>

              <button onClick={createAccount} className="db-goldBtn bigBtn">
                Crear cuenta
              </button>
            </div>
          </div>
        </section>

        <section className="db-mainGrid">
          <div className="db-card">
            <div className="db-cardHeader">
              <div>
                <div className="db-cardTitle">Crecimiento de cuenta</div>
                <div className="db-cardMeta">Curva de balance</div>
              </div>
            </div>

            <div className="chartBox">
              {chartData.length === 0 ? (
                <div className="db-statusBox db-statusFree">Todavía no hay operaciones para graficar.</div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                    <XAxis dataKey="date" stroke="rgba(234,243,255,0.55)" />
                    <YAxis stroke="rgba(234,243,255,0.55)" />
                    <Tooltip
                      contentStyle={{
                        background: "rgba(0,0,0,0.9)",
                        border: "1px solid rgba(255,210,120,0.25)",
                        borderRadius: "14px",
                        color: "#fff",
                      }}
                    />
                    <Line type="monotone" dataKey="balance" stroke="#f6c453" strokeWidth={3} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          <div className="db-card">
            <div className="db-cardHeader">
              <div>
                <div className="db-cardTitle">Calendario</div>
                <div className="db-cardMeta">{format(selectedDate, "MMMM 'de' yyyy", { locale: es })}</div>
              </div>
            </div>

            <div className="calendarGrid">
              {["L", "M", "X", "J", "V", "S", "D"].map((d) => (
                <div key={d} className="calendarHead">{d}</div>
              ))}

              {monthDays.map((day) => {
                const dayProfit = getDayProfit(day);
                const active = isSameDay(day, selectedDate);

                return (
                  <button
                    key={day.toISOString()}
                    onClick={() => setSelectedDate(day)}
                    className={`calendarDay ${active ? "active" : ""} ${
                      dayProfit > 0 ? "win" : dayProfit < 0 ? "loss" : ""
                    }`}
                  >
                    <span>{format(day, "d")}</span>
                    {dayProfit !== 0 && <b>{dayProfit > 0 ? "+" : ""}{dayProfit.toFixed(0)}</b>}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        <section className="db-card" style={{ marginTop: 18 }}>
          <div className="db-cardHeader">
            <div>
              <div className="db-cardTitle">Trades del {format(selectedDate, "dd/MM/yyyy")}</div>
              <div className="db-cardMeta">Operaciones guardadas para el día seleccionado</div>
            </div>
          </div>

          {selectedTrades.length === 0 ? (
            <div className="db-statusBox db-statusFree">No hay operaciones este día.</div>
          ) : (
            <div className="tableWrap">
              <table>
                <thead>
                  <tr>
                    <th>Símbolo</th>
                    <th>Tipo</th>
                    <th>Entrada</th>
                    <th>SL</th>
                    <th>Lote</th>
                    <th>Resultado</th>
                    <th>Profit</th>
                    <th>Notas</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedTrades.map((trade) => (
                    <tr key={trade.id}>
                      <td>{trade.symbol}</td>
                      <td>{trade.trade_type}</td>
                      <td>{trade.entry_price}</td>
                      <td>{trade.stop_loss}</td>
                      <td>{trade.lot_size}</td>
                      <td>{trade.result}</td>
                      <td className={Number(trade.profit || 0) >= 0 ? "profitWin" : "profitLoss"}>
                        {Number(trade.profit || 0) > 0 ? "+" : ""}
                        {Number(trade.profit || 0).toFixed(2)} USD
                      </td>
                      <td>{trade.notes || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>

      <style jsx>{styles}</style>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="db-statCard">
      <div className="db-statLabel">{label}</div>
      <div className="db-statValue">{value}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="field">
      <label>{label}</label>
      {children}
    </div>
  );
}

const styles = `
  .db-page {
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

  .db-page:before {
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

  .db-wrap {
    max-width: 1180px;
    margin: 0 auto;
    padding: 16px 16px 92px;
    position: relative;
    z-index: 1;
  }

  .db-topbar {
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

  .db-topbarLeft {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .db-logo {
    height: 52px;
    width: auto;
  }

  .db-topTitle {
    font-size: 18px;
    font-weight: 800;
  }

  .db-topSub {
    margin-top: 4px;
    color: rgba(234, 243, 255, 0.72);
    font-size: 13px;
  }

  .db-topActions {
    display: flex;
    gap: 10px;
  }

  .db-softBtn,
  .db-goldBtn {
    padding: 12px 16px;
    border-radius: 12px;
    cursor: pointer;
    font-weight: 800;
    color: white;
  }

  .db-softBtn {
    border: 1px solid rgba(255,255,255,0.12);
    background: rgba(255,255,255,0.05);
  }

  .db-goldBtn {
    border: 1px solid rgba(255,200,110,0.45);
    background: linear-gradient(180deg, rgba(255,200,110,0.25), rgba(0,0,0,0.18));
  }

  .bigBtn {
    margin-top: 18px;
    width: 100%;
    padding: 14px 18px;
  }

  .db-hero {
    margin-top: 18px;
    display: grid;
    grid-template-columns: 1.2fr 0.8fr;
    gap: 16px;
  }

  .db-heroMain,
  .db-card,
  .db-statCard {
    border-radius: 22px;
    background: rgba(0, 0, 0, 0.34);
    border: 1px solid rgba(255, 255, 255, 0.08);
    backdrop-filter: blur(14px);
  }

  .db-heroMain,
  .db-card {
    padding: 24px;
  }

  .db-heroSide {
    display: grid;
    gap: 12px;
  }

  .db-pill {
    display: inline-block;
    padding: 8px 12px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 700;
    color: rgba(255, 220, 160, 0.92);
    background: rgba(255, 190, 80, 0.10);
    border: 1px solid rgba(255, 210, 120, 0.18);
  }

  .db-heroTitle {
    margin: 14px 0 0;
    font-size: 34px;
    line-height: 1.08;
    font-weight: 800;
  }

  .db-heroText {
    margin-top: 14px;
    color: rgba(234, 243, 255, 0.82);
    line-height: 1.7;
    font-size: 15px;
  }

  .filterBox {
    margin-top: 22px;
    max-width: 380px;
    display: grid;
    gap: 8px;
  }

  .message {
    margin-top: 16px;
    padding: 14px 16px;
    border-radius: 16px;
    border: 1px solid rgba(255,210,120,0.22);
    background: rgba(255,190,80,0.10);
    color: rgba(255,235,190,0.95);
  }

  .db-statCard {
    padding: 16px;
  }

  .db-statLabel {
    color: rgba(234,243,255,0.68);
    font-size: 13px;
  }

  .db-statValue {
    margin-top: 8px;
    font-size: 22px;
    font-weight: 800;
  }

  .db-mainGrid {
    margin-top: 18px;
    display: grid;
    grid-template-columns: 1fr 0.9fr;
    gap: 16px;
  }

  .db-cardHeader {
    display: flex;
    justify-content: space-between;
    margin-bottom: 14px;
  }

  .db-cardTitle {
    font-size: 22px;
    font-weight: 800;
  }

  .db-cardMeta {
    margin-top: 4px;
    color: rgba(234,243,255,0.68);
    font-size: 13px;
  }

  .formGrid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
  }

  .formStack {
    display: grid;
    gap: 12px;
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

  .notesBox {
    margin-top: 14px;
    display: grid;
    gap: 8px;
  }

  textarea {
    min-height: 95px;
    resize: vertical;
  }

  .chartBox {
    height: 330px;
  }

  .calendarGrid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 8px;
  }

  .calendarHead {
    text-align: center;
    color: rgba(234,243,255,0.58);
    font-size: 13px;
  }

  .calendarDay {
    height: 58px;
    border-radius: 14px;
    border: 1px solid rgba(255,255,255,0.08);
    background: rgba(255,255,255,0.04);
    color: rgba(234,243,255,0.78);
    cursor: pointer;
  }

  .calendarDay.active {
    border-color: rgba(255,210,120,0.45);
    background: rgba(255,190,80,0.13);
  }

  .calendarDay.win {
    color: #4ade80;
  }

  .calendarDay.loss {
    color: #fb7185;
  }

  .calendarDay b {
    display: block;
    margin-top: 4px;
    font-size: 11px;
  }

  .tableWrap {
    overflow-x: auto;
  }

  table {
    width: 100%;
    border-collapse: collapse;
  }

  th {
    text-align: left;
    color: rgba(234,243,255,0.62);
    padding: 12px;
    border-bottom: 1px solid rgba(255,255,255,0.08);
  }

  td {
    padding: 14px 12px;
    border-bottom: 1px solid rgba(255,255,255,0.06);
  }

  .profitWin {
    color: #4ade80;
    font-weight: 800;
  }

  .profitLoss {
    color: #fb7185;
    font-weight: 800;
  }

  .db-statusBox {
    padding: 16px;
    border-radius: 16px;
    color: rgba(234,243,255,0.88);
  }

  .db-statusFree {
    border: 1px solid rgba(255,255,255,0.08);
    background: rgba(255,255,255,0.04);
  }

  @media (max-width: 980px) {
    .db-topActions {
      display: none;
    }

    .db-hero,
    .db-mainGrid {
      grid-template-columns: 1fr;
    }

    .formGrid {
      grid-template-columns: 1fr 1fr;
    }
  }

  @media (max-width: 680px) {
    .db-logo {
      height: 42px;
    }

    .db-topInfo {
      display: none;
    }

    .db-heroTitle {
      font-size: 28px;
    }

    .db-heroMain,
    .db-card {
      padding: 18px;
    }

    .formGrid {
      grid-template-columns: 1fr;
    }
  }
`;