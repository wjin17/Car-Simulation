import { Road } from "../@types/road";
import { CONTROLS, Controls } from "./Controls";
import { CoordPlane } from "./CoordPlane";
import { RoadSensor } from "./Sensors/RoadSensor";

export class Car {
  plane: CoordPlane;
  x: number;
  y: number;
  width = 40;
  height = 70;
  polygon: Point[] = [];

  controls?: Controls;
  maxSpeed: number;
  speed = 0;
  acceleration = 0.2;
  break = 0.05;
  angle = 0;
  collision = false;

  distance = 0;

  roadSensor: RoadSensor;

  constructor(
    plane: CoordPlane,
    startX: number,
    startY: number,
    maxSpeed: number
  ) {
    this.plane = plane;
    this.x = startX;
    this.y = startY;
    this.maxSpeed = maxSpeed;

    this.polygon = this.generateCar();

    //this.controls = new Controls(CONTROLS.MANUAL);
    this.roadSensor = new RoadSensor(this, plane);
  }

  // distance could be dist += Math.abs(this.speed)

  generateCar() {
    const points = [];
    const rad = Math.hypot(this.width, this.height / 2);
    const alpha = Math.atan2(this.width, this.height);
    points.push({
      x: this.x + Math.sin(this.angle - alpha) * rad,
      y: this.y + Math.cos(this.angle - alpha) * rad,
    });
    points.push({
      x: this.x + Math.sin(this.angle + alpha) * rad,
      y: this.y + Math.cos(this.angle + alpha) * rad,
    });
    points.push({
      x: this.x + Math.sin(Math.PI + this.angle - alpha) * rad,
      y: this.y + Math.cos(Math.PI + this.angle - alpha) * rad,
    });
    points.push({
      x: this.x + Math.sin(Math.PI + this.angle + alpha) * rad,
      y: this.y + Math.cos(Math.PI + this.angle + alpha) * rad,
    });
    return points;
  }

  move() {
    if (this.controls) {
      const { forward, reverse, left, right } = this.controls;
      if (forward) this.speed += this.acceleration;
      if (reverse) this.speed -= this.acceleration;

      if (this.speed > this.maxSpeed) this.speed = this.maxSpeed;
      if (this.speed < -this.maxSpeed) this.speed = -this.maxSpeed;

      if (this.speed != 0) {
        const flip = this.speed > 0 ? -1 : 1;
        if (left) this.angle += 0.03 * flip;
        if (right) this.angle -= 0.03 * flip;
      }
    }

    if (this.speed > 0) this.speed -= this.break;
    if (this.speed < 0) this.speed += this.break;

    this.x += Math.sin(this.angle) * this.speed;
    this.y += Math.cos(this.angle) * this.speed;
  }

  update(roads: Road[]) {
    if (this.roadSensor) this.roadSensor.update(roads);
    for (const road of roads) {
      if (road.detectCollision(this)) this.collision = true;
    }
    if (!this.collision) {
      this.move();
      this.distance += Math.abs(this.speed);
      this.polygon = this.generateCar();
    }
  }

  draw(context: CanvasRenderingContext2D, color: string) {
    if (this.collision) context.fillStyle = "grey";
    else context.fillStyle = color;
    context.beginPath();
    this.polygon.forEach((point, index) => {
      const { x, y } = this.plane.mapToCanvas(point);
      if (index == 0) context.moveTo(x, y);
      else context.lineTo(x, y);
    });
    context.fill();

    if (this.roadSensor) this.roadSensor.draw(context);
  }
}
