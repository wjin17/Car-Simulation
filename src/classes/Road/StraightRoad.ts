import { Road, RoadOffset, StraightBorder } from "../../@types/road";
import { linesIntersect, polygonsIntersect } from "../../utils/intersections";
import { lerp } from "../../utils/lerp";
import { maxReduction, minReduction } from "../../utils/reductions";
import { rotateClockwiseAround, shift } from "../../utils/transformations";
import { Car } from "../Car";
import { CoordPlane } from "../CoordPlane";

export class StraightRoad implements Road {
  plane: CoordPlane;
  start: Point;
  width: number;
  laneCount: number;
  rotation: number;

  lanes: Point[][];
  borders: Point[][];

  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;

  constructor(
    plane: CoordPlane,
    offset: RoadOffset,
    width: number,
    laneCount: number
  ) {
    const { x, y, rotation } = offset;
    this.plane = plane;
    this.start = { x, y };
    this.width = width;
    this.laneCount = laneCount;
    this.rotation = rotation;

    this.lanes = this.generateLanes();
    this.borders = this.generateBorders();
    const { xMin, xMax, yMin, yMax } = this.getBounds();

    this.xMin = xMin;
    this.xMax = xMax;
    this.yMin = yMin;
    this.yMax = yMax;
  }

  get offset() {
    const angle = this.rotation / Math.PI;
    let xOffset = 0;
    let yOffset = 0;

    if (angle % 1 == 0) {
      if (angle % 2 == 0) {
        yOffset = this.width;
      } else {
        yOffset = -this.width;
      }
    } else {
      if ((angle - 0.5) % 2 == 0) {
        xOffset = this.width;
      } else {
        xOffset = -this.width;
      }
    }

    const shiftedCenter = shift(this.start, xOffset, yOffset);
    return {
      ...shiftedCenter,
      rotation: this.rotation,
    };
  }

  getLaneCenter(lane: number) {
    const laneWidth = this.width / this.laneCount;
    const left = this.start.x - this.width / 2;
    const laneX =
      left + laneWidth / 2 + Math.min(lane - 1, this.laneCount - 1) * laneWidth;
    const laneY = this.start.y;

    const { x, y } = rotateClockwiseAround(
      this.start,
      { x: laneX, y: laneY },
      this.rotation
    );

    return {
      x,
      y,
      rotation: this.rotation,
    };
  }

  private generateBorders() {
    const shiftRoad = this.width / 2;
    const left = [
      shift(this.start, -shiftRoad, -shiftRoad),
      shift(this.start, -shiftRoad, shiftRoad),
    ];
    const right = [
      shift(this.start, shiftRoad, -shiftRoad),
      shift(this.start, shiftRoad, shiftRoad),
    ];

    return [left, right].map((border) =>
      border.map((point) =>
        rotateClockwiseAround(this.start, point, this.rotation)
      )
    );
  }

  private generateLanes() {
    const shiftRoad = this.width / 2;
    const { x, y } = this.start;
    const left = x - shiftRoad;
    const right = x + shiftRoad;
    const top = y + shiftRoad;
    const bottom = y - shiftRoad;
    const lanes: Point[][] = [];

    for (let i = 1; i < this.laneCount; i++) {
      const laneX = lerp(left, right, i / this.laneCount);
      const laneBottom = { x: laneX, y: bottom };
      const laneTop = { x: laneX, y: top };
      lanes.push([laneBottom, laneTop]);
    }

    return lanes.map((lane) =>
      lane.map((point) =>
        rotateClockwiseAround(this.start, point, this.rotation)
      )
    );
  }

  private getBounds() {
    const bounds = this.borders.flat();
    const xVals = bounds.map(({ x }) => x);
    const yVals = bounds.map(({ y }) => y);
    const xMin = xVals.reduce(minReduction, xVals[0]);
    const xMax = xVals.reduce(maxReduction, xVals[0]);
    const yMin = yVals.reduce(minReduction, yVals[0]);
    const yMax = yVals.reduce(maxReduction, yVals[0]);

    return { xMin, xMax, yMin, yMax };
  }

  containsCar(car: Car) {
    return car.polygon.some((corner) => this.containsPoint(corner));
  }

  containsPoint({ x, y }: Point) {
    const xInBounds = x > this.xMin && x < this.xMax;
    const yInBounds = y > this.yMin && y < this.yMax;
    if (xInBounds && yInBounds) return true;
    return false;
  }

  detectCollision(car: Car) {
    for (const border of this.borders) {
      if (polygonsIntersect(car.polygon, border)) return true;
    }
    return false;
  }

  findBorderIntersection(line: Line) {
    const intersections = this.borders.map((border) =>
      linesIntersect(line[0], line[1], border[0], border[1])
    );
    return intersections.find((intersection) => intersection);
  }

  findLaneIntersection(line: Line) {
    const intersections = [...this.lanes, ...this.borders].map((border) =>
      linesIntersect(line[0], line[1], border[0], border[1])
    );
    return intersections.find((intersection) => intersection);
  }

  draw(context: CanvasRenderingContext2D) {
    context.lineWidth = 5;
    context.strokeStyle = "white";

    context.setLineDash([this.width / 4, this.width / 4]);
    for (const lane of this.lanes) {
      const points = lane.map((point) => this.plane.mapToCanvas(point));
      context.beginPath();
      context.moveTo(points[0].x, points[0].y);
      context.lineTo(points[1].x, points[1].y);
      context.stroke();
    }

    context.setLineDash([]);
    for (const border of this.borders) {
      const points = border.map((point) => this.plane.mapToCanvas(point));
      context.beginPath();
      context.moveTo(points[0].x, points[0].y);
      context.lineTo(points[1].x, points[1].y);
      context.stroke();
    }
  }
}
