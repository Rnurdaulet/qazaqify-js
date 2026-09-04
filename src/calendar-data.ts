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

/** Sunday = 0, same as Date.getDay(). */
const weekdaysWide = ["жексенбі", "дүйсенбі", "сейсенбі", "сәрсенбі", "бейсенбі", "жұма", "сенбі"] as const;

/** Month 1–12. In-date form (lowercase). */
export function monthName(month: number, width: "wide" | "abbreviated"): string {
  if (month < 1 || month > 12) {
    return "";
  }
  return (width === "abbreviated" ? monthsAbbr[month - 1] : monthsWide[month - 1]) ?? "";
}

/** Weekday 0 = Sunday. In-date wide form. */
export function weekdayName(day: number): string {
  if (day < 0 || day > 6) {
    return "";
  }
  return weekdaysWide[day] ?? "";
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
