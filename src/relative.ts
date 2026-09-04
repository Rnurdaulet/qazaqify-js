import { midnight } from "./calendar-data.js";

const TODAY = "бүгін";
const YESTERDAY = "кеше";
const TOMORROW = "ертең";
const DAY_BEFORE_YEST = "алдыңгүні";
const DAY_AFTER_TOMORR = "бүрсігүні";
const NOW = "қазір";
const JUST_NOW = "жаңа ғана";

type RelUnit = {
  name: string;
  ablative: string;
};

export const unitSecond: RelUnit = { name: "секунд", ablative: "секундтан" };
export const unitMinute: RelUnit = { name: "минут", ablative: "минуттан" };
export const unitHour: RelUnit = { name: "сағат", ablative: "сағаттан" };
export const unitDay: RelUnit = { name: "күн", ablative: "күннен" };
export const unitWeek: RelUnit = { name: "апта", ablative: "аптадан" };
export const unitMonth: RelUnit = { name: "ай", ablative: "айдан" };
export const unitYear: RelUnit = { name: "жыл", ablative: "жылдан" };

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const WEEK = 7 * DAY;
const MONTH = 30 * DAY;
const YEAR = 365 * DAY;

function past(n: number, u: RelUnit): string {
  return `${n} ${u.name} бұрын`;
}

function future(n: number, u: RelUnit): string {
  return `${n} ${u.ablative} кейін`;
}

function namedDay(offset: number): string {
  switch (offset) {
    case -2:
      return DAY_BEFORE_YEST;
    case -1:
      return YESTERDAY;
    case 0:
      return TODAY;
    case 1:
      return TOMORROW;
    case 2:
      return DAY_AFTER_TOMORR;
    default:
      return "";
  }
}

export type RelativeTimeOptions = {
  now?: Date;
};

/**
 * Usual UI relative phrase: «5 минут бұрын», «кеше», «ертең».
 * Pass `now` for tests; defaults to the current time.
 */
export function relativeTime(date: Date, options?: RelativeTimeOptions): string {
  const now = options?.now ?? new Date();
  if (Math.abs(date.getTime() - now.getTime()) < 45 * SECOND) {
    return NOW;
  }
  return calendarRelative(date, now);
}

function calendarRelative(t: Date, now: Date): string {
  const diff = t.getTime() - now.getTime();
  if (Math.abs(diff) < 45 * SECOND) {
    return JUST_NOW;
  }

  const days = calendarDays(now, t);
  if (days === 0) {
    return diff < 0 ? ago(-diff) : inFuture(diff);
  }
  const name = namedDay(days);
  if (name !== "") {
    return name;
  }
  if (days < 0) {
    return pastCalendar(-days, now, t);
  }
  return futureCalendar(days, now, t);
}

function ago(ms: number): string {
  if (ms < SECOND) {
    return JUST_NOW;
  }
  const [n, u] = largestUnit(ms);
  return past(n, u);
}

function inFuture(ms: number): string {
  if (ms < SECOND) {
    return NOW;
  }
  const [n, u] = largestUnit(ms);
  return future(n, u);
}

function pastCalendar(daySpan: number, now: Date, then: Date): string {
  const months = calendarMonths(then, now);
  if (months >= 12) {
    return past(Math.max(1, Math.trunc(months / 12)), unitYear);
  }
  if (months >= 1) {
    return past(months, unitMonth);
  }
  if (daySpan >= 7) {
    return past(Math.max(1, Math.trunc(daySpan / 7)), unitWeek);
  }
  return past(daySpan, unitDay);
}

function futureCalendar(daySpan: number, now: Date, then: Date): string {
  const months = calendarMonths(now, then);
  if (months >= 12) {
    return future(Math.max(1, Math.trunc(months / 12)), unitYear);
  }
  if (months >= 1) {
    return future(months, unitMonth);
  }
  if (daySpan >= 7) {
    return future(Math.max(1, Math.trunc(daySpan / 7)), unitWeek);
  }
  return future(daySpan, unitDay);
}

function calendarDays(from: Date, to: Date): number {
  const a = midnight(from).getTime();
  const b = midnight(to).getTime();
  return Math.round((b - a) / DAY);
}

function calendarMonths(a: Date, b: Date): number {
  const am = midnight(a);
  const bm = midnight(b);
  let n = (bm.getFullYear() - am.getFullYear()) * 12 + (bm.getMonth() - am.getMonth());
  if (bm.getDate() < am.getDate()) {
    n--;
  }
  return n < 0 ? 0 : n;
}

/** Largest duration unit. `ms` is a non-negative millisecond span. */
export function largestUnit(ms: number): [number, RelUnit] {
  switch (true) {
    case ms < MINUTE:
      return [Math.max(1, Math.trunc(ms / SECOND)), unitSecond];
    case ms < HOUR:
      return [Math.max(1, Math.trunc(ms / MINUTE)), unitMinute];
    case ms < DAY:
      return [Math.max(1, Math.trunc(ms / HOUR)), unitHour];
    case ms < WEEK:
      return [Math.max(1, Math.trunc(ms / DAY)), unitDay];
    case ms < MONTH:
      return [Math.max(1, Math.trunc(ms / WEEK)), unitWeek];
    case ms < YEAR:
      return [Math.max(1, Math.trunc(ms / MONTH)), unitMonth];
    default:
      return [Math.max(1, Math.trunc(ms / YEAR)), unitYear];
  }
}
