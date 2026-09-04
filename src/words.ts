const MINUS_WORD = "минус";
const ZERO_WORD = "нөл";
const HUNDRED_WORD = "жүз";
const WHOLE_WORD = "бүтін";
const NAN_WORD = "сан емес";

const FRAC_NAMES = [
  "",
  "оннан",
  "жүзден",
  "мыңнан",
  "он мыңнан",
  "жүз мыңнан",
  "миллионнан",
  "он миллионнан",
  "жүз миллионнан",
  "миллиардтан",
  "он миллиардтан",
  "жүз миллиардтан",
  "триллионнан",
  "он триллионнан",
  "жүз триллионнан",
];

const ONES = ["", "бір", "екі", "үш", "төрт", "бес", "алты", "жеті", "сегіз", "тоғыз"];
const TENS = ["", "он", "жиырма", "отыз", "қырық", "елу", "алпыс", "жетпіс", "сексен", "тоқсан"];

const SCALES = [
  "",
  "мың",
  "миллион",
  "миллиард",
  "триллион",
  "квадриллион",
  "квинтиллион",
  "секстиллион",
  "септиллион",
  "октиллион",
  "нониллион",
  "дециллион",
  "ундециллион",
  "дуодециллион",
  "тредециллион",
];

/** Irregular ordinals only. Regular forms come from ordinalGuess. */
export const ordinalLast: Record<string, string> = {
  жиырма: "жиырмасыншы",
  қырық: "қырқыншы",
  елу: "елуінші",
};

const KK_VOWELS = new Set(["а", "ә", "е", "ё", "и", "о", "ө", "у", "ұ", "ү", "ы", "і", "э", "ю", "я"]);
const FRONT_VOWELS = new Set(["ә", "е", "і", "ө", "ү", "и", "э"]);

/**
 * Spells a number.
 * 42 → «қырық екі»; 84.13 → «сексен төрт бүтін жүзден он үш».
 * Strings accept «12,5» or «12.5».
 */
export function words(n: number | bigint | string): string {
  if (typeof n === "string") {
    return wordsString(n) ?? "";
  }
  if (typeof n === "bigint") {
    return wordsInt(n);
  }
  if (!Number.isFinite(n)) {
    return NAN_WORD;
  }
  if (Number.isInteger(n)) {
    return wordsInt(BigInt(n));
  }
  return wordsString(decimalString(n)) ?? NAN_WORD;
}

function wordsInt(n: bigint): string {
  if (n === 0n) {
    return ZERO_WORD;
  }
  const neg = n < 0n;
  const abs = neg ? -n : n;
  const s = wordsUint(abs);
  return neg ? MINUS_WORD + " " + s : s;
}

function wordsString(raw: string): string | null {
  let s = raw.trim();
  if (s === "") {
    return null;
  }
  let neg = false;
  if (s[0] === "+") {
    s = s.slice(1);
  } else if (s[0] === "-") {
    neg = true;
    s = s.slice(1);
  }
  if (s === "") {
    return null;
  }
  const split = splitDecimal(s);
  if (split === null) {
    return null;
  }
  let { intPart, fracPart, hasFrac } = split;
  if (intPart === "" && hasFrac) {
    intPart = "0";
  }
  if (intPart === "" || !allDigits(intPart)) {
    return null;
  }
  if (hasFrac && !allDigits(fracPart)) {
    return null;
  }

  const intWords = digitsToWords(intPart);
  if (intWords === null) {
    return null;
  }

  if (!hasFrac || fracPart === "" || isAllZeros(fracPart)) {
    if (neg && !isAllZeros(intPart)) {
      return MINUS_WORD + " " + intWords;
    }
    if (neg && isAllZeros(intPart)) {
      return ZERO_WORD;
    }
    return intWords;
  }

  const fracWords = digitsToWords(fracPart);
  if (fracWords === null) {
    return null;
  }
  const name = FRAC_NAMES[fracPart.length];
  if (name === undefined || name === "") {
    return null;
  }
  return `${neg ? MINUS_WORD + " " : ""}${intWords} ${WHOLE_WORD} ${name} ${fracWords}`;
}

function splitDecimal(s: string): { intPart: string; fracPart: string; hasFrac: boolean } | null {
  const dot = s.indexOf(".");
  const comma = s.indexOf(",");
  if (dot >= 0 && comma >= 0) {
    return null;
  }
  const i = dot >= 0 ? dot : comma;
  if (i < 0) {
    return { intPart: s, fracPart: "", hasFrac: false };
  }
  return { intPart: s.slice(0, i), fracPart: s.slice(i + 1), hasFrac: true };
}

function allDigits(s: string): boolean {
  if (s === "") {
    return false;
  }
  for (const r of s) {
    if (r < "0" || r > "9") {
      return false;
    }
  }
  return true;
}

function isAllZeros(s: string): boolean {
  for (const r of s) {
    if (r !== "0") {
      return false;
    }
  }
  return true;
}

function decimalString(n: number): string {
  if (n === 0) {
    return "0";
  }
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

export function wordsUint(n: bigint): string {
  if (n === 0n) {
    return ZERO_WORD;
  }
  return mustDigits(n.toString());
}

function mustDigits(digits: string): string {
  return digitsToWords(digits) ?? "";
}

function digitsToWords(digits: string): string | null {
  digits = digits.replace(/^0+/, "");
  if (digits === "") {
    return ZERO_WORD;
  }
  if (digits.length % 3 !== 0) {
    digits = "0".repeat(3 - (digits.length % 3)) + digits;
  }
  const nGroups = digits.length / 3;
  if (nGroups > SCALES.length) {
    return null;
  }

  const parts: string[] = [];
  for (let i = 0; i < nGroups; i++) {
    const scale = nGroups - 1 - i;
    const trip = digits.slice(i * 3, i * 3 + 3);
    const n = (trip.charCodeAt(0) - 48) * 100 + (trip.charCodeAt(1) - 48) * 10 + (trip.charCodeAt(2) - 48);
    if (n === 0) {
      continue;
    }
    let w = triplet(n);
    const scaleWord = SCALES[scale] ?? "";
    if (scaleWord !== "") {
      // 1000 → мың (not бір мың); million+ keep бір: 1_000_000 → бір миллион
      if (n === 1 && scale === 1) {
        w = scaleWord;
      } else {
        w += " " + scaleWord;
      }
    }
    parts.push(w);
  }
  if (parts.length === 0) {
    return ZERO_WORD;
  }
  return parts.join(" ");
}

function triplet(n: number): string {
  if (n <= 0 || n > 999) {
    return "";
  }
  const h = Math.floor(n / 100);
  const r = n % 100;
  const t = Math.floor(r / 10);
  const u = r % 10;
  const p: string[] = [];
  if (h === 1) {
    p.push(HUNDRED_WORD);
  } else if (h > 1) {
    p.push(ONES[h] ?? "", HUNDRED_WORD);
  }
  if (t > 0) {
    p.push(TENS[t] ?? "");
  }
  if (u > 0) {
    p.push(ONES[u] ?? "");
  }
  return p.join(" ");
}

export function ordinalGuess(word: string): string {
  const rs = Array.from(word);
  const last = rs[rs.length - 1] ?? "";
  const vowel = lastVowel(rs);
  const front = isFront(vowel);
  if (isKKVowel(last)) {
    return front ? "нші" : "ншы";
  }
  return front ? "інші" : "ыншы";
}

function lastVowel(rs: string[]): string {
  for (let i = rs.length - 1; i >= 0; i--) {
    const ch = rs[i];
    if (ch !== undefined && isKKVowel(ch)) {
      return ch;
    }
  }
  return "";
}

function isKKVowel(r: string): boolean {
  return KK_VOWELS.has(r.toLowerCase());
}

function isFront(r: string): boolean {
  return FRONT_VOWELS.has(r.toLowerCase());
}
