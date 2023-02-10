export interface Road {
  plane: CoordPlane;
  rotation: number;
  start: Point;

  containsCar(car: Car): boolean;
  containsPoint(car: Car): boolean;
  detectCollision(car: Car): boolean;
  findBorderIntersection(line: Line): Point | undefined;
  findLaneIntersection(line: Line): Point | undefined;

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

export interface Track {
  create(plane: CoordPlane, width: number, lanes: number): Road[];
}
