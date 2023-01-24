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
