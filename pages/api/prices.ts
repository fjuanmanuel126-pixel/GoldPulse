import type { NextApiRequest, NextApiResponse } from "next";

type PriceMap = Record<string, number>;

const SYMBOLS = [
  { local: "XAUUSD", remote: "XAU/USD" },
  { local: "OANDA:EURUSD", remote: "EUR/USD" },
  { local: "EURUSD", remote: "EUR/USD" },
  { local: "GBPUSD", remote: "GBP/USD" },
  { local: "BTCUSDT", remote: "BTC/USD" },
];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const apiKey = process.env.TWELVE_DATA_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        ok: false,
        error: "a26711d9c39a4c9e981b8bfe7f897ea9",
      });
    }

    const prices: PriceMap = {};

    await Promise.all(
      SYMBOLS.map(async ({ local, remote }) => {
        const url = `https://api.twelvedata.com/price?symbol=${encodeURIComponent(
          remote
        )}&apikey=${apiKey}`;

        const response = await fetch(url);
        const data = await response.json();

        if (data?.price && !data?.status) {
          prices[local] = Number(data.price);
        }
      })
    );

    return res.status(200).json({
      ok: true,
      prices,
      updatedAt: Date.now(),
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "No se pudieron obtener precios";

    return res.status(500).json({
      ok: false,
      error: message,
    });
  }
}