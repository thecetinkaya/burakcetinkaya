import { schedule } from "@netlify/functions";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || "https://qapgyjnhgywszwdfegam.supabase.co";
const SUPABASE_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || "sb_publishable_vXj3Ad7pWMoW5t-PaoR8Iw_Z1Z6eRUt";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const DEFAULT_SYMBOLS = [
  "TTRAK", "THYAO", "GARAN", "EREGL", "ASELS", "KCHOL", "TUPRS", "AKBNK",
  "SISE", "BIMAS", "SAHOL", "ISCTR", "YKBNK", "ARCLK", "FROTO", "TOASO",
  "HEKTS", "SASA", "KRDMD", "PETKM", "KOZAL", "ODAS", "ENKAI", "GUBRF"
];

// Netlify Scheduled Handler: Monday to Friday at 15:30 UTC (18:30 TR Time)
const handler = schedule("30 15 * * 1-5", async (event, context) => {
  console.log("🤖 Netlify Scheduled Cron: Paper Trading Bot triggered!");
  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Netlify Cron Bot execution completed." })
  };
});

export { handler };
