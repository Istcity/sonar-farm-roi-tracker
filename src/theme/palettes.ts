export type ThemeName = "tropical" | "arid" | "continental";

/**
 * Brand palette — modernized with an Apple Weather inspired sky-blue range
 * harmonized with a cyan/mint accent. Keys are kept stable to avoid breaking
 * existing call sites; values were retuned for a calmer, more contemporary feel.
 */
export const brand = {
  // Primary deep sky tone (used for hero header, splash, accents)
  deepBlue: "#0F2B45",
  // Accent cyan-teal (replaces the older neon green energy accent)
  teal: "#2EC4B6",
  tealLight: "#5BD6CC",
  // Mint accents (still named neonGreen / neonMint for backwards compatibility)
  neonGreen: "#5EEAD4",
  neonMint: "#A4F7E8",
  // Soft mid sky blue used for secondary highlights
  skyBlue: "#4FA7D8",
  // Backgrounds — calmer night-sky tones that pair with white logo badge
  nightBg: "#081827",
  bgLight: "#0C2438",
  bgCard: "#13334D",
  // Text — tuned for AA+ contrast on the dark sky backgrounds.
  textDark: "#F2F8FF",
  textMuted: "#C8DCED",
  white: "#FFFFFF",
  // Status
  error: "#FF6B6B",
  success: "#4ADE80",
  warning: "#FBBF24",
  border: "#1F4660",
} as const;

export type BrandColor = keyof typeof brand;

export type ThemePalette = {
  primary: string;
  bg: string;
  card: string;
  text: string;
  muted: string;
  border: string;
};

export const themePalettes: Record<ThemeName, ThemePalette> = {
  tropical: {
    primary: brand.neonGreen,
    bg: brand.bgLight,
    card: brand.bgCard,
    text: brand.textDark,
    muted: brand.textMuted,
    border: brand.border,
  },
  arid: {
    primary: "#E0A45C",
    bg: "#F4ECDD",
    card: "#FFF6E6",
    text: "#3F2F17",
    muted: "#8E7654",
    border: "#E2D3B9",
  },
  continental: {
    primary: "#3E8FBF",
    bg: "#EAF3FB",
    card: "#F6FBFF",
    text: "#0F2B45",
    muted: "#5C86A6",
    border: "#CFE1EF",
  },
};

/**
 * Backdrop gradients for the WeatherBackdrop component. Each preset is a top→bottom
 * stop list that paints a calm, Apple Weather inspired sky for the inferred condition.
 */
export type WeatherCondition = "clear-day" | "clear-night" | "cloudy" | "rain" | "snow" | "hot";

export const weatherBackdrops: Record<WeatherCondition, [string, string, string]> = {
  "clear-day":   ["#3DA9E0", "#1F6FA8", "#0F2B45"],
  "clear-night": ["#0B2545", "#0A1A2A", "#06101C"],
  "cloudy":      ["#5C7C95", "#34536B", "#142737"],
  "rain":        ["#3F5B72", "#1F3447", "#0B1B27"],
  "snow":        ["#A9C9DD", "#6E94B0", "#2F4D66"],
  "hot":         ["#F8A35C", "#E26A4A", "#4B2540"],
};
