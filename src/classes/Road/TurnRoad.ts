import { Road } from "../../@types/road";
import { shift } from "../../utils/transformations";
import { Car } from "../Car";
import { CoordPlane } from "../CoordPlane";

export class TurnRoad implements Road {
  plane: CoordPlane;
  rotation: number;
  start: Point;
  width: number;

  origin: Point;
  rotationOrigin: number;

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

    this.rotationOrigin = rotation - Math.PI;

    const angle = this.rotation / Math.PI;

    if (direction == "CW") {
      if (angle % 1 == 0) {
        this.origin = shift(this.start, 1.5 * width, 0);
      } else {
        this.origin = shift(this.start, width, 0);
      }
    } else {
      this.origin = shift(this.start, 0, 0);
    }

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
      this.rotationOrigin,
      this.rotationOrigin + Math.PI / 2
    );
    context.stroke();

    context.beginPath();
    context.arc(
      x,
      y,
      this.width,
      this.rotationOrigin,
      this.rotationOrigin + Math.PI / 2
    );
    context.stroke();
  }
}
