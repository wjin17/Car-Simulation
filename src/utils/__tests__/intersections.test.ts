import { findCircleLineIntersections, pointOnSegment } from "../intersections";

describe("Intersections", () => {
  it.skip("should detect the intersection between a line and a circle", () => {
    const origin = { x: 0, y: 0 };
    const line = [
      { x: 0, y: 0 },
      { x: 1, y: 10 },
    ];

    const intersections = findCircleLineIntersections(origin, 10, line);
    console.log("bruh aint no way", intersections);

    // expect(x).toBeCloseTo(150);
    // expect(y).toBeCloseTo(150);
  });

  it("should determine if a point is on a segment", () => {
    const point = { x: 1, y: 1 };
    const segment = [
      { x: 0, y: 0 },
      { x: 2, y: 2 },
    ];

    const pointIsOnSegment = pointOnSegment(point, segment);
    expect(pointIsOnSegment).toBeTruthy();
  });

  it("should determine if a point is not on a segment", () => {
    const point = { x: 3, y: 3 };
    const segment = [
      { x: 0, y: 0 },
      { x: 2, y: 2 },
    ];

    const pointIsOnSegment = pointOnSegment(point, segment);
    expect(pointIsOnSegment).toBeFalsy();
  });
});
