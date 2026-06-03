import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Supabase client.
 *
 * Reads `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` from Vite env
 * vars at build time. If either is missing we export `null` instead of
 * throwing — pages should treat `null` as "Supabase not configured" and
 * fall back to an empty state. That keeps local dev usable before the
 * project is wired up and prevents the production bundle from crashing
 * during a misconfigured deploy.
 */
const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const supabase: SupabaseClient | null =
  url && anonKey ? createClient(url, anonKey) : null;

export const isSupabaseConfigured = supabase !== null;
