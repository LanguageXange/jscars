class Crossing {
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

    this.borders = [this.poly.segments[2], this.poly.segments[0]];
  }

  draw(ctx) {
    //this.poly.draw(ctx);
    for (const border of this.borders) {
      border.draw(ctx);
    }

    const perp = perpendicular(this.directionVector);
    const line = new Segment(
      addOffset(this.projectPoint, scale(perp, this.width / 2)),
      addOffset(this.projectPoint, scale(perp, -this.width / 2))
    );

    line.draw(ctx, { width: this.height, color: "#fff", dashed: [10, 10] });
  }
}
