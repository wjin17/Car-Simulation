import { Road } from "../../@types/road";
import { distance } from "../../utils/distance";
import { lerp } from "../../utils/lerp";
import { Car } from "../Car";
import { CoordPlane } from "../CoordPlane";

export class LaneSensor {
  car: Car;
  plane: CoordPlane;

  rayCount = 2;
  rayLength = 150;
  raySpread = Math.PI / 2;

  rays: Line[] = [];

  intersections: (Point | undefined)[] = [];

  constructor(car: Car, plane: CoordPlane) {
    this.car = car;
    this.plane = plane;
  }

  update(roads: Road[]) {
    this.castRays();

    const borderIntersections = roads.map((road) =>
      this.rays.map((ray) => road.findLaneIntersection(ray))
    );
    const intersectionLenghts = borderIntersections.map(
      (intersections) => intersections.length
    );

    let i = 0;
    const intersections: (Point | undefined)[] = [];

    while (intersectionLenghts.some((length) => i < length)) {
      const validIntersection = borderIntersections.find(
        (intersections) => intersections[i]
      );
      if (validIntersection) intersections.push(validIntersection[i]);
      else intersections.push(undefined);
      i++;
    }

    this.intersections = intersections;
  }

  private castRays() {
    this.rays = [];
    const spread = this.raySpread / 2;
    for (let i = 0; i < this.rayCount; i++) {
      const spacing = this.rayCount == 1 ? 0.5 : i / (this.rayCount - 1);
      const rayAngle = lerp(spread, -spread, spacing) + this.car.angle;
      const start = { x: this.car.x, y: this.car.y };
      const end = {
        x: this.car.x + Math.sin(rayAngle) * this.rayLength,
        y: this.car.y + Math.cos(rayAngle) * this.rayLength,
      };

      this.rays.push([start, end]);
    }
  }

  get readings() {
    const values: number[] = [];
    for (let i = 0; i < this.rayCount; i++) {
      let middle = this.plane.mapToCanvas(this.rays[i][1]);
      if (this.intersections[i]) {
        middle = this.plane.mapToCanvas(this.intersections[i]!);
      }

      const end = this.plane.mapToCanvas(this.rays[i][1]);

      values.push(distance(end, middle) / this.rayLength);
    }

    return values;
  }

  draw(context: CanvasRenderingContext2D) {
    for (let i = 0; i < this.rayCount; i++) {
      let middle = this.plane.mapToCanvas(this.rays[i][1]);

      if (this.intersections[i]) {
        middle = this.plane.mapToCanvas(this.intersections[i]!);
      }

      const start = this.plane.mapToCanvas(this.rays[i][0]);
      const end = this.plane.mapToCanvas(this.rays[i][1]);

      context.beginPath();
      context.lineWidth = 2;
      context.strokeStyle = "yellow";
      context.moveTo(start.x, start.y);
      context.lineTo(middle.x, middle.y);
      context.stroke();

      context.beginPath();
      context.lineWidth = 2;
      context.strokeStyle = "black";
      context.moveTo(middle.x, middle.y);
      context.lineTo(end.x, end.y);
      context.stroke();
    }
  }
}
