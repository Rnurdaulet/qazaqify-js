import { integer, numberFrac } from "./number.js";
import { words } from "./words.js";

const CURRENCY_SYMBOL = "₸";
const TENGE = "теңге";
const TIYN = "тиын";
const MINUS_WORD = "минус";

/** Formats an amount with a currency code: currency(12500, "KZT") → «12 500 ₸». */
export function currency(amount: number, code = "KZT"): string {
  let num: string;
  if (amount === Math.trunc(amount) && Number.isSafeInteger(amount)) {
    num = integer(amount);
  } else {
    num = numberFrac(amount, 2);
  }
  return num + " " + currencyMark(code);
}

function currencyMark(code: string): string {
  switch (code.trim().toUpperCase()) {
    case "":
    case "KZT":
      return CURRENCY_SYMBOL;
    default:
      return code.trim().toUpperCase();
  }
}

/**
 * Spells float64 tenge.
 * 12 → «он екі теңге»; 12.50 → «он екі теңге елу тиын».
 */
export function currencyWords(amount: number): string {
  const [neg, te, ti] = tengeTiyn(amount);
  return withMinus(neg, moneyWords(te, ti));
}

function tengeTiyn(amount: number): [neg: boolean, te: number, ti: number] {
  const neg = amount < 0;
  if (neg) {
    amount = -amount;
  }
  const total = Math.round(amount * 100 + 1e-9);
  return [neg, Math.trunc(total / 100), total % 100];
}

function withMinus(neg: boolean, s: string): string {
  return neg ? MINUS_WORD + " " + s : s;
}

function moneyWords(te: number, ti: number): string {
  const s = words(te) + " " + TENGE;
  if (ti === 0) {
    return s;
  }
  return s + " " + words(ti) + " " + TIYN;
}
