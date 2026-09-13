/**
 * Shared design tokens (colors / gradients / shadows) — this is the single
 * source of truth for the Cortex palette. Ported 1:1 from the original
 * prototype so every page keeps its exact look.
 */
export const C = {
  canvas: "#E9E9E4",
  card: "#F1F1EC",
  cardMuted: "#E4E4DE",
  border: "#D7D7D0",
  borderSoft: "#DEDED8",
  divider: "#C9C9C1",

  text: "#181816",
  sub: "#63635F",
  faint: "#8F8F89",

  ink: "#0D0D0C",
  ink2: "#2E2E2A",
  ink3: "#2A2A27",
  onInk: "#F4F4F2",
  onInkSub: "#8F8F8A",

  sheen: "rgba(255,255,255,0.9)",
  sheenSoft: "rgba(255,255,255,0.55)",
  glossDark: "linear-gradient(155deg, #232320 0%, #0D0D0C 45%, #060605 100%)",
  glossCard: "linear-gradient(155deg, #F8F8F4 0%, #F1F1EC 55%, #E9E9E3 100%)",

  shadow: "0 1px 1px rgba(10,10,8,0.05), 0 6px 18px rgba(10,10,8,0.09)",
  shadowLift: "0 3px 6px rgba(10,10,8,0.08), 0 14px 30px rgba(10,10,8,0.14)",

  good: "#3F6B4E",
  goodBg: "#E4EDE6",
  warn: "#9A6A2E",
  warnBg: "#F3E4DA",
  bad: "#8C4A3A",
  badBg: "#F3E7E4",

  high: "#B3492B",
  highBg: "#F3E4DD",
  med: "#8A6A1E",
  medBg: "#F1E9D6",
  low: "#3E6A55",
  lowBg: "#E1EAE4",

  danger: "#8A2E22",
  dangerBg: "#F3E7E4",
  success: "#2E5D3E",
} as const;

/** Base64 dot-texture used behind the animated dot field. */
export const DOT_FIELD_BG =
  "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/4QDMRXhpZgAATU0AKgAAAAgABQEaAAUAAAABAAAASgEbAAUAAAABAAAAUgEoAAMAAAABAAIAAAITAAMAAAABAAEAAIdpAAQAAAABAAAAWgAAAAA=";

/** Minimal `clsx`-style class joiner (kept dependency-free). */
export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

/* ------------------------------------------------------------------ */
/* Date helpers (used by the calendar & planner pages)                 */
/* ------------------------------------------------------------------ */
export function pad2(n: number) {
  return String(n).padStart(2, "0");
}
export function fmtKey(d: Date) {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}
export function parseKey(k: string) {
  const [y, m, d] = k.split("-").map(Number);
  return new Date(y, m - 1, d);
}
export function addDays(d: Date, n: number) {
  const nd = new Date(d);
  nd.setDate(nd.getDate() + n);
  return nd;
}
export function addMonths(d: Date, n: number) {
  const nd = new Date(d);
  nd.setMonth(nd.getMonth() + n);
  return nd;
}
export function sameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}
export function startOfWeekMon(d: Date) {
  const nd = new Date(d);
  const day = (nd.getDay() + 6) % 7;
  nd.setDate(nd.getDate() - day);
  return nd;
}
export function fmtHour(hourDecimal: number) {
  const h = Math.floor(hourDecimal);
  const m = Math.round((hourDecimal - h) * 60);
  const period = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return m === 0 ? `${h12} ${period}` : `${h12}:${pad2(m)} ${period}`;
}
export function fmtDuration(hrs: number) {
  if (hrs < 1) return `${Math.round(hrs * 60)}m`;
  const h = Math.floor(hrs);
  const m = Math.round((hrs - h) * 60);
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
}
