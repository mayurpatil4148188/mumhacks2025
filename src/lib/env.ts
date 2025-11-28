const MODE = (process.env.NEXT_PUBLIC_PROJECT_MODE || "").toLowerCase();

export function isDummyMode() {
  return MODE === "dummy";
}
