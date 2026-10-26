import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.0";
export const SUPABASE_URL = "https://cevylpnoexugwgygvtgu.supabase.co";
export const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_AdfM5y6RqvF3tbvEVzDZSg_JuGTQLD-";
export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
});