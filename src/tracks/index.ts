import { DonutTrack } from "./donut";
import { MarioCircuit1Track } from "./MushroomCup/marioCircuit1";
import { NascarTrack } from "./nascar";

export enum TRACKS {
  DONUT = "donut",
  NASCAR = "nascar",
  MARIO_CIRCUIT_1 = "mario-circuit-1",
}

export function getTrack(track: TRACKS) {
  switch (track) {
    case TRACKS.DONUT:
      return new DonutTrack();
    case TRACKS.NASCAR:
      return new NascarTrack();
    case TRACKS.MARIO_CIRCUIT_1:
      return new MarioCircuit1Track();
    default:
      return new DonutTrack();
  }
}
