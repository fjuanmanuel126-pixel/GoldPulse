import { useMemo, useState } from "react";
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

const balanceData = [
  { date: "2026-05-01", balance: 10000, equity: 10000 },
  { date: "2026-05-02", balance: 10120, equity: 10080 },
  { date: "2026-05-03", balance: 10040, equity: 10020 },
  { date: "2026-05-04", balance: 10210, equity: 10190 },
  { date: "2026-05-05", balance: 10350, equity: 10320 },
  { date: "2026-05-06", balance: 10280, equity: 10260 },
  { date: "2026-05-07", balance: 10440, equity: 10410 },
];

const trades = [
  {
    id: 1,
    date: "2026-05-02",
    symbol: "XAUUSD",
    type: "BUY",
    entry: 2320,
    lot: 0.1,
    profit: 120,
    note: "Buena entrada después de barrida de liquidez.",
  },
  {
    id: 2,
    date: "2026-05-03",
    symbol: "NAS100",
    type: "SELL",
    entry: 18200,
    lot: 0.05,
    profit: -80,
    note: "Entrada impulsiva, no esperé confirmación.",
  },
  {
    id: 3,
    date: "2026-05-05",
    symbol: "XAUUSD",
    type: "BUY",
    entry: 2334,
    lot: 0.12,
    profit: 140,
    note: "Trade limpio siguiendo estructura.",
  },
];

export default function Bitacora() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const monthDays = useMemo(() => {
    return eachDayOfInterval({
      start: startOfMonth(selectedDate),
      end: endOfMonth(selectedDate),
    });
  }, [selectedDate]);

  const selectedTrades = trades.filter((trade) =>
    isSameDay(new Date(trade.date), selectedDate)
  );

  const totalProfit = trades.reduce((acc, trade) => acc + trade.profit, 0);
  const wins = trades.filter((trade) => trade.profit > 0).length;
  const winrate = Math.round((wins / trades.length) * 100);

  const getDayProfit = (day: Date) => {
    return trades
      .filter((trade) => isSameDay(new Date(trade.date), day))
      .reduce((acc, trade) => acc + trade.profit, 0);
  };

  return (
    <main className="min-h-screen bg-[#050816] text-white px-6 py-8">
      <section className="max-w-7xl mx-auto">
        <div className="mb-8">
          <p className="text-sm text-yellow-400 tracking-[0.3em] uppercase">
            GoldPulse Journal PRO
          </p>
          <h1 className="text-4xl font-bold mt-2">Bitácora de Trading</h1>
          <p className="text-slate-400 mt-2">
            Controla tus operaciones, mide tu rendimiento y detecta tus errores.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card title="Balance" value="$10,440" />
          <Card title="Profit Total" value={`$${totalProfit}`} />
          <Card title="Winrate" value={`${winrate}%`} />
          <Card title="Trades" value={String(trades.length)} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-2xl p-5 shadow-xl">
            <h2 className="text-xl font-semibold mb-4">Crecimiento de cuenta</h2>

            <div className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={balanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="date" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{
                      background: "#020617",
                      border: "1px solid #334155",
                      borderRadius: "12px",
                      color: "white",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="balance"
                    stroke="#facc15"
                    strokeWidth={3}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="equity"
                    stroke="#38bdf8"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 shadow-xl">
            <h2 className="text-xl font-semibold mb-4">Calendario</h2>

            <div className="grid grid-cols-7 gap-2 text-center text-sm">
              {["L", "M", "X", "J", "V", "S", "D"].map((d) => (
                <div key={d} className="text-slate-400">
                  {d}
                </div>
              ))}

              {monthDays.map((day) => {
                const profit = getDayProfit(day);
                const active = isSameDay(day, selectedDate);

                return (
                  <button
                    key={day.toISOString()}
                    onClick={() => setSelectedDate(day)}
                    className={`
                      rounded-xl h-14 border text-sm transition
                      ${
                        active
                          ? "border-yellow-400 bg-yellow-400/20"
                          : "border-white/10 bg-white/5"
                      }
                      ${
                        profit > 0
                          ? "text-emerald-400"
                          : profit < 0
                          ? "text-red-400"
                          : "text-slate-400"
                      }
                    `}
                  >
                    <div>{format(day, "d")}</div>
                    {profit !== 0 && (
                      <div className="text-xs">
                        {profit > 0 ? "+" : ""}
                        {profit}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white/5 border border-white/10 rounded-2xl p-5 shadow-xl">
          <h2 className="text-xl font-semibold mb-4">
            Trades del {format(selectedDate, "dd/MM/yyyy")}
          </h2>

          {selectedTrades.length === 0 ? (
            <p className="text-slate-400">No hay operaciones este día.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-slate-400 border-b border-white/10">
                  <tr>
                    <th className="text-left py-3">Símbolo</th>
                    <th className="text-left py-3">Tipo</th>
                    <th className="text-left py-3">Entrada</th>
                    <th className="text-left py-3">Lote</th>
                    <th className="text-left py-3">Resultado</th>
                    <th className="text-left py-3">Nota</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedTrades.map((trade) => (
                    <tr key={trade.id} className="border-b border-white/5">
                      <td className="py-3">{trade.symbol}</td>
                      <td className="py-3">{trade.type}</td>
                      <td className="py-3">{trade.entry}</td>
                      <td className="py-3">{trade.lot}</td>
                      <td
                        className={`py-3 font-semibold ${
                          trade.profit >= 0
                            ? "text-emerald-400"
                            : "text-red-400"
                        }`}
                      >
                        {trade.profit > 0 ? "+" : ""}
                        {trade.profit} USD
                      </td>
                      <td className="py-3 text-slate-300">{trade.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

function Card({ title, value }: { title: string; value: string }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-5 shadow-xl">
      <p className="text-slate-400 text-sm">{title}</p>
      <h3 className="text-2xl font-bold mt-2">{value}</h3>
    </div>
  );
}