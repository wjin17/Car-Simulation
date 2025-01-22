import { findCircleLineIntersections, pointOnSegment } from "./intersections";

describe("Intersections", () => {
  it("should detect the intersection between a vertical line and a circle", () => {
    const origin = { x: 0, y: 0 };
    const line = [
      { x: 0, y: 0 },
      { x: 0, y: 20 },
    ];

    const intersections = findCircleLineIntersections(origin, 10, line);

    expect(intersections).toStrictEqual([{ x: 0, y: 10 }]);
  });

  it("should detect the intersection between a horizontal line and a circle", () => {
    const origin = { x: 0, y: 0 };
    const line = [
      { x: 0, y: 0 },
      { x: 20, y: 0 },
    ];

    const intersections = findCircleLineIntersections(origin, 10, line);

    expect(intersections).toStrictEqual([{ x: 10, y: 0 }]);
  });

  it("should detect the intersection between a diagonal line and a circle", () => {
    const origin = { x: 0, y: 0 };
    const line = [
      { x: 0, y: 0 },
      { x: 6, y: 8 },
    ];

    const intersections = findCircleLineIntersections(origin, 5, line);

    expect(intersections).toStrictEqual([{ x: 3, y: 4 }]);
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
