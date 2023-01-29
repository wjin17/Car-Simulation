import { CoordPlane } from "../classes/CoordPlane";
import { StraightRoad } from "../classes/Road/StraightRoad";
import { TurnRoad } from "../classes/Road/TurnRoad";

export function createNascar(plane: CoordPlane, width: number, lanes: number) {
  const road1 = new StraightRoad(plane, 0, 0, width, lanes, 0);
  const turnRoad1 = new TurnRoad(
    plane,
    road1.offset.x,
    road1.offset.y,
    width,
    lanes,
    road1.offset.rotation,
    "CCW"
  );
  const turnRoad2 = new TurnRoad(
    plane,
    turnRoad1.offset.x,
    turnRoad1.offset.y,
    width,
    lanes,
    turnRoad1.offset.rotation,
    "CCW"
  );
  const road2 = new StraightRoad(
    plane,
    turnRoad2.offset.x,
    turnRoad2.offset.y,
    width,
    lanes,
    turnRoad2.offset.rotation
  );
  const turnRoad3 = new TurnRoad(
    plane,
    road2.offset.x,
    road2.offset.y,
    width,
    lanes,
    road2.offset.rotation,
    "CCW"
  );
  const turnRoad4 = new TurnRoad(
    plane,
    turnRoad3.offset.x,
    turnRoad3.offset.y,
    width,
    lanes,
    turnRoad3.offset.rotation,
    "CCW"
  );

  return [road1, turnRoad1, turnRoad2, road2, turnRoad3, turnRoad4];
}
