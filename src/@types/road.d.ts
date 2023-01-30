export interface Road {
  plane: CoordPlane;
  rotation: number;
  start: Point;

  containsCar(car: Car): boolean;
  detectCollision(car: Car): boolean;
  findIntersection(car: Car): Point | undefined;

  draw(context: CanvasRenderingContext2D): void;
}

export type StraightBorder = Point[][];

export type TurnBorder = {
  radius: number;
  start: number;
  end: number;
};

export type RoadOffset = {
  x: number;
  y: number;
  rotation: number;
};
