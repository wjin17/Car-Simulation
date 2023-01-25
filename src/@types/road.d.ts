export interface Road {
  plane: CoordPlane;
  rotation: number;
  start: Point;

  containsCar(car: Car): boolean;
  detectCollision(car: Car): boolean;

  draw(context: CanvasRenderingContext2D): void;
}
