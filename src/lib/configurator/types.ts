export type ProductId = "roller" | "venetian" | "vertisheer";

export type OpacityId =
  | "blackout"
  | "dim-out"
  | "sunscreen"
  | "light-filtering";

export type Fabric = {
  name: string;
  hex: string;
  /** Hex of the deeper fold/shadow colour for the same fabric. */
  shadowHex: string;
  /** Hex of the lighter highlight colour. */
  highlightHex: string;
  /**
   * Optional texture image (URL relative to /public) — if set, the swatch
   * button and the slat fill in the preview will use the photographic
   * texture instead of a flat colour gradient. Used for Venetian wood/
   * faux-wood samples where the real material has visible grain.
   */
  image?: string;
};

export type Configuration = {
  product: ProductId;
  fabric: Fabric;
  opacity: OpacityId;
};

/**
 * Roller / VertiSheer fabric library — these are dyed fabric panels, mostly
 * neutral browns and warm whites for the brand palette.
 */
export const FABRICS: Fabric[] = [
  { name: "Linen Wheat", hex: "#D9C9A2", shadowHex: "#BFAA7C", highlightHex: "#EFE5CB" },
  { name: "Stone Mist", hex: "#C4BCA8", shadowHex: "#9F977F", highlightHex: "#E0D9C5" },
  { name: "Sandbar", hex: "#C8B68C", shadowHex: "#A99367", highlightHex: "#E1D4B0" },
  { name: "Bone", hex: "#EAE2CC", shadowHex: "#C9BFA1", highlightHex: "#F6F1DD" },
  { name: "Walnut", hex: "#8B5A3C", shadowHex: "#5D3A1F", highlightHex: "#B68463" },
  { name: "Tobacco", hex: "#A89072", shadowHex: "#7C684F", highlightHex: "#C5B49A" },
  { name: "Char", hex: "#3A382F", shadowHex: "#1F1E18", highlightHex: "#5C594D" },
  { name: "Inkwell", hex: "#2D2D2A", shadowHex: "#13130F", highlightHex: "#4A4A45" },
];

/**
 * Venetian wood / faux-wood finish library — physical W-coded samples from
 * the Kova catalogue. Photographed and colour-matched.
 */
export const VENETIAN_FABRICS: Fabric[] = [
  {
    name: "W101 Alpine White",
    hex: "#F1ECE3",
    shadowHex: "#D8D2C2",
    highlightHex: "#FBF9F2",
    image: "/textures/venetian/w101-alpine-white.svg",
  },
  {
    name: "W301 Pearl River",
    hex: "#D6CFC2",
    shadowHex: "#B5AC9C",
    highlightHex: "#EAE4D6",
    image: "/textures/venetian/w301-pearl-river.svg",
  },
  {
    name: "W302 Agate Grey",
    hex: "#C9BFA8",
    shadowHex: "#A89D87",
    highlightHex: "#E0D8C5",
    image: "/textures/venetian/w302-agate-grey.svg",
  },
  {
    name: "W206 Mahogany Teak",
    hex: "#5B2E1F",
    shadowHex: "#3A1C12",
    highlightHex: "#7E4732",
    image: "/textures/venetian/w206-mahogany-teak.svg",
  },
];

/** Fabric set for a given product. Defaults to the general FABRICS list. */
export function getFabricsForProduct(p: ProductId): Fabric[] {
  if (p === "venetian") return VENETIAN_FABRICS;
  return FABRICS;
}

/** Per-product opacity options. Indexed by product. */
export const OPACITY_OPTIONS: Record<ProductId, OpacityId[]> = {
  roller: ["blackout", "dim-out", "sunscreen", "light-filtering"],
  venetian: ["blackout", "dim-out", "light-filtering"],
  vertisheer: ["sunscreen", "light-filtering"],
};

/** Approximate "amount of light leaking through" used by the SVG overlays. 0 = opaque, 1 = sheer. */
export const OPACITY_LEVEL: Record<OpacityId, number> = {
  blackout: 0.0,
  "dim-out": 0.18,
  sunscreen: 0.42,
  "light-filtering": 0.6,
};

export const DEFAULT_CONFIGURATION: Configuration = {
  product: "roller",
  fabric: FABRICS[0]!,
  opacity: "sunscreen",
};
