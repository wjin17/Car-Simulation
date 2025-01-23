import { reflectOverX, rotateClockwise, shift } from "./transformations";

describe("Transformations", () => {
  it("should shift a point by 150 in x and y", () => {
    const point = { x: 0, y: 0 };
    const { x, y } = shift(point, 150, 150);
    expect(x).toBeCloseTo(150);
    expect(y).toBeCloseTo(150);
  });

  it("should rotate a point 90deg clockwise", () => {
    const point = { x: 60, y: 90 };
    const { x, y } = rotateClockwise(point, Math.PI / 2);
    expect(x).toBeCloseTo(90);
    expect(y).toBeCloseTo(-60);
  });

  it("should reflect a point about the x axis", () => {
    const point = { x: 60, y: 90 };
    const { x, y } = reflectOverX(point);
    expect(x).toBeCloseTo(60);
    expect(y).toBeCloseTo(-90);
  });
});
