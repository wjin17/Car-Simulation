import "../css/style.css";
import { Car } from "./classes/Car";
import { CONTROLS, Controls } from "./classes/Controls";
import { CoordPlane } from "./classes/CoordPlane";

console.log("begin");

const carCanvas = document.getElementById("carCanvas") as HTMLCanvasElement;
const carContext = carCanvas.getContext("2d")!;
carContext.canvas.width = carCanvas.offsetWidth;
carContext.canvas.height = carCanvas.offsetHeight;

const plane = new CoordPlane(
  -Math.PI / 2,
  carCanvas.offsetWidth / 2,
  carCanvas.offsetHeight / 2
);

const car1 = new Car(plane, 0, 0, 5);
const car2 = new Car(plane, 100, 0, 5);

const controls = new Controls(CONTROLS.MANUAL);

car1.isFocus = true;
car1.controls = controls;

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

function swapCars() {
  if (car1.isFocus) {
    car1.isFocus = false;
    car1.controls = undefined;
    car2.isFocus = true;
    car2.controls = controls;
  } else {
    car2.isFocus = false;
    car2.controls = undefined;
    car1.isFocus = true;
    car1.controls = controls;
  }
}

function animate() {
  carContext.canvas.width = carCanvas.offsetWidth;
  carContext.canvas.height = carCanvas.offsetHeight;

  car1.update();
  car2.update();
  if (car1.isFocus) plane.updateCenter(car1);
  if (car2.isFocus) plane.updateCenter(car2);

  car1.draw(carContext, "red");
  car2.draw(carContext, "blue");

  document.getElementById("reset")!.onclick = () => {
    console.log(car1.speed);
    swapCars();
  };

  const test = plane.translatePoint({ x: 0, y: 0 });

  carContext.beginPath();
  carContext.arc(test.x, test.y, 100, Math.PI * 2, 0);
  carContext.stroke();
  // convert coordinate plane
  requestAnimationFrame(animate);
}

animate();
