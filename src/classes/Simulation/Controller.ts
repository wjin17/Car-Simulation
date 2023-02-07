import { Simulation } from "../../@types/simulation";
import { Controls, CONTROLS } from "../Controls";
import { ManualSimulation } from "./ManualSimulation";
import { SelfDrivingSimulation } from "./SelfDrivingSimulation";

export class SimulationController {
  mode: CONTROLS = CONTROLS.MANUAL;
  simulation: Simulation = new ManualSimulation(CONTROLS.MANUAL);
  numCars = 50;

  modeButtons = document.getElementsByClassName("setting-button");
  trackButtons = document.getElementsByClassName("track-button");

  constructor() {
    this.addListeners();
  }

  private addListeners() {
    document.getElementById("select-manual")!.onclick = () => {
      this.mode = CONTROLS.MANUAL;
      this.updateMode();
    };
    document.getElementById("select-lane-assist")!.onclick = () => {
      this.mode = CONTROLS.LANE_ASSIST;
      this.updateMode();
    };
    document.getElementById("select-self-driving")!.onclick = () => {
      this.mode = CONTROLS.SELF_DRIVING;
      this.updateMode();
    };
    document.getElementById("select-full-self-driving")!.onclick = () => {
      this.mode = CONTROLS.FULL_SELF_DRIVING;
      this.updateMode();
    };

    // document.getElementById("select-donut")!.onclick = () => {
    //   this.setDonut();
    // };
    // document.getElementById("select-nascar")!.onclick = () => {
    //   this.setNascar();
    // };
    // document.getElementById("select-mario-circuit")!.onclick = () => {
    //   this.setMarioCircuit();
    // };
  }

  start() {
    this.simulation.simulate();
  }

  updateMode() {
    this.simulation = this.getSimulation();
    this.clearMode();
    this.setButtonActive(this.mode);
    this.start();
  }

  getSimulation() {
    if (this.mode == CONTROLS.MANUAL || this.mode == CONTROLS.LANE_ASSIST) {
      return new ManualSimulation(this.mode);
    } else {
      return new SelfDrivingSimulation(this.mode, this.numCars);
    }
  }

  private clearMode() {
    for (let i = 0; i < this.modeButtons.length; i++) {
      this.modeButtons[i]?.classList.remove("active");
    }
  }

  //   setDonut() {
  //     this.clearTrack();
  //     this.setMode("select-donut");
  //     this.start();
  //   }

  //   setNascar() {
  //     this.clearTrack();
  //     this.setMode("select-nascar");
  //     this.start();
  //   }

  //   setMarioCircuit() {
  //     this.clearTrack();
  //     this.setMode("select-mario-circuit");
  //     this.start();
  //   }

  //   private clearTrack() {
  //     for (let i = 0; i < this.trackButtons.length; i++) {
  //       this.trackButtons[i]?.classList.remove("active");
  //     }
  //   }

  private setButtonActive(button: string) {
    document.getElementById(`select-${button}`)?.classList.add("active");
  }

  resetSimulation() {
    this.simulation.reset();
  }
}
