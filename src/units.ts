import { number, numberFrac } from "./number.js";
import { largestUnit } from "./relative.js";

type UnitLex = {
  wide: string;
  short: string;
};

const KILOMETER: UnitLex = { wide: "{0} километр", short: "{0} км" };
const METER: UnitLex = { wide: "{0} метр", short: "{0} м" };
const CENTIMETER: UnitLex = { wide: "{0} сантиметр", short: "{0} см" };
const MILLIMETER: UnitLex = { wide: "{0} миллиметр", short: "{0} мм" };
const KILOGRAM: UnitLex = { wide: "{0} килограмм", short: "{0} кг" };
const GRAM: UnitLex = { wide: "{0} грамм", short: "{0} г" };
const MILLIGRAM: UnitLex = { wide: "{0} миллиграмм", short: "{0} мг" };
const BYTE: UnitLex = { wide: "{0} байт", short: "{0} байт" };
const KILOBYTE: UnitLex = { wide: "{0} килобайт", short: "{0} кБ" };
const MEGABYTE: UnitLex = { wide: "{0} мегабайт", short: "{0} МБ" };
const GIGABYTE: UnitLex = { wide: "{0} гигабайт", short: "{0} ГБ" };
const TERABYTE: UnitLex = { wide: "{0} терабайт", short: "{0} ТБ" };
const DAY: UnitLex = { wide: "{0} күн", short: "{0} күн" };
const HOUR: UnitLex = { wide: "{0} сағат", short: "{0} сағ" };
const MINUTE: UnitLex = { wide: "{0} минут", short: "{0} мин" };
const SECOND: UnitLex = { wide: "{0} секунд", short: "{0} с" };
const MILLISECOND: UnitLex = { wide: "{0} миллисекунд", short: "{0} мс" };

function formatUnit(n: number, frac: number, lex: UnitLex, width: "wide" | "abbreviated"): string {
  const pat = width === "abbreviated" ? lex.short : lex.wide;
  return pat.replace("{0}", numberFrac(n, frac));
}

/** Formats a quantity by English or Kazakh unit name: unit(1500, "meter") → «1,5 км». */
export function unit(n: number, name: string): string {
  const meters = toMeters(n, name);
  if (meters !== null) {
    return autoLength(meters);
  }
  const grams = toGrams(n, name);
  if (grams !== null) {
    return autoMass(grams);
  }
  return number(n) + " " + name.trim();
}

function toMeters(n: number, name: string): number | null {
  switch (name.trim().toLowerCase()) {
    case "meter":
    case "metre":
    case "m":
    case "метр":
      return n;
    case "kilometer":
    case "km":
    case "км":
    case "километр":
      return n * 1000;
    case "centimeter":
    case "cm":
    case "см":
    case "сантиметр":
      return n / 100;
    case "millimeter":
    case "mm":
    case "мм":
    case "миллиметр":
      return n / 1000;
    default:
      return null;
  }
}

function toGrams(n: number, name: string): number | null {
  switch (name.trim().toLowerCase()) {
    case "gram":
    case "g":
    case "грамм":
      return n;
    case "kilogram":
    case "kg":
    case "кг":
    case "килограмм":
      return n * 1000;
    case "milligram":
    case "mg":
    case "мг":
    case "миллиграмм":
      return n / 1000;
    default:
      return null;
  }
}

function autoFrac(n: number): number {
  n = Math.abs(n);
  if (Math.abs(n - Math.round(n)) < 1e-9) {
    return 0;
  }
  if (n < 10) {
    return 1;
  }
  return 0;
}

function autoLength(meters: number): string {
  const abs = Math.abs(meters);
  if (abs >= 1000) {
    const v = meters / 1000;
    return formatUnit(v, autoFrac(v), KILOMETER, "abbreviated");
  }
  if (abs >= 1) {
    return formatUnit(meters, autoFrac(meters), METER, "abbreviated");
  }
  if (abs >= 0.01) {
    const v = meters * 100;
    return formatUnit(v, autoFrac(v), CENTIMETER, "abbreviated");
  }
  const v = meters * 1000;
  return formatUnit(v, autoFrac(v), MILLIMETER, "abbreviated");
}

function autoMass(grams: number): string {
  const abs = Math.abs(grams);
  if (abs >= 1000) {
    const v = grams / 1000;
    return formatUnit(v, autoFrac(v), KILOGRAM, "abbreviated");
  }
  if (abs >= 1) {
    return formatUnit(grams, autoFrac(grams), GRAM, "abbreviated");
  }
  const v = grams * 1000;
  return formatUnit(v, autoFrac(v), MILLIGRAM, "abbreviated");
}

/** File size with SI steps (1000): bytes(1536000) → «1,5 МБ». */
export function bytes(n: number | bigint): string {
  const value = typeof n === "bigint" ? Number(n) : n;
  return formatDataSize(value, 1000);
}

function formatDataSize(byteCount: number, base: number): string {
  if (byteCount < 0) {
    return formatUnit(-byteCount, 0, BYTE, "abbreviated");
  }
  const steps = [BYTE, KILOBYTE, MEGABYTE, GIGABYTE, TERABYTE];
  let n = byteCount;
  let i = 0;
  while (i < steps.length - 1 && n >= base) {
    n /= base;
    i++;
  }
  let frac = 0;
  if (i > 0 && n < 10) {
    frac = 1;
  }
  if (i > 0 && Math.abs(n - Math.round(n)) < 1e-9) {
    frac = 0;
  }
  return formatUnit(n, frac, steps[i] ?? BYTE, "abbreviated");
}

const MS = 1000;
const MIN_MS = 60 * MS;
const HOUR_MS = 60 * MIN_MS;
const DAY_MS = 24 * HOUR_MS;

/** Spells a length in seconds: duration(3665) → «1 сағат 1 минут 5 секунд». */
export function duration(seconds: number): string {
  if (seconds < 0) {
    seconds = -seconds;
  }
  return formatDurationUnits(seconds * MS, "wide");
}

function formatDurationUnits(ms: number, width: "wide" | "abbreviated"): string {
  if (ms < 0) {
    ms = -ms;
  }
  if (ms < MS) {
    const millis = Math.trunc(ms);
    if (millis === 0) {
      return formatUnit(0, 0, SECOND, width);
    }
    return formatUnit(millis, 0, MILLISECOND, width);
  }
  const parts: string[] = [];
  const days = Math.trunc(ms / DAY_MS);
  ms %= DAY_MS;
  const hours = Math.trunc(ms / HOUR_MS);
  ms %= HOUR_MS;
  const mins = Math.trunc(ms / MIN_MS);
  ms %= MIN_MS;
  const secs = Math.trunc(ms / MS);
  if (days > 0) {
    parts.push(formatUnit(days, 0, DAY, width));
  }
  if (hours > 0) {
    parts.push(formatUnit(hours, 0, HOUR, width));
  }
  if (mins > 0) {
    parts.push(formatUnit(mins, 0, MINUTE, width));
  }
  if (secs > 0 || parts.length === 0) {
    parts.push(formatUnit(secs, 0, SECOND, width));
  }
  return parts.join(" ");
}

/** Single approximate unit: humanDuration(3665) → «шамамен 1 сағат». */
export function humanDuration(seconds: number): string {
  if (seconds < 0) {
    seconds = -seconds;
  }
  if (seconds < 1) {
    return "шамамен 0 секунд";
  }
  const [n, u] = largestUnit(seconds * MS);
  return "шамамен " + String(n) + " " + u.name;
}
