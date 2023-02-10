import { Road, Track } from "../@types/road";
import { CoordPlane } from "../classes/CoordPlane";
import { TurnRoad } from "../classes/Road/TurnRoad";

export class DonutTrack implements Track {
  create(plane: CoordPlane, width: number, lanes: number): Road[] {
    const start = { x: 0, y: 0, rotation: 0 };
    const turnRoad1 = new TurnRoad(plane, start, width, lanes, "CW");
    const turnRoad2 = new TurnRoad(plane, turnRoad1.offset, width, lanes, "CW");
    const turnRoad3 = new TurnRoad(plane, turnRoad2.offset, width, lanes, "CW");
    const turnRoad4 = new TurnRoad(plane, turnRoad3.offset, width, lanes, "CW");

    return [turnRoad1, turnRoad2, turnRoad3, turnRoad4];
  }
}
