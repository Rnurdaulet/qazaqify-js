const monthsWide = [
  "қаңтар",
  "ақпан",
  "наурыз",
  "сәуір",
  "мамыр",
  "маусым",
  "шілде",
  "тамыз",
  "қыркүйек",
  "қазан",
  "қараша",
  "желтоқсан",
] as const;

const monthsAbbr = [
  "қаң.",
  "ақп.",
  "нау.",
  "сәу.",
  "мам.",
  "мау.",
  "шіл.",
  "там.",
  "қыр.",
  "қаз.",
  "қар.",
  "жел.",
] as const;

const monthsNarrow = ["Қ", "А", "Н", "С", "М", "М", "Ш", "Т", "Қ", "Қ", "Қ", "Ж"] as const;

/** Sunday = 0, same as Date.getDay(). */
const weekdaysWide = ["жексенбі", "дүйсенбі", "сейсенбі", "сәрсенбі", "бейсенбі", "жұма", "сенбі"] as const;
const weekdaysAbbr = ["жс", "дс", "сс", "ср", "бс", "жм", "сб"] as const;
const weekdaysNarrow = ["Ж", "Д", "С", "С", "Б", "Ж", "С"] as const;

export type NameWidth = "wide" | "abbreviated" | "narrow";
export type NameForm = "standalone" | "inDate";

export type CalendarNameOptions = {
  width?: NameWidth;
  form?: NameForm;
};

function titleKK(s: string): string {
  const r = Array.from(s);
  if (r.length === 0) {
    return s;
  }
  r[0] = r[0]!.toUpperCase();
  return r.join("");
}

function pickMonth(month: number, width: NameWidth): string {
  if (month < 1 || month > 12) {
    return "";
  }
  const i = month - 1;
  if (width === "abbreviated") {
    return monthsAbbr[i] ?? "";
  }
  if (width === "narrow") {
    return monthsNarrow[i] ?? "";
  }
  return monthsWide[i] ?? "";
}

function pickWeekday(day: number, width: NameWidth): string {
  if (day < 0 || day > 6) {
    return "";
  }
  if (width === "abbreviated") {
    return weekdaysAbbr[day] ?? "";
  }
  if (width === "narrow") {
    return weekdaysNarrow[day] ?? "";
  }
  return weekdaysWide[day] ?? "";
}

function applyForm(s: string, width: NameWidth, form: NameForm): string {
  if (s === "") {
    return "";
  }
  if (form === "standalone" && width !== "narrow") {
    return titleKK(s);
  }
  return s;
}

/** Month 1–12 or a Date. Standalone default: «Қыркүйек». In a date: «қыркүйек». */
export function month(value: number | Date, options?: CalendarNameOptions): string {
  const m = value instanceof Date ? value.getMonth() + 1 : Math.trunc(value);
  const width = options?.width ?? "wide";
  const form = options?.form ?? "standalone";
  return applyForm(pickMonth(m, width), width, form);
}

/** Weekday 0 = Sunday, or a Date. Standalone default: «Жұма». */
export function weekday(value: number | Date, options?: CalendarNameOptions): string {
  const d = value instanceof Date ? value.getDay() : Math.trunc(value);
  const width = options?.width ?? "wide";
  const form = options?.form ?? "standalone";
  return applyForm(pickWeekday(d, width), width, form);
}

/** January through December. */
export function months(options?: CalendarNameOptions): string[] {
  return Array.from({ length: 12 }, (_, i) => month(i + 1, options));
}

/** Sunday–Saturday, or Monday–Sunday if `mondayFirst`. */
export function weekdays(options?: CalendarNameOptions & { mondayFirst?: boolean }): string[] {
  const days = Array.from({ length: 7 }, (_, i) => weekday(i, options));
  if (options?.mondayFirst) {
    return [...days.slice(1), days[0]!];
  }
  return days;
}

/** Month 1–12. In-date form (lowercase). */
export function monthName(monthIndex: number, width: "wide" | "abbreviated"): string {
  return pickMonth(monthIndex, width);
}

/** Weekday 0 = Sunday. In-date wide form. */
export function weekdayName(day: number): string {
  return pickWeekday(day, "wide");
}

export function dateParts(d: Date): {
  year: number;
  month: number;
  day: number;
  weekday: number;
  hours: number;
  minutes: number;
  seconds: number;
} {
  return {
    year: d.getFullYear(),
    month: d.getMonth() + 1,
    day: d.getDate(),
    weekday: d.getDay(),
    hours: d.getHours(),
    minutes: d.getMinutes(),
    seconds: d.getSeconds(),
  };
}

export function pad2(n: number): string {
  return n < 10 ? `0${n}` : String(n);
}

export function midnight(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}
