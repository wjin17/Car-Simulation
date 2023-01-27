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
        offset: t,
      };
    }
  }

  return null;
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

/**
 * 
 * circleCollide(circle) {
        var slope = this.slope();
        var yInt = this.yInt();
        var a = 1 + slope * slope;
        var b = 2 * (slope * (yInt - circle.y) - circle.x);
        var c = circle.x * circle.x + (yInt - circle.y) * (yInt - circle.y) - circle.radius * circle.radius;

        var d = b * b - 4 * a * c;

        if (d === 0) {
            return [(-b + Math.sqrt(d)) / (2 * a)];
        } else if (d > 0) {
            return [(-b + Math.sqrt(d)) / (2 * a), (-b - Math.sqrt(d)) / (2 * a)];
        } 

        return [];
    };
 */
export function findCircleLineIntersections(
  origin: Point,
  radius: number,
  line: Point[]
) {
  const slope = (line[1].y - line[0].y) / (line[1].x - line[0].x);
  const yIntercept = line[0].y - slope * line[0].x;

  const A = 1 + Math.pow(slope, 2);
  if (A == Infinity) return [];
  const B = 2 * (slope * (yIntercept - origin.y) - origin.x);
  const C =
    Math.pow(origin.x, 2) +
    Math.pow(yIntercept - origin.y, 2) -
    Math.pow(radius, 2);

  const D = Math.pow(B, 2) - 4 * A * C;

  if (D == 0) {
    return [(-B + Math.sqrt(D)) / (2 * A)].map((x) => ({
      x,
      y: slope * x + yIntercept,
    }));
  } else if (D >= 0) {
    const intersections = [
      (-B + Math.sqrt(D)) / (2 * A),
      (-B - Math.sqrt(D)) / (2 * A),
    ];

    return intersections.map((x) => ({ x, y: slope * x + yIntercept }));
  }
  return [];
}

// export function pointOnSegment(point: Point, segment: Point[]) {
//   const dxPoint = point.x - segment[0].x;
//   const dyPoint = point.y - segment[0].y;

//   const dxSegment = segment[1].x - segment[0].x;
//   const dySegment = segment[1].y - segment[0].y;

//   const cross = dxPoint * dySegment - dyPoint * dxSegment;
//   if (cross) return false;

//   if (Math.abs(dxSegment) >= Math.abs(dySegment)) {
//     if (dxSegment > 0) {
//       return segment[0].x <= point.x && point.x <= segment[1].x;
//     } else {
//       return segment[1].x <= point.x && point.x <= segment[0].x;
//     }
//   } else {
//     if (dySegment > 0) {
//       return segment[0].y <= point.x && point.y <= segment[1].x;
//     } else {
//       return segment[1].y <= point.x && point.y <= segment[0].x;
//     }
//   }
// }

export function pointOnSegment(point: Point, segment: Point[]) {
  const distanceA = distance(point, segment[0]);
  const distanceB = distance(point, segment[1]);
  const distances = distanceA + distanceB - distance(segment[0], segment[1]);
  return Math.abs(distances) < 0.00001;
}
