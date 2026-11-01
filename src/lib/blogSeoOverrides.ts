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
  /** Describes the cover photo itself; falls back to the h1 when unset. */
  imageAlt?: string;
}

export const blogSeoOverrides: Record<string, BlogSeoOverride> = {
  "langsir-blackout-atau-bidai-blackout": {
    title: "Langsir Blackout atau Bidai Blackout? Mana Lebih Gelap | Kova",
    description:
      "Langsir blackout atau bidai roller blackout untuk bilik tidur? Di mana cahaya masih masuk, pemasangan dalam atau luar, dan cara dapatkan bilik yang gelap.",
    h1: "Langsir Blackout atau Bidai Blackout: Mana Lebih Gelap untuk Bilik Tidur?",
  },
  "cara-pasang-bidai-tingkap": {
    title: "Cara Pasang Bidai Tingkap: Langkah & Tip Keselamatan | Kova",
    description:
      "Cara pasang bidai tingkap: dalam atau luar bingkai, mengukur, menggerudi tanpa kena kabel, alat keselamatan tali, dan bila lebih baik guna pemasang.",
    h1: "Cara Pasang Bidai Tingkap: Apa yang Perlu Tahu Sebelum Pasang",
    imageAlt: "Bidai Venetian aluminium putih dipasang di dalam ceruk tingkap dapur, di atas singki dan kaunter",
  },
  "blinds-for-living-room": {
    title: "Blinds for Living Room: Roller, VertiSheer or Venetian? | Kova",
    description:
      "How to choose blinds for a living room: sunscreen or dim-out roller, VertiSheer for sliding doors, Venetian to angle the light, mounts and child safety.",
    h1: "Blinds for Living Room: How to Choose the Right Blind for Each Window",
    imageAlt:
      "Living room with a roller blind, VertiSheer vanes on the sliding door and Venetian blinds on the side window",
  },
  "motorised-blinds-guide": {
    title: "Motorised Blinds: Battery, Wired & When It's Worth It | Kova",
    description:
      "Motorised blinds explained: battery or wired, HomeKit control, child safety and which windows really need a motor, for roller, Venetian and VertiSheer.",
    h1: "Motorised Blinds: How They Work and When They Are Worth It",
    imageAlt: "Kova VertiSheer vertical sheer blinds in Pivot Anchor",
  },
  "how-to-clean-blinds": {
    title: "How to Clean Blinds: Roller, Venetian & Sheer | Kova",
    description:
      "How to clean blinds without damage: weekly dusting, spot-cleaning fabric, wiping aluminium and wood slats, and keeping blinds fresh in Malaysian humidity.",
  },
  "zebra-blinds-vs-roller-blinds": {
    title: "Zebra Blinds vs Roller Blinds: Which Is Better? | Kova",
    description:
      "Zebra blinds vs roller blinds: light control, privacy, blackout, heat, cleaning, cost and child safety compared, plus the right blind for each room.",
    h1: "Zebra Blinds vs Roller Blinds: Which Blinds Are Most Suitable for Your Lifestyle?",
    imageAlt: "Grey zebra blind beside a plain roller blind, with icons for light control, privacy, blackout, maintenance, price and design",
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
    title: "Renovating? Guide to Factory-Direct Blinds Malaysia | Kova",
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
    title: "Bidai Rumah: Panduan Bidai Roller vs Langsir | Kova",
    description:
      "Pilih bidai rumah yang betul: kain bidai roller untuk cuaca panas Malaysia, bidai atau langsir untuk setiap bilik, dan tip penjagaan. Ukur percuma.",
    h1: "Penyelesaian Tingkap Bidai Pintar Untuk Setiap Rumah di Malaysia",
  },
  "bidai-terus-dari-kilang-malaysia": {
    title: "Renovasi Rumah? Panduan Bidai Terus dari Kilang di Malaysia",
    description:
      "Sedang renovasi? Maksud sebenar bidai terus dari kilang, bila perlu tempah, cara banding sebut harga dengan adil, dan kenapa rancang bidai bermotor awal.",
  },
  "memilih-bidai-dan-langsir-rumah": {
    title: "Kenapa Bidai & Langsir Mahal? Cara Dapat Harga Kilang",
    description:
      "Kenapa harga bidai dan langsir di pasaran selalu mahal? Dari mana datangnya caj tambahan, dan cara dapatkan bidai berkualiti terus dari kilang.",
  },
};
