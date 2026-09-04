import { dateParts, monthName, pad2, weekdayName } from "./calendar-data.js";

export type Style = "short" | "medium" | "long" | "full";

export type DateStyleOptions = {
  style?: Style;
};

/** Formats a date. Default style is «long»: «2026 ж. 4 қыркүйек». */
export function formatDate(date: Date, options?: DateStyleOptions): string {
  const style = options?.style ?? "long";
  const { year, month, day, weekday } = dateParts(date);
  switch (style) {
    case "short":
      return `${pad2(day)}.${pad2(month)}.${pad2(year % 100)}`;
    case "medium":
      return `${year} ж. ${pad2(day)} ${monthName(month, "abbreviated")}`;
    case "long":
      return `${year} ж. ${day} ${monthName(month, "wide")}`;
    case "full":
      return `${year} ж. ${day} ${monthName(month, "wide")}, ${weekdayName(weekday)}`;
  }
}

/** 24-hour clock. Default style is «short»: «14:30». */
export function formatTime(date: Date, options?: DateStyleOptions): string {
  const style = options?.style ?? "short";
  const { hours, minutes, seconds } = dateParts(date);
  const hm = `${pad2(hours)}:${pad2(minutes)}`;
  const hms = `${hm}:${pad2(seconds)}`;
  switch (style) {
    case "short":
      return hm;
    case "medium":
      return hms;
    case "long":
    case "full":
      return `${hms} ${zoneLabel(date)}`;
  }
}

/** Usual UI datetime: «4 қыркүйек 2026, 14:30». */
export function formatDateTime(date: Date): string {
  const { year, month, day } = dateParts(date);
  return `${day} ${monthName(month, "wide")} ${year}, ${formatTime(date, { style: "short" })}`;
}

/** Year caption: yearLabel(2026) → «2026 ж.» */
export function yearLabel(year: number): string {
  return `${Math.trunc(year)} ж.`;
}

function zoneLabel(date: Date): string {
  if (date.getTimezoneOffset() === 0) {
    return "UTC";
  }
  const parts = new Intl.DateTimeFormat("en", { timeZoneName: "short" }).formatToParts(date);
  return parts.find((p) => p.type === "timeZoneName")?.value ?? "";
}
