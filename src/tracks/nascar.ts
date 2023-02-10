import { Road, Track } from "../@types/road";
import { CoordPlane } from "../classes/CoordPlane";
import { StraightRoad } from "../classes/Road/StraightRoad";
import { TurnRoad } from "../classes/Road/TurnRoad";

export class NascarTrack implements Track {
  create(plane: CoordPlane, width: number, lanes: number): Road[] {
    const start = { x: 0, y: 0, rotation: 0 };
    const road1 = new StraightRoad(plane, start, width, lanes);
    const turnRoad1 = new TurnRoad(plane, road1.offset, width, lanes, "CCW");
    const turnRoad2 = new TurnRoad(
      plane,
      turnRoad1.offset,
      width,
      lanes,
      "CCW"
    );
    const road2 = new StraightRoad(plane, turnRoad2.offset, width, lanes);
    const turnRoad3 = new TurnRoad(plane, road2.offset, width, lanes, "CCW");
    const turnRoad4 = new TurnRoad(
      plane,
      turnRoad3.offset,
      width,
      lanes,
      "CCW"
    );

    return [road1, turnRoad1, turnRoad2, road2, turnRoad3, turnRoad4];
  }
}
