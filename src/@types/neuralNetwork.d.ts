interface Layer {
  inputs: number[];
  outputs: number[];
  weights: number[][];
  biases: number[];

  randomize(): void;
}

interface NeuralNetwork {
  layers: Layer[] = [];
  predict(input: number[]): number[];
}

type ActivationFunction = (input: number[], layer: Layer) => number[];

interface FFNetworkParams {
  networkType: "FeedForward";
  mutationRate: number;
  hiddenLayers: number[];
  generationSize: number;
  activationFunction: "sigmoid" | "step";
}
