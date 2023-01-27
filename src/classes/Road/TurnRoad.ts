import { Road, TurnBorder } from "../../@types/road";
import { distance } from "../../utils/distance";
import {
  findCircleLineIntersections,
  pointOnSegment,
} from "../../utils/intersections";
import { makePositiveRad, shift } from "../../utils/transformations";
import { Car } from "../Car";
import { CoordPlane } from "../CoordPlane";

export class TurnRoad implements Road {
  plane: CoordPlane;
  start: Point;
  width: number;
  rotation: number;

  isCW: boolean;
  origin: Point;
  radii: number[];
  rotationStart: number;
  rotationEnd: number;

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

    this.origin = this.calculateOrigin();
    this.radii = [width, width * 2];

    this.rotationStart = this.isCW ? this.rotation - Math.PI : this.rotation;
    this.rotationEnd = this.rotation - Math.PI / 2;
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

  calculateOrigin() {
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

    return shift(this.start, shiftX, shiftY);
  }

  containsCar(car: Car) {
    return car.polygon.some((corner) => this.validPoint(corner));
  }

  validPoint(point: Point) {
    const position = distance(point, this.origin);
    const validDistance = position >= this.width && position <= this.width * 2;
    if (!validDistance) return false;

    const dx = point.x - this.origin.x;
    const dy = point.y - this.origin.y;

    let angle = Math.atan2(-dy, dx);
    if (angle < 0) angle += 2 * Math.PI;
    const keep2PI = this.isCW
      ? this.rotation == Math.PI / 2
      : this.rotation == 0;
    const startAngle = makePositiveRad(this.rotationStart, keep2PI);
    const endAngle = makePositiveRad(this.rotationEnd, keep2PI);
    if (this.isCW) return angle >= startAngle && angle <= endAngle;
    else return angle <= startAngle && angle >= endAngle;
  }

  detectCollision(car: Car) {
    for (let i = 0; i < car.polygon.length; i++) {
      const line = [car.polygon[i], car.polygon[(i + 1) % car.polygon.length]];
      const innerIntersections = findCircleLineIntersections(
        this.origin,
        this.width * 2,
        line
      );
      const outerIntersections = findCircleLineIntersections(
        this.origin,
        this.width,
        line
      );

      const totalIntersections = [...innerIntersections, ...outerIntersections];

      const doesIntersect = totalIntersections.some((point) =>
        pointOnSegment(point, line)
      );

      if (doesIntersect) return true;
    }
    return false;
  }

  test(car: Car, canvas: CanvasRenderingContext2D) {
    for (let i = 0; i < car.polygon.length; i++) {
      const line = [car.polygon[i], car.polygon[(i + 1) % car.polygon.length]];
      const innerIntersections = findCircleLineIntersections(
        this.origin,
        this.width * 2,
        line
      );
      const outerIntersections = findCircleLineIntersections(
        this.origin,
        this.width,
        line
      );
      const totalIntersections = [...innerIntersections, ...outerIntersections];
      totalIntersections.forEach((intersection) => {
        const { x, y } = this.plane.mapToCanvas(intersection);
        if (pointOnSegment(intersection, line)) canvas.strokeStyle = "black";
        else canvas.strokeStyle = "white";
        canvas.beginPath();
        canvas.arc(x, y, 10, 0, 2 * Math.PI);
        canvas.stroke();
      });

      //   const outerIntersections = findCircleLineIntersections(
      //     this.origin,
      //     this.width * 2,
      //     line
      //   );
      //   totalIntersections.push(...innerIntersections, ...outerIntersections);
      //   console.log(
      //     totalIntersections.some((point) => pointOnSegment(point, line))
      //   );
    }
  }

  draw(context: CanvasRenderingContext2D) {
    context.lineWidth = 5;
    context.strokeStyle = "white";

    for (const radius of this.radii) {
      const { x, y } = this.plane.mapToCanvas(this.origin);
      context.beginPath();
      context.arc(
        x,
        y,
        radius,
        this.rotationStart,
        this.rotationEnd,
        !this.isCW
      );
      context.stroke();
    }
  }
}
