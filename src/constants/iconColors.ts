export const IconColors = {
  // Primary / Brand
  indigo: "#818cf8",
  teal: "#2dd4bf",

  // Habits
  book: "#818cf8",
  leaf: "#2dd4bf",
  barbell: "#fb923c",
  water: "#60a5fa",
  moon: "#a78bfa",
  code: "#34d399",
  music: "#f472b6",
  running: "#facc15",

  // Finance
  income: "#4ade80",
  expense: "#f87171",
  wallet: "#fbbf24",
  trendingUp: "#4ade80",
  trendingDown: "#f87171",

  // Tasks
  urgent: "#ef4444",
  high: "#f97316",
  medium: "#eab308",
  low: "#22c55e",
  done: "#4ade80",
} as const;

export type IconColorKey = keyof typeof IconColors;
