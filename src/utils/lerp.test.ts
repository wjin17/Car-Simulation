import { lerp } from "./lerp";

describe("Linear interpolation", () => {
  it("should return 12 for lerp(4, 8, 2)", () => {
    expect(lerp(4, 8, 2)).toBe(12);
  });
  it("should return 6 for lerp(4, 8, 0.5)", () => {
    expect(lerp(4, 8, 0.5)).toBe(6);
  });
});
