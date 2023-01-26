import { Road, TurnBorder } from "../../@types/road";
import { shift } from "../../utils/transformations";
import { Car } from "../Car";
import { CoordPlane } from "../CoordPlane";

export class TurnRoad implements Road {
  plane: CoordPlane;
  start: Point;
  width: number;
  rotation: number;

  borders: TurnBorder[];
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

    this.borders = this.generateBorders();
  }

  get offset() {
    const angle = this.rotation / Math.PI;
    let xOffset = this.width;
    let yOffset = this.width;

    if (angle % 1 == 0) {
      if (angle % 2 == 0) {
        xOffset *= this.isCW ? 2 : -2;
      } else {
        xOffset *= this.isCW ? -2 : 2;
        yOffset *= -1;
      }
    } else {
      if ((angle - 0.5) % 2 == 0) {
        yOffset *= this.isCW ? -2 : 2;
      } else {
        yOffset *= this.isCW ? 2 : -2;
        xOffset *= -1;
      }
    }

    const offsetOrigin = shift(this.start, xOffset, yOffset);
    const rotationDirection = this.isCW ? Math.PI / 2 : -Math.PI / 2;

    return {
      ...offsetOrigin,
      rotation: (this.rotation + rotationDirection) % (2 * Math.PI),
    };
  }

  generateBorders() {
    const angle = this.rotation / Math.PI;

    const flip = this.isCW ? 1 : -1;
    const halfWidth = this.width / 2;

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

    const origin = shift(this.start, shiftX, shiftY);

    const rotationStart = this.isCW ? this.rotation - Math.PI : this.rotation;
    const rotationEnd = this.rotation - Math.PI / 2;

    return [
      {
        origin: origin,
        radius: this.width,
        start: rotationStart,
        end: rotationEnd,
      },
      {
        origin: origin,
        radius: this.width * 2,
        start: rotationStart,
        end: rotationEnd,
      },
    ];
  }

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

    for (const border of this.borders) {
      const { x, y } = this.plane.mapToCanvas(border.origin);
      context.beginPath();
      context.arc(x, y, border.radius, border.start, border.end, !this.isCW);
      context.stroke();
    }
  }
}
