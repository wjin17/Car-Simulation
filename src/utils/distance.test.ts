import { distance } from "./distance";

describe("Distance", () => {
  it("should return the distance between 2 points", () => {
    const p1 = { x: 0, y: 0 };
    const p2 = { x: 3, y: 4 };

    expect(distance(p1, p2)).toBe(5);
  });
});
