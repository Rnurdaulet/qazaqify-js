import { describe, expect, it } from "vitest";
import { relativeTime } from "../src/index.js";

function local(y: number, m: number, d: number, h = 0, min = 0, s = 0): Date {
  return new Date(y, m - 1, d, h, min, s);
}

describe("relativeTime", () => {
  const now = local(2026, 9, 4, 14, 30);

  it("uses қазір under 45 seconds", () => {
    expect(relativeTime(new Date(now.getTime() + 20_000), { now })).toBe("қазір");
  });

  it("uses duration on the same calendar day", () => {
    expect(relativeTime(new Date(now.getTime() - 5 * 60_000), { now })).toBe("5 минут бұрын");
    const noon = local(2026, 9, 4, 12, 0);
    expect(relativeTime(new Date(noon.getTime() - 3 * 3600_000), { now: noon })).toBe("3 сағат бұрын");
  });

  it("uses named calendar days", () => {
    expect(relativeTime(local(2026, 9, 3, 14, 30), { now })).toBe("кеше");
    expect(relativeTime(local(2026, 9, 5, 14, 30), { now })).toBe("ертең");
    expect(relativeTime(local(2026, 9, 2, 14, 30), { now })).toBe("алдыңгүні");
    expect(relativeTime(local(2026, 9, 9, 14, 30), { now })).toBe("5 күннен кейін");
  });

  it("uses calendar months", () => {
    expect(relativeTime(local(2026, 1, 4, 12), { now: local(2026, 2, 4, 12) })).toBe("1 ай бұрын");
    expect(relativeTime(local(2026, 2, 4, 12), { now: local(2026, 3, 6, 12) })).toBe("1 ай бұрын");
  });
});
