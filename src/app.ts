import "../css/style.css";
import { Car } from "./classes/Car";
import { CONTROLS, Controls } from "./classes/Controls";
import { CoordPlane } from "./classes/CoordPlane";
import { StraightRoad } from "./classes/Road/StraightRoad";
import { TurnRoad } from "./classes/Road/TurnRoad";

console.log("begin");

const carCanvas = document.getElementById("carCanvas") as HTMLCanvasElement;
const carContext = carCanvas.getContext("2d")!;
carContext.canvas.width = carCanvas.offsetWidth;
carContext.canvas.height = carCanvas.offsetHeight;

const plane = new CoordPlane(
  Math.PI / 2,
  carCanvas.offsetWidth / 2,
  carCanvas.offsetHeight / 2
);

const car1 = new Car(plane, 0, 0, 5);
//const car2 = new Car(plane, 100, 0, 5);

const controls = new Controls(CONTROLS.MANUAL);

car1.controls = controls;

const straightRoad1 = new StraightRoad(plane, 0, 0, 100, 3, 0);
// const straightRoad2 = new StraightRoad(
//   plane,
//   straightRoad1.offset.x,
//   straightRoad1.offset.y,
//   100,
//   straightRoad1.offset.rotation
// );
//(3 * Math.PI) / 2
const turnRoad1 = new TurnRoad(
  plane,
  straightRoad1.offset.x,
  straightRoad1.offset.y,
  100,
  3,
  straightRoad1.offset.rotation,
  "CW"
);

const straightRoad3 = new StraightRoad(
  plane,
  turnRoad1.offset.x,
  turnRoad1.offset.y,
  100,
  3,
  turnRoad1.offset.rotation
);

const straightRoad4 = new StraightRoad(
  plane,
  straightRoad3.offset.x,
  straightRoad3.offset.y,
  100,
  3,
  straightRoad3.offset.rotation
);

const straightRoad5 = new StraightRoad(
  plane,
  straightRoad4.offset.x,
  straightRoad4.offset.y,
  100,
  3,
  straightRoad4.offset.rotation
);
// const turnRoad2 = new TurnRoad(
//   plane,
//   straightRoad2.offset.x,
//   straightRoad2.offset.y,
//   100,
//   straightRoad2.offset.rotation,
//   "CCW"
// );
const roads = [
  straightRoad1,
  //straightRoad2,
  turnRoad1,
  straightRoad3,
  straightRoad4,
  //straightRoad5,
]; //straightRoad2

//console.log(rotateClockwise({ x: 0, y: 0 }, -Math.PI / 2));

document.getElementById("reset")!.onclick = () => {
  console.log("reset!");
};

document.getElementById("save")!.onclick = () => {
  console.log("save!");
};

document.getElementById("discard")!.onclick = () => {
  console.log("discard!");
};

window.onresize = () => {
  plane.shiftX = carCanvas.offsetWidth / 2;
  plane.shiftY = carCanvas.offsetHeight / 2;
};

// function swapCars() {
//   if (car1.controls) {
//     car1.controls = undefined;
//     car2.controls = controls;
//   } else {
//     car2.controls = undefined;
//     car1.controls = controls;
//   }
// }

function animate() {
  carContext.canvas.width = carCanvas.offsetWidth;
  carContext.canvas.height = carCanvas.offsetHeight;
  // find what road the car is in
  // for road in current roads
  //   road.detectCollision(car)

  const currentRoads = roads.filter((road) => road.containsCar(car1));

  car1.update(currentRoads);
  plane.updateCenter(car1);
  // //car2.update();
  // //if (car1.isFocus) plane.updateCenter(car1);
  // //if (car2.isFocus) plane.updateCenter(car2);

  for (const road of roads) {
    road.draw(carContext);
  }

  car1.draw(carContext, "red");
  //car2.draw(carContext, "blue");

  // const origin = { x: 100, y: 0 };
  // const { x, y } = plane.mapToCanvas(origin);
  // carContext.arc(x, y, 50, 0, 2 * Math.PI);
  // carContext.stroke();
  turnRoad1.test(car1, carContext);

  document.getElementById("reset")!.onclick = () => {
    //console.log("road1 offset", straightRoad1.offset);
    // console.log(
    //   "road3 offset",
    //   car1.polygon.map((corner) => turnRoad1.validPoint(corner))
    // );
    //console.log(currentRoads);
    turnRoad1.test(car1, carContext);

    console.log("commence drawing");
    // carContext.beginPath();
    // carContext.strokeStyle = "black";
    // carContext.arc(400, 200, 100, 0, 2 * Math.PI);
    carContext.stroke();
    //(Cy - Ay)  * (Bx - Ax) = (By - Ay) * (Cx - Ax).
    // A = 1,1 B = 3,3 C = 2,2
    // console.log(Math.atan2(1, 0)); // pi/2
    // console.log(Math.atan2(0, 1)); // 0
    // console.log(Math.atan2(-1, 0)); // -pi/2 + 2pi => 3pi/2
    // console.log(Math.atan2(0, -1)); // pi
    //console.log("turn road origin", turnRoad1.origin);
    //console.log(straightRoad1.containsCar(car1));
    //swapCars();
    //console.log("car polygon", car1.distance);
    //console.log(straightRoad1.borders.flat());
  };

  // const test = plane.translatePoint({ x: 0, y: 0 });

  // carContext.beginPath();
  // carContext.arc(test.x, test.y, 100, Math.PI * 2, 0);
  // carContext.stroke();
  // convert coordinate plane
  requestAnimationFrame(animate);
}

animate();
