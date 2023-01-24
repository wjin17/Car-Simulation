export function minReduction<T>(prev: T, curr: T) {
  return curr < prev ? curr : prev;
}

export function maxReduction<T>(prev: T, curr: T) {
  return curr > prev ? curr : prev;
}
