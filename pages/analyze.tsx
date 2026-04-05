import Link from "next/link";
import { useMemo, useRef, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { getSupabaseClient } from "../lib/supabaseClient";

const SYMBOLS = ["XAUUSD", "OANDA:EURUSD", "GBPUSD", "NAS100USD", "BTCUSDT"];
const TIMEFRAMES = ["1m", "5m", "15m", "1h", "4h", "1D"] as const;

type PremiumSignal = {
  title: string;
  side: "BUY" | "SELL";
  confidence: number;
  entry: string;
  sl: number;
  tp1?: number;
  tp2?: number;
  tp3?: number;
  rationale: string;
  sections?: { technical?: string; fundamental?: string; sentiment?: string };
  bias?: { label: string; explanation: string };
};

type FlashSignal = {
  title: string;
  side: "BUY" | "SELL";
  confidence: number;
  entry: number;
  sl: number;
  tp1: number;
  tp2: number;
  tp3: number;
  rationale: string;
};

type ApiMeta = {
  usedToday: number;
  remaining: number;
  limit: number;
  dateKey: string;
};

type TradeOutcome = "PENDING" | "TP1" | "TP2" | "TP3" | "SL";

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
  outcome: TradeOutcome;
  pnl?: number;
};

type AccessLevel = "free" | "premium" | "vip" | "admin";

const JOURNAL_KEY = "goldpulse_journal_v1";

function newId() {
  return `${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

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

export default function Analyze() {
  const router = useRouter();

  const [authChecked, setAuthChecked] = useState(false);
  const [accessLevel, setAccessLevel] = useState<AccessLevel | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const [symbol, setSymbol] = useState(SYMBOLS[0]);
  const [timeframe, setTimeframe] = useState<(typeof TIMEFRAMES)[number]>("15m");
  const [currentPrice, setCurrentPrice] = useState("");

  const [fileName, setFileName] = useState<string>("No has subido imagen");
  const [file, setFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [premium, setPremium] = useState<PremiumSignal | null>(null);
  const [flash, setFlash] = useState<FlashSignal | null>(null);
  const [meta, setMeta] = useState<ApiMeta | null>(null);
  const [error, setError] = useState<string>("");

  const [journalCount, setJournalCount] = useState(0);
  const fileRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const supabase = getSupabaseClient();

    async function checkUserAndAccess() {
      const { data: userData, error: userError } = await supabase.auth.getUser();

      if (userError || !userData.user) {
        router.replace("/login");
        return;
      }

      const user = userData.user;

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("access_level")
        .eq("id", user.id)
        .single();

      if (profileError || !profile) {
        router.replace("/upgrade");
        return;
      }

      const level = (profile.access_level || "free") as AccessLevel;
      setAccessLevel(level);

      if (level === "premium" || level === "vip" || level === "admin") {
        setAuthChecked(true);
        return;
      }

      router.replace("/upgrade");
    }

    checkUserAndAccess();
  }, [router]);

  useEffect(() => {
    const j = loadJournal();
    setJournalCount(j.length);
  }, []);

  const tvInterval = useMemo(() => {
    if (timeframe === "1m") return "1";
    if (timeframe === "5m") return "5";
    if (timeframe === "15m") return "15";
    if (timeframe === "1h") return "60";
    if (timeframe === "4h") return "240";
    return "D";
  }, [timeframe]);

  async function onGenerate() {
    setError("");
    setPremium(null);
    setFlash(null);

    const price = Number(currentPrice);
    if (!Number.isFinite(price)) {
      setError("Escribe un precio válido (número).");
      return;
    }

    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("symbol", symbol);
      fd.append("timeframe", timeframe);
      fd.append("currentPrice", String(price));
      if (file) fd.append("image", file);

      const r = await fetch("/api/analyze", { method: "POST", body: fd });

      const text = await r.text();
      let j: any = null;

      try {
        j = JSON.parse(text);
      } catch {
        setError(`La API no devolvió JSON. Status: ${r.status}. Respuesta: ${text.slice(0, 220)}...`);
        return;
      }

      if (!r.ok) {
        setError(typeof j?.error === "string" ? j.error : JSON.stringify(j, null, 2));
        if (j?.meta) setMeta(j.meta);
        return;
      }

      setPremium(j.premium || null);
      setFlash(j.momentum || null);
      setMeta(j.meta || null);

      const now = Date.now();
      const existing = loadJournal();
      const next: JournalItem[] = [...existing];

      if (j.premium) {
        next.unshift({
          id: newId(),
          createdAt: now,
          symbol,
          timeframe,
          kind: "PREMIUM",
          title: j.premium.title || "GoldPulse Premium (Institucional)",
          side: j.premium.side,
          confidence: Number(j.premium.confidence) || 0,
          entry: String(j.premium.entry ?? ""),
          sl: Number(j.premium.sl),
          tp1: typeof j.premium.tp1 === "number" ? j.premium.tp1 : undefined,
          tp2: typeof j.premium.tp2 === "number" ? j.premium.tp2 : undefined,
          tp3: typeof j.premium.tp3 === "number" ? j.premium.tp3 : undefined,
          thesis: j.premium.rationale,
          outcome: "PENDING",
        });
      }

      if (j.momentum) {
        next.unshift({
          id: newId(),
          createdAt: now,
          symbol,
          timeframe,
          kind: "SCALP",
          title: "GoldPulse Scalp",
          side: j.momentum.side,
          confidence: Number(j.momentum.confidence) || 0,
          entry: String(j.momentum.entry ?? ""),
          sl: Number(j.momentum.sl),
          tp1: j.momentum.tp1,
          tp2: j.momentum.tp2,
          tp3: j.momentum.tp3,
          thesis: j.momentum.rationale,
          outcome: "PENDING",
        });
      }

      const trimmed = next.slice(0, 2000);
      saveJournal(trimmed);
      setJournalCount(trimmed.length);
    } catch (e: any) {
      setError(e?.message || "Error desconocido");
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    const supabase = getSupabaseClient();
    await supabase.auth.signOut();
    router.push("/login");
  }

  if (!authChecked) {
    return (
      <div className="gp-page">
        <div className="gp-loading">Verificando acceso...</div>

        <style jsx>{`
          .gp-page {
            min-height: 100vh;
            display: grid;
            place-items: center;
            color: white;
            background:
              radial-gradient(1200px 800px at 70% 35%, rgba(255, 190, 80, 0.12), transparent 60%),
              radial-gradient(900px 600px at 30% 30%, rgba(60, 180, 255, 0.1), transparent 55%),
              linear-gradient(180deg, rgba(0, 0, 0, 0.55), rgba(0, 0, 0, 0.92)),
              url("/landing/hero-bg.jpg");
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
          }
          .gp-loading {
            font-size: 18px;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="gp-page">
      <div className="gp-wrap">
        <div className="gp-topbar">
          <div className="gp-topbarLeft">
            <Link href="/" style={{ display: "inline-block" }}>
              <img src="/branding/logo.png" alt="GoldPulse Pro" className="gp-logo" />
            </Link>

            <div className="gp-topInfo">
              <div className="gp-topTitle">Analyze</div>
              <div className="gp-topSub">Panel premium de análisis y señales</div>
            </div>
          </div>

          <nav className="gp-topActions">
            <button type="button" className="gp-softBtn" onClick={() => router.push("/dashboard")}>
              Dashboard
            </button>
            <button type="button" className="gp-softBtn" onClick={() => router.push("/diary")}>
              Diario
            </button>
            <button type="button" className="gp-softBtn" onClick={() => router.push("/scalping-goldpulse")}>
              Estrategia
            </button>
            <button type="button" className="gp-goldBtn" onClick={handleLogout}>
              Cerrar sesión
            </button>
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
            <button onClick={() => { setMenuOpen(false); handleLogout(); }}>Cerrar sesión</button>
          </div>
        )}

        <section className="gp-hero">
          <div className="gp-heroCard">
            <div className="gp-pill">PANEL OPERATIVO</div>
            <h1 className="gp-heroTitle">Genera una señal con estructura y dirección operativa</h1>
            <p className="gp-heroText">
              Selecciona el símbolo, timeframe y precio actual. Opcionalmente puedes subir una imagen
              del gráfico para dar más contexto al análisis.
            </p>

            <div className="gp-quickStats">
              <div className="gp-statBox">
                <div className="gp-statLabel">Nivel</div>
                <div className="gp-statValue">{accessLevel ? accessLevel.toUpperCase() : "—"}</div>
              </div>
              <div className="gp-statBox">
                <div className="gp-statLabel">Uso hoy</div>
                <div className="gp-statValueSmall">{meta ? `${meta.usedToday}/${meta.limit}` : "—"}</div>
              </div>
              <div className="gp-statBox">
                <div className="gp-statLabel">Diario</div>
                <div className="gp-statValueSmall">{journalCount} registros</div>
              </div>
            </div>
          </div>
        </section>

        <div className="gp-grid">
          <div style={{ display: "grid", gap: 18 }}>
            <div className="gp-card">
              <div className="gp-cardHeader">
                <div>
                  <div className="gp-cardTitle">TradingView (Vista comercial)</div>
                  <div className="gp-cardMeta">
                    {symbol} · {timeframe}
                  </div>
                </div>
                <div className="gp-livePill">Live</div>
              </div>

              <div className="gp-chartWrap">
                <iframe
                  key={`${symbol}-${tvInterval}`}
                  src={`https://s.tradingview.com/widgetembed/?frameElementId=tradingview&symbol=${encodeURIComponent(
                    symbol
                  )}&interval=${encodeURIComponent(
                    tvInterval
                  )}&hidesidetoolbar=1&hidetoptoolbar=0&symboledit=0&saveimage=0&toolbarbg=%230a1623&studies=%5B%5D&theme=dark&style=1&timezone=Etc%2FUTC&withdateranges=1&hideideas=1`}
                  className="gp-tvFrame"
                />
              </div>
            </div>

            {premium ? (
              <ResultCard
                title={premium.title || "GoldPulse Premium (Institucional)"}
                side={premium.side}
                confidence={premium.confidence}
                entryLabel="Entrada institucional"
                entryValue={premium.entry}
                sl={premium.sl}
                tp1={premium.tp1}
                tp2={premium.tp2}
                tp3={premium.tp3}
                thesisTitle="Tesis de entrada"
                rationale={premium.rationale}
                bias={premium.bias}
                sections={premium.sections}
              />
            ) : (
              <EmptyCard
                title="Señal Premium"
                text="Aquí aparecerá la señal premium institucional cuando generes el análisis."
              />
            )}
          </div>

          <div style={{ display: "grid", gap: 18 }}>
            <div className="gp-card">
              <div className="gp-cardHeader">
                <div>
                  <div className="gp-cardTitle">Generador de Señales IA</div>
                  <div className="gp-cardMeta">Premium + Scalp</div>
                </div>
                <div className="gp-cardMeta">{meta ? `${meta.remaining} restantes` : "—"}</div>
              </div>

              <div className="gp-cardBody">
                <div className="gp-form">
                  <div>
                    <div className="gp-label">Símbolo</div>
                    <select className="gp-select" value={symbol} onChange={(e) => setSymbol(e.target.value)}>
                      {SYMBOLS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="gp-row2">
                    <div>
                      <div className="gp-label">Periodo de tiempo</div>
                      <select
                        className="gp-select"
                        value={timeframe}
                        onChange={(e) => setTimeframe(e.target.value as any)}
                      >
                        {TIMEFRAMES.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <div className="gp-label">Precio actual</div>
                      <input
                        className="gp-input"
                        placeholder="Ej: 5076.91"
                        value={currentPrice}
                        onChange={(e) => setCurrentPrice(e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="gp-label">Gráfico (opcional)</div>
                    <div className="gp-uploadRow">
                      <input
                        ref={fileRef}
                        type="file"
                        accept="image/png,image/jpeg"
                        style={{ display: "none" }}
                        onChange={(e) => {
                          const f = e.target.files?.[0] || null;
                          setFile(f);
                          setFileName(f ? f.name : "No has subido imagen");
                        }}
                      />
                      <button type="button" className="gp-uploadBtn" onClick={() => fileRef.current?.click()}>
                        📎 Cargar
                      </button>
                      <div className="gp-fileHint">{fileName}</div>
                    </div>
                  </div>

                  <div className="gp-help">
                    Si no subes imagen, el agente analiza con precio + símbolo + timeframe.
                  </div>

                  <button className="gp-btnPrimary" onClick={onGenerate} disabled={loading}>
                    ⚡ {loading ? "Generando..." : "Generar Señal"}
                  </button>

                  {error ? <div className="gp-error">{error}</div> : null}
                </div>
              </div>
            </div>

            {flash ? (
              <ResultCard
                title="GoldPulse Scalp"
                side={flash.side}
                confidence={flash.confidence}
                entryLabel="Entrada (precio actual)"
                entryValue={String(flash.entry)}
                sl={flash.sl}
                tp1={flash.tp1}
                tp2={flash.tp2}
                tp3={flash.tp3}
                thesisTitle="Impulso"
                rationale={flash.rationale}
              />
            ) : (
              <EmptyCard
                title="GoldPulse Scalp"
                text="Aquí aparecerá la señal rápida de scalp cuando generes el análisis."
              />
            )}
          </div>
        </div>

        <section className="gp-bottomNav">
          <button onClick={() => router.push("/dashboard")} className="gp-bottomItem">
            <span>🏠</span>
            <span>Dashboard</span>
          </button>
          <button onClick={() => router.push("/analyze")} className="gp-bottomItem">
            <span>📈</span>
            <span>Analyze</span>
          </button>
          <button onClick={() => router.push("/diary")} className="gp-bottomItem">
            <span>📘</span>
            <span>Diario</span>
          </button>
          <button onClick={() => router.push("/scalping-goldpulse")} className="gp-bottomItem">
            <span>⚡</span>
            <span>Estrategia</span>
          </button>
        </section>
      </div>

      <style jsx>{`
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

        .gp-hero {
          margin-top: 18px;
        }

        .gp-heroCard,
        .gp-card,
        .gp-emptyCard {
          border-radius: 22px;
          background: rgba(0, 0, 0, 0.34);
          border: 1px solid rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(14px);
        }

        .gp-heroCard {
          padding: 24px;
        }

        .gp-pill {
          display: inline-block;
          padding: 8px 12px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 700;
          color: rgba(255, 220, 160, 0.92);
          background: rgba(255, 190, 80, 0.10);
          border: 1px solid rgba(255, 210, 120, 0.18);
        }

        .gp-heroTitle {
          margin: 14px 0 0;
          font-size: 38px;
          line-height: 1.08;
        }

        .gp-heroText {
          margin-top: 14px;
          max-width: 760px;
          color: rgba(234, 243, 255, 0.82);
          line-height: 1.7;
        }

        .gp-quickStats {
          margin-top: 18px;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }

        .gp-statBox {
          padding: 16px;
          border-radius: 18px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
        }

        .gp-statLabel {
          color: rgba(234,243,255,0.68);
          font-size: 13px;
        }

        .gp-statValue {
          margin-top: 8px;
          font-size: 28px;
          font-weight: 900;
        }

        .gp-statValueSmall {
          margin-top: 8px;
          font-size: 18px;
          font-weight: 800;
        }

        .gp-grid {
          margin-top: 18px;
          display: grid;
          grid-template-columns: 1.05fr 0.95fr;
          gap: 16px;
        }

        .gp-card {
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

        .gp-livePill {
          padding: 8px 12px;
          border-radius: 999px;
          background: rgba(60,160,255,0.10);
          border: 1px solid rgba(120,190,255,0.18);
          color: rgba(220,245,255,0.92);
          font-size: 12px;
          font-weight: 800;
        }

        .gp-chartWrap {
          border-radius: 18px;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.06);
          background: rgba(255,255,255,0.03);
        }

        .gp-tvFrame {
          width: 100%;
          height: 540px;
          border: 0;
          display: block;
        }

        .gp-cardBody {
          display: grid;
          gap: 14px;
        }

        .gp-form {
          display: grid;
          gap: 14px;
        }

        .gp-label {
          color: rgba(234,243,255,0.84);
          font-size: 13px;
          font-weight: 700;
          margin-bottom: 8px;
        }

        .gp-row2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .gp-select,
        .gp-input {
          width: 100%;
          padding: 13px 14px;
          border-radius: 14px;
          border: 1px solid rgba(255,255,255,0.10);
          background: rgba(255,255,255,0.04);
          color: #ffffff;
          outline: none;
          -webkit-appearance: none;
          appearance: none;
        }

        .gp-select option {
          background-color: #0f1115;
          color: #ffffff;
        }

        .gp-uploadRow {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }

        .gp-uploadBtn,
        .gp-softBtn,
        .gp-goldBtn,
        .gp-btnPrimary {
          padding: 12px 16px;
          border-radius: 12px;
          cursor: pointer;
          font-weight: 800;
        }

        .gp-softBtn,
        .gp-uploadBtn {
          border: 1px solid rgba(255,255,255,0.12);
          background: rgba(255,255,255,0.05);
          color: white;
        }

        .gp-goldBtn {
          border: 1px solid rgba(255,200,110,0.45);
          background: linear-gradient(180deg, rgba(255,200,110,0.25), rgba(0,0,0,0.18));
          color: white;
        }

        .gp-btnPrimary {
          border: 1px solid rgba(120,190,255,0.35);
          background: linear-gradient(180deg, rgba(60,160,255,0.30), rgba(0,0,0,0.18));
          color: white;
        }

        .gp-fileHint {
          color: rgba(234,243,255,0.66);
          font-size: 13px;
          word-break: break-word;
        }

        .gp-help {
          color: rgba(234,243,255,0.68);
          font-size: 13px;
          line-height: 1.6;
        }

        .gp-error {
          padding: 12px 14px;
          border-radius: 14px;
          background: rgba(255,90,90,0.10);
          border: 1px solid rgba(255,90,90,0.18);
          color: #ffd7d7;
          font-size: 14px;
        }

        .gp-emptyCard {
          padding: 20px;
        }

        .gp-emptyTitle {
          font-size: 22px;
          font-weight: 800;
        }

        .gp-emptyText {
          margin-top: 10px;
          color: rgba(234,243,255,0.76);
          line-height: 1.7;
        }

        .gp-badge {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 10px 12px;
          border-radius: 14px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          font-size: 13px;
          font-weight: 800;
        }

        .gp-bigConf {
          font-size: 28px;
          font-weight: 900;
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

        .gp-sections {
          display: grid;
          gap: 12px;
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

          .gp-quickStats,
          .gp-grid,
          .gp-row2 {
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

          .gp-heroCard,
          .gp-card,
          .gp-emptyCard {
            border-radius: 18px;
          }

          .gp-heroCard,
          .gp-card,
          .gp-emptyCard {
            padding: 18px;
          }

          .gp-heroTitle {
            font-size: 30px;
          }

          .gp-heroText {
            font-size: 15px;
          }

          .gp-statValue {
            font-size: 22px;
          }

          .gp-statValueSmall {
            font-size: 16px;
          }

          .gp-cardTitle,
          .gp-emptyTitle {
            font-size: 20px;
          }

          .gp-tvFrame {
            height: 360px;
          }
        }
      `}</style>
    </div>
  );
}

function EmptyCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="gp-emptyCard">
      <div className="gp-emptyTitle">{title}</div>
      <div className="gp-emptyText">{text}</div>
    </div>
  );
}

function ResultCard(props: {
  title: string;
  side: "BUY" | "SELL";
  confidence: number;
  entryLabel: string;
  entryValue: string;
  sl: number;
  tp1?: number;
  tp2?: number;
  tp3?: number;
  thesisTitle: string;
  rationale: string;
  bias?: { label: string; explanation: string };
  sections?: { technical?: string; fundamental?: string; sentiment?: string };
}) {
  const isBuy = props.side === "BUY";

  return (
    <div className="gp-card">
      <div className="gp-cardHeader">
        <div>
          <div className="gp-cardTitle">{props.title}</div>
          <div className="gp-cardMeta">Señal única · Alta probabilidad</div>
        </div>

        <div className="gp-badge">
          <strong style={{ color: isBuy ? "var(--green, #3ee089)" : "var(--red, #ff6b81)" }}>
            {props.side}
          </strong>
          <span style={{ color: "rgba(234,243,255,0.68)" }}>{Math.round(props.confidence)}%</span>
        </div>
      </div>

      <div className="gp-cardBody">
        {props.bias?.label ? (
          <div className="gp-section">
            <div className="gp-sectionTitle">Bias del día</div>
            <div className="gp-sectionText">
              <strong>{props.bias.label}</strong> — {props.bias.explanation}
            </div>
          </div>
        ) : null}

        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12 }}>
          <div className="gp-cardMeta">Confianza</div>
          <div className="gp-bigConf">{Math.round(props.confidence)}%</div>
        </div>

        <div className="gp-kv">
          <div className="gp-kvRow">
            <div className="gp-k">{props.entryLabel}</div>
            <div className="gp-v">{props.entryValue}</div>
          </div>

          <div className="gp-kvRow">
            <div className="gp-k">Stop Loss</div>
            <div className="gp-v gp-red">{props.sl}</div>
          </div>

          {typeof props.tp1 === "number" && (
            <div className="gp-kvRow">
              <div className="gp-k">Take Profit 1</div>
              <div className="gp-v gp-green">{props.tp1}</div>
            </div>
          )}

          {typeof props.tp2 === "number" && (
            <div className="gp-kvRow">
              <div className="gp-k">Take Profit 2</div>
              <div className="gp-v gp-green">{props.tp2}</div>
            </div>
          )}

          {typeof props.tp3 === "number" && props.tp3 !== 0 && (
            <div className="gp-kvRow">
              <div className="gp-k">Take Profit 3</div>
              <div className="gp-v gp-green">{props.tp3}</div>
            </div>
          )}
        </div>

        <div className="gp-sections">
          <div className="gp-section">
            <div className="gp-sectionTitle">{props.thesisTitle}</div>
            <div className="gp-sectionText">{props.rationale}</div>
          </div>

          {props.sections?.technical && (
            <div className="gp-section">
              <div className="gp-sectionTitle">Análisis Técnico</div>
              <div className="gp-sectionText">{props.sections.technical}</div>
            </div>
          )}

          {props.sections?.fundamental && (
            <div className="gp-section">
              <div className="gp-sectionTitle">Análisis Fundamental</div>
              <div className="gp-sectionText">{props.sections.fundamental}</div>
            </div>
          )}

          {props.sections?.sentiment && (
            <div className="gp-section">
              <div className="gp-sectionTitle">Sentimiento del Mercado</div>
              <div className="gp-sectionText">{props.sections.sentiment}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}