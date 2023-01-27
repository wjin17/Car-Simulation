export function distance(A: Point, B: Point) {
  const aSquare = Math.pow(A.x - B.x, 2);
  const bSquare = Math.pow(A.y - B.y, 2);
  return Math.sqrt(aSquare + bSquare);
}
