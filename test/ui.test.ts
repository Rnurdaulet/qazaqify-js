import { describe, expect, it } from "vitest";
import { join, joinOr, message } from "../src/index.js";

describe("join", () => {
  it("uses және", () => {
    expect(join(["Алма", "алмұрт", "өрік"])).toBe("Алма, алмұрт және өрік");
    expect(join(["Алма", "алмұрт"])).toBe("Алма және алмұрт");
  });
});

describe("joinOr", () => {
  it("uses немесе", () => {
    expect(joinOr(["Алма", "алмұрт", "өрік"])).toBe("Алма, алмұрт немесе өрік");
  });
});

describe("message", () => {
  it("substitutes locale-formatted numbers", () => {
    expect(message("{count} жаңа хабарлама", { count: 5 })).toBe("5 жаңа хабарлама");
  });
});
