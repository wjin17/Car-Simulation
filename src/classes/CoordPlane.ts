/**
 * Class representing the coordinate plane for a canvas
 */

import { reflectOverX, rotateClockwise, shift } from "../utils/transform";
import { Car } from "./Car";

export class CoordPlane {
  rotation: number;
  shiftX: number;
  shiftY: number;
  center = { x: 0, y: 0 };

  constructor(rotation: number, x: number, y: number) {
    this.rotation = rotation;
    this.shiftX = x;
    this.shiftY = y;
  }

  updateCenter(car: Car) {
    const x = car.x;
    const y = car.y;
    this.center = { x, y };
  }

  mapToCanvas(point: Point) {
    // shift then rotate
    // const shiftedPoint = shift(
    //   point,
    //   this.shiftX + this.center.x,
    //   this.shiftY + this.center.y
    // );
    // return rotateClockwise(shiftedPoint, this.rotation);

    // rotate then shift
    const rotatedPoint = reflectOverX(point);
    return shift(
      rotatedPoint,
      this.shiftX - this.center.x,
      this.shiftY + this.center.y
    );
  }
}
