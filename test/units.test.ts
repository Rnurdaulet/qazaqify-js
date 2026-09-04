import { describe, expect, it } from "vitest";
import { bytes, duration, humanDuration, unit } from "../src/index.js";

describe("unit", () => {
  it("auto-scales length", () => {
    expect(unit(1500, "meter")).toBe("1,5 км");
  });
});

describe("bytes", () => {
  it("uses SI 1000", () => {
    expect(bytes(1536000)).toBe("1,5 МБ");
  });
});

describe("duration", () => {
  it("spells all non-zero parts", () => {
    expect(duration(3665)).toBe("1 сағат 1 минут 5 секунд");
  });
});

describe("humanDuration", () => {
  it("uses a single approximate unit", () => {
    expect(humanDuration(3665)).toBe("шамамен 1 сағат");
  });
});
