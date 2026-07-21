/**
 * Lead capture → LeadZap agency pipeline.
 *
 * DUAL-WRITE, both fire-and-forget so a visitor's submit never blocks on
 * either destination:
 *
 *   1. Google Sheet (live now)  — a plain `no-cors` POST to a bound Apps
 *      Script web app that appends a row. Works today with zero backend and
 *      no Supabase dependency. This is the destination the agency actually
 *      watches while the console is being built.
 *   2. Supabase `leads` table (when configured) — a REST insert with the
 *      project anon key. Insert-only RLS makes the anon key safe to embed.
 *      The SEO console reads this (service role) for the per-client view.
 *
 * Any client site reuses this module by overriding the VITE_* build vars and
 * VITE_CLIENT_SLUG. Both writes are best-effort; on total failure the lead is
 * stashed to localStorage so nothing is silently lost.
 */

// --- Supabase (agency multi-tenant table) -------------------------------
const LEADS_URL =
  (import.meta.env.VITE_LEADS_SUPABASE_URL as string | undefined) ||
  "https://tfgkbxrxzmjexnuwwhcj.supabase.co";
const LEADS_ANON =
  (import.meta.env.VITE_LEADS_SUPABASE_ANON_KEY as string | undefined) || "";

// --- Google Sheet (Apps Script web app) ---------------------------------
const SHEET_URL =
  (import.meta.env.VITE_LEADS_SHEET_URL as string | undefined) || "";
const SHEET_TOKEN =
  (import.meta.env.VITE_LEADS_SHEET_TOKEN as string | undefined) || "";

/** Which client site this build belongs to — the tenant key everywhere. */
const CLIENT_SLUG =
  (import.meta.env.VITE_CLIENT_SLUG as string | undefined) || "kova";

export type LeadInput = {
  name?: string;
  phone?: string;
  email?: string;
  location?: string;
  message?: string;
  interest?: string;
  configSummary?: string | null;
  lang?: string;
};

/**
 * Submit a lead to every configured destination. Resolves `true` if at least
 * one write reported success. Never throws — the caller should always show the
 * visitor a friendly confirmation regardless. On total failure the lead is
 * stashed to localStorage as a backstop.
 */
export async function submitLead(input: LeadInput): Promise<boolean> {
  const row = {
    client_slug: CLIENT_SLUG,
    name: input.name || null,
    phone: input.phone || null,
    email: input.email || null,
    location: input.location || null,
    message: input.message || null,
    interest: input.interest || null,
    config_summary: input.configSummary || null,
    lang: input.lang || "en",
    source_url: typeof window !== "undefined" ? window.location.href : null,
    user_agent: typeof navigator !== "undefined" ? navigator.userAgent : null,
  };

  const results = await Promise.allSettled([sendToSheet(row), sendToSupabase(row)]);
  const anyOk = results.some((r) => r.status === "fulfilled" && r.value === true);

  // The Sheet write is no-cors (opaque) so we can't confirm it — treat a
  // configured Sheet as best-effort success. Only stash if BOTH are
  // unconfigured or the Supabase write is the only path and it failed.
  const sheetAttempted = Boolean(SHEET_URL && SHEET_TOKEN);
  if (!anyOk && !sheetAttempted) {
    stash(row);
    return false;
  }
  return true;
}

/**
 * Append to the Google Sheet via the Apps Script web app. `no-cors` because
 * Apps Script sends no CORS headers — the POST still goes through, we just get
 * an opaque response we can't read (which is fine, it's fire-and-forget).
 */
async function sendToSheet(row: Record<string, unknown>): Promise<boolean> {
  if (!SHEET_URL || !SHEET_TOKEN) return false;
  try {
    await fetch(SHEET_URL, {
      method: "POST",
      mode: "no-cors",
      // text/plain avoids a CORS preflight; the script JSON.parses the body.
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ token: SHEET_TOKEN, ...row }),
    });
    return true; // opaque — assume delivered
  } catch (err) {
    console.warn("[leads] sheet write failed", err);
    return false;
  }
}

/** Insert into the agency Supabase leads table (when configured). */
async function sendToSupabase(row: Record<string, unknown>): Promise<boolean> {
  if (!LEADS_ANON) return false;
  try {
    const res = await fetch(`${LEADS_URL}/rest/v1/leads`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: LEADS_ANON,
        Authorization: `Bearer ${LEADS_ANON}`,
        Prefer: "return=minimal",
      },
      body: JSON.stringify(row),
    });
    if (!res.ok) {
      // Table may not exist yet (blocked on account access) — that's expected
      // for now; the Sheet is the live destination. Don't spam the console.
      if (res.status !== 404) {
        console.warn("[leads] supabase insert failed", res.status);
      }
      return false;
    }
    return true;
  } catch (err) {
    console.warn("[leads] supabase network error", err);
    return false;
  }
}

/** Backstop: keep failed leads in localStorage so they can be recovered. */
function stash(row: unknown) {
  try {
    const key = "kova-unsent-leads";
    const arr = JSON.parse(localStorage.getItem(key) || "[]");
    arr.push({ ...(row as object), stashed_at: new Date().toISOString() });
    localStorage.setItem(key, JSON.stringify(arr));
  } catch {
    /* localStorage unavailable — nothing more we can do */
  }
}
