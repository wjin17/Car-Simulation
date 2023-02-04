import { NeuralNetwork } from "./Models/NeuralNetwork";

export const enum CONTROLS {
  MANUAL = "MANUAL",
  DUMMY = "DUMMY",
  LANE_ASSIST = "LANE_ASSIST",
  SELF_DRIVING = "SELF_DRIVING",
  FULL_SELF_DRIVING = "FULL_SELF_DRIVING",
}

export class Controls {
  forward = false;
  left = false;
  right = false;
  reverse = false;

  manualOverride = false;

  brain: NeuralNetwork | undefined = undefined;

  constructor(type?: CONTROLS, rays?: number) {
    switch (type) {
      case CONTROLS.DUMMY:
        this.forward = true;
        break;
      case CONTROLS.LANE_ASSIST:
        this.manualControls();
      // fsd will switch between lane assist and NN
      case CONTROLS.SELF_DRIVING:
        this.brain = new NeuralNetwork([rays!, 6, 4]!);
        break;
      default:
        this.manualControls();
        break;
    }
  }

  private manualControls() {
    document.onkeydown = (event) => {
      switch (event.key) {
        case "ArrowUp":
          this.forward = true;
          break;
        case "ArrowLeft":
          this.manualOverride = true;
          this.left = true;
          this.right = false;
          break;
        case "ArrowRight":
          this.manualOverride = true;
          this.right = true;
          this.left = false;
          break;
        case "ArrowDown":
          this.reverse = true;
          break;
      }
    };

    document.onkeyup = (event) => {
      switch (event.key) {
        case "ArrowUp":
          this.forward = false;
          break;
        case "ArrowLeft":
          this.manualOverride = false;
          this.left = false;
          break;
        case "ArrowRight":
          this.manualOverride = false;
          this.right = false;
          break;
        case "ArrowDown":
          this.reverse = false;
          break;
      }
    };
  }

  useLaneAssist(readings: number[]) {
    if (!this.manualOverride) {
      if (readings[0] > readings[1]) {
        this.left = true;
        this.right = false;
      }
      if (readings[0] < readings[1]) {
        this.left = false;
        this.right = true;
      }
    }
  }

  useSelfDriving(readings: number[]) {
    // const offsets = readings.map((reading) =>
    //   reading == null ? 0 : 1 - reading
    // );
    const outputs = NeuralNetwork.feedForward(readings, this.brain!);
    if (outputs[0] && !outputs[3]) {
      this.forward = true;
    } else {
      this.forward = false;
    }
    if (outputs[1] && !outputs[2]) {
      this.left = true;
    } else {
      this.left = false;
    }
    if (outputs[2] && !outputs[1]) {
      this.right = true;
    } else {
      this.right = false;
    }
    if (outputs[3] && !outputs[0]) {
      this.reverse = true;
    } else {
      this.reverse = false;
    }
    //this.forward = true;
    //this.reverse = false;
  }
}
