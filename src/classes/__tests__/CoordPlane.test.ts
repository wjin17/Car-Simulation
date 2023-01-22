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

  it("should map a point at 10,10 to 160,140", () => {
    const canvasHeight = 300;
    const canvasWidth = 300;
    const plane = new CoordPlane(
      -Math.PI / 2,
      canvasHeight / 2,
      canvasWidth / 2
    );
    const point = { x: 10, y: 10 };
    const { x, y } = plane.mapToCanvas(point);

    expect(x).toBeCloseTo(160);
    expect(y).toBeCloseTo(140);
  });

  it("should map a point at 10,10 to 150,150 if car is at 10,10", () => {
    const canvasHeight = 300;
    const canvasWidth = 300;
    const plane = new CoordPlane(
      -Math.PI / 2,
      canvasHeight / 2,
      canvasWidth / 2
    );
    const point = { x: 10, y: 10 };
    const car = new Car(plane, 10, 10, 5);
    plane.updateCenter(car);
    const { x, y } = plane.mapToCanvas(point);

    expect(x).toBeCloseTo(150);
    expect(y).toBeCloseTo(150);
  });
});
