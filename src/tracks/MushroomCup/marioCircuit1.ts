import { CoordPlane } from "../../classes/CoordPlane";
import { TurnRoad } from "../../classes/Road/TurnRoad";
import { StraightRoad } from "../../classes/Road/StraightRoad";

export function createMarioCircuit1(
  plane: CoordPlane,
  width: number,
  lanes: number
) {
  const start = { x: 0, y: 0, rotation: 0 };
  const SR0 = new StraightRoad(plane, start, width, lanes);
  const SR1 = new StraightRoad(plane, SR0.offset, width, lanes);
  const SR2 = new StraightRoad(plane, SR1.offset, width, lanes);
  const SR3 = new StraightRoad(plane, SR2.offset, width, lanes);
  const TR1 = new TurnRoad(plane, SR3.offset, width, lanes, "CW");
  const SR4 = new StraightRoad(plane, TR1.offset, width, lanes);
  const SR5 = new StraightRoad(plane, SR4.offset, width, lanes);
  const SR6 = new StraightRoad(plane, SR5.offset, width, lanes);
  const SR7 = new StraightRoad(plane, SR6.offset, width, lanes);
  const SR8 = new StraightRoad(plane, SR7.offset, width, lanes);
  const SR9 = new StraightRoad(plane, SR8.offset, width, lanes);
  const TR2 = new TurnRoad(plane, SR9.offset, width, lanes, "CW");
  const SR10 = new StraightRoad(plane, TR2.offset, width, lanes);
  const SR11 = new StraightRoad(plane, SR10.offset, width, lanes);
  const SR12 = new StraightRoad(plane, SR11.offset, width, lanes);
  const TR3 = new TurnRoad(plane, SR12.offset, width, lanes, "CW");
  const SR13 = new StraightRoad(plane, TR3.offset, width, lanes);
  const SR14 = new StraightRoad(plane, SR13.offset, width, lanes);
  const SR15 = new StraightRoad(plane, SR14.offset, width, lanes);
  const TR4 = new TurnRoad(plane, SR15.offset, width, lanes, "CCW"); // problem child
  const SR16 = new StraightRoad(plane, TR4.offset, width, lanes);
  const SR17 = new StraightRoad(plane, SR16.offset, width, lanes);
  const TR5 = new TurnRoad(plane, SR17.offset, width, lanes, "CW");
  const TR6 = new TurnRoad(plane, TR5.offset, width, lanes, "CW");
  const SR18 = new StraightRoad(plane, TR6.offset, width, lanes);
  const SR19 = new StraightRoad(plane, SR18.offset, width, lanes);
  const SR20 = new StraightRoad(plane, SR19.offset, width, lanes);
  const SR21 = new StraightRoad(plane, SR20.offset, width, lanes);

  console.log(TR4);

  return [
    SR0,
    SR1,
    SR2,
    TR1,
    SR3,
    SR4,
    SR5,
    SR6,
    SR7,
    SR8,
    SR9,
    TR2,
    SR10,
    SR11,
    SR12,
    TR3,
    SR13,
    SR14,
    SR15,
    TR4,
    SR16,
    SR17,
    TR5,
    TR6,
    SR18,
    SR19,
    SR20,
    SR21,
  ];
}
