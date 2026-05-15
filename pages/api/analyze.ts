import type { NextApiRequest, NextApiResponse } from "next";
import formidable, { File } from "formidable";
import fs from "fs";
import { createClient } from "@supabase/supabase-js";
import { JM_SYSTEM_PROMPT } from "../../lib/jmSystemPrompt";

export const config = {
  api: {
    bodyParser: false,
  },
};

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
  sections?: {
    technical?: string;
    fundamental?: string;
    sentiment?: string;
  };
  bias?: {
    label: string;
    explanation: string;
  };
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

type ApiSuccess = {
  premium: PremiumSignal | null;
  momentum: FlashSignal | null;
  meta: {
    usedToday: number;
    remaining: number;
    limit: number;
    dateKey: string;
  };
};

type ApiError = {
  error: string;
  meta?: {
    usedToday: number;
    remaining: number;
    limit: number;
    dateKey: string;
  };
};

type AgentOutput = {
  premium?: {
    title?: string;
    side?: "BUY" | "SELL" | string;
    confidence?: number;
    entry?: string | number;
    sl?: number;
    tp1?: number;
    tp2?: number;
    tp3?: number;
    rationale?: string;
    sections?: {
      technical?: string;
      fundamental?: string;
      sentiment?: string;
    };
    bias?: {
      label?: string;
      explanation?: string;
    };
  };
  momentum?: {
    title?: string;
    side?: "BUY" | "SELL" | string;
    confidence?: number;
    entry?: number;
    sl?: number;
    tp1?: number;
    tp2?: number;
    tp3?: number;
    rationale?: string;
  };
  bias?: string;
};

const DAILY_LIMIT = 5;
const usageStore = new Map<string, number>();

function getTodayKey() {
  const now = new Date();
  const y = now.getUTCFullYear();
  const m = String(now.getUTCMonth() + 1).padStart(2, "0");
  const d = String(now.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function getClientIp(req: NextApiRequest) {
  const xfwd = req.headers["x-forwarded-for"];
  if (typeof xfwd === "string" && xfwd.length > 0) return xfwd.split(",")[0].trim();
  if (Array.isArray(xfwd) && xfwd.length > 0) return xfwd[0];
  return req.socket.remoteAddress || "unknown";
}

function getUsageMeta(req: NextApiRequest, unlimited = false) {
  const ip = getClientIp(req);
  const dateKey = getTodayKey();
  const key = `${ip}:${dateKey}`;

  if (unlimited) {
    return {
      key,
      usedToday: 0,
      remaining: 999999999,
      limit: 999999999,
      dateKey,
    };
  }

  const usedToday = usageStore.get(key) || 0;

  return {
    key,
    usedToday,
    remaining: Math.max(0, DAILY_LIMIT - usedToday),
    limit: DAILY_LIMIT,
    dateKey,
  };
}

function bumpUsage(key: string) {
  const current = usageStore.get(key) || 0;
  usageStore.set(key, current + 1);
}

function parseForm(req: NextApiRequest): Promise<{ fields: formidable.Fields; files: formidable.Files }> {
  const form = formidable({
    multiples: true,
    keepExtensions: true,
    maxFileSize: 8 * 1024 * 1024,
    maxFiles: 3,
  });

  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });
}

function firstField(value: string | string[] | undefined) {
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
}

function getFiles(value: File | File[] | undefined): File[] {
  if (!value) return [];
  if (Array.isArray(value)) return value.filter(Boolean).slice(0, 3);
  return [value].slice(0, 3);
}

function fileToDataUrl(file: File): string {
  const mime = file.mimetype || "image/jpeg";
  const buffer = fs.readFileSync(file.filepath);
  return `data:${mime};base64,${buffer.toString("base64")}`;
}

function num(value: unknown, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function normalizeSide(side: unknown): "BUY" | "SELL" {
  const s = String(side || "").toUpperCase();
  return s === "SELL" ? "SELL" : "BUY";
}

function buildBiasLabel(agent: AgentOutput) {
  const rawBias = agent?.premium?.bias?.label || agent?.bias || "";
  const bias = String(rawBias ?? "");
  const b = bias.toLowerCase();

  if (b.includes("bull")) return "ALCISTA";
  if (b.includes("bear")) return "BAJISTA";
  if (b.includes("neutral")) return "NEUTRO";

  return bias ? bias.toUpperCase() : "NEUTRO";
}

function buildBiasExplanation(agent: AgentOutput) {
  const text = String(agent?.premium?.bias?.explanation || "").trim();
  return text || "Bias generado por el análisis actual del mercado.";
}

function sanitizePremium(agent: AgentOutput): PremiumSignal | null {
  if (!agent?.premium) return null;

  return {
    title: String(agent.premium.title || "GoldPulse Premium (Institucional)"),
    side: normalizeSide(agent.premium.side),
    confidence: num(agent.premium.confidence, 70),
    entry: String(agent.premium.entry ?? ""),
    sl: num(agent.premium.sl, 0),
    tp1: agent.premium.tp1 != null ? num(agent.premium.tp1) : undefined,
    tp2: agent.premium.tp2 != null ? num(agent.premium.tp2) : undefined,
    tp3: agent.premium.tp3 != null ? num(agent.premium.tp3) : undefined,
    rationale: String(agent.premium.rationale || "Sin explicación."),
    sections: {
      technical: agent.premium.sections?.technical ? String(agent.premium.sections.technical) : undefined,
      fundamental: agent.premium.sections?.fundamental ? String(agent.premium.sections.fundamental) : undefined,
      sentiment: agent.premium.sections?.sentiment ? String(agent.premium.sections.sentiment) : undefined,
    },
    bias: {
      label: buildBiasLabel(agent),
      explanation: buildBiasExplanation(agent),
    },
  };
}

function sanitizeMomentum(agent: AgentOutput, currentPrice: number): FlashSignal | null {
  if (!agent?.momentum) return null;

  return {
    title: String(agent.momentum.title || "GoldPulse Scalp"),
    side: normalizeSide(agent.momentum.side),
    confidence: num(agent.momentum.confidence, 65),
    entry: num(agent.momentum.entry, currentPrice),
    sl: num(agent.momentum.sl, 0),
    tp1: num(agent.momentum.tp1, 0),
    tp2: num(agent.momentum.tp2, 0),
    tp3: num(agent.momentum.tp3, 0),
    rationale: String(agent.momentum.rationale || "Sin explicación."),
  };
}

function extractJson(text: string): AgentOutput {
  const trimmed = text.trim();

  try {
    return JSON.parse(trimmed);
  } catch {
    const start = trimmed.indexOf("{");
    const end = trimmed.lastIndexOf("}");

    if (start >= 0 && end > start) {
      const maybe = trimmed.slice(start, end + 1);
      return JSON.parse(maybe);
    }

    throw new Error("No se pudo extraer JSON de la respuesta del modelo.");
  }
}

async function getUserAccessLevel(
  req: NextApiRequest
): Promise<"free" | "premium" | "vip" | "admin" | null> {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";

  if (!token) return null;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) return null;

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  });

  const { data: userData, error: userError } = await supabase.auth.getUser(token);
  if (userError || !userData.user) return null;

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("access_level")
    .eq("id", userData.user.id)
    .single();

  if (profileError || !profile?.access_level) return null;

  return profile.access_level;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiSuccess | ApiError>
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const envKey = process.env.OPENAI_API_KEY;

  if (!envKey) {
    return res.status(500).json({ error: "Falta OPENAI_API_KEY en variables de entorno." });
  }

  const accessLevel = await getUserAccessLevel(req);
  const isAdmin = accessLevel === "admin";

  const usage = getUsageMeta(req, isAdmin);

  if (!isAdmin && usage.usedToday >= DAILY_LIMIT) {
    return res.status(429).json({
      error: "Has alcanzado el límite diario de señales.",
      meta: {
        usedToday: usage.usedToday,
        remaining: usage.remaining,
        limit: usage.limit,
        dateKey: usage.dateKey,
      },
    });
  }

  try {
    const { fields, files } = await parseForm(req);

    const symbol = String(firstField(fields.symbol) || "XAUUSD");
    const timeframe = String(firstField(fields.timeframe) || "15m");

    const rawCurrentPrice = firstField(fields.currentPrice);
    const parsedCurrentPrice = Number(rawCurrentPrice);
    const hasValidCurrentPrice =
      rawCurrentPrice !== "" &&
      Number.isFinite(parsedCurrentPrice) &&
      parsedCurrentPrice > 0;

    const uploadedImages = [
      ...getFiles(files.images as File | File[] | undefined),
      ...getFiles(files.image as File | File[] | undefined),
    ].slice(0, 3);

    const hasImages = uploadedImages.length > 0;

    if (!hasImages && !hasValidCurrentPrice) {
      return res.status(400).json({
        error: "Debes escribir un precio actual válido o subir al menos una imagen del gráfico.",
        meta: {
          usedToday: usage.usedToday,
          remaining: usage.remaining,
          limit: usage.limit,
          dateKey: usage.dateKey,
        },
      });
    }

    const currentPrice = hasValidCurrentPrice ? parsedCurrentPrice : 0;

    const imageDataUrls = uploadedImages.map(fileToDataUrl);

    const userPrompt = `
Analiza este activo y devuelve SOLO JSON válido.

Datos:
- symbol: ${symbol}
- timeframe: ${timeframe}
- currentPrice: ${hasValidCurrentPrice ? currentPrice : "NO PROPORCIONADO"}
- imagesProvided: ${hasImages ? imageDataUrls.length : 0}

Instrucciones importantes:
- Si currentPrice es NO PROPORCIONADO, analiza el precio visible del gráfico y usa la imagen como fuente principal.
- Si hay varias imágenes, combínalas como contexto multi-timeframe o multi-gráfico.
- Puedes analizar cualquier activo: oro, forex, índices, cripto, acciones o futuros.
- Si no puedes leer exactamente un precio, estima la zona de entrada como rango.
- No inventes datos fundamentales si no están claros.
- Devuelve premium y momentum siempre que sea posible.
- Si no hay currentPrice, el momentum debe usar una entrada estimada desde el gráfico o una zona aproximada.

Necesito exactamente esta estructura:

{
  "premium": {
    "title": "GoldPulse Premium (Institucional)",
    "side": "BUY o SELL",
    "confidence": 0,
    "entry": "texto o rango de entrada",
    "sl": 0,
    "tp1": 0,
    "tp2": 0,
    "tp3": 0,
    "rationale": "explicación principal",
    "sections": {
      "technical": "texto",
      "fundamental": "texto",
      "sentiment": "texto"
    },
    "bias": {
      "label": "bullish / bearish / neutral",
      "explanation": "explicación breve"
    }
  },
  "momentum": {
    "title": "GoldPulse Scalp",
    "side": "BUY o SELL",
    "confidence": 0,
    "entry": 0,
    "sl": 0,
    "tp1": 0,
    "tp2": 0,
    "tp3": 0,
    "rationale": "explicación"
  }
}

Reglas:
- Responde solo con JSON.
- premium y momentum deben existir siempre.
- side solo puede ser BUY o SELL.
- confidence entre 1 y 100.
- Si currentPrice existe, úsalo como referencia para el scalp.
- Si currentPrice no existe, usa el gráfico para estimar la entrada.
- No incluyas markdown.
`;

    const inputContent: any[] = [
      {
        type: "input_text",
        text: userPrompt,
      },
    ];

    imageDataUrls.forEach((imageDataUrl) => {
      inputContent.push({
        type: "input_image",
        image_url: imageDataUrl,
        detail: "auto",
      });
    });

    const payload = {
      model: "gpt-4o-mini",
      input: [
        {
          role: "system",
          content: [
            {
              type: "input_text",
              text: JM_SYSTEM_PROMPT,
            },
          ],
        },
        {
          role: "user",
          content: inputContent,
        },
      ],
    };

    const openaiRes = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${envKey}`,
      },
      body: JSON.stringify(payload),
    });

    const raw = await openaiRes.text();

    if (!openaiRes.ok) {
      return res.status(500).json({
        error: `Error OpenAI: ${raw}`,
        meta: {
          usedToday: usage.usedToday,
          remaining: usage.remaining,
          limit: usage.limit,
          dateKey: usage.dateKey,
        },
      });
    }

    let parsedOpenAI: any;

    try {
      parsedOpenAI = JSON.parse(raw);
    } catch {
      return res.status(500).json({
        error: "La respuesta de OpenAI no fue JSON válido.",
        meta: {
          usedToday: usage.usedToday,
          remaining: usage.remaining,
          limit: usage.limit,
          dateKey: usage.dateKey,
        },
      });
    }

    const outputText =
      parsedOpenAI?.output_text ||
      parsedOpenAI?.output
        ?.map((x: any) => x?.content?.map((c: any) => c?.text).join(" "))
        .join(" ") ||
      "";

    if (!outputText) {
      return res.status(500).json({
        error: "OpenAI no devolvió texto utilizable.",
        meta: {
          usedToday: usage.usedToday,
          remaining: usage.remaining,
          limit: usage.limit,
          dateKey: usage.dateKey,
        },
      });
    }

    const agent = extractJson(outputText);

    const premium = sanitizePremium(agent);
    const momentum = sanitizeMomentum(agent, currentPrice);

    if (!isAdmin) {
      bumpUsage(usage.key);
    }

    const newUsed = isAdmin ? 0 : usage.usedToday + 1;

    return res.status(200).json({
      premium,
      momentum,
      meta: {
        usedToday: newUsed,
        remaining: isAdmin ? 999999999 : Math.max(0, DAILY_LIMIT - newUsed),
        limit: isAdmin ? 999999999 : DAILY_LIMIT,
        dateKey: usage.dateKey,
      },
    });
  } catch (err: any) {
    return res.status(500).json({
      error: err?.message || "Error interno en /api/analyze",
      meta: {
        usedToday: usage.usedToday,
        remaining: usage.remaining,
        limit: usage.limit,
        dateKey: usage.dateKey,
      },
    });
  }
}