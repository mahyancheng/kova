/**
 * EN ↔ MS slug pairs for blog articles that are genuine translations of
 * each other.
 *
 * The English and Malay journals are NOT mirror image route trees the way
 * the static brochure pages are (/roller ↔ /bidai/roller, same content,
 * same slug). Each language has its own independently-slugged set of
 * articles, and only some of them have a counterpart in the other
 * language — confirmed by matching descriptions (see the SEO audit
 * spreadsheet): the two English-only pieces below cover topics ("zebra
 * vs roller", "which roller blind do you need") that have no Malay
 * article at all yet.
 *
 * SeoHead.tsx used to derive the alternate URL for every blog post by
 * swapping the path prefix and keeping the same slug
 * (/blog/X → /bidai/jurnal/X) — that only works when both languages
 * happen to share a slug, which they never do here, so every hreflang
 * pair pointed at a URL that doesn't exist. This table is the source of
 * truth for which posts actually have a translation; SeoHead looks up a
 * post's slug here and only emits the alternate-language tag when a pair
 * is found, falling back to a self-referencing hreflang otherwise.
 */
export const blogTranslationPairs: Record<string, string> = {
  // English slug → Malay slug
  "roller-blinds-for-your-house": "bidai-malaysia",
  "factory-direct-blinds-malaysia": "bidai-terus-dari-kilang-malaysia",
  "factory-direct-blind-curtain-in-malaysia": "memilih-bidai-dan-langsir-rumah",
};

/** Reverse lookup: Malay slug → English slug. */
export const blogTranslationPairsReverse: Record<string, string> = Object.fromEntries(
  Object.entries(blogTranslationPairs).map(([en, ms]) => [ms, en]),
);
