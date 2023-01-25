import { Car } from "../Car";
import { CoordPlane } from "../CoordPlane";
import { StraightRoad } from "../Road/StraightRoad";

describe("Roads", () => {
  const plane = new CoordPlane(Math.PI / 2, 900, 900);

  describe("Straight road", () => {
    const road0 = new StraightRoad(plane, 0, 0, 300, 0);
    const road90 = new StraightRoad(plane, 0, 0, 300, Math.PI / 2);
    const road180 = new StraightRoad(plane, 0, 0, 300, Math.PI);
    const road270 = new StraightRoad(plane, 0, 0, 300, (Math.PI * 3) / 2);

    it("should detect car in bounds", () => {
      const carInBounds = new Car(plane, 0, 0, 5);

      expect(road0.containsCar(carInBounds)).toBeTruthy();
      expect(road90.containsCar(carInBounds)).toBeTruthy();
      expect(road180.containsCar(carInBounds)).toBeTruthy();
      expect(road270.containsCar(carInBounds)).toBeTruthy();
    });

    it("should not detect car out of bounds", () => {
      const carOutOfBounds = new Car(plane, 600, 600, 5);

      expect(road0.containsCar(carOutOfBounds)).toBeFalsy();
      expect(road90.containsCar(carOutOfBounds)).toBeFalsy();
      expect(road180.containsCar(carOutOfBounds)).toBeFalsy();
      expect(road270.containsCar(carOutOfBounds)).toBeFalsy();
    });

    it("should detect collision", () => {
      const damagedCar = new Car(plane, -130, -105, 5);

      expect(road0.detectCollision(damagedCar)).toBeTruthy();
      expect(road90.detectCollision(damagedCar)).toBeTruthy();
      expect(road180.detectCollision(damagedCar)).toBeTruthy();
      expect(road270.detectCollision(damagedCar)).toBeTruthy();
    });

    it("should not detect collision", () => {
      const safeCar = new Car(plane, 0, 0, 5);
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
});
