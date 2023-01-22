import "../css/style.css";
import { Car } from "./classes/Car";
import { CONTROLS, Controls } from "./classes/Controls";
import { CoordPlane } from "./classes/CoordPlane";
import { StraightRoad } from "./classes/Road/StraightRoad";
import { rotateClockwise } from "./utils/transform";

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

const straightRoad1 = new StraightRoad(plane, 0, 0, 300, -Math.PI / 2);

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

  car1.update();
  plane.updateCenter(car1);
  // //car2.update();
  // //if (car1.isFocus) plane.updateCenter(car1);
  // //if (car2.isFocus) plane.updateCenter(car2);

  straightRoad1.draw(carContext);

  car1.draw(carContext, "red");
  //car2.draw(carContext, "blue");

  // const origin = { x: 100, y: 0 };
  // const { x, y } = plane.mapToCanvas(origin);
  // carContext.arc(x, y, 50, 0, 2 * Math.PI);
  // carContext.stroke();

  document.getElementById("reset")!.onclick = () => {
    //swapCars();
  };

  // const test = plane.translatePoint({ x: 0, y: 0 });

  // carContext.beginPath();
  // carContext.arc(test.x, test.y, 100, Math.PI * 2, 0);
  // carContext.stroke();
  // convert coordinate plane
  requestAnimationFrame(animate);
}

animate();
