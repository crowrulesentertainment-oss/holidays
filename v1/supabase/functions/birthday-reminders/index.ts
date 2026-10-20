// Scheduled Supabase Edge Function starter. Configure secrets and an email provider before use.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
Deno.serve(async (req) => {
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });
  const authHeader = req.headers.get("authorization") || "";
  const expected = `Bearer ${Deno.env.get("CRON_SECRET") || ""}`;
  if (!Deno.env.get("CRON_SECRET") || authHeader !== expected) return new Response("Unauthorized", { status: 401 });
  const url = Deno.env.get("SUPABASE_URL")!, serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const emailApiKey = Deno.env.get("RESEND_API_KEY"), from = Deno.env.get("REMINDER_FROM_EMAIL");
  if (!emailApiKey || !from) return Response.json({ error: "Configure RESEND_API_KEY and REMINDER_FROM_EMAIL secrets." }, { status: 503 });
  const db = createClient(url, serviceKey);
  const today = new Date().toISOString().slice(5, 10);
  const { data: rows, error } = await db.from("holiday_reminder_preferences").select("user_id,birthday_date,birthday_name,email_opt_in").eq("email_opt_in", true).not("birthday_date", "is", null);
  if (error) return Response.json({ error: error.message }, { status: 500 });
  // This starter intentionally does not send until recipient email retrieval and opt-in copy are configured.
  // Never email users without an explicit opt-in, verified sender, and tested delivery safeguards.
  const due = (rows || []).filter(r => r.birthday_date?.slice(5, 10) === today);
  return Response.json({ status: "dry_run", date: today, birthdayMatches: due.length, message: "Dry-run only. Configure verified recipient lookup, email content, deduplication log, and delivery provider call before enabling sends." });
});
