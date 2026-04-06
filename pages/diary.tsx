import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";

type Outcome = "PENDING" | "TP1" | "TP2" | "TP3" | "SL";

type JournalItem = {
  id: string;
  createdAt: number;
  symbol: string;
  timeframe: string;
  kind: "PREMIUM" | "SCALP";
  title: string;
  side: "BUY" | "SELL";
  confidence: number;
  entry: string;
  sl: number;
  tp1?: number;
  tp2?: number;
  tp3?: number;
  thesis?: string;
  outcome: Outcome;
  pnl?: number;
};

const JOURNAL_KEY = "goldpulse_journal_v1";
const DIARY_PRICES_KEY = "goldpulse_diary_prices_v1";

function loadJournal(): JournalItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(JOURNAL_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

function saveJournal(items: JournalItem[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(JOURNAL_KEY, JSON.stringify(items));
}

function loadPrices(): Record<string, string> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(DIARY_PRICES_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function savePrices(prices: Record<string, string>) {
  if (typeof window === "undefined") return;
  localStorage.setItem(DIARY_PRICES_KEY, JSON.stringify(prices));
}

function monthKey(ts: number) {
  const d = new Date(ts);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function monthLabel(key: string) {
  const [y, m] = key.split("-").map(Number);
  const dt = new Date(y, (m || 1) - 1, 1);
  return dt.toLocaleString(undefined, { month: "long", year: "numeric" });
}

function yyyyMmDd(ts: number) {
  const d = new Date(ts);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

function outcomeRank(o: Outcome) {
  if (o === "PENDING") return 0;
  if (o === "SL") return 1;
  if (o === "TP1") return 2;
  if (o === "TP2") return 3;
  if (o === "TP3") return 4;
  return 0;
}

function detectOutcome(item: JournalItem, currentPrice: number): Outcome {
  const entry = Number(item.entry);
  if (!Number.isFinite(entry) || !Number.isFinite(currentPrice)) return item.outcome;

  if (item.side === "BUY") {
    if (typeof item.tp3 === "number" && currentPrice >= item.tp3) return "TP3";
    if (typeof item.tp2 === "number" && currentPrice >= item.tp2) return "TP2";
    if (typeof item.tp1 === "number" && currentPrice >= item.tp1) return "TP1";
    if (currentPrice <= item.sl) return "SL";
    return "PENDING";
  }

  if (typeof item.tp3 === "number" && currentPrice <= item.tp3) return "TP3";
  if (typeof item.tp2 === "number" && currentPrice <= item.tp2) return "TP2";
  if (typeof item.tp1 === "number" && currentPrice <= item.tp1) return "TP1";
  if (currentPrice >= item.sl) return "SL";
  return "PENDING";
}

function mergeAutoOutcome(prev: Outcome, next: Outcome): Outcome {
  if (prev === "SL") return "SL";
  if (prev === "TP3") return "TP3";
  if (prev === "TP2" && next !== "TP3") return "TP2";
  if (prev === "TP1" && next !== "TP2" && next !== "TP3") return "TP1";
  if (prev === "PENDING") return next;
  if (outcomeRank(next) > outcomeRank(prev)) return next;
  return prev;
}

function applyAutomaticOutcomes(
  items: JournalItem[],
  prices: Record<string, string>
): { nextItems: JournalItem[]; changed: boolean } {
  let changed = false;

  const nextItems = items.map((item) => {
    const raw = prices[item.symbol];
    const currentPrice = Number(raw);

    if (!raw || !Number.isFinite(currentPrice)) return item;

    const auto = detectOutcome(item, currentPrice);
    const merged = mergeAutoOutcome(item.outcome, auto);

    if (merged !== item.outcome) {
      changed = true;
      return { ...item, outcome: merged };
    }

    return item;
  });

  return { nextItems, changed };
}

function DonutCard(props: {
  title: string;
  subtitle: string;
  percent: number;
  leftLabel: string;
  leftValue: number;
  rightLabel: string;
  rightValue: number;
}) {
  const r = 62;
  const c = 2 * Math.PI * r;
  const p = clamp(props.percent, 0, 100);
  const dash = (p / 100) * c;

  return (
    <div className="gp-card">
      <div className="gp-cardBody" style={{ padding: 22 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 16, alignItems: "flex-start" }}>
          <div>
            <div className="gp-cardTitle">{props.title}</div>
            <div className="gp-cardMeta">{props.subtitle}</div>
          </div>

          <svg width="170" height="170" viewBox="0 0 170 170" style={{ flex: "0 0 auto" }}>
            <circle cx="85" cy="85" r={r} stroke="rgba(255,255,255,.10)" strokeWidth="14" fill="none" />
            <circle
              cx="85"
              cy="85"
              r={r}
              stroke="currentColor"
              strokeWidth="14"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={`${dash} ${c - dash}`}
              transform="rotate(-90 85 85)"
              style={{ opacity: 0.9 }}
            />
            <text x="85" y="92" textAnchor="middle" fontSize="26" fontWeight="900" fill="white">
              {p.toFixed(2)}%
            </text>
          </svg>
        </div>

        <div style={{ display: "grid", gap: 10, marginTop: 10 }}>
          <div className="gp-cardMeta" style={{ display: "flex", gap: 14 }}>
            <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ width: 10, height: 10, borderRadius: 3, background: "var(--green, #3ee089)" }} />
              {props.leftValue} {props.leftLabel}
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ width: 10, height: 10, borderRadius: 3, background: "var(--red, #ff6b81)" }} />
              {props.rightValue} {props.rightLabel}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function MiniLineChart(props: { points: number[]; height?: number }) {
  const h = props.height ?? 120;
  const w = 420;
  const pts = props.points.length ? props.points : [0, 0, 0, 0, 0];

  const min = Math.min(...pts);
  const max = Math.max(...pts);
  const span = max - min || 1;

  const xy = pts.map((v, i) => {
    const x = (i / (pts.length - 1 || 1)) * (w - 20) + 10;
    const y = h - ((v - min) / span) * (h - 20) - 10;
    return { x, y };
  });

  const d = xy.map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`)).join(" ");

  return (
    <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
      <path d={d} fill="none" stroke="currentColor" strokeWidth="3" style={{ opacity: 0.9 }} />
    </svg>
  );
}

export default function Diary() {
  const router = useRouter();
  const [items, setItems] = useState<JournalItem[]>([]);
  const [activeMonth, setActiveMonth] = useState<string>("");
  const [page, setPage] = useState(1);
  const [prices, setPrices] = useState<Record<string, string>>({});
  const [menuOpen, setMenuOpen] = useState(false);

  const PAGE_SIZE = 2;

  useEffect(() => {
    const loaded = loadJournal();
    const fixed = loaded.map((x) => ({ ...x, outcome: x.outcome || "PENDING" }));
    const loadedPrices = loadPrices();

    const { nextItems } = applyAutomaticOutcomes(fixed, loadedPrices);

    setItems(nextItems);
    setPrices(loadedPrices);
    saveJournal(nextItems);
  }, []);

  useEffect(() => {
    savePrices(prices);
  }, [prices]);

  useEffect(() => {
    if (!items.length) return;

    const { nextItems, changed } = applyAutomaticOutcomes(items, prices);

    if (changed) {
      setItems(nextItems);
      saveJournal(nextItems);
    }
  }, [prices]);

  const months = useMemo(() => {
    const set = new Set(items.map((x) => monthKey(x.createdAt)));
    const arr = Array.from(set);
    arr.sort((a, b) => (a > b ? -1 : 1));
    return arr;
  }, [items]);

  useEffect(() => {
    if (!activeMonth && months.length) setActiveMonth(months[0]);
  }, [months, activeMonth]);

  useEffect(() => {
    setPage(1);
  }, [activeMonth]);

  const monthItems = useMemo(() => {
    if (!activeMonth) return [];
    return items.filter((x) => monthKey(x.createdAt) === activeMonth).sort((a, b) => b.createdAt - a.createdAt);
  }, [items, activeMonth]);

  const symbolsInJournal = useMemo(() => {
    const symbols = Array.from(new Set(items.map((x) => x.symbol)));
    return symbols.sort();
  }, [items]);

  const stats = useMemo(() => {
    const total = monthItems.length;
    const wins = monthItems.filter((x) => x.outcome === "TP1" || x.outcome === "TP2" || x.outcome === "TP3").length;
    const losses = monthItems.filter((x) => x.outcome === "SL").length;
    const pending = monthItems.filter((x) => x.outcome === "PENDING").length;

    const tp1 = monthItems.filter((x) => x.outcome === "TP1").length;
    const tp2 = monthItems.filter((x) => x.outcome === "TP2").length;
    const tp3 = monthItems.filter((x) => x.outcome === "TP3").length;

    const winrate = total ? (wins / total) * 100 : 0;
    return { total, wins, losses, pending, tp1, tp2, tp3, winrate };
  }, [monthItems]);

  const donutTrades = useMemo(() => {
    const done = monthItems.filter((x) => x.outcome !== "PENDING");
    const totalDone = done.length || 0;
    const wins = done.filter((x) => x.outcome === "TP1" || x.outcome === "TP2" || x.outcome === "TP3").length;
    const losses = totalDone - wins;
    const percent = totalDone ? (wins / totalDone) * 100 : 0;
    return { percent, wins, losses };
  }, [monthItems]);

  const donutDays = useMemo(() => {
    const map = new Map<string, { wins: number; sl: number }>();
    for (const it of monthItems) {
      const key = yyyyMmDd(it.createdAt);
      const cur = map.get(key) || { wins: 0, sl: 0 };
      if (it.outcome === "SL") cur.sl += 1;
      if (it.outcome === "TP1" || it.outcome === "TP2" || it.outcome === "TP3") cur.wins += 1;
      map.set(key, cur);
    }
    const days = Array.from(map.values());
    const totalDays = days.length || 0;
    const winDays = days.filter((d) => d.wins > d.sl).length;
    const lossDays = totalDays - winDays;
    const percent = totalDays ? (winDays / totalDays) * 100 : 0;
    return { percent, winDays, lossDays };
  }, [monthItems]);

  const equityPoints = useMemo(() => {
    const done = [...monthItems].reverse();
    let acc = 0;
    const pts: number[] = [];
    for (const x of done) {
      if (x.outcome === "SL") acc -= 1;
      if (x.outcome === "TP1" || x.outcome === "TP2" || x.outcome === "TP3") acc += 1;
      pts.push(acc);
    }
    return pts.slice(-60);
  }, [monthItems]);

  const calendar = useMemo(() => {
    if (!activeMonth) return null;
    const [y, m] = activeMonth.split("-").map(Number);
    const year = y;
    const month = (m || 1) - 1;

    const first = new Date(year, month, 1);
    const last = new Date(year, month + 1, 0);
    const daysInMonth = last.getDate();
    const startDow = first.getDay();

    const dayMap = new Map<string, { score: number; count: number }>();
    for (const it of monthItems) {
      const key = yyyyMmDd(it.createdAt);
      const cur = dayMap.get(key) || { score: 0, count: 0 };
      cur.count += 1;
      if (it.outcome === "SL") cur.score -= 1;
      if (it.outcome === "TP1" || it.outcome === "TP2" || it.outcome === "TP3") cur.score += 1;
      dayMap.set(key, cur);
    }

    const cells: Array<{ day: number | null; key?: string; score?: number; count?: number }> = [];
    for (let i = 0; i < startDow; i++) cells.push({ day: null });

    for (let d = 1; d <= daysInMonth; d++) {
      const dateKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      const info = dayMap.get(dateKey);
      cells.push({ day: d, key: dateKey, score: info?.score ?? 0, count: info?.count ?? 0 });
    }

    return { cells };
  }, [activeMonth, monthItems]);

  const totalPages = Math.max(1, Math.ceil(monthItems.length / PAGE_SIZE));
  const pageItems = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return monthItems.slice(start, start + PAGE_SIZE);
  }, [monthItems, page]);

  return (
    <div className="gp-page">
      <div className="gp-wrap">
        <div className="gp-topbar">
          <div className="gp-topbarLeft">
            <Link href="/" style={{ display: "inline-block" }}>
              <img src="/branding/logo.png" alt="GoldPulse Pro" className="gp-logo" />
            </Link>

            <div className="gp-topInfo">
              <div className="gp-topTitle">Diary PRO</div>
              <div className="gp-topSub">Métricas · Calendario · Registro automático</div>
            </div>
          </div>

          <nav className="gp-topActions">
            <button className="gp-softBtn" onClick={() => router.push("/dashboard")}>Dashboard</button>
            <button className="gp-softBtn" onClick={() => router.push("/analyze")}>Analyze</button>
            <button className="gp-softBtn" onClick={() => router.push("/scalping-goldpulse")}>Estrategia</button>
          </nav>

          <button
            type="button"
            className="gp-menuBtn"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Abrir menú"
            aria-expanded={menuOpen}
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>

        {menuOpen && (
          <div className="gp-mobileMenu">
            <button onClick={() => { setMenuOpen(false); router.push("/dashboard"); }}>Dashboard</button>
            <button onClick={() => { setMenuOpen(false); router.push("/analyze"); }}>Analyze</button>
            <button onClick={() => { setMenuOpen(false); router.push("/diary"); }}>Diario</button>
            <button onClick={() => { setMenuOpen(false); router.push("/scalping-goldpulse"); }}>Estrategia</button>
          </div>
        )}

        <div className="gp-card" style={{ marginTop: 18, marginBottom: 18 }}>
          <div className="gp-cardHeader">
            <div>
              <div className="gp-cardTitle">Detección automática de TP / SL</div>
              <div className="gp-cardMeta">
                Escribe el precio actual por símbolo y el diario marcará automáticamente los targets alcanzados.
              </div>
            </div>
          </div>

          <div className="gp-cardBody">
            {symbolsInJournal.length === 0 ? (
              <div className="gp-help">Aún no hay símbolos en el diario.</div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
                {symbolsInJournal.map((symbol) => (
                  <div key={symbol} className="gp-section">
                    <div className="gp-label">{symbol}</div>
                    <input
                      className="gp-input"
                      placeholder="Precio actual"
                      value={prices[symbol] || ""}
                      onChange={(e) =>
                        setPrices((prev) => ({
                          ...prev,
                          [symbol]: e.target.value,
                        }))
                      }
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="gp-card" style={{ marginBottom: 18 }}>
          <div className="gp-cardBody" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
            <div>
              <div className="gp-cardTitle">Diario de operaciones</div>
              <div className="gp-cardMeta">
                Mes: {activeMonth ? monthLabel(activeMonth) : "—"} · Total: {stats.total}
              </div>
            </div>

            <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
              <div className="gp-cardMeta">
                Winrate: <b>{stats.winrate.toFixed(2)}%</b>
              </div>
              <select
                className="gp-select"
                value={activeMonth}
                onChange={(e) => setActiveMonth(e.target.value)}
                style={{ minWidth: 220 }}
              >
                {months.length === 0 ? <option value="">Sin datos</option> : null}
                {months.map((m) => (
                  <option key={m} value={m}>
                    {monthLabel(m)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="gp-grid" style={{ marginBottom: 18 }}>
          <DonutCard
            title="Porcentaje de ganancias por operaciones"
            subtitle="Análisis de los resultados comerciales"
            percent={donutTrades.percent}
            leftLabel="victorias"
            leftValue={donutTrades.wins}
            rightLabel="pérdidas"
            rightValue={donutTrades.losses}
          />
          <DonutCard
            title="Porcentaje de victorias por días"
            subtitle="Desglose del rendimiento diario"
            percent={donutDays.percent}
            leftLabel="victorias"
            leftValue={donutDays.winDays}
            rightLabel="pérdidas"
            rightValue={donutDays.lossDays}
          />
        </div>

        <div className="gp-card" style={{ marginBottom: 18 }}>
          <div className="gp-cardHeader">
            <div>
              <div className="gp-cardTitle">PNL neto acumulado (proxy)</div>
              <div className="gp-cardMeta">Curva basada en outcomes (TP=+1 / SL=-1)</div>
            </div>
            <div className="gp-cardMeta">
              TP1: <b>{stats.tp1}</b> · TP2: <b>{stats.tp2}</b> · TP3: <b>{stats.tp3}</b> · SL:{" "}
              <b style={{ color: "var(--red, #ff6b81)" }}>{stats.losses}</b>
            </div>
          </div>
          <div className="gp-cardBody">
            <div style={{ color: "var(--green, #3ee089)" }}>
              <MiniLineChart points={equityPoints} height={140} />
            </div>
          </div>
        </div>

        <div className="gp-gridCalendar">
          <div className="gp-card">
            <div className="gp-cardHeader">
              <div>
                <div className="gp-cardTitle">Resumen mensual del rendimiento</div>
                <div className="gp-cardMeta">Score diario (TP=+1, SL=-1)</div>
              </div>
              <div className="gp-cardMeta">Pendientes: {stats.pending}</div>
            </div>

            <div className="gp-cardBody">
              {calendar ? (
                <div>
                  <div className="gp-cardMeta" style={{ marginBottom: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <span>Dom</span><span>Lun</span><span>Mar</span><span>Mié</span><span>Jue</span><span>Vie</span><span>Sáb</span>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 10 }}>
                    {calendar.cells.map((c, idx) => {
                      if (!c.day) return <div key={idx} style={{ height: 78 }} />;

                      const score = c.score || 0;
                      const isPos = score > 0;
                      const isNeg = score < 0;

                      return (
                        <div
                          key={c.key}
                          className="gp-section"
                          style={{
                            height: 78,
                            borderColor: isPos
                              ? "rgba(0,255,180,.22)"
                              : isNeg
                              ? "rgba(255,70,90,.22)"
                              : "rgba(120,190,255,.12)",
                            background: isPos
                              ? "linear-gradient(180deg, rgba(0,255,180,.10), rgba(0,0,0,.18))"
                              : isNeg
                              ? "linear-gradient(180deg, rgba(255,70,90,.10), rgba(0,0,0,.18))"
                              : "rgba(0,0,0,.18)",
                          }}
                        >
                          <div className="gp-cardMeta" style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                            <span><b>{String(c.day).padStart(2, "0")}</b></span>
                            <span>{c.count || 0} ops</span>
                          </div>

                          <div
                            style={{
                              marginTop: 8,
                              fontWeight: 900,
                              fontSize: 14,
                              color: isPos ? "var(--green, #3ee089)" : isNeg ? "var(--red, #ff6b81)" : "rgba(234,243,255,0.66)",
                            }}
                          >
                            {score === 0 ? "0" : score > 0 ? `+${score}` : `${score}`}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="gp-help">Sin datos todavía.</div>
              )}
            </div>
          </div>

          <div style={{ display: "grid", gap: 18 }}>
            <div className="gp-card">
              <div className="gp-cardHeader">
                <div>
                  <div className="gp-cardTitle">Resumen</div>
                  <div className="gp-cardMeta">Mes seleccionado</div>
                </div>
              </div>
              <div className="gp-cardBody">
                <div className="gp-kvRow"><span className="gp-k">Operaciones</span><b>{stats.total}</b></div>
                <div className="gp-kvRow"><span className="gp-k">Victorias (TP1+)</span><b style={{ color: "var(--green, #3ee089)" }}>{stats.wins}</b></div>
                <div className="gp-kvRow"><span className="gp-k">Pérdidas (SL)</span><b style={{ color: "var(--red, #ff6b81)" }}>{stats.losses}</b></div>
                <div className="gp-kvRow"><span className="gp-k">Pendientes</span><b>{stats.pending}</b></div>
              </div>
            </div>

            <div className="gp-card">
              <div className="gp-cardHeader">
                <div>
                  <div className="gp-cardTitle">Distribución TP</div>
                  <div className="gp-cardMeta">Qué TP se alcanza más</div>
                </div>
              </div>
              <div className="gp-cardBody">
                <div className="gp-kvRow"><span className="gp-k">TP1</span><b>{stats.tp1}</b></div>
                <div className="gp-kvRow"><span className="gp-k">TP2</span><b>{stats.tp2}</b></div>
                <div className="gp-kvRow"><span className="gp-k">TP3</span><b>{stats.tp3}</b></div>
              </div>
            </div>
          </div>
        </div>

        <div className="gp-card" style={{ marginTop: 18 }}>
          <div className="gp-cardHeader">
            <div>
              <div className="gp-cardTitle">Registro de operaciones</div>
              <div className="gp-cardMeta">Desplegable · Paginado ({PAGE_SIZE} por página) · Automático</div>
            </div>

            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <div className="gp-cardMeta">
                Página <b>{page}</b> / <b>{totalPages}</b>
              </div>
              <button className="gp-uploadBtn" type="button" onClick={() => setPage((p) => Math.max(1, p - 1))}>◀</button>
              <button className="gp-uploadBtn" type="button" onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>▶</button>
            </div>
          </div>

          <div className="gp-cardBody">
            {monthItems.length === 0 ? (
              <div className="gp-help">Aún no hay operaciones este mes.</div>
            ) : (
              <details className="gp-section" open={false}>
                <summary style={{ cursor: "pointer", fontWeight: 900, listStyle: "none" as any }}>
                  📌 Ver / Ocultar registro (paginado)
                </summary>

                <div style={{ display: "grid", gap: 10, marginTop: 12 }}>
                  {pageItems.map((x) => {
                    const dt = new Date(x.createdAt);
                    const badge =
                      x.outcome === "SL"
                        ? "SL ❌"
                        : x.outcome === "TP3"
                        ? "TP3 ✅✅✅"
                        : x.outcome === "TP2"
                        ? "TP2 ✅✅"
                        : x.outcome === "TP1"
                        ? "TP1 ✅"
                        : "Pendiente";

                    return (
                      <div key={x.id} className="gp-section">
                        <div className="gp-cardMeta" style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                          <span>
                            <b>{x.kind === "PREMIUM" ? "Premium" : "Scalp"}</b> · {x.symbol} · {x.timeframe} ·{" "}
                            <b style={{ color: x.side === "BUY" ? "var(--green, #3ee089)" : "var(--red, #ff6b81)" }}>{x.side}</b> ·{" "}
                            {Math.round(x.confidence)}%
                          </span>
                          <span>{dt.toLocaleString()}</span>
                        </div>

                        <div className="gp-cardMeta" style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
                          <span><b>{badge}</b></span>
                          <span>{x.title}</span>
                        </div>

                        <div className="gp-kv" style={{ marginTop: 10 }}>
                          <div className="gp-kvRow"><div className="gp-k">Entry</div><div className="gp-v">{x.entry}</div></div>
                          <div className="gp-kvRow"><div className="gp-k">SL</div><div className="gp-v gp-red">{x.sl}</div></div>
                          {typeof x.tp1 === "number" && <div className="gp-kvRow"><div className="gp-k">TP1</div><div className="gp-v gp-green">{x.tp1}</div></div>}
                          {typeof x.tp2 === "number" && <div className="gp-kvRow"><div className="gp-k">TP2</div><div className="gp-v gp-green">{x.tp2}</div></div>}
                          {typeof x.tp3 === "number" && <div className="gp-kvRow"><div className="gp-k">TP3</div><div className="gp-v gp-green">{x.tp3}</div></div>}
                        </div>

                        {x.thesis ? (
                          <div className="gp-cardMeta" style={{ marginTop: 10 }}>
                            Tesis: {x.thesis}
                          </div>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              </details>
            )}
          </div>
        </div>

        <section className="gp-bottomNav">
          <button onClick={() => router.push("/dashboard")} className="gp-bottomItem">
            <span>🏠</span><span>Dashboard</span>
          </button>
          <button onClick={() => router.push("/analyze")} className="gp-bottomItem">
            <span>📈</span><span>Analyze</span>
          </button>
          <button onClick={() => router.push("/diary")} className="gp-bottomItem">
            <span>📘</span><span>Diario</span>
          </button>
          <button onClick={() => router.push("/scalping-goldpulse")} className="gp-bottomItem">
            <span>⚡</span><span>Estrategia</span>
          </button>
        </section>
      </div>

      <style jsx>{styles}</style>
    </div>
  );
}

const styles = `
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
    background-repeat: no-repeat;
  }

  .gp-page:before {
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

  .gp-wrap {
    max-width: 1180px;
    margin: 0 auto;
    padding: 16px 16px 92px;
    position: relative;
    z-index: 1;
  }

  .gp-topbar {
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
    box-shadow: 0 18px 60px rgba(0, 0, 0, 0.35);
    backdrop-filter: blur(14px);
  }

  .gp-topbarLeft {
    display: flex;
    align-items: center;
    gap: 12px;
    min-width: 0;
  }

  .gp-logo {
    height: 52px;
    width: auto;
    display: block;
    cursor: pointer;
  }

  .gp-topTitle {
    font-size: 18px;
    font-weight: 800;
  }

  .gp-topSub {
    margin-top: 4px;
    color: rgba(234, 243, 255, 0.72);
    font-size: 13px;
  }

  .gp-topActions {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }

  .gp-menuBtn {
    display: none;
    width: 42px;
    height: 42px;
    border-radius: 12px;
    border: 1px solid rgba(255,255,255,0.12);
    background: rgba(255,255,255,0.05);
    color: white;
    font-size: 20px;
  }

  .gp-mobileMenu {
    display: none;
  }

  .gp-card {
    border-radius: 22px;
    background: rgba(0, 0, 0, 0.34);
    border: 1px solid rgba(255, 255, 255, 0.08);
    backdrop-filter: blur(14px);
    padding: 20px;
  }

  .gp-cardHeader {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 14px;
  }

  .gp-cardTitle {
    font-size: 22px;
    font-weight: 800;
  }

  .gp-cardMeta {
    margin-top: 4px;
    color: rgba(234,243,255,0.68);
    font-size: 13px;
  }

  .gp-cardBody {
    display: grid;
    gap: 14px;
  }

  .gp-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }

  .gp-gridCalendar {
    display: grid;
    grid-template-columns: 1.5fr 1fr;
    gap: 16px;
  }

  .gp-section {
    border-radius: 16px;
    padding: 14px;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.07);
  }

  .gp-sectionTitle {
    font-size: 14px;
    font-weight: 800;
    color: rgba(255,220,160,0.92);
  }

  .gp-sectionText {
    margin-top: 8px;
    color: rgba(234,243,255,0.78);
    line-height: 1.7;
    font-size: 14px;
  }

  .gp-label {
    color: rgba(234,243,255,0.84);
    font-size: 13px;
    font-weight: 700;
    margin-bottom: 8px;
  }

  .gp-select,
  .gp-input {
    width: 100%;
    padding: 13px 14px;
    border-radius: 14px;
    border: 1px solid rgba(255,255,255,0.10);
    background: rgba(255,255,255,0.04);
    color: white;
    outline: none;
  }

  .gp-kv {
    display: grid;
    gap: 10px;
  }

  .gp-kvRow {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    padding: 12px 14px;
    border-radius: 14px;
    background: rgba(0,0,0,0.24);
    border: 1px solid rgba(255,255,255,0.06);
    flex-wrap: wrap;
  }

  .gp-k {
    color: rgba(234,243,255,0.66);
  }

  .gp-v {
    font-weight: 800;
  }

  .gp-green {
    color: var(--green, #3ee089);
  }

  .gp-red {
    color: var(--red, #ff6b81);
  }

  .gp-help {
    color: rgba(234,243,255,0.68);
    font-size: 13px;
    line-height: 1.6;
  }

  .gp-uploadBtn,
  .gp-softBtn {
    padding: 12px 16px;
    border-radius: 12px;
    cursor: pointer;
    font-weight: 800;
    border: 1px solid rgba(255,255,255,0.12);
    background: rgba(255,255,255,0.05);
    color: white;
  }

  .gp-bottomNav {
    position: fixed;
    left: 12px;
    right: 12px;
    bottom: 12px;
    z-index: 30;
    display: none;
    grid-template-columns: repeat(4, 1fr);
    gap: 8px;
    padding: 8px;
    border-radius: 18px;
    background: rgba(0,0,0,0.55);
    border: 1px solid rgba(255,255,255,0.08);
    backdrop-filter: blur(14px);
    box-shadow: 0 18px 60px rgba(0,0,0,0.35);
  }

  .gp-bottomItem {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 4px;
    min-height: 56px;
    border-radius: 14px;
    border: 1px solid rgba(255,255,255,0.06);
    background: rgba(255,255,255,0.04);
    color: white;
    font-size: 12px;
  }

  @media (max-width: 980px) {
    .gp-topActions {
      display: none;
    }

    .gp-menuBtn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }

    .gp-mobileMenu {
      display: grid;
      gap: 8px;
      margin-top: 12px;
      padding: 14px;
      border-radius: 18px;
      background: rgba(0,0,0,0.42);
      border: 1px solid rgba(255,255,255,0.08);
      backdrop-filter: blur(14px);
    }

    .gp-mobileMenu button {
      text-align: left;
      padding: 12px 14px;
      border-radius: 12px;
      border: 1px solid rgba(255,255,255,0.08);
      background: rgba(255,255,255,0.04);
      color: white;
    }

    .gp-grid,
    .gp-gridCalendar {
      grid-template-columns: 1fr;
    }

    .gp-bottomNav {
      display: grid;
    }
  }

  @media (max-width: 680px) {
    .gp-wrap {
      padding: 12px 12px 92px;
    }

    .gp-topbar {
      padding: 10px 12px;
      border-radius: 18px;
    }

    .gp-logo {
      height: 42px;
    }

    .gp-topTitle {
      font-size: 16px;
    }

    .gp-topSub {
      font-size: 12px;
    }

    .gp-card {
      border-radius: 18px;
      padding: 18px;
    }
  }
`;