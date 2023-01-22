import { rotateClockwise, shift } from "../../utils/transform";
import { CoordPlane } from "../CoordPlane";

export class StraightRoad {
  plane: CoordPlane;
  center: Point;
  width: number;
  rotation: number;

  borders: Point[][];

  constructor(
    plane: CoordPlane,
    x: number,
    y: number,
    width: number,
    rotation: number
  ) {
    this.plane = plane;
    this.center = { x, y };
    this.width = width;
    this.rotation = rotation;

    this.borders = this.generateRoad();
  }

  private generateRoad() {
    const shiftRoad = this.width / 2;
    const left = [
      shift(this.center, -shiftRoad, -shiftRoad),
      shift(this.center, -shiftRoad, shiftRoad),
    ];
    const right = [
      shift(this.center, shiftRoad, -shiftRoad),
      shift(this.center, shiftRoad, shiftRoad),
    ];

    const bruh = [left, right].map((border) =>
      border.map((point) => rotateClockwise(point, this.rotation))
    );
    console.log(bruh);
    return bruh;
  }

  draw(context: CanvasRenderingContext2D) {
    context.lineWidth = 5;
    context.strokeStyle = "white";

    for (const border of this.borders) {
      const points = border.map((point) => this.plane.mapToCanvas(point));
      context.beginPath();
      context.moveTo(points[0].x, points[0].y);
      context.lineTo(points[1].x, points[1].y);
      context.stroke();
    }
  }
}
