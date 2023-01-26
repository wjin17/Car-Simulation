import { Road } from "../../@types/road";
import { shift } from "../../utils/transformations";
import { Car } from "../Car";
import { CoordPlane } from "../CoordPlane";

export class TurnRoad implements Road {
  plane: CoordPlane;
  start: Point;
  width: number;
  rotation: number;

  origin: Point;
  rotationOrigin: number;
  isCW: boolean;

  constructor(
    plane: CoordPlane,
    x: number,
    y: number,
    width: number,
    rotation: number,
    direction: "CW" | "CCW"
  ) {
    this.plane = plane;
    this.start = { x, y };
    this.width = width;
    this.rotation = rotation;
    this.isCW = direction == "CW";

    this.rotationOrigin = rotation - Math.PI;

    const angle = this.rotation / Math.PI;

    const flip = this.isCW ? 1 : -1;
    const halfWidth = width / 2;

    let shiftX = 0;
    let shiftY = 0;

    if (angle % 1 == 0) {
      if (angle % 2 == 0) {
        shiftX = 3 * halfWidth * flip;
        shiftY = -halfWidth;
      } else {
        shiftX = 3 * halfWidth * -flip;
        shiftY = halfWidth;
      }
    } else {
      if ((angle - 0.5) % 2 == 0) {
        shiftX = -halfWidth;
        shiftY = 3 * halfWidth * -flip;
      } else {
        shiftX = halfWidth;
        shiftY = 3 * halfWidth * flip;
      }
    }

    this.origin = shift(this.start, shiftX, shiftY);

    //this.borders = this.generateRoad();
  }

  //   get offset() {
  //     const angle = this.rotation / Math.PI;
  //     let xOffset = 0;
  //     let yOffset = 0;

  //     if (angle % 1 == 0) {
  //       if (angle % 2 == 0) {
  //         yOffset = this.width;
  //       } else {
  //         yOffset = -this.width;
  //       }
  //     } else {
  //       if ((angle - 0.5) % 2 == 0) {
  //         xOffset = -this.width;
  //       } else {
  //         xOffset = this.width;
  //       }}
  //   }

  containsCar(car: Car) {
    return false;
  }
  detectCollision(car: Car) {
    // find possible intersection for both sides of point
    return false;
  }
  draw(context: CanvasRenderingContext2D) {
    context.lineWidth = 5;
    context.strokeStyle = "white";
    const { x, y } = this.plane.mapToCanvas(this.origin);

    context.beginPath();
    context.arc(
      x,
      y,
      this.width * 2,
      this.isCW ? this.rotationOrigin : this.rotation,
      this.rotationOrigin + Math.PI / 2,
      !this.isCW
    );
    context.stroke();

    context.beginPath();
    context.arc(
      x,
      y,
      this.width,
      this.isCW ? this.rotationOrigin : this.rotation,
      this.rotationOrigin + Math.PI / 2,
      !this.isCW
    );
    context.stroke();
  }
}
