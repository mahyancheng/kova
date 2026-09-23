import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;

/**
 * The publishable (anon) key, accepted under any of the three names this
 * project has used for it.
 *
 * These had drifted apart: this file read only
 * VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY, .env.example documented
 * VITE_SUPABASE_ANON_KEY, and the journal's own "not connected" message
 * named VITE_SUPABASE_PUBLISHABLE_KEY. scripts/generate-sitemap.mjs
 * already accepted two of them. Setting the key under the documented name
 * therefore satisfied the build script while leaving the client with
 * `undefined` — the journal rendered empty with no indication why.
 * Accept all three so the deploy environment can use whichever it has.
 */
const anonKey = (import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY) as string | undefined;

export const supabase: SupabaseClient | null =
  url && anonKey ? createClient(url, anonKey) : null;

export const isSupabaseConfigured = supabase !== null;