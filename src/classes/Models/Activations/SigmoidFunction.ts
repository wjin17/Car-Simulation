export const sigmoidFunction: ActivationFunction = (
  inputs: number[],
  layer: Layer
) => {
  for (let i = 0; i < layer.inputs.length; i++) {
    layer.inputs[i] = inputs[i];
  }

  for (let i = 0; i < layer.outputs.length; i++) {
    let sum = 0;
    for (let j = 0; j < layer.inputs.length; j++) {
      sum += layer.inputs[j] * layer.weights[j][i];
    }

    sum += layer.biases[i];

    layer.outputs[i] = 1 / (1 + Math.exp(-sum));
  }

  return layer.outputs;
};
