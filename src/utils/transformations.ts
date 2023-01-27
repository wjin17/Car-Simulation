export function rotateClockwise(point: Point, rotation: number) {
  const x = point.x * Math.cos(-rotation) - point.y * Math.sin(-rotation);
  const y = point.x * Math.sin(-rotation) + point.y * Math.cos(-rotation);
  return { x, y };
}

export function rotateClockwiseAround(
  origin: Point,
  point: Point,
  rotation: number
) {
  const shiftedPoint = shift(point, -origin.x, -origin.y);
  const x =
    shiftedPoint.x * Math.cos(-rotation) - shiftedPoint.y * Math.sin(-rotation);
  const y =
    shiftedPoint.x * Math.sin(-rotation) + shiftedPoint.y * Math.cos(-rotation);
  return shift({ x, y }, origin.x, origin.y);
}

export function reflectOverX(point: Point) {
  const x = point.x;
  const y = -point.y;
  return { x, y };
}

export function shift(point: Point, shiftX: number, shiftY: number) {
  const x = point.x + shiftX;
  const y = point.y + shiftY;
  return { x, y };
}

export function makePositiveRad(rad: number, keep2PI?: boolean) {
  const positiveRad = (rad + 2 * Math.PI) % (2 * Math.PI);
  if (positiveRad == 0 && keep2PI) return 2 * Math.PI;
  else return positiveRad;
}
