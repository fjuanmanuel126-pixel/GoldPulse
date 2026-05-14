import { useEffect, useState } from "react";
import { getSupabaseClient } from "../../lib/supabaseClient";

type Account = {
  id: string;
  name: string;
  broker: string;
  account_type: string;
  initial_balance: number;
};

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);

  const [name, setName] = useState("");
  const [broker, setBroker] = useState("");
  const [type, setType] = useState("");
  const [balance, setBalance] = useState("");

  useEffect(() => {
    loadAccounts();
  }, []);

  async function loadAccounts() {
    const supabase = getSupabaseClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data } = await supabase
      .from("trading_accounts")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    setAccounts(data || []);
  }

  async function createAccount() {
    const supabase = getSupabaseClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    if (!name) return;

    await supabase.from("trading_accounts").insert({
      user_id: user.id,
      name,
      broker,
      account_type: type,
      initial_balance: Number(balance || 0),
      current_balance: Number(balance || 0),
    });

    setName("");
    setBroker("");
    setType("");
    setBalance("");

    loadAccounts();
  }

  return (
    <div className="page">
      <div className="wrap">
        <h1>Bitácora PRO · Cuentas</h1>

        <div className="card">
          <h2>Agregar cuenta</h2>

          <input
            placeholder="Nombre de cuenta"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            placeholder="Broker"
            value={broker}
            onChange={(e) => setBroker(e.target.value)}
          />

          <input
            placeholder="Tipo"
            value={type}
            onChange={(e) => setType(e.target.value)}
          />

          <input
            placeholder="Balance inicial"
            value={balance}
            onChange={(e) => setBalance(e.target.value)}
          />

          <button onClick={createAccount}>
            Crear cuenta
          </button>
        </div>

        <div className="grid">
          {accounts.map((acc) => (
            <div className="accountCard" key={acc.id}>
              <h3>{acc.name}</h3>

              <p>{acc.broker}</p>

              <span>{acc.account_type}</span>

              <strong>${acc.initial_balance}</strong>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .page {
          min-height: 100vh;
          background: black;
          color: white;
          padding: 40px;
        }

        .wrap {
          max-width: 1200px;
          margin: auto;
        }

        .card {
          background: #111;
          padding: 24px;
          border-radius: 20px;
          margin-top: 20px;
        }

        input {
          width: 100%;
          margin-top: 10px;
          padding: 14px;
          border-radius: 12px;
          border: 1px solid #333;
          background: #000;
          color: white;
        }

        button {
          margin-top: 20px;
          padding: 14px 20px;
          border-radius: 12px;
          border: none;
          background: #f5b942;
          color: black;
          font-weight: bold;
          cursor: pointer;
        }

        .grid {
          margin-top: 30px;
          display: grid;
          grid-template-columns: repeat(auto-fit,minmax(240px,1fr));
          gap: 20px;
        }

        .accountCard {
          background: #111;
          padding: 20px;
          border-radius: 20px;
          border: 1px solid #222;
        }

        h3 {
          margin: 0;
        }

        strong {
          display: block;
          margin-top: 14px;
          color: #f5b942;
        }
      `}</style>
    </div>
  );
}