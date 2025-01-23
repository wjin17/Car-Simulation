import { FFNN } from "./Models/Networks/FeedForward";

export const enum CONTROLS {
  MANUAL = "manual",
  DUMMY = "dummy",
  LANE_ASSIST = "lane-assist",
  SELF_DRIVING = "self-driving",
  FULL_SELF_DRIVING = "full-self-driving",
}

export class Controls {
  forward = false;
  left = false;
  right = false;
  reverse = false;

  manualOverride = false;

  brain: FFNN | undefined = undefined;

  constructor(type?: CONTROLS, rays?: number) {
    switch (type) {
      case CONTROLS.DUMMY:
        this.forward = true;
        break;
      case CONTROLS.LANE_ASSIST:
        this.manualControls();
        break;
      case CONTROLS.SELF_DRIVING:
        this.brain = new FFNN([rays!, 6, 4]!);
        break;
      case CONTROLS.FULL_SELF_DRIVING:
        this.brain = new FFNN([rays!, 6, 4]!);
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
    const outputs = this.brain!.predict(readings);
    if (outputs[0] && !outputs[3]) {
      this.forward = true;
    } else {
      this.forward = false;
    }
    if (outputs[1] && !outputs[2]) {
      this.manualOverride = true;
      this.left = true;
    } else {
      this.manualOverride = false;
      this.left = false;
    }
    if (outputs[2] && !outputs[1]) {
      this.manualOverride = true;
      this.right = true;
    } else {
      this.manualOverride = false;
      this.right = false;
    }
    if (outputs[3] && !outputs[0]) {
      this.reverse = true;
    } else {
      this.reverse = false;
    }
  }
}
