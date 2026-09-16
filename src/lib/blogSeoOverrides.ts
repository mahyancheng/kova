/**
 * Per-article SEO overrides, keyed by slug.
 *
 * The article's headline (h1) and on-page excerpt come from Supabase
 * (`post.title` / `post.excerpt` — see lib/blog.ts) because that's the
 * live editorial copy. The <title>/<meta description> a search result
 * shows is a different, more constrained piece of writing (character
 * budget, exact target keyword), and the anon key the site ships with
 * is read-only — so rather than fight that split, this table lets the
 * meta tags diverge from the on-page copy without touching Supabase.
 *
 * `h1` is optional and only set where the on-page headline itself needed
 * fixing (e.g. it was literally the URL slug) — leave it out to keep the
 * existing Supabase title as the h1 while only the meta tags change.
 *
 * IMPORTANT: Supabase's `title` field was since edited directly to hold
 * the new SEO title verbatim (including the " | Kova" suffix) for several
 * of these posts, instead of only being read here as a fallback. Since
 * both the article H1 and the blog-index card heading fall back to
 * post.title when no `h1` override is set, those posts would otherwise
 * show "...| Kova" as the visible on-page headline. Every entry below
 * whose `title` ends in the brand suffix therefore also carries an `h1`
 * that restores the original, human-facing headline (from the pre-audit
 * copy) so search snippets and on-page text can keep diverging on
 * purpose.
 */
export interface BlogSeoOverride {
  title: string;
  description: string;
  h1?: string;
}

export const blogSeoOverrides: Record<string, BlogSeoOverride> = {
  "zebra-blinds-vs-roller-blinds": {
    title: "Zebra Blinds vs Roller Blinds: Which Is Better? | Kova",
    description:
      "Zebra or roller blinds? We compare light control, privacy, blackout, heat, cleaning, price and child safety, then match the right blind to each room.",
    h1: "Zebra Blinds vs Roller Blinds: Which Blinds Are Most Suitable for Your Lifestyle?",
  },
  "roller-blinds-for-your-house": {
    title: "Roller Blinds for Malaysian Homes: A Complete Guide | Kova",
    description:
      "How roller blinds work, which fabrics suit Malaysia's heat and glare, how to choose for each space, roller blinds vs curtains, and simple care tips.",
    h1: "Roller Blinds For Your Home: The Smart Window Solution Every Malaysian Home Needs",
  },
  "roller-blinds-you-need": {
    title: "How to Choose Roller Blinds for Every Room | Kova",
    description:
      "Blackout for bedrooms, sunscreen for living areas, manual or motorised? How to match roller blind fabrics to each room in a hot, bright Malaysian home.",
    // The Supabase title is still the raw slug ("what-roller-blinds-you-need-
    // for-your-house") — fix the on-page headline too, distinct from the
    // meta title above so this doesn't collide with the guide article.
    h1: "What Roller Blinds Do You Need for Your House?",
  },
  "factory-direct-blinds-malaysia": {
    title: "Renovating? A Guide to Factory-Direct Blinds in Malaysia | Kova",
    description:
      "Planning a renovation? What factory-direct blinds really mean, when to order them, how to compare quotes fairly, and why to plan motorisation early.",
    h1: "A Smarter Way to Dress Your Windows When Renovating",
  },
  "factory-direct-blind-curtain-in-malaysia": {
    title: "Why Blinds Cost So Much in Malaysia — and How to Pay Less",
    description:
      "Why do blinds and curtains cost so much in showrooms? Where the mark-ups come from, and how factory-direct blind curtains cost Malaysian homes less.",
  },
  "bidai-malaysia": {
    title: "Panduan Lengkap Bidai Roller untuk Rumah di Malaysia | Kova",
    description:
      "Apa itu bidai roller, kain yang sesuai untuk cuaca panas Malaysia, cara memilih untuk setiap ruang, bidai roller berbanding langsir dan tip penjagaan.",
    h1: "Penyelesaian Tingkap Bidai Pintar Untuk Setiap Rumah di Malaysia",
  },
  "bidai-terus-dari-kilang-malaysia": {
    title: "Renovasi Rumah? Panduan Bidai Terus dari Kilang di Malaysia",
    description:
      "Sedang renovasi? Maksud sebenar bidai terus dari kilang, bila perlu tempah, cara banding sebut harga dengan adil, dan kenapa rancang bidai bermotor awal.",
  },
  "memilih-bidai-dan-langsir-rumah": {
    title: "Kenapa Harga Bidai & Langsir Mahal? Cara Dapat Harga Kilang",
    description:
      "Kenapa harga bidai dan langsir di pasaran selalu mahal? Dari mana datangnya caj tambahan, dan cara dapatkan bidai berkualiti terus dari kilang.",
  },
};
