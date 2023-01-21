/**
 * Class representing the coordinate plane for a canvas
 */

export class CoordPlane {
  rotation: number;
  shiftX: number;
  shiftY: number;

  constructor(rotation: number, shiftX: number, shiftY: number) {
    this.rotation = rotation;
    this.shiftX = shiftX;
    this.shiftY = shiftY;
  }

  transformCoord(point: Point) {
    // first rotate
    const x =
      point.x * Math.cos(this.rotation) - point.x * Math.sin(this.rotation);
    const y =
      point.y * Math.sin(this.rotation) + point.y * Math.cos(this.rotation);
    return { x: x + this.shiftX, y: y + this.shiftY };
  }
}
