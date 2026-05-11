export const typography = {
  displayLg: { fontSize: 32, letterSpacing: -0.5, lineHeight: 38, fontFamily: "Inter_700Bold" },
  displayMd: { fontSize: 24, letterSpacing: -0.3, lineHeight: 30, fontFamily: "Inter_700Bold" },
  titleLg: { fontSize: 20, lineHeight: 26, fontFamily: "Inter_600SemiBold" },
  titleMd: { fontSize: 17, lineHeight: 23, fontFamily: "Inter_600SemiBold" },
  bodyLg: { fontSize: 16, lineHeight: 24, fontFamily: "Inter_400Regular" },
  bodyMd: { fontSize: 14, lineHeight: 21, fontFamily: "Inter_400Regular" },
  caption: { fontSize: 12, lineHeight: 18, fontFamily: "Inter_400Regular" },
  label: { fontSize: 13, letterSpacing: 0.3, lineHeight: 18, fontFamily: "Inter_500Medium" },
} as const;

export type TypographyVariant = keyof typeof typography;
