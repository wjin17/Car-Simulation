import { distance } from "./distance";
import { lerp } from "./lerp";

export function linesIntersect(A: Point, B: Point, C: Point, D: Point) {
  const tTop = (D.x - C.x) * (A.y - C.y) - (D.y - C.y) * (A.x - C.x);
  const uTop = (C.y - A.y) * (A.x - B.x) - (C.x - A.x) * (A.y - B.y);
  const bottom = (D.y - C.y) * (B.x - A.x) - (D.x - C.x) * (B.y - A.y);

  if (bottom != 0) {
    const t = tTop / bottom;
    const u = uTop / bottom;
    if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
      return {
        x: lerp(A.x, B.x, t),
        y: lerp(A.y, B.y, t),
      };
    }
  }

  return undefined;
}

export function polygonsIntersect(polygon1: Point[], polygon2: Point[]) {
  for (let i = 0; i < polygon1.length; i++) {
    for (let j = 0; j < polygon2.length; j++) {
      const touch = linesIntersect(
        polygon1[i],
        polygon1[(i + 1) % polygon1.length],
        polygon2[j],
        polygon2[(j + 1) % polygon2.length]
      );
      if (touch) {
        return true;
      }
    }
  }
  return false;
}

export function findCircleLineIntersections(
  origin: Point,
  radius: number,
  line: Point[]
) {
  const [p1, p2] = line;
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;

  const circle_x = p1.x - origin.x;
  const circle_y = p1.y - origin.y;

  const A = dx * dx + dy * dy;
  const B = 2 * (circle_x * dx + circle_y * dy);
  const C = circle_x * circle_x + circle_y * circle_y - radius * radius;

  const discriminant = B * B - 4 * A * C;
  if (discriminant < 0) return [];

  const t1 = (-B + Math.sqrt(discriminant)) / (2 * A);
  const t2 = (-B - Math.sqrt(discriminant)) / (2 * A);

  const intersections: Point[] = [];

  for (const t of [t1, t2]) {
    if (t >= 0 && t <= 1) {
      intersections.push({
        x: p1.x + t * dx + origin.x - origin.x,
        y: p1.y + t * dy + origin.y - origin.y,
      });
    }
  }

  return intersections;
  // const slope = (p2.y - p1.y) / (p2.x - p1.x);
  // const yIntercept = p1.y - slope * p1.x;

  // const A = 1 + Math.pow(slope, 2);
  // if (A == Infinity) return [];
  // const B = 2 * (slope * (yIntercept - origin.y) - origin.x);
  // const C =
  //   Math.pow(origin.x, 2) +
  //   Math.pow(yIntercept - origin.y, 2) -
  //   Math.pow(radius, 2);

  // const D = Math.pow(B, 2) - 4 * A * C;

  // if (D == 0) {
  //   const intersection = [(-B + Math.sqrt(D)) / (2 * A)];

  //   return intersection
  //     .map((x) => ({
  //       x,
  //       y: slope * x + yIntercept,
  //     }))
  //     .filter((point) => Math.abs(distance(point, origin) - radius) < 0.0001);
  // } else if (D >= 0) {
  //   const intersections = [
  //     (-B + Math.sqrt(D)) / (2 * A),
  //     (-B - Math.sqrt(D)) / (2 * A),
  //   ];

  //   return intersections
  //     .map((x) => ({ x, y: slope * x + yIntercept }))
  //     .filter((point) => Math.abs(distance(point, origin) - radius) < 0.0001);
  // }
  // return [];
}

export function pointOnSegment(point: Point, segment: Point[]) {
  const distanceA = distance(point, segment[0]);
  const distanceB = distance(point, segment[1]);
  const distances = distanceA + distanceB - distance(segment[0], segment[1]);
  return Math.abs(distances) < 0.00000001;
}
