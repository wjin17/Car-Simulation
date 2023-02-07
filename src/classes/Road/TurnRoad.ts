import { Road, RoadOffset, TurnBorder } from "../../@types/road";
import { distance } from "../../utils/distance";
import {
  findCircleLineIntersections,
  pointOnSegment,
} from "../../utils/intersections";
import { lerp } from "../../utils/lerp";
import { makePositiveRad, shift } from "../../utils/transformations";
import { Car } from "../Car";
import { CoordPlane } from "../CoordPlane";

export class TurnRoad implements Road {
  plane: CoordPlane;
  start: Point;
  width: number;
  laneCount: number;
  rotation: number;

  isCW: boolean;
  origin: Point;
  laneRadii: number[];
  borderRadii: number[];
  rotationStart: number;
  rotationEnd: number;

  constructor(
    plane: CoordPlane,
    offset: RoadOffset,
    width: number,
    laneCount: number,
    direction: "CW" | "CCW"
  ) {
    const { x, y, rotation } = offset;
    this.plane = plane;
    this.start = { x, y };
    this.width = width;
    this.laneCount = laneCount;
    this.rotation = rotation;
    this.isCW = direction == "CW";

    this.origin = this.calculateOrigin();
    this.laneRadii = this.generateLaneRadii();
    this.borderRadii = [width, width * 2];

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

  private generateLaneRadii() {
    const start = this.width;
    const end = this.width * 2;
    const laneRadii: number[] = [];
    for (let i = 1; i < this.laneCount; i++) {
      const laneX = lerp(start, end, i / this.laneCount);
      laneRadii.push(laneX);
    }

    return laneRadii;
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
    return car.polygon.some((corner) => this.containsPoint(corner));
  }

  containsPoint(point: Point) {
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
      const doesIntersect = this.findBorderIntersection(line);

      if (doesIntersect) return true;
    }
    return false;
  }

  findBorderIntersection(line: Line) {
    const borderIntersections = this.borderRadii
      .map((radius) => findCircleLineIntersections(this.origin, radius, line))
      .flat();

    return borderIntersections.find((intersection) => {
      if (pointOnSegment(intersection, line)) return intersection;
    });
  }

  findLaneIntersection(line: Line) {
    const laneIntersections = [...this.laneRadii, ...this.borderRadii]
      .map((radius) => findCircleLineIntersections(this.origin, radius, line))
      .flat();
    return laneIntersections.find((intersection) => {
      if (pointOnSegment(intersection, line)) return intersection;
    });
  }

  draw(context: CanvasRenderingContext2D) {
    context.lineWidth = 5;
    context.strokeStyle = "white";

    context.setLineDash([this.width / 4, this.width / 4]);
    for (const laneRadius of this.laneRadii) {
      const { x, y } = this.plane.mapToCanvas(this.origin);
      context.beginPath();
      context.arc(
        x,
        y,
        laneRadius,
        this.rotationStart,
        this.rotationEnd,
        !this.isCW
      );
      context.stroke();
    }

    context.setLineDash([]);
    for (const borderRadius of this.borderRadii) {
      const { x, y } = this.plane.mapToCanvas(this.origin);
      context.beginPath();
      context.arc(
        x,
        y,
        borderRadius,
        this.rotationStart,
        this.rotationEnd,
        !this.isCW
      );
      context.stroke();
    }
  }
}
