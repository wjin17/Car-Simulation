export function getRGBA(value: number) {
  const alpha = Math.abs(value);
  const R = value < 0 ? 0 : 240;
  const G = value < 0 ? 175 : 113;
  const B = value < 0 ? 285 : 103;
  return "rgba(" + R + "," + G + "," + B + "," + alpha + ")";
}
