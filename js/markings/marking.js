// refactor stop.js and crossing.js to reuse code

class Marking {
  constructor(projectPoint, directionVector, width, height) {
    this.projectPoint = projectPoint; // center point
    this.directionVector = directionVector;
    this.width = width;
    this.height = height;
    // half of the heigth toward the front & toward the back of the segment
    this.support = new Segment(
      translate(projectPoint, getAngle(directionVector), height / 2),
      translate(projectPoint, getAngle(directionVector), -height / 2)
    );
    this.poly = new Envelope(this.support, width, 0).poly; // this will span the entire road width
    this.type = "marking";
  }

  static load(info) {
    const point = new Point(info.projectPoint.x, info.projectPoint.y);
    const dir = new Point(info.directionVector.x, info.directionVector.y);
    switch (info.type) {
      case "crossing":
        return new Crossing(point, dir, info.width, info.height);
      case "start":
        return new Start(point, dir, info.width, info.height);
      case "stop":
        return new StopSign(point, dir, info.width, info.height);
    }
  }

  // to be overwritten by subclass
  draw(ctx) {
    return null;
  }
}
