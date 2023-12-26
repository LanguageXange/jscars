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
  }

  // to be overwritten by subclass
  draw(ctx) {
    return null;
  }
}
