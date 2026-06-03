import { supabase } from "./supabase";

/** Row shape for the `posts` table in Supabase. */
export type Post = {
  slug: string;
  title: string;
  excerpt: string | null;
  body_md: string;
  cover_image_url: string | null;
  author: string | null;
  published_at: string | null;
  created_at: string;
};

/** Light row used by the index — body intentionally omitted to keep the listing payload small. */
export type PostSummary = Omit<Post, "body_md">;

/**
 * Fetch every published post, newest first.
 *
 * Returns an empty array when Supabase isn't configured or the request
 * fails, so the UI can degrade gracefully to an empty state instead of
 * throwing.
 */
export async function listPosts(): Promise<PostSummary[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("posts")
    .select("slug,title,excerpt,cover_image_url,author,published_at,created_at")
    .not("published_at", "is", null)
    .lte("published_at", new Date().toISOString())
    .order("published_at", { ascending: false });
  if (error) {
    console.warn("[blog] listPosts failed:", error.message);
    return [];
  }
  return (data ?? []) as PostSummary[];
}

/**
 * Fetch a single published post by slug. Returns `null` if it doesn't
 * exist, isn't published yet, or Supabase isn't configured.
 */
export async function getPost(slug: string): Promise<Post | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .not("published_at", "is", null)
    .lte("published_at", new Date().toISOString())
    .maybeSingle();
  if (error) {
    console.warn("[blog] getPost failed:", error.message);
    return null;
  }
  return (data ?? null) as Post | null;
}

/** Format a post date for display ("12 March 2025"). Empty string if absent. */
export function formatPostDate(iso: string | null, locale = "en-MY"): string {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleDateString(locale, {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return "";
  }
}
