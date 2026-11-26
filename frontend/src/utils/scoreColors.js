/**
 * Returns color tokens based on sustainability score (1-10)
 */
export function getScoreColors(score) {
  if (score >= 8) {
    return {
      circle: "#15803d",      // green-700
      circleBg: "#dcfce7",    // green-100
      barFill: "#22c55e",     // green-500
      badge: { bg: "#dcfce7", color: "#15803d" },
      label: "Excellent",
    };
  }
  if (score >= 6) {
    return {
      circle: "#16a34a",
      circleBg: "#f0fdf4",
      barFill: "#4ade80",
      badge: { bg: "#f0fdf4", color: "#16a34a" },
      label: "Good",
    };
  }
  if (score >= 4) {
    return {
      circle: "#ca8a04",      // yellow-600
      circleBg: "#fefce8",
      barFill: "#facc15",
      badge: { bg: "#fefce8", color: "#a16207" },
      label: "Fair",
    };
  }
  if (score >= 2) {
    return {
      circle: "#ea580c",      // orange-600
      circleBg: "#fff7ed",
      barFill: "#fb923c",
      badge: { bg: "#fff7ed", color: "#ea580c" },
      label: "Poor",
    };
  }
  return {
    circle: "#dc2626",        // red-600
    circleBg: "#fef2f2",
    barFill: "#f87171",
    badge: { bg: "#fef2f2", color: "#dc2626" },
    label: "Very Poor",
  };
}
