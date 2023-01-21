import "../css/style.css";
import { Car } from "./classes/Car";
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

const car = new Car(plane, 0, 0, 3);

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
  // carContext.canvas.width = carCanvas.offsetWidth;
  // carContext.canvas.height = carCanvas.offsetHeight;
  plane.shiftX = carCanvas.offsetWidth / 2;
  plane.shiftY = carCanvas.offsetHeight / 2;
};

function animate() {
  //console.log();
  carContext.canvas.width = carCanvas.offsetWidth;
  carContext.canvas.height = carCanvas.offsetHeight;
  car.update();
  car.draw(carContext, "red");

  //const test = plane.transformCoord({ x: car.x, y: car.y });

  //carContext.beginPath();
  //carContext.arc(test.x, test.y, 100, Math.PI * 2, 0);
  //carContext.stroke();
  // convert coordinate plane
  requestAnimationFrame(animate);
}

animate();
