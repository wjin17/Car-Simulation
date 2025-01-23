import { getRGBA } from "../utils/getRGBA";
import { lerp } from "../utils/lerp";

export class Visualizer {
  static drawNetwork(
    context: CanvasRenderingContext2D,
    network: NeuralNetwork,
    id?: string | number
  ) {
    context.fillStyle = "#FDFCDC";
    context.fillRect(0, 0, context.canvas.width, context.canvas.height);
    context.fillStyle = "black";
    context.font = "30px Arial";
    context.fillText("Speciment: " + id, 50, 50);
    const margin = 100;
    const top = margin;
    const width = context.canvas.width - margin * 2;
    const height = context.canvas.height - margin * 2;

    const layerHeight = height / network.layers.length;

    for (let i = network.layers.length - 1; i >= 0; i--) {
      const layerY =
        top +
        lerp(
          height - layerHeight,
          0,
          network.layers.length == 1 ? 0.5 : i / (network.layers.length - 1)
        );

      context.setLineDash([7, 3]);
      Visualizer.drawLevel(
        context,
        network.layers[i],
        margin,
        layerY,
        width,
        layerHeight,
        i == network.layers.length - 1 ? ["⬆️", "⬅️", "➡️", "⬇️"] : []
      );
    }
  }

  static drawLevel(
    context: CanvasRenderingContext2D,
    layer: Layer,
    left: number,
    top: number,
    width: number,
    height: number,
    outputLabels: string[]
  ) {
    const right = left + width;
    const bottom = top + height;

    const { inputs, outputs, weights, biases } = layer;

    // Drawing the weights
    for (let i = 0; i < inputs.length; i++) {
      for (let j = 0; j < outputs.length; j++) {
        context.beginPath();
        context.moveTo(Visualizer.getNodeX(inputs, i, left, right), bottom);
        context.lineTo(Visualizer.getNodeX(outputs, j, left, right), top);
        context.lineWidth = 2;
        context.strokeStyle = getRGBA(weights[i][j]);
        context.stroke();
      }
    }

    // Drawing the nodes
    const nodeRadius = 18;
    for (let i = 0; i < inputs.length; i++) {
      const x = Visualizer.getNodeX(inputs, i, left, right);
      context.beginPath();
      context.arc(x, bottom, nodeRadius, 0, Math.PI * 2);
      context.fillStyle = "black";
      context.fill();
      context.beginPath();
      context.arc(x, bottom, nodeRadius * 0.6, 0, Math.PI * 2);
      context.fillStyle = getRGBA(inputs[i]);
      context.fill();
    }

    // Drawing the emojis
    for (let i = 0; i < outputs.length; i++) {
      const x = Visualizer.getNodeX(outputs, i, left, right);
      context.beginPath();
      context.arc(x, top, nodeRadius, 0, Math.PI * 2);
      context.fillStyle = "black";
      context.fill();
      context.beginPath();
      context.arc(x, top, nodeRadius * 0.6, 0, Math.PI * 2);
      context.fillStyle = getRGBA(outputs[i]);
      context.fill();

      context.beginPath();
      context.lineWidth = 2;
      context.arc(x, top, nodeRadius * 0.8, 0, Math.PI * 2);
      context.strokeStyle = getRGBA(biases[i]);
      context.setLineDash([3, 3]);
      context.stroke();
      context.setLineDash([]);

      if (outputLabels[i]) {
        context.beginPath();
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillStyle = "black";
        context.strokeStyle = "white";
        context.font = nodeRadius * 0.75 + "px Arial";
        context.fillText(outputLabels[i], x, top + nodeRadius * 0.1);
        context.lineWidth = 0.5;
        context.strokeText(outputLabels[i], x, top + nodeRadius * 0.1);
      }
    }
  }

  private static getNodeX(
    nodes: number[],
    index: number,
    left: number,
    right: number
  ) {
    return lerp(
      left,
      right,
      nodes.length == 1 ? 0.5 : index / (nodes.length - 1)
    );
  }
}
