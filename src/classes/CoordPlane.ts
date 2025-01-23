import { reflectOverX, rotateClockwise, shift } from "../utils/transformations";
import { Car } from "./Car";

/**
 * Class representing the coordinate plane for a canvas
 */
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

  /**
   * Moves the canvas to the given point
   * @param point
   */
  updateCenter(point: Point) {
    const x = point.x;
    const y = point.y;
    this.center = { x, y };
  }

  /**
   * Maps a point to the canvas
   * @param point
   * @returns Point
   */
  mapToCanvas(point: Point): Point {
    const rotatedPoint = reflectOverX(point);
    return shift(
      rotatedPoint,
      this.shiftX - this.center.x,
      this.shiftY + this.center.y
    );
  }
}
