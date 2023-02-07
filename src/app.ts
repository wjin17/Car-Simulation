import "../css/style.css";
import { CONTROLS } from "./classes/Controls";
import { SimulationController } from "./classes/Simulation/Controller";
import { SelfDrivingSimulation } from "./classes/Simulation/SelfDrivingSimulation";
const modal = document.getElementById("modal");

console.log("begin");

const controller = new SimulationController();
controller.start();

function documentButtons() {
  document.getElementById("reset")!.onclick = () => {
    controller.resetSimulation();
  };

  document.getElementById("save")!.onclick = () => {
    console.log("save!");
  };

  document.getElementById("discard")!.onclick = () => {
    console.log("discard!");
  };

  document.getElementById("settings")!.onclick = () => {
    console.log("settings!");
    if (modal) modal.style.display = "block";
  };

  document.getElementById("close-modal-button")!.onclick = () => {
    if (modal) modal.style.display = "none";
  };

  window.onclick = function (event) {
    if (event.target == modal) {
      if (modal) modal.style.display = "none";
    }
  };
}

documentButtons();
