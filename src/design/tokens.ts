/**
 * QuestHire design tokens: "The Haunted Library".
 * Dark storybook palette: deep purple and teal shadows, warm candlelight accents.
 * These values are mirrored as CSS variables in globals.css. The contrast test
 * (tokens.test.ts) checks every text/background pair listed in `contrastPairs`.
 */
export const colors = {
  void: "#0d0a14",
  crypt: "#17111f",
  cryptRaised: "#231a30",
  cryptBorder: "#705a96",
  parchment: "#f1e6cf",
  parchmentDim: "#c9bda4",
  candle: "#ffb44a",
  ember: "#ff7a3d",
  ghost: "#4fd1c5",
  blood: "#ff7b8e",
  rune: "#a58cf0",
  moon: "#e8eefc",
} as const;

export type ColorToken = keyof typeof colors;

/** Minimum WCAG 2.x contrast ratios we target. */
export const CONTRAST_TARGETS = {
  text: 4.5,
  largeTextAndUi: 3,
} as const;

/**
 * Pairs that must meet the contrast target. `kind: "text"` needs 4.5:1,
 * `kind: "ui"` (borders, icons, focus rings, meters) needs 3:1.
 */
export const contrastPairs: ReadonlyArray<{
  fg: ColorToken;
  bg: ColorToken;
  kind: "text" | "ui";
  label: string;
}> = [
  { fg: "parchment", bg: "void", kind: "text", label: "body text on page" },
  { fg: "parchment", bg: "crypt", kind: "text", label: "body text on panel" },
  { fg: "parchment", bg: "cryptRaised", kind: "text", label: "body text on raised panel" },
  { fg: "parchmentDim", bg: "void", kind: "text", label: "secondary text on page" },
  { fg: "parchmentDim", bg: "crypt", kind: "text", label: "secondary text on panel" },
  { fg: "candle", bg: "void", kind: "text", label: "accent text on page" },
  { fg: "candle", bg: "crypt", kind: "text", label: "accent text on panel" },
  { fg: "ghost", bg: "crypt", kind: "text", label: "ghost/info text on panel" },
  { fg: "blood", bg: "crypt", kind: "text", label: "danger text on panel" },
  { fg: "rune", bg: "crypt", kind: "text", label: "rune text on panel" },
  { fg: "void", bg: "candle", kind: "text", label: "primary button label" },
  { fg: "cryptBorder", bg: "void", kind: "ui", label: "panel border on page" },
  { fg: "candle", bg: "void", kind: "ui", label: "focus ring on page" },
  { fg: "candle", bg: "crypt", kind: "ui", label: "candle flame / HP on panel" },
  { fg: "moon", bg: "void", kind: "ui", label: "moon meter on page" },
];
