import "../css/style.css";
import { Road } from "./@types/road";
import { Car } from "./classes/Car";
import { CONTROLS } from "./classes/Controls";
import { CoordPlane } from "./classes/CoordPlane";
import { NeuralNetwork } from "./classes/Models/NeuralNetwork";
import { StraightRoad } from "./classes/Road/StraightRoad";
import { Visualizer } from "./classes/Visualizer";
import Tracks from "./tracks";

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

let car = new Car(plane, 0, 0, 5, 0, CONTROLS.MANUAL);
let cars = generateCars(10);
let bestCar: Car;

window.onresize = () => {
  plane.shiftX = carCanvas.offsetWidth / 2;
  plane.shiftY = carCanvas.offsetHeight / 2;
};

const track = Tracks.Mario.createMarioCircuit1(plane, 300, 3);

const traffic = generateTraffic(track);

function resetSimulation() {
  const car = getBestCar(cars);
  if (!bestCar) bestCar = car;
  if (car.distance > bestCar.distance) bestCar = car;
  cars = generateCars(50);
  cars[0].controls.brain = bestCar.controls.brain;
  for (let i = 1; i < cars.length; i++) {
    NeuralNetwork.mutate(cars[i].controls.brain!, 0.2);
  }
}

function animateSingle() {
  carContext.canvas.width = carCanvas.offsetWidth;
  carContext.canvas.height = carCanvas.offsetHeight;

  for (const road of track) {
    road.draw(carContext);
  }

  for (const trafficCar of traffic) {
    trafficCar.draw(carContext, "blue");
  }

  plane.updateCenter(car);

  const currentRoads = track.filter((road) => road.containsCar(car));
  car.update(currentRoads);
  car.draw(carContext, "red");

  document.getElementById("save")!.onclick = () => {
    console.log("reset!");
    if (track[0] instanceof StraightRoad) {
      console.log(track[0].getLaneCenter(1));
    }
  };

  requestAnimationFrame(animateSingle);
}

// function animateMultiple() {
//   carContext.canvas.width = carCanvas.offsetWidth;
//   carContext.canvas.height = carCanvas.offsetHeight;

//   for (const road of track) {
//     road.draw(carContext);
//   }

//   carContext.globalAlpha = 0.2;
//   for (const currentCar of cars) {
//     const currentRoads = track.filter((road) => road.containsCar(currentCar));
//     currentCar.update(currentRoads);
//     currentCar.draw(carContext, "red");
//   }

//   const car = getBestCar(cars);

//   plane.updateCenter(car);

//   // document.getElementById("reset")!.onclick = () => {
//   //   console.log("reset!");
//   //   console.log(car.roadSensor!.readings);
//   // };
//   carContext.globalAlpha = 1;
//   car.draw(carContext, "red");
//   if (car.controls.brain) {
//     Visualizer.drawNetwork(networkContext, car.controls.brain);
//   }

//   if (cars.every((car) => car.collision)) resetSimulation();

//   // if (car.collision && car.controls.brain) {
//   //   if (!bestCar) bestCar = car;
//   //   if (car.distance > bestCar.distance) bestCar = car;
//   //   cars = generateCars(50);
//   //   cars[0].controls.brain = bestCar.controls.brain;
//   //   for (let i = 1; i < cars.length; i++) {
//   //     NeuralNetwork.mutate(cars[i].controls.brain!, 0.2);
//   //   }
//   //   NeuralNetwork.mutate(car.controls.brain!);
//   // }

//   requestAnimationFrame(animateMultiple);
// }

animateSingle();

function generateCars(numCars: number) {
  let newCars = [];
  for (let i = 0; i < numCars; i++) {
    newCars.push(new Car(plane, 0, 0, 5, 0, CONTROLS.SELF_DRIVING));
  }

  return newCars;
}

function generateTraffic(roads: Road[]) {
  const traffic: Car[] = [];
  for (const road of roads) {
    if (road instanceof StraightRoad) {
      const { x, y, rotation } = road.getLaneCenter(3);
      traffic.push(new Car(plane, x, y, 2, rotation, CONTROLS.DUMMY));
    }
  }
  return traffic;
}

function getBestCar(cars: Car[]) {
  return cars.reduce((prev, curr) => {
    return prev.distance > curr.distance ? prev : curr;
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
