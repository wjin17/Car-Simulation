import { CoordPlane } from "../classes/CoordPlane";
import { TurnRoad } from "../classes/Road/TurnRoad";

export function createDonut(plane: CoordPlane, width: number, lanes: number) {
  const turnRoad1 = new TurnRoad(plane, 0, 0, width, lanes, 0, "CW");
  const turnRoad2 = new TurnRoad(
    plane,
    turnRoad1.offset.x,
    turnRoad1.offset.y,
    width,
    lanes,
    turnRoad1.offset.rotation,
    "CW"
  );
  const turnRoad3 = new TurnRoad(
    plane,
    turnRoad2.offset.x,
    turnRoad2.offset.y,
    width,
    lanes,
    turnRoad2.offset.rotation,
    "CW"
  );
  const turnRoad4 = new TurnRoad(
    plane,
    turnRoad3.offset.x,
    turnRoad3.offset.y,
    width,
    lanes,
    turnRoad3.offset.rotation,
    "CW"
  );

  return [turnRoad1, turnRoad2, turnRoad3, turnRoad4];
}
