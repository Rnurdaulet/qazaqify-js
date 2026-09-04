import { describe, expect, it } from "vitest";
import {
  formatDate,
  formatDateTime,
  formatInterval,
  formatTime,
  month,
  months,
  weekday,
  weekdays,
  yearLabel,
} from "../src/index.js";

function local(y: number, m: number, d: number, h = 0, min = 0, s = 0): Date {
  return new Date(y, m - 1, d, h, min, s);
}

describe("formatDate", () => {
  const d = local(2026, 9, 4, 15, 4, 5);

  it("formats CLDR styles", () => {
    expect(formatDate(d, { style: "short" })).toBe("04.09.26");
    expect(formatDate(d, { style: "medium" })).toBe("2026 ж. 04 қыр.");
    expect(formatDate(d, { style: "long" })).toBe("2026 ж. 4 қыркүйек");
    expect(formatDate(d)).toBe("2026 ж. 4 қыркүйек");
    expect(formatDate(d, { style: "full" })).toBe("2026 ж. 4 қыркүйек, жұма");
  });
});

describe("formatTime", () => {
  const d = local(2026, 9, 4, 15, 4, 5);

  it("formats 24-hour clock", () => {
    expect(formatTime(d)).toBe("15:04");
    expect(formatTime(d, { style: "short" })).toBe("15:04");
    expect(formatTime(d, { style: "medium" })).toBe("15:04:05");
    expect(formatTime(d, { style: "long" })).toBe("15:04:05 UTC");
    expect(formatTime(d, { style: "full" })).toBe("15:04:05 UTC");
  });
});

describe("formatDateTime", () => {
  it("uses the usual UI pattern", () => {
    expect(formatDateTime(local(2026, 9, 4, 15, 4, 5))).toBe("4 қыркүйек 2026, 15:04");
  });
});

describe("formatInterval", () => {
  it("collapses same month and year", () => {
    const a = local(2026, 9, 4);
    const b = local(2026, 9, 10);
    const c = local(2026, 10, 2);
    const d = local(2027, 1, 5);
    expect(formatInterval(a, a)).toBe("2026 ж. 4 қыркүйек");
    expect(formatInterval(a, b)).toBe("2026 ж. 4–10 қыркүйек");
    expect(formatInterval(a, c)).toBe("2026 ж. 4 қыркүйек – 2 қазан");
    expect(formatInterval(a, d)).toBe("2026 ж. 4 қыркүйек – 2027 ж. 5 қаңтар");
  });
});

describe("yearLabel", () => {
  it("adds ж. after the year", () => {
    expect(yearLabel(2026)).toBe("2026 ж.");
  });
});

describe("months", () => {
  it("returns in-date month names", () => {
    expect(months({ form: "inDate" })).toEqual([
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
    ]);
  });
});

describe("month", () => {
  it("uses standalone title case by default", () => {
    expect(month(1)).toBe("Қаңтар");
  });

  it("abbreviates in-date form", () => {
    expect(month(9, { width: "abbreviated", form: "inDate" })).toBe("қыр.");
  });
});

describe("weekday", () => {
  it("uses Sunday = 0", () => {
    expect(weekday(1, { form: "inDate" })).toBe("дүйсенбі");
    expect(weekday(5)).toBe("Жұма");
  });

  it("abbreviates in-date form", () => {
    expect(weekday(1, { width: "abbreviated", form: "inDate" })).toBe("дс");
  });
});

describe("weekdays", () => {
  it("starts on Monday when mondayFirst", () => {
    expect(weekdays({ mondayFirst: true, form: "inDate" })[0]).toBe("дүйсенбі");
    expect(weekdays({ mondayFirst: true, form: "inDate" })[6]).toBe("жексенбі");
  });
});
