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

  constructor(type: CONTROLS) {
    switch (type) {
      default: {
        this.manualControls();
      }
    }
  }

  private manualControls() {
    document.onkeydown = (event) => {
      switch (event.key) {
        case "ArrowUp":
          this.forward = true;
          break;
        case "ArrowLeft":
          this.left = true;
          break;
        case "ArrowRight":
          this.right = true;
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
          this.left = false;
          break;
        case "ArrowRight":
          this.right = false;
          break;
        case "ArrowDown":
          this.reverse = false;
          break;
      }
    };
  }
}
