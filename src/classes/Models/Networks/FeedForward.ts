import { lerp } from "../../../utils/lerp";
import { stepFunction } from "../Activations/StepFunction";
import { sigmoidFunction } from "../Activations/SigmoidFunction";

export class FFNN implements NeuralNetwork {
  layers: Layer[] = [];
  brainId = 0;
  activationFunction: ActivationFunction;

  constructor(neuronCounts: number[]) {
    for (let i = 0; i < neuronCounts.length - 1; i++) {
      this.layers.push(new FFNNLayer(neuronCounts[i], neuronCounts[i + 1]));
    }
    this.activationFunction = sigmoidFunction;
  }

  predict(input: number[]) {
    let outputs = this.activationFunction(input, this.layers[0]);
    for (let i = 1; i < this.layers.length; i++) {
      outputs = this.activationFunction(outputs, this.layers[i]);
    }
    return outputs.map((output) => (output > 0.5 ? 1 : 0));
  }

  inherit(parent: FFNN) {
    this.layers.forEach((layer, i) => {
      for (let j = 0; j < layer.biases.length; j++) {
        layer.biases[j] = parent.layers[i].biases[j];
      }
      for (let j = 0; j < layer.weights.length; j++) {
        for (let k = 0; k < layer.weights[j].length; k++) {
          layer.weights[j][k] = parent.layers[i].weights[j][k];
        }
      }
    });
  }

  mutate(mutationFactor = 1) {
    this.layers.forEach((layer) => {
      for (let i = 0; i < layer.biases.length; i++) {
        layer.biases[i] = lerp(
          layer.biases[i],
          Math.random() * 2 - 1,
          mutationFactor
        );
      }
      for (let i = 0; i < layer.weights.length; i++) {
        for (let j = 0; j < layer.weights[i].length; j++) {
          layer.weights[i][j] = lerp(
            layer.weights[i][j],
            Math.random() * 2 - 1,
            mutationFactor
          );
        }
      }
    });
  }
}

export class FFNNLayer implements Layer {
  inputs: number[];
  outputs: number[];
  biases: number[];
  weights: number[][] = [];

  constructor(inputCount: number, outputCount: number) {
    this.inputs = new Array(inputCount);
    this.outputs = new Array(outputCount);
    this.biases = new Array(outputCount);

    for (let i = 0; i < inputCount; i++) {
      this.weights.push(new Array(outputCount));
    }

    this.randomize();
  }

  randomize() {
    if (this.weights.length) {
      for (let i = 0; i < this.inputs.length; i++) {
        for (let j = 0; j < this.outputs.length; j++) {
          this.weights[i][j] = Math.random() * 2 - 1;
        }
      }

      for (let i = 0; i < this.biases.length; i++) {
        this.biases[i] = Math.random() * 2 - 1;
      }
    }
  }
}
