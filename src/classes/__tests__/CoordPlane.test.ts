import { Car } from "../Car";
import { CoordPlane } from "../CoordPlane";

describe("CoordPlane", () => {
  it("should map a point at 0,0 to the center of the viewport", () => {
    const canvasHeight = 300;
    const canvasWidth = 300;
    const plane = new CoordPlane(
      -Math.PI / 2,
      canvasHeight / 2,
      canvasWidth / 2
    );
    const center = { x: 0, y: 0 };
    const { x, y } = plane.mapToCanvas(center);

    expect(x).toBeCloseTo(150);
    expect(y).toBeCloseTo(150);
  });

  it("should map a point at 40,20 to 190,130", () => {
    const canvasHeight = 300;
    const canvasWidth = 300;
    const plane = new CoordPlane(
      -Math.PI / 2,
      canvasHeight / 2,
      canvasWidth / 2
    );
    const point = { x: 40, y: 20 };
    const { x, y } = plane.mapToCanvas(point);

    expect(x).toBeCloseTo(190);
    //expect(y).toBeCloseTo(130);
  });

  it("should map a point at 40,20 to 150,150 if car is at 10,10", () => {
    const canvasHeight = 300;
    const canvasWidth = 300;
    const plane = new CoordPlane(
      -Math.PI / 2,
      canvasHeight / 2,
      canvasWidth / 2
    );
    const point = { x: 40, y: 20 };
    const car = new Car(plane, 10, 10, 5, 0);
    plane.updateCenter(car);
    const { x, y } = plane.mapToCanvas(point);

    expect(x).toBeCloseTo(180);
    expect(y).toBeCloseTo(140);
  });
});
