import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.warn("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variable.");
}

export const supabase = createClient(url || "https://invalid.supabase.co", key || "missing-key", {
  auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false }
});

export const bucket = process.env.SUPABASE_BUCKET || "urban-greeneye";

export function requireSupabase() {
  if (!url || !key) throw new Error("Chưa cấu hình SUPABASE_URL và SUPABASE_SERVICE_ROLE_KEY trên Vercel.");
}
