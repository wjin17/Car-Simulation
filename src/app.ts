import "../css/style.css";
console.log("begin");

const carCanvas = document.getElementById("carCanvas") as HTMLCanvasElement;
const carContext = carCanvas.getContext("2d")!;

document.getElementById("reset")!.onclick = () => {
  console.log("reset!");
};

document.getElementById("save")!.onclick = () => {
  console.log("save!");
};

document.getElementById("discard")!.onclick = () => {
  console.log("discard!");
};

function animate() {
  carContext.canvas.width = carCanvas.offsetWidth;
  carContext.canvas.height = carCanvas.offsetHeight;
  //requestAnimationFrame(animate);
}

animate();
