import "../css/style.css";
import { Road } from "./@types/road";
import { Car } from "./classes/Car";
import { CONTROLS } from "./classes/Controls";
import { CoordPlane } from "./classes/CoordPlane";
import { NeuralNetwork } from "./classes/Models/NeuralNetwork";
import { StraightRoad } from "./classes/Road/StraightRoad";
import { Visualizer } from "./classes/Visualizer";
import Tracks from "./tracks";
import { distance } from "./utils/distance";
import { randomIntBetween } from "./utils/random";

console.log("begin");

const networkCanvas = document.getElementById(
  "networkCanvas"
) as HTMLCanvasElement;
const networkContext = networkCanvas.getContext("2d")!;
networkContext.canvas.width = networkCanvas.offsetWidth;
networkContext.canvas.height = networkCanvas.offsetHeight;

const carCanvas = document.getElementById("carCanvas") as HTMLCanvasElement;
const carContext = carCanvas.getContext("2d")!;
carContext.canvas.width = carCanvas.offsetWidth;
carContext.canvas.height = carCanvas.offsetHeight;

const plane = new CoordPlane(
  Math.PI / 2,
  carCanvas.offsetWidth / 2,
  carCanvas.offsetHeight / 2
);

//let car = new Car(plane, 0, 0, 5, 0, CONTROLS.SELF_DRIVING);
let cars = generateCars(10);
let bestCar: Car;

window.onresize = () => {
  plane.shiftX = carCanvas.offsetWidth / 2;
  plane.shiftY = carCanvas.offsetHeight / 2;
};

const track = Tracks.Mario.createMarioCircuit1(plane, 300, 3);

let traffic = generateTraffic(track);

function resetSimulation() {
  const car = getBestCar(cars);
  traffic = generateTraffic(track);
  if (!bestCar) bestCar = car;
  if (car.distance > bestCar.distance) bestCar = car;
  cars = generateCars(50);
  cars[0].controls.brain = bestCar.controls.brain;
  for (let i = 1; i < cars.length; i++) {
    NeuralNetwork.mutate(cars[i].controls.brain!, 0.2);
  }
}

// function animateSingle() {
//   carContext.canvas.width = carCanvas.offsetWidth;
//   carContext.canvas.height = carCanvas.offsetHeight;

//   for (const road of track) {
//     road.draw(carContext);
//   }

//   if (traffic.length) {
//     for (const trafficCar of traffic) {
//       //const trafficRoad = track.find((road) => road.containsPoint(car));
//       const sensorRoads = track.filter((road) =>
//         trafficCar
//           .laneSensor!.rays.flat()
//           .some((point) => road.containsPoint(point))
//       );
//       trafficCar.updateTraffic(sensorRoads);
//       trafficCar.draw(carContext, "blue");
//     }
//   }

//   plane.updateCenter(car);

//   const currentRoads = track.filter((road) => {
//     return road.containsCar(car); //||
//     //car.laneSensor!.rays.flat().some((point) => road.containsPoint(point))
//   });
//   const nearestTraffic = traffic.filter(
//     (dummyCar) => distance(dummyCar, car) < 150
//   );
//   car.update(currentRoads, nearestTraffic);
//   car.draw(carContext, "red");

//   document.getElementById("save")!.onclick = () => {
//     console.log("reset!");
//     //console.log("bro", car.laneSensor!.rays.flat());
//     //console.log("aga", car.roadSensor?.wtfBRo(currentRoads, traffic));
//     console.log(car.roadSensor?.readings);
//     // if (track[0] instanceof StraightRoad) {
//     //   console.log(track[0].getLaneCenter(1));
//     // }
//   };

//   requestAnimationFrame(animateSingle);
// }

function animateMultiple() {
  carContext.canvas.width = carCanvas.offsetWidth;
  carContext.canvas.height = carCanvas.offsetHeight;

  for (const road of track) {
    road.draw(carContext);
  }

  if (traffic.length) {
    for (const trafficCar of traffic) {
      //const trafficRoad = track.find((road) => road.containsPoint(car));
      const sensorRoads = track.filter((road) =>
        trafficCar
          .laneSensor!.rays.flat()
          .some((point) => road.containsPoint(point))
      );
      trafficCar.updateTraffic(sensorRoads);
      trafficCar.draw(carContext, "blue");
    }
  }

  carContext.globalAlpha = 0.2;
  for (const currentCar of cars) {
    const currentRoads = track.filter((road) => road.containsCar(currentCar));
    const nearestTraffic = traffic.filter(
      (dummyCar) => distance(dummyCar, currentCar) < 150
    );
    currentCar.update(currentRoads, nearestTraffic);
    currentCar.draw(carContext, "red");
  }

  const car = getBestCar(cars);

  plane.updateCenter(car);

  carContext.globalAlpha = 1;
  car.draw(carContext, "red");
  if (car.controls.brain) {
    Visualizer.drawNetwork(networkContext, car.controls.brain);
  }

  if (cars.every((car) => car.collision)) resetSimulation();

  requestAnimationFrame(animateMultiple);
}

animateMultiple();

function generateCars(numCars: number) {
  let newCars = [];
  for (let i = 0; i < numCars; i++) {
    newCars.push(new Car(plane, 0, 0, 5, 0, CONTROLS.SELF_DRIVING));
  }

  return newCars;
}

function generateTraffic(roads: Road[]) {
  const traffic: Car[] = [];
  roads.forEach((road, index) => {
    if (road instanceof StraightRoad && index != 0) {
      const lane = randomIntBetween(1, 3);
      const { x, y, rotation } = road.getLaneCenter(lane);
      traffic.push(new Car(plane, x, y, 3, rotation, CONTROLS.DUMMY));
    }
  });
  return traffic;
}

function getBestCar(cars: Car[]) {
  return cars.reduce((prev, curr) => {
    const longer = prev.distance < curr.distance;
    const noCollision = !curr.collision;
    if (longer && noCollision) return curr;
    else return prev;
  }, cars[0]);
}

document.getElementById("reset")!.onclick = () => {
  console.log("reset!");
  const car = getBestCar(cars);
  if (!bestCar) bestCar = car;
  if (car.distance > bestCar.distance) bestCar = car;
  cars = generateCars(50);
  cars[0].controls.brain = bestCar.controls.brain;
  for (let i = 1; i < cars.length; i++) {
    NeuralNetwork.mutate(cars[i].controls.brain!, 0.2);
  }
  //car = new Car(plane, 0, 0, 5, CONTROLS.SELF_DRIVING);
};

document.getElementById("save")!.onclick = () => {
  console.log("save!");
};

document.getElementById("discard")!.onclick = () => {
  console.log("discard!");
};
