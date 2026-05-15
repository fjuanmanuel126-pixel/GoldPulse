// pages/analyze.tsx

import Link from "next/link";
import { useMemo, useRef, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { getSupabaseClient } from "../lib/supabaseClient";

const SYMBOLS = [
  "XAUUSD",
  "OANDA:EURUSD",
  "GBPUSD",
  "NAS100USD",
  "BTCUSDT",
];

const TIMEFRAMES = ["1m", "5m", "15m", "1h", "4h", "1D"] as const;

type AccessLevel = "free" | "premium" | "vip" | "admin";

export default function Analyze() {
  const router = useRouter();

  const [authChecked, setAuthChecked] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const [accessLevel, setAccessLevel] =
    useState<AccessLevel | null>(null);

  const [symbol, setSymbol] = useState(SYMBOLS[0]);

  const [timeframe, setTimeframe] =
    useState<(typeof TIMEFRAMES)[number]>("15m");

  const [currentPrice, setCurrentPrice] = useState("");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [fileName, setFileName] =
    useState("No has subido imagen");

  const [file, setFile] = useState<File | null>(null);

  const fileRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const supabase = getSupabaseClient();

    async function checkUser() {
      const { data } = await supabase.auth.getUser();

      if (!data.user) {
        router.replace("/login");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("access_level")
        .eq("id", data.user.id)
        .single();

      const level = (profile?.access_level ||
        "free") as AccessLevel;

      setAccessLevel(level);

      if (
        level === "premium" ||
        level === "vip" ||
        level === "admin"
      ) {
        setAuthChecked(true);
        return;
      }

      router.replace("/upgrade");
    }

    checkUser();
  }, [router]);

  const tvInterval = useMemo(() => {
    if (timeframe === "1m") return "1";
    if (timeframe === "5m") return "5";
    if (timeframe === "15m") return "15";
    if (timeframe === "1h") return "60";
    if (timeframe === "4h") return "240";
    return "D";
  }, [timeframe]);

  async function onGenerate() {
    setLoading(true);
    setError("");

    try {
      await new Promise((r) => setTimeout(r, 1200));
    } catch (e: any) {
      setError(e.message || "Error");
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
      <div className="loadingPage">
        Verificando acceso...
      </div>
    );
  }

  return (
    <div className="gp-page">
      <div className="gp-wrap">

        {/* TOPBAR */}

        <div className="gp-topbar">

          <div className="gp-topbarLeft">

            <Link href="/">
              <img
                src="/branding/logo.png"
                alt="logo"
                className="gp-logo"
              />
            </Link>

            <div className="gp-topInfo">

              <div className="gp-topTitle">
                Analyze
              </div>

              <div className="gp-topSub">
                Panel premium de análisis
              </div>

            </div>

          </div>

          {/* MENU WEB */}

          <nav className="gp-topActions">

            <button
              className="gp-softBtn"
              onClick={() =>
                router.push("/dashboard")
              }
            >
              Dashboard
            </button>

            <button
              className="gp-softBtn"
              onClick={() =>
                router.push("/analyze")
              }
            >
              Analyze
            </button>

            <button
              className="gp-softBtn"
              onClick={() =>
                router.push("/diary")
              }
            >
              Diario
            </button>

            <button
              className="gp-softBtn"
              onClick={() =>
                router.push("/upgrade")
              }
            >
              Upgrade
            </button>

            <button
              className="gp-goldBtn"
              onClick={handleLogout}
            >
              Cerrar sesión
            </button>

          </nav>

          {/* MENU BTN */}

          <button
            className="gp-menuBtn"
            onClick={() =>
              setMenuOpen(!menuOpen)
            }
          >
            ☰
          </button>

        </div>

        {/* MENU MOVIL */}

        {menuOpen && (
          <div className="gp-mobileMenu">

            <button
              onClick={() => {
                setMenuOpen(false);
                router.push("/dashboard");
              }}
            >
              Dashboard
            </button>

            <button
              onClick={() => {
                setMenuOpen(false);
                router.push("/analyze");
              }}
            >
              Analyze
            </button>

            <button
              onClick={() => {
                setMenuOpen(false);
                router.push("/diary");
              }}
            >
              Diario
            </button>

            <button
              onClick={() => {
                setMenuOpen(false);
                router.push("/upgrade");
              }}
            >
              Upgrade
            </button>

            <button
              onClick={() => {
                setMenuOpen(false);
                handleLogout();
              }}
            >
              Cerrar sesión
            </button>

          </div>
        )}

        {/* HERO */}

        <section className="gp-hero">

          <div className="gp-heroCard">

            <div className="gp-pill">
              PANEL OPERATIVO
            </div>

            <h1 className="gp-heroTitle">
              Genera una señal con estructura y dirección operativa
            </h1>

            <p className="gp-heroText">
              Selecciona símbolo, timeframe y precio actual.
            </p>

          </div>

        </section>

        {/* GRID */}

        <div className="gp-grid">

          {/* CHART */}

          <div className="gp-card">

            <div className="gp-cardHeader">

              <div>

                <div className="gp-cardTitle">
                  TradingView
                </div>

                <div className="gp-cardMeta">
                  {symbol} · {timeframe}
                </div>

              </div>

            </div>

            <div className="gp-chartWrap">

              <iframe
                key={`${symbol}-${tvInterval}`}
                src={`https://s.tradingview.com/widgetembed/?symbol=${encodeURIComponent(
                  symbol
                )}&interval=${tvInterval}&theme=dark`}
                className="gp-tvFrame"
              />

            </div>

          </div>

          {/* FORM */}

          <div className="gp-card">

            <div className="gp-form">

              <div>

                <div className="gp-label">
                  Símbolo
                </div>

                <select
                  className="gp-select"
                  value={symbol}
                  onChange={(e) =>
                    setSymbol(e.target.value)
                  }
                >
                  {SYMBOLS.map((s) => (
                    <option key={s}>
                      {s}
                    </option>
                  ))}
                </select>

              </div>

              <div className="gp-row2">

                <div>

                  <div className="gp-label">
                    Timeframe
                  </div>

                  <select
                    className="gp-select"
                    value={timeframe}
                    onChange={(e) =>
                      setTimeframe(
                        e.target.value as any
                      )
                    }
                  >
                    {TIMEFRAMES.map((t) => (
                      <option key={t}>
                        {t}
                      </option>
                    ))}
                  </select>

                </div>

                <div>

                  <div className="gp-label">
                    Precio actual
                  </div>

                  <input
                    className="gp-input"
                    value={currentPrice}
                    onChange={(e) =>
                      setCurrentPrice(
                        e.target.value
                      )
                    }
                  />

                </div>

              </div>

              <div>

                <div className="gp-label">
                  Imagen opcional
                </div>

                <div className="gp-uploadRow">

                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/png,image/jpeg"
                    style={{ display: "none" }}
                    onChange={(e) => {
                      const f =
                        e.target.files?.[0] ||
                        null;

                      setFile(f);

                      setFileName(
                        f
                          ? f.name
                          : "No has subido imagen"
                      );
                    }}
                  />

                  <button
                    className="gp-uploadBtn"
                    onClick={() =>
                      fileRef.current?.click()
                    }
                  >
                    📎 Cargar
                  </button>

                  <div className="gp-fileHint">
                    {fileName}
                  </div>

                </div>

              </div>

              <button
                className="gp-btnPrimary"
                onClick={onGenerate}
                disabled={loading}
              >
                {loading
                  ? "Generando..."
                  : "⚡ Generar Señal"}
              </button>

              {error && (
                <div className="gp-error">
                  {error}
                </div>
              )}

            </div>

          </div>

        </div>

        {/* MENU INFERIOR */}

        <section className="gp-bottomNav">

          <button
            onClick={() =>
              router.push("/dashboard")
            }
            className="gp-bottomItem"
          >
            <span>🏠</span>
            <span>Dashboard</span>
          </button>

          <button
            onClick={() =>
              router.push("/analyze")
            }
            className="gp-bottomItem"
          >
            <span>📈</span>
            <span>Analyze</span>
          </button>

          <button
            onClick={() =>
              router.push("/diary")
            }
            className="gp-bottomItem"
          >
            <span>📘</span>
            <span>Diario</span>
          </button>

        </section>

      </div>

      <style jsx global>{`
        body {
          margin: 0;
          font-family: Inter;
        }

        .loadingPage {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: black;
          color: white;
        }

        .gp-page {
          min-height: 100vh;
          color: white;
          background:
            linear-gradient(
              rgba(0,0,0,.7),
              rgba(0,0,0,.92)
            ),
            url("/landing/hero-bg.jpg");
          background-size: cover;
          background-position: center;
        }

        .gp-wrap {
          max-width: 1200px;
          margin: auto;
          padding: 16px 16px 100px;
        }

        .gp-topbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 14px;
          border-radius: 20px;
          background: rgba(255,255,255,.05);
          backdrop-filter: blur(14px);
        }

        .gp-topbarLeft {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .gp-logo {
          height: 52px;
        }

        .gp-topTitle {
          font-size: 18px;
          font-weight: 800;
        }

        .gp-topSub {
          font-size: 13px;
          opacity: .7;
        }

        .gp-topActions {
          display: flex;
          gap: 10px;
        }

        .gp-softBtn,
        .gp-goldBtn,
        .gp-btnPrimary,
        .gp-uploadBtn {
          border: none;
          padding: 12px 16px;
          border-radius: 12px;
          cursor: pointer;
          font-weight: 700;
        }

        .gp-softBtn,
        .gp-uploadBtn {
          background: rgba(255,255,255,.08);
          color: white;
        }

        .gp-goldBtn,
        .gp-btnPrimary {
          background: #f5bf54;
          color: black;
        }

        .gp-menuBtn {
          display: none;
        }

        .gp-mobileMenu {
          display: none;
        }

        .gp-heroCard,
        .gp-card {
          margin-top: 18px;
          padding: 22px;
          border-radius: 22px;
          background: rgba(255,255,255,.05);
          backdrop-filter: blur(14px);
        }

        .gp-pill {
          display: inline-block;
          padding: 8px 12px;
          border-radius: 999px;
          background: rgba(245,191,84,.15);
          color: #f5bf54;
          font-size: 12px;
        }

        .gp-heroTitle {
          font-size: 42px;
        }

        .gp-heroText {
          opacity: .8;
        }

        .gp-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-top: 18px;
        }

        .gp-cardHeader {
          display: flex;
          justify-content: space-between;
          margin-bottom: 14px;
        }

        .gp-cardTitle {
          font-size: 22px;
          font-weight: 800;
        }

        .gp-cardMeta {
          opacity: .7;
          font-size: 13px;
        }

        .gp-chartWrap {
          overflow: hidden;
          border-radius: 18px;
        }

        .gp-tvFrame {
          width: 100%;
          height: 520px;
          border: 0;
        }

        .gp-form {
          display: grid;
          gap: 14px;
        }

        .gp-row2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .gp-select,
        .gp-input {
          width: 100%;
          padding: 14px;
          border-radius: 14px;
          border: none;
          background: rgba(255,255,255,.08);
          color: white;
        }

        .gp-uploadRow {
          display: flex;
          gap: 10px;
          align-items: center;
        }

        .gp-error {
          padding: 12px;
          border-radius: 12px;
          background: rgba(255,0,0,.15);
        }

        .gp-bottomNav{
          position:fixed;
          left:12px;
          right:12px;
          bottom:12px;
          z-index:50;
          display:grid;
          grid-template-columns:repeat(3,1fr);
          gap:8px;
          padding:8px;
          border-radius:18px;
          background:rgba(0,0,0,.6);
          backdrop-filter:blur(14px);
          border:1px solid rgba(255,255,255,.08);
        }

        .gp-bottomItem{
          display:flex;
          flex-direction:column;
          align-items:center;
          justify-content:center;
          gap:4px;
          min-height:58px;
          border:none;
          border-radius:14px;
          background:rgba(255,255,255,.06);
          color:white;
          cursor:pointer;
        }

        @media(max-width:980px){

          .gp-topActions{
            display:none;
          }

          .gp-menuBtn{
            display:block;
          }

          .gp-mobileMenu{
            display:grid;
            gap:8px;
            margin-top:12px;
          }

          .gp-mobileMenu button{
            padding:14px;
            border:none;
            border-radius:12px;
            background:rgba(255,255,255,.08);
            color:white;
          }

          .gp-grid,
          .gp-row2{
            grid-template-columns:1fr;
          }

          .gp-heroTitle{
            font-size:30px;
          }

        }
      `}</style>

    </div>
  );
}