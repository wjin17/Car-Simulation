export function rotateClockwise(point: Point, rotation: number) {
  const x = point.x * Math.cos(rotation) - point.y * Math.sin(rotation);
  const y = point.x * Math.sin(rotation) + point.y * Math.cos(rotation);
  return { x, y };
}

export function shift(point: Point, shiftX: number, shiftY: number) {
  const x = point.x + shiftX;
  const y = point.y + shiftY;
  return { x, y };
}
