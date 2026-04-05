import Link from "next/link";

type AppTopbarProps = {
  subtitle?: string;
  rightSlot?: React.ReactNode;
};

export default function AppTopbar({
  subtitle = "",
  rightSlot,
}: AppTopbarProps) {
  return (
    <header className="app-topbar">
      <div className="app-brand">
        <Link href="/" className="app-logoLink" title="Volver al inicio">
          <img className="app-logo" src="/branding/logo.png" alt="GoldPulse Pro" />
        </Link>
        {subtitle ? <div className="app-subtitle">{subtitle}</div> : null}
      </div>

      <div className="app-right">{rightSlot}</div>

      <style jsx>{`
        .app-topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          padding: 14px 18px;
          border-radius: 18px;
          background: rgba(0, 0, 0, 0.35);
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 0 18px 60px rgba(0, 0, 0, 0.35);
          backdrop-filter: blur(10px);
          flex-wrap: wrap;
        }

        .app-brand {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .app-logoLink {
          display: inline-block;
          width: fit-content;
        }

        .app-logo {
          height: 54px;
          width: auto;
          display: block;
          cursor: pointer;
          filter: drop-shadow(0 14px 34px rgba(255, 190, 80, 0.18));
        }

        .app-subtitle {
          color: rgba(234, 243, 255, 0.72);
          font-size: 13px;
        }

        .app-right {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }
      `}</style>
    </header>
  );
}