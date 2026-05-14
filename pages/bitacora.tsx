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
  initial_balance: number | null;
  current_balance: number | null;
};

type Trade = {
  id: string;
  account_id: string;
  symbol: string;
  trade_type: string;
  entry_price: number | null;
  lot_size: number | null;
  profit: number | null;
  trade_date: string;
  result: string | null;
  notes: string | null;
};

export default function BitacoraPage() {
  const router = useRouter();

  const [selectedDate, setSelectedDate] = useState(new Date());

  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedAccount, setSelectedAccount] = useState("all");

  const [trades, setTrades] = useState<Trade[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
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

  const filteredTrades = useMemo(() => {
    if (selectedAccount === "all") return trades;

    return trades.filter((t) => t.account_id === selectedAccount);
  }, [trades, selectedAccount]);

  const monthDays = useMemo(() => {
    return eachDayOfInterval({
      start: startOfMonth(selectedDate),
      end: endOfMonth(selectedDate),
    });
  }, [selectedDate]);

  const selectedTrades = filteredTrades.filter((trade) =>
    isSameDay(new Date(trade.trade_date), selectedDate)
  );

  const totalProfit = filteredTrades.reduce(
    (acc, t) => acc + Number(t.profit || 0),
    0
  );

  const wins = filteredTrades.filter(
    (t) => Number(t.profit || 0) > 0
  ).length;

  const winrate =
    filteredTrades.length > 0
      ? Math.round((wins / filteredTrades.length) * 100)
      : 0;

  const selectedAccountData =
    selectedAccount === "all"
      ? null
      : accounts.find((a) => a.id === selectedAccount);

  const initialBalance =
    selectedAccount === "all"
      ? accounts.reduce(
          (acc, a) => acc + Number(a.initial_balance || 0),
          0
        )
      : Number(selectedAccountData?.initial_balance || 0);

  const currentBalance = initialBalance + totalProfit;

  const chartData = useMemo(() => {
    let runningBalance = initialBalance;

    return filteredTrades.map((trade) => {
      runningBalance += Number(trade.profit || 0);

      return {
        date: format(new Date(trade.trade_date), "dd/MM"),
        balance: Number(runningBalance.toFixed(2)),
      };
    });
  }, [filteredTrades, initialBalance]);

  function getDayProfit(day: Date) {
    return filteredTrades
      .filter((trade) =>
        isSameDay(new Date(trade.trade_date), day)
      )
      .reduce(
        (acc, trade) => acc + Number(trade.profit || 0),
        0
      );
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
              <img
                src="/branding/logo.png"
                alt="GoldPulse Pro"
                className="db-logo"
              />
            </Link>

            <div className="db-topInfo">
              <div className="db-topTitle">
                Bitácora PRO
              </div>

              <div className="db-topSub">
                Métricas · Calendario · Registro manual
              </div>
            </div>
          </div>

          <nav className="db-topActions">
            <button
              onClick={() =>
                router.push("/bitacora/new-trade")
              }
              className="db-goldBtn"
            >
              Nueva operación
            </button>

            <button
              onClick={() =>
                router.push("/bitacora/accounts")
              }
              className="db-softBtn"
            >
              Cuentas
            </button>

            <button
              onClick={() => router.push("/dashboard")}
              className="db-softBtn"
            >
              Dashboard
            </button>
          </nav>
        </header>

        <section className="db-hero">
          <div className="db-heroMain">
            <div className="db-pill">
              BITÁCORA DE TRADING
            </div>

            <h1 className="db-heroTitle">
              Controla tu rendimiento como trader
            </h1>

            <p className="db-heroText">
              Visualiza balance, profit, operaciones
              y evolución de tus cuentas.
            </p>

            <div className="filterBox">
              <label>Cuenta</label>

              <select
                value={selectedAccount}
                onChange={(e) =>
                  setSelectedAccount(e.target.value)
                }
              >
                <option value="all">
                  Todas las cuentas
                </option>

                {accounts.map((acc) => (
                  <option
                    key={acc.id}
                    value={acc.id}
                  >
                    {acc.name}
                    {acc.broker
                      ? ` · ${acc.broker}`
                      : ""}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="db-heroSide">
            <StatCard
              label="Balance"
              value={`$${currentBalance.toFixed(2)}`}
            />

            <StatCard
              label="Profit total"
              value={`$${totalProfit.toFixed(2)}`}
            />

            <StatCard
              label="Winrate"
              value={`${winrate}%`}
            />
          </div>
        </section>

        <section className="db-mainGrid">
          <div className="db-card">
            <div className="db-cardHeader">
              <div>
                <div className="db-cardTitle">
                  Crecimiento de cuenta
                </div>

                <div className="db-cardMeta">
                  Balance acumulado
                </div>
              </div>
            </div>

            <div className="chartBox">
              {chartData.length === 0 ? (
                <div className="db-statusBox db-statusFree">
                  Todavía no hay operaciones.
                </div>
              ) : (
                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >
                  <LineChart data={chartData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="rgba(255,255,255,0.08)"
                    />

                    <XAxis
                      dataKey="date"
                      stroke="rgba(234,243,255,0.55)"
                    />

                    <YAxis
                      stroke="rgba(234,243,255,0.55)"
                    />

                    <Tooltip
                      contentStyle={{
                        background:
                          "rgba(0,0,0,0.9)",
                        border:
                          "1px solid rgba(255,210,120,0.25)",
                        borderRadius: "14px",
                        color: "#fff",
                      }}
                    />

                    <Line
                      type="monotone"
                      dataKey="balance"
                      stroke="#f6c453"
                      strokeWidth={3}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          <div className="db-card">
            <div className="db-cardHeader">
              <div>
                <div className="db-cardTitle">
                  Calendario
                </div>

                <div className="db-cardMeta">
                  {format(
                    selectedDate,
                    "MMMM 'de' yyyy",
                    { locale: es }
                  )}
                </div>
              </div>
            </div>

            <div className="calendarGrid">
              {[
                "L",
                "M",
                "X",
                "J",
                "V",
                "S",
                "D",
              ].map((d) => (
                <div
                  key={d}
                  className="calendarHead"
                >
                  {d}
                </div>
              ))}

              {monthDays.map((day) => {
                const profit = getDayProfit(day);

                const active = isSameDay(
                  day,
                  selectedDate
                );

                return (
                  <button
                    key={day.toISOString()}
                    onClick={() =>
                      setSelectedDate(day)
                    }
                    className={`calendarDay ${
                      active ? "active" : ""
                    } ${
                      profit > 0
                        ? "win"
                        : profit < 0
                        ? "loss"
                        : ""
                    }`}
                  >
                    <span>
                      {format(day, "d")}
                    </span>

                    {profit !== 0 && (
                      <b>
                        {profit > 0 ? "+" : ""}
                        {profit.toFixed(0)}
                      </b>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        <section
          className="db-card"
          style={{ marginTop: 18 }}
        >
          <div className="db-cardHeader">
            <div>
              <div className="db-cardTitle">
                Trades del{" "}
                {format(
                  selectedDate,
                  "dd/MM/yyyy"
                )}
              </div>

              <div className="db-cardMeta">
                Registro operativo del día
              </div>
            </div>
          </div>

          {selectedTrades.length === 0 ? (
            <div className="db-statusBox db-statusFree">
              No hay operaciones este día.
            </div>
          ) : (
            <div className="tableWrap">
              <table>
                <thead>
                  <tr>
                    <th>Símbolo</th>
                    <th>Tipo</th>
                    <th>Entrada</th>
                    <th>Lote</th>
                    <th>Resultado</th>
                    <th>Notas</th>
                  </tr>
                </thead>

                <tbody>
                  {selectedTrades.map((trade) => (
                    <tr key={trade.id}>
                      <td>{trade.symbol}</td>

                      <td>
                        {trade.trade_type}
                      </td>

                      <td>
                        {trade.entry_price}
                      </td>

                      <td>
                        {trade.lot_size}
                      </td>

                      <td
                        className={
                          Number(
                            trade.profit || 0
                          ) >= 0
                            ? "profitWin"
                            : "profitLoss"
                        }
                      >
                        {Number(
                          trade.profit || 0
                        ) > 0
                          ? "+"
                          : ""}
                        {Number(
                          trade.profit || 0
                        ).toFixed(2)}{" "}
                        USD
                      </td>

                      <td>
                        {trade.notes || "-"}
                      </td>
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

function StatCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="db-statCard">
      <div className="db-statLabel">
        {label}
      </div>

      <div className="db-statValue">
        {value}
      </div>
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

    background: rgba(0,0,0,0.42);

    border: 1px solid rgba(255,255,255,0.08);

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
    color: rgba(234,243,255,0.72);
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
    background: linear-gradient(
      180deg,
      rgba(255,200,110,0.25),
      rgba(0,0,0,0.18)
    );
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

    background: rgba(0,0,0,0.34);

    border: 1px solid rgba(255,255,255,0.08);

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

    color: rgba(255,220,160,0.92);

    background: rgba(255,190,80,0.10);

    border: 1px solid rgba(255,210,120,0.18);
  }

  .db-heroTitle {
    margin: 14px 0 0;
    font-size: 34px;
    line-height: 1.08;
    font-weight: 800;
  }

  .db-heroText {
    margin-top: 14px;

    color: rgba(234,243,255,0.82);

    line-height: 1.7;
    font-size: 15px;
  }

  .filterBox {
    margin-top: 22px;
    max-width: 360px;

    display: grid;
    gap: 8px;
  }

  .filterBox label {
    color: rgba(234,243,255,0.72);
    font-size: 13px;
    font-weight: 700;
  }

  .filterBox select {
    width: 100%;
    border-radius: 14px;
    border: 1px solid rgba(255,255,255,0.10);
    background: rgba(0,0,0,0.35);
    color: white;
    padding: 13px 14px;
    outline: none;
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

  .chartBox {
    height: 330px;
  }

  .calendarGrid {
    display: grid;
    grid-template-columns: repeat(7,1fr);
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
  }
`;