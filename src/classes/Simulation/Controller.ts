import { Simulation } from "../../@types/simulation";
import { getTrack, TRACKS } from "../../tracks";
import { CONTROLS } from "../Controls";
import { ManualSimulation } from "./ManualSimulation";
import { SelfDrivingSimulation } from "./SelfDrivingSimulation";

export class SimulationController {
  mode: CONTROLS = CONTROLS.MANUAL;
  track: TRACKS = TRACKS.MARIO_CIRCUIT_1;
  simulation: Simulation;
  numCars = 10;
  mutationRate = 0.2;
  hiddenLayers: number[] = [6];

  modeButtons = document.getElementsByClassName("setting-button");
  trackButtons = document.getElementsByClassName("track-button");

  constructor() {
    const defaultTrack = getTrack(this.track);
    this.simulation = new ManualSimulation(this.mode, defaultTrack);
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

    document.getElementById("select-donut")!.onclick = () => {
      this.track = TRACKS.DONUT;
      this.updateTrack();
    };
    document.getElementById("select-nascar")!.onclick = () => {
      this.track = TRACKS.NASCAR;
      this.updateTrack();
    };
    document.getElementById("select-mario-circuit-1")!.onclick = () => {
      this.track = TRACKS.MARIO_CIRCUIT_1;
      this.updateTrack();
    };
    document.getElementById("update-training-size")!.onclick = () => {
      const sizeInput = document.getElementById(
        "training-size-input"
      ) as HTMLInputElement;
      this.numCars = parseInt(sizeInput.value);

      const mutationRateInput = document.getElementById(
        "mutation-rate-input"
      ) as HTMLInputElement;
      this.mutationRate = parseFloat(mutationRateInput.value);

      const hiddenLayersInput = document.getElementById(
        "hidden-layers-input"
      ) as HTMLInputElement;
      this.hiddenLayers = hiddenLayersInput.value
        .split(",")
        .map((val) => parseInt(val));
      this.updateMode();
    };
  }

  start() {
    this.simulation.simulate();
  }

  updateMode() {
    this.setSimulation();
    this.clearModeSelection();
    this.setButtonActive(this.mode);
    this.start();
  }

  updateTrack() {
    this.setSimulation();
    this.clearTrackSelection();
    this.setButtonActive(this.track);
    this.start();
  }

  setSimulation() {
    const track = getTrack(this.track);
    const container = document.getElementById("simulation-container");
    if (this.mode == CONTROLS.MANUAL || this.mode == CONTROLS.LANE_ASSIST) {
      if (container) container.dataset.mode = "manual";
      this.simulation = new ManualSimulation(this.mode, track);
    } else {
      if (container) container.dataset.mode = "self-driving";
      this.simulation = new SelfDrivingSimulation(this.mode, track, {
        networkType: "FeedForward",
        generationSize: this.numCars,
        mutationRate: this.mutationRate,
        activationFunction: "sigmoid",
        hiddenLayers: this.hiddenLayers,
      });
    }
  }

  private clearModeSelection() {
    for (let i = 0; i < this.modeButtons.length; i++) {
      this.modeButtons[i]?.classList.remove("active");
    }
  }

  private clearTrackSelection() {
    for (let i = 0; i < this.modeButtons.length; i++) {
      this.trackButtons[i]?.classList.remove("active");
    }
  }

  private setButtonActive(button: string) {
    document.getElementById(`select-${button}`)?.classList.add("active");
  }

  resetSimulation() {
    this.simulation.reset();
  }
}
