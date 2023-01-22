/**
 * Class representing the coordinate plane for a canvas
 */

import { Car } from "./Car";

export class CoordPlane {
  rotation: number;
  shiftX: number;
  shiftY: number;
  center: Point;

  constructor(rotation: number, x: number, y: number) {
    this.rotation = rotation;
    this.shiftX = x;
    this.shiftY = y;
    this.center = { x, y };
  }

  updateCenter(car: Car) {
    const x = car.x;
    const y = car.y;
    this.center = { x, y };
  }

  translatePoint(point: Point) {
    const x =
      point.x * Math.cos(this.rotation) - point.x * Math.sin(this.rotation);
    const y =
      point.y * Math.sin(this.rotation) + point.y * Math.cos(this.rotation);
    return {
      x: x + this.shiftX - this.center.x,
      y: y + this.shiftY + this.center.y,
    };
  }
}
