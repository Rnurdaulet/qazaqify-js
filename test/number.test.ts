import { describe, expect, it } from "vitest";
import { currency, currencyWords, number, ordinal, percent } from "../src/index.js";

const NBSP = "\u00a0";

describe("number", () => {
  it("groups thousands with NBSP and uses comma decimal", () => {
    expect(number(1234567.89)).toBe(`1${NBSP}234${NBSP}567,89`);
  });

  it("formats NaN", () => {
    expect(number(Number.NaN)).toBe("сан емес");
  });
});

describe("percent", () => {
  it("formats ratios", () => {
    expect(percent(0.75)).toBe("75%");
    expect(percent(0.755)).toBe("75,5%");
  });
});

describe("currency", () => {
  it("formats KZT integers and fractions", () => {
    expect(currency(12500, "KZT")).toBe(`12${NBSP}500 ₸`);
    expect(currency(1234.5, "KZT")).toBe(`1${NBSP}234,50 ₸`);
  });

  it("defaults to KZT", () => {
    expect(currency(12500)).toBe(`12${NBSP}500 ₸`);
  });

  it("uses uppercase code for other currencies", () => {
    expect(currency(10, "usd")).toBe("10 USD");
  });
});

describe("currencyWords", () => {
  it("matches Go golden values", () => {
    expect(currencyWords(0)).toBe("нөл теңге");
    expect(currencyWords(1)).toBe("бір теңге");
    expect(currencyWords(1.01)).toBe("бір теңге бір тиын");
    expect(currencyWords(1.1)).toBe("бір теңге он тиын");
    expect(currencyWords(1.5)).toBe("бір теңге елу тиын");
    expect(currencyWords(12)).toBe("он екі теңге");
    expect(currencyWords(12.5)).toBe("он екі теңге елу тиын");
    expect(currencyWords(125.53)).toBe("жүз жиырма бес теңге елу үш тиын");
    expect(currencyWords(999.99)).toBe("тоғыз жүз тоқсан тоғыз теңге тоқсан тоғыз тиын");
    expect(currencyWords(-12.5)).toBe("минус он екі теңге елу тиын");
    expect(currencyWords(12500)).toBe("он екі мың бес жүз теңге");
  });
});

describe("ordinal", () => {
  it("uses vowel-harmony suffixes", () => {
    const cases: Record<number, string> = {
      1: "1-ші",
      2: "2-ші",
      3: "3-ші",
      4: "4-ші",
      5: "5-ші",
      6: "6-шы",
      7: "7-ші",
      8: "8-ші",
      9: "9-шы",
      10: "10-шы",
      11: "11-ші",
      12: "12-ші",
      13: "13-ші",
      14: "14-ші",
      15: "15-ші",
      16: "16-шы",
      17: "17-ші",
      18: "18-ші",
      19: "19-шы",
      20: "20-шы",
      21: "21-ші",
      22: "22-ші",
      26: "26-шы",
      27: "27-ші",
      30: "30-шы",
      31: "31-ші",
      36: "36-шы",
      40: "40-шы",
      50: "50-ші",
      60: "60-шы",
      70: "70-ші",
      80: "80-ші",
      90: "90-шы",
      100: "100-ші",
    };
    for (const [n, want] of Object.entries(cases)) {
      expect(ordinal(Number(n)), `ordinal(${n})`).toBe(want);
    }
  });
});
