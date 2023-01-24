export interface Road {
  plane: CoordPlane;
  rotation: number;

  containsCar(car: Car): boolean;
  detectCollision(car: Car): boolean;
}
