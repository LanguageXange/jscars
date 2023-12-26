class Crossing extends Marking {
  constructor(projectPoint, directionVector, width, height) {
    super(projectPoint, directionVector, width, height);
    this.borders = [this.poly.segments[2], this.poly.segments[0]];
  }

  draw(ctx) {
    // this.poly.draw(ctx);
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
