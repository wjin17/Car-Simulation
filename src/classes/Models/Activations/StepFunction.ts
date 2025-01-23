export const stepFunction: ActivationFunction = (
  givenInputs: number[],
  layer: Layer
) => {
  for (let i = 0; i < layer.inputs.length; i++) {
    layer.inputs[i] = givenInputs[i];
  }

  for (let i = 0; i < layer.outputs.length; i++) {
    let sum = 0;
    for (let j = 0; j < layer.inputs.length; j++) {
      sum += layer.inputs[j] * layer.weights[j][i];
    }

    if (sum > layer.biases[i]) {
      layer.outputs[i] = 1;
    } else {
      layer.outputs[i] = 0;
    }
  }

  return layer.outputs;
};
