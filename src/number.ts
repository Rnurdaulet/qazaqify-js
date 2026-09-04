import { ordinalGuess, ordinalLast, wordsUint } from "./words.js";

export const DECIMAL_SEPARATOR = ",";
export const GROUP_SEPARATOR = "\u00a0";
export const NAN = "сан емес";
export const PERCENT_SIGN = "%";

/** Formats a decimal for UI: 1234567.89 → «1 234 567,89». */
export function number(n: number): string {
  if (Number.isNaN(n)) {
    return NAN;
  }
  return numberFrac(n, -1);
}

export function numberFrac(n: number, frac: number): string {
  if (Number.isNaN(n)) {
    return NAN;
  }
  let neg = n < 0;
  if (neg) {
    n = -n;
  }
  const s0 = formatFloat(n, frac);
  const dot = s0.indexOf(".");
  let intPart = dot < 0 ? s0 : s0.slice(0, dot);
  const fracPart = dot < 0 ? "" : s0.slice(dot + 1);
  intPart = groupInt(intPart);
  let s = fracPart !== "" && frac !== 0 ? intPart + DECIMAL_SEPARATOR + fracPart : intPart;
  if (neg) {
    return "-" + s;
  }
  return s;
}

export function integer(n: number | bigint): string {
  if (typeof n === "bigint") {
    if (n < 0n) {
      return "-" + groupInt((-n).toString());
    }
    return groupInt(n.toString());
  }
  if (n < 0) {
    if (n === Number.MIN_SAFE_INTEGER) {
      return integer(BigInt(n));
    }
    return "-" + groupInt(String(-n));
  }
  return groupInt(String(n));
}

/** Formats a ratio: 0.75 → «75%», 0.755 → «75,5%». */
export function percent(rate: number): string {
  if (Number.isNaN(rate)) {
    return NAN;
  }
  return number(rate * 100) + PERCENT_SIGN;
}

export function groupInt(s: string): string {
  if (s.length <= 3) {
    return s;
  }
  let lead = s.length % 3;
  if (lead === 0) {
    lead = 3;
  }
  let out = s.slice(0, lead);
  for (let i = lead; i < s.length; i += 3) {
    out += GROUP_SEPARATOR + s.slice(i, i + 3);
  }
  return out;
}

/**
 * Numeric ordinal: «1-ші», «6-шы», «21-ші».
 * The suffix follows the last spelled word, not CLDR ordinal categories.
 */
export function ordinal(n: number): string {
  const i = Math.trunc(n);
  if (i < 0) {
    return "-" + String(-i) + ordinalHyphen(BigInt(-i));
  }
  return String(i) + ordinalHyphen(BigInt(i));
}

function ordinalHyphen(n: bigint): string {
  const w = wordsUint(n);
  const parts = w.split(/\s+/);
  const last = parts[parts.length - 1] ?? w;
  const form = ordinalLast[last] ?? last + ordinalGuess(last);
  if (form.endsWith("ші")) {
    return "-ші";
  }
  return "-шы";
}

/** Go strconv.FormatFloat(n, 'f', frac, 64). frac < 0 means shortest. */
export function formatFloat(n: number, frac: number): string {
  if (frac >= 0) {
    return n.toFixed(frac);
  }
  if (n === 0) {
    return "0";
  }
  return decimalString(n);
}

function decimalString(n: number): string {
  const s = n.toString();
  const m = s.match(/^(-?)(\d+)(?:\.(\d+))?[eE]([+-]?\d+)$/);
  if (!m) {
    return s;
  }
  const sign = m[1] ?? "";
  const intDigs = m[2] ?? "";
  const fracDigs = m[3] ?? "";
  const exp = Number(m[4]);
  const digits = intDigs + fracDigs;
  const point = intDigs.length + exp;
  if (point <= 0) {
    return sign + "0." + "0".repeat(-point) + digits;
  }
  if (point >= digits.length) {
    return sign + digits + "0".repeat(point - digits.length);
  }
  return sign + digits.slice(0, point) + "." + digits.slice(point);
}
