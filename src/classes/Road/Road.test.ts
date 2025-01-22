import { Car } from "../Car";
import { CoordPlane } from "../CoordPlane";
import { StraightRoad } from "./StraightRoad";
import { TurnRoad } from "./TurnRoad";

describe("Roads", () => {
  const plane = new CoordPlane(Math.PI / 2, 900, 900);
  const start0 = { x: 0, y: 0, rotation: 0 };
  const start90 = { x: 0, y: 0, rotation: Math.PI / 2 };
  const start180 = { x: 0, y: 0, rotation: Math.PI };
  const start270 = { x: 0, y: 0, rotation: (3 * Math.PI) / 2 };

  describe("Straight road", () => {
    const road0 = new StraightRoad(plane, start0, 300, 3);
    const road90 = new StraightRoad(plane, start90, 300, 3);
    const road180 = new StraightRoad(plane, start180, 300, 3);
    const road270 = new StraightRoad(plane, start270, 300, 3);

    it("should detect car in bounds", () => {
      const carInBounds = new Car(plane, 0, 0, 5, 0);

      expect(road0.containsCar(carInBounds)).toBeTruthy();
      expect(road90.containsCar(carInBounds)).toBeTruthy();
      expect(road180.containsCar(carInBounds)).toBeTruthy();
      expect(road270.containsCar(carInBounds)).toBeTruthy();
    });

    it("should not detect car out of bounds", () => {
      const carOutOfBounds = new Car(plane, 600, 600, 5, 0);

      expect(road0.containsCar(carOutOfBounds)).toBeFalsy();
      expect(road90.containsCar(carOutOfBounds)).toBeFalsy();
      expect(road180.containsCar(carOutOfBounds)).toBeFalsy();
      expect(road270.containsCar(carOutOfBounds)).toBeFalsy();
    });

    it("should detect collision", () => {
      const damagedCar = new Car(plane, -130, -105, 5, 0);

      expect(road0.detectCollision(damagedCar)).toBeTruthy();
      expect(road90.detectCollision(damagedCar)).toBeTruthy();
      expect(road180.detectCollision(damagedCar)).toBeTruthy();
      expect(road270.detectCollision(damagedCar)).toBeTruthy();
    });

    it("should not detect collision", () => {
      const safeCar = new Car(plane, 0, 0, 5, 0);
      expect(road0.detectCollision(safeCar)).toBeFalsy();
      expect(road90.detectCollision(safeCar)).toBeFalsy();
      expect(road180.detectCollision(safeCar)).toBeFalsy();
      expect(road270.detectCollision(safeCar)).toBeFalsy();
    });

    it("should set the offset correctly", () => {
      const { x: x0, y: y0 } = road0.offset;
      const { x: x90, y: y90 } = road90.offset;
      const { x: x180, y: y180 } = road180.offset;
      const { x: x270, y: y270 } = road270.offset;

      expect(x0).toBeCloseTo(0);
      expect(y0).toBeCloseTo(300);

      expect(x90).toBeCloseTo(300);
      expect(y90).toBeCloseTo(0);

      expect(x180).toBeCloseTo(0);
      expect(y180).toBeCloseTo(-300);

      expect(x270).toBeCloseTo(-300);
      expect(y270).toBeCloseTo(0);
    });
  });

  describe("Turn road", () => {
    describe("Clockwise", () => {
      const cwRoad0 = new TurnRoad(plane, start0, 300, 3, "CW");
      const cwRoad90 = new TurnRoad(plane, start90, 300, 3, "CW");
      const cwRoad180 = new TurnRoad(plane, start180, 300, 3, "CW");
      const cwRoad270 = new TurnRoad(plane, start270, 300, 3, "CW");

      it("should set the offset correctly", () => {
        const { x: cwX0, y: cwY0, rotation: cwRot0 } = cwRoad0.offset;
        const { x: cwX90, y: cwY90, rotation: cwRot90 } = cwRoad90.offset;
        const { x: cwX180, y: cwY180, rotation: cwRot180 } = cwRoad180.offset;
        const { x: cwX270, y: cwY270, rotation: cwRot270 } = cwRoad270.offset;

        expect(cwX0).toBeCloseTo(600);
        expect(cwY0).toBeCloseTo(300);
        expect(cwRot0).toBeCloseTo(Math.PI / 2);

        expect(cwX90).toBeCloseTo(300);
        expect(cwY90).toBeCloseTo(-600);
        expect(cwRot90).toBeCloseTo(Math.PI);

        expect(cwX180).toBeCloseTo(-600);
        expect(cwY180).toBeCloseTo(-300);
        expect(cwRot180).toBeCloseTo((3 * Math.PI) / 2);

        expect(cwX270).toBeCloseTo(-300);
        expect(cwY270).toBeCloseTo(600);
        expect(cwRot270).toBeCloseTo(0);
      });

      it("should detect car in bounds", () => {
        const carInBounds = new Car(plane, 0, 0, 5, 0);

        expect(cwRoad0.containsCar(carInBounds)).toBeTruthy();
        expect(cwRoad90.containsCar(carInBounds)).toBeTruthy();
        expect(cwRoad180.containsCar(carInBounds)).toBeTruthy();
        expect(cwRoad270.containsCar(carInBounds)).toBeTruthy();
      });

      it("should not detect car out of bounds", () => {
        const carOutOfBounds = new Car(plane, 600, 600, 5, 0);

        expect(cwRoad0.containsCar(carOutOfBounds)).toBeFalsy();
        expect(cwRoad90.containsCar(carOutOfBounds)).toBeFalsy();
        expect(cwRoad180.containsCar(carOutOfBounds)).toBeFalsy();
        expect(cwRoad270.containsCar(carOutOfBounds)).toBeFalsy();
      });
    });

    describe("Counter clockwise", () => {
      const ccwRoad0 = new TurnRoad(plane, start0, 300, 3, "CCW");
      const ccwRoad90 = new TurnRoad(plane, start90, 300, 3, "CCW");
      const ccwRoad180 = new TurnRoad(plane, start180, 300, 3, "CCW");
      const ccwRoad270 = new TurnRoad(plane, start270, 300, 3, "CCW");

      it("should set the offset correctly", () => {
        const { x: ccwX0, y: ccwY0, rotation: ccwRot0 } = ccwRoad0.offset;
        const { x: ccwX90, y: ccwY90, rotation: ccwRot90 } = ccwRoad90.offset;
        const {
          x: ccwX180,
          y: ccwY180,
          rotation: ccwRot180,
        } = ccwRoad180.offset;
        const {
          x: ccwX270,
          y: ccwY270,
          rotation: ccwRot270,
        } = ccwRoad270.offset;

        expect(ccwX0).toBeCloseTo(-600);
        expect(ccwY0).toBeCloseTo(300);
        expect(ccwRot0).toBeCloseTo(-Math.PI / 2);

        expect(ccwX90).toBeCloseTo(300);
        expect(ccwY90).toBeCloseTo(600);
        expect(ccwRot90).toBeCloseTo(0);

        expect(ccwX180).toBeCloseTo(600);
        expect(ccwY180).toBeCloseTo(-300);
        expect(ccwRot180).toBeCloseTo(Math.PI / 2);

        expect(ccwX270).toBeCloseTo(-300);
        expect(ccwY270).toBeCloseTo(-600);
        expect(ccwRot270).toBeCloseTo(Math.PI);
      });

      it("should detect car in bounds", () => {
        const carInBounds = new Car(plane, 0, 0, 5, 0);

        expect(ccwRoad0.containsCar(carInBounds)).toBeTruthy();
        expect(ccwRoad90.containsCar(carInBounds)).toBeTruthy();
        expect(ccwRoad180.containsCar(carInBounds)).toBeTruthy();
        expect(ccwRoad270.containsCar(carInBounds)).toBeTruthy();
      });

      it("should not detect car out of bounds", () => {
        const carOutOfBounds = new Car(plane, 600, 600, 5, 0);

        expect(ccwRoad0.containsCar(carOutOfBounds)).toBeFalsy();
        expect(ccwRoad90.containsCar(carOutOfBounds)).toBeFalsy();
        expect(ccwRoad180.containsCar(carOutOfBounds)).toBeFalsy();
        expect(ccwRoad270.containsCar(carOutOfBounds)).toBeFalsy();
      });
    });
  });
});
