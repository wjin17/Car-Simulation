import { Road, Track } from "../../@types/road";
import { Simulation } from "../../@types/simulation";
import { distance } from "../../utils/distance";
import { randomIntBetween } from "../../utils/random";
import { Car } from "../Car";
import { CONTROLS } from "../Controls";
import { CoordPlane } from "../CoordPlane";
// import { FFNN } from "../Models/FeedForward/NeuralNetwork";
import { StraightRoad } from "../Road/StraightRoad";
import { Visualizer } from "../Visualizer";

export class SelfDrivingSimulation implements Simulation {
  carCanvas = document.getElementById("carCanvas") as HTMLCanvasElement;
  carContext = this.carCanvas.getContext("2d")!;
  networkCanvas = document.getElementById("networkCanvas") as HTMLCanvasElement;
  networkContext = this.networkCanvas.getContext("2d")!;

  mode: CONTROLS;
  cars: Car[];
  bestCar: Car;
  specimens = 0;
  generation = 0;
  networkParams: FFNetworkParams;

  track: Road[] = [];
  traffic: Car[] = [];

  plane: CoordPlane;

  constructor(mode: CONTROLS, track: Track, networkParams: FFNetworkParams) {
    this.simulate = this.simulate.bind(this);
    this.mode = mode;
    this.plane = new CoordPlane(
      Math.PI / 2,
      this.carCanvas.offsetWidth / 2,
      this.carCanvas.offsetHeight / 2
    );
    this.networkParams = networkParams;
    this.cars = this.generateCars(networkParams.generationSize);
    this.bestCar = this.cars[0];
    this.track = track.create(this.plane, 300, 3);
    this.traffic = this.generateTraffic(this.track);

    window.onresize = () => {
      this.plane.shiftX = this.carCanvas.offsetWidth / 2;
      this.plane.shiftY = this.carCanvas.offsetHeight / 2;
    };
  }

  simulate() {
    this.carContext.canvas.width = this.carCanvas.offsetWidth;
    this.carContext.canvas.height = this.carCanvas.offsetHeight;

    this.networkContext.canvas.width = this.carCanvas.offsetWidth;
    this.networkContext.canvas.height = this.carCanvas.offsetHeight;

    for (const road of this.track) {
      road.draw(this.carContext);
    }

    for (const trafficCar of this.traffic) {
      const sensorRoads = this.track.filter((road) =>
        trafficCar
          .laneSensor!.rays.flat()
          .some((point) => road.containsPoint(point))
      );
      trafficCar.updateTraffic(sensorRoads);
      trafficCar.draw(this.carContext, "blue");
    }

    this.carContext.globalAlpha = 0.2;
    for (const currentCar of this.cars) {
      const currentRoads = this.track.filter((road) =>
        road.containsCar(currentCar)
      );
      const nearestTraffic = this.traffic.filter(
        (dummyCar) => distance(dummyCar, currentCar) < 150
      );
      currentCar.update(currentRoads, nearestTraffic);
      currentCar.draw(this.carContext, "red");
    }

    const car = this.getBestCar(false);

    this.plane.updateCenter(car);

    this.carContext.globalAlpha = 1;
    car.draw(this.carContext, "red");
    if (car.controls.brain) {
      Visualizer.drawNetwork(
        this.networkContext,
        car.controls.brain,
        car.specimenId
      );
    }

    if (this.cars.every((car) => car.collision)) this.reset();

    this.carContext.fillStyle = "white";
    this.carContext.font = "30px Arial";
    this.carContext.fillText(`Gen: ${this.generation}`, 50, 70);
    this.carContext.fillText(
      `Best distance: ${this.bestCar.distance.toFixed(2)}`,
      50,
      100
    );

    requestAnimationFrame(this.simulate);
  }

  reset() {
    const currentBest = this.getBestCar(true);
    if (currentBest.distance > this.bestCar.distance) {
      this.bestCar = currentBest;
    }
    this.generation++;
    this.traffic = this.generateTraffic(this.track);
    this.cars = this.generateCars(
      this.networkParams.generationSize,
      this.bestCar
    );
    for (let i = 0; i < this.cars.length; i++) {
      if (i != 0) {
        this.cars[i].controls.brain?.mutate(this.networkParams.mutationRate);
      }
    }
  }

  private generateCars(numCars: number, parent?: Car) {
    let newCars = [];
    for (let i = 0; i < numCars; i++) {
      const newCar = new Car(
        this.plane,
        0,
        0,
        5,
        this.specimens,
        0,
        this.mode,
        this.networkParams.hiddenLayers
      );
      if (parent) newCar.controls.brain?.inherit(parent.controls.brain!);
      newCars.push(newCar);
      this.specimens++;
    }
    if (parent) newCars[0].specimenId = parent.specimenId;
    return newCars;
  }

  generateTraffic(roads: Road[]) {
    const traffic: Car[] = [];
    roads.forEach((road, index) => {
      if (road instanceof StraightRoad && index != 0) {
        // const lane = randomIntBetween(1, 4);
        const { x, y, rotation } = road.getLaneCenter((index % 3) + 1);
        traffic.push(new Car(this.plane, x, y, 3, 0, rotation, CONTROLS.DUMMY));
      }
    });
    return traffic;
  }

  getBestCar(includeDead: boolean) {
    let currentBest = this.cars[0];
    for (const current of this.cars) {
      const isFurther = current.distance > currentBest.distance;
      const alive = !current.collision;
      if (includeDead) {
        if (isFurther) currentBest = current;
      } else {
        if (isFurther && alive) currentBest = current;
      }
    }
    return currentBest;
  }
}
