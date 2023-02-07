import { Road } from "../@types/road";
import { CONTROLS, Controls } from "./Controls";
import { CoordPlane } from "./CoordPlane";
import { LaneSensor } from "./Sensors/LaneSensor";
import { RoadSensor } from "./Sensors/RoadSensor";
import { linesIntersect, polygonsIntersect } from "../utils/intersections";
import { distance } from "../utils/distance";

export class Car {
  plane: CoordPlane;
  x: number;
  y: number;
  width = 40;
  height = 70;
  angle = 0;
  polygon: Point[] = [];
  controlType: CONTROLS;

  controls: Controls;
  maxSpeed: number;
  speed = 0;
  acceleration = 0.2;
  break = 0.05;

  collision = false;

  distance = 0;

  roadSensor?: RoadSensor;
  laneSensor?: LaneSensor;
  specimenId = 0;

  constructor(
    plane: CoordPlane,
    startX: number,
    startY: number,
    maxSpeed: number,
    specimenId: number,
    angle?: number,
    controlType?: CONTROLS
  ) {
    this.plane = plane;
    this.x = startX;
    this.y = startY;
    if (angle) this.angle = angle;
    this.maxSpeed = maxSpeed;
    this.specimenId = specimenId;
    this.controlType = controlType || CONTROLS.DUMMY;

    this.polygon = this.generateCar();

    if (controlType == CONTROLS.DUMMY) {
      this.laneSensor = new LaneSensor(this, plane);
      this.controls = new Controls(controlType);
    } else if (controlType == CONTROLS.LANE_ASSIST) {
      this.laneSensor = new LaneSensor(this, plane);
      this.controls = new Controls(controlType);
    } else if (controlType == CONTROLS.SELF_DRIVING) {
      this.roadSensor = new RoadSensor(this, plane);
      this.controls = new Controls(controlType, this.roadSensor.rayCount);
    } else if (controlType == CONTROLS.FULL_SELF_DRIVING) {
      this.roadSensor = new RoadSensor(this, plane);
      this.laneSensor = new LaneSensor(this, plane);
      this.controls = new Controls(controlType, this.roadSensor.rayCount);
    } else {
      //this.laneSensor = new LaneSensor(this, plane);
      this.controls = new Controls(controlType);
    }
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

  detectCollision(car: Car) {
    return polygonsIntersect(car.polygon, this.polygon);
  }

  findRayIntersection(line: Line) {
    const intersections = [];

    for (let i = 0; i < this.polygon.length; i++) {
      intersections.push(
        linesIntersect(
          line[0],
          line[1],
          this.polygon[i],
          this.polygon[(i + 1) % this.polygon.length]
        )
      );
    }

    let closestIntersection: Point | undefined = undefined;
    intersections.forEach((intersection) => {
      if (!closestIntersection) closestIntersection = intersection;
      if (intersection && closestIntersection) {
        const isCloser =
          distance(this, intersection) < distance(this, closestIntersection);
        if (isCloser) closestIntersection = intersection;
      }
    });
    return closestIntersection;
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

  update(roads: Road[], traffic: Car[]) {
    if (this.roadSensor) {
      this.roadSensor.update(roads, traffic);
      if (
        this.controlType == CONTROLS.SELF_DRIVING ||
        this.controlType == CONTROLS.FULL_SELF_DRIVING
      ) {
        this.controls.useSelfDriving(this.roadSensor.readings);
      }
    }
    if (this.laneSensor) {
      this.laneSensor.update(roads);
      this.controls.useLaneAssist(this.laneSensor.readings);
    }
    for (const road of roads) {
      if (road.detectCollision(this)) this.collision = true;
    }
    for (const trafficCar of traffic) {
      if (this.detectCollision(trafficCar)) this.collision = true;
    }
    if (!this.collision) {
      this.move();
      this.distance += this.speed;
      this.polygon = this.generateCar();
    }
  }

  updateTraffic(roads: Road[]) {
    if (this.laneSensor) {
      this.laneSensor!.update(roads);
      this.controls.useLaneAssist(this.laneSensor!.readings);
    }
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
    if (this.laneSensor && this.controlType !== CONTROLS.DUMMY) {
      this.laneSensor.draw(context);
    }
  }
}
