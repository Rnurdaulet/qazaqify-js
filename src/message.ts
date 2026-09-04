import { integer, number } from "./number.js";

/** Substitutes {name} placeholders. Numbers are locale-formatted. */
export function message(pattern: string, vars?: Record<string, unknown>): string {
  if (vars == null) {
    return pattern;
  }
  let out = pattern;
  for (const [k, v] of Object.entries(vars)) {
    out = out.split("{" + k + "}").join(formatVar(v));
  }
  return out;
}

function formatVar(v: unknown): string {
  if (v == null) {
    return "";
  }
  if (typeof v === "string") {
    return v;
  }
  if (typeof v === "bigint") {
    return integer(v);
  }
  if (typeof v === "number") {
    if (Number.isInteger(v)) {
      return integer(v);
    }
    return number(v);
  }
  if (typeof v === "boolean") {
    return String(v);
  }
  return String(v);
}
