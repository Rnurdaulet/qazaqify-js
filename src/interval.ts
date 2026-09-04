import { monthName, dateParts } from "./calendar-data.js";
import { formatDate } from "./date.js";

const EN_DASH = "–";

/** Date range: «2026 ж. 4–10 қыркүйек», «4 қыркүйек – 2 қазан». */
export function formatInterval(from: Date, to: Date): string {
  if (to.getTime() < from.getTime()) {
    [from, to] = [to, from];
  }
  const a = dateParts(from);
  const b = dateParts(to);

  if (a.year === b.year && a.month === b.month && a.day === b.day) {
    return formatDate(from, { style: "long" });
  }

  if (a.year === b.year && a.month === b.month) {
    return `${a.year} ж. ${a.day}${EN_DASH}${b.day} ${monthName(a.month, "wide")}`;
  }

  if (a.year === b.year) {
    return `${a.year} ж. ${a.day} ${monthName(a.month, "wide")} ${EN_DASH} ${b.day} ${monthName(b.month, "wide")}`;
  }

  return `${formatDate(from, { style: "long" })} ${EN_DASH} ${formatDate(to, { style: "long" })}`;
}
