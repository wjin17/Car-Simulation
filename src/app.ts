import "../css/style.css";
import { Car } from "./classes/Car";
import { CONTROLS, Controls } from "./classes/Controls";
import { CoordPlane } from "./classes/CoordPlane";
import { TurnRoad } from "./classes/Road/TurnRoad";
import Tracks from "./tracks";

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

const car = new Car(plane, 0, 0, 5);

const controls = new Controls(CONTROLS.MANUAL);

car.controls = controls;

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

const track = Tracks.createNascar(plane, 200, 3);

function animate() {
  carContext.canvas.width = carCanvas.offsetWidth;
  carContext.canvas.height = carCanvas.offsetHeight;

  const currentRoads = track.filter((road) => road.containsCar(car));

  car.update(currentRoads);
  plane.updateCenter(car);

  for (const road of track) {
    road.draw(carContext);
  }

  document.getElementById("reset")!.onclick = () => {
    console.log("reset!");
  };

  car.draw(carContext, "red");

  requestAnimationFrame(animate);
}

animate();
