import { Road } from "../../@types/road";
import { Simulation } from "../../@types/simulation";
import Tracks from "../../tracks";
import { distance } from "../../utils/distance";
import { Car } from "../Car";
import { CONTROLS } from "../Controls";
import { CoordPlane } from "../CoordPlane";

export class ManualSimulation implements Simulation {
  carCanvas = document.getElementById("carCanvas") as HTMLCanvasElement;
  carContext = this.carCanvas.getContext("2d")!;

  mode: CONTROLS;
  car: Car;

  track: Road[] = [];
  traffic: Car[] = [];

  plane: CoordPlane;

  constructor(mode: CONTROLS) {
    const networkCanvas = document.getElementById(
      "networkCanvas"
    ) as HTMLCanvasElement;

    networkCanvas.style.display = "none";
    this.simulate = this.simulate.bind(this);
    this.mode = mode;
    this.plane = new CoordPlane(
      Math.PI / 2,
      this.carCanvas.offsetWidth / 2,
      this.carCanvas.offsetHeight / 2
    );
    this.car = new Car(this.plane, 0, 0, 5, 0, 0, this.mode);
    this.track = Tracks.Mario.createMarioCircuit1(this.plane, 300, 3);

    window.onresize = () => {
      this.plane.shiftX = this.carCanvas.offsetWidth / 2;
      this.plane.shiftY = this.carCanvas.offsetHeight / 2;
    };
  }

  simulate() {
    this.carContext.canvas.width = this.carCanvas.offsetWidth;
    this.carContext.canvas.height = this.carCanvas.offsetHeight;
    for (const road of this.track) {
      road.draw(this.carContext);
    }

    if (this.traffic.length) {
      for (const trafficCar of this.traffic) {
        const sensorRoads = this.track.filter((road) =>
          trafficCar
            .laneSensor!.rays.flat()
            .some((point) => road.containsPoint(point))
        );
        trafficCar.updateTraffic(sensorRoads);
        trafficCar.draw(this.carContext, "blue");
      }
    }

    this.plane.updateCenter(this.car);

    const currentRoads = this.track.filter((road) => {
      const containsSensor =
        this.mode == CONTROLS.LANE_ASSIST &&
        this.car
          .laneSensor!.rays.flat()
          .some((point) => road.containsPoint(point));
      const containsCar = road.containsCar(this.car);

      return containsSensor || containsCar;
    });
    const nearestTraffic = this.traffic.filter(
      (dummyCar) => distance(dummyCar, this.car) < 150
    );

    this.car.update(currentRoads, nearestTraffic);
    this.car.draw(this.carContext, "red");

    requestAnimationFrame(this.simulate);
  }

  reset() {
    this.car = new Car(this.plane, 0, 0, 5, 0, 0, this.mode);
  }
}
