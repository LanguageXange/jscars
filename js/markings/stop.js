class StopSign {
  constructor(projectPoint, directionVector, width, height) {
    this.projectPoint = projectPoint;
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

  draw(ctx) {
    this.support.draw(ctx, { color: "#000" });
    this.poly.draw(ctx);
  }
}
