export const ICON_OPTIONS = [
  // Lifestyle
  "restaurant", "home", "bed", "shirt", "gift", "paw",
  // Finance
  "wallet", "cart", "bag-handle", "briefcase", "card", "cash",
  // Transport
  "car", "bicycle", "bus", "airplane", "boat", "walk",
  // Food & Drink
  "pizza", "cafe", "wine", "nutrition", "fast-food", "ice-cream",
  // Health
  "fitness", "medkit", "heart", "moon", "body", "walk-outline",
  // Work & Study
  "book", "laptop", "school", "library", "pencil", "document-text",
  // Entertainment
  "film", "musical-notes", "game-controller", "camera", "mic", "color-palette",
  // Nature
  "leaf", "flower", "sunny", "cloudy", "rainy", "thunderstorm",
  // Tech
  "phone-portrait", "logo-electron", "flash", "globe", "wifi", "settings",
  // Misc
  "star", "trophy", "ribbon", "time", "checkmark-circle", "flag",
] as const;

export const COLOR_OPTIONS = [
  "#818cf8", // indigo
  "#2dd4bf", // teal
  "#4ade80", // green
  "#f87171", // red
  "#fb923c", // orange
  "#fbbf24", // yellow
  "#f472b6", // pink
  "#a78bfa", // purple
  "#60a5fa", // blue
  "#34d399", // emerald
  "#e879f9", // fuchsia
  "#908fa0", // gray
] as const;

export type IconOption = (typeof ICON_OPTIONS)[number];
export type ColorOption = (typeof COLOR_OPTIONS)[number];
