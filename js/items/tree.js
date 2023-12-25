class Tree {
  constructor(centerPoint, size, heightCoefficient = 0.5) {
    this.centerPoint = centerPoint;
    this.size = size; // size of the base
    this.heightCoefficient = heightCoefficient;
  }

  draw(ctx, viewPoint) {
    const diff = subtractOffset(this.centerPoint, viewPoint); // pseudo 3d effect
    // this.centerPoint.draw(ctx, { size: this.size, color: "green" });

    const top = addOffset(
      this.centerPoint,
      scale(diff, this.heightCoefficient)
    );

    const levelCount = 7;

    for (let level = 0; level < levelCount; level++) {
      const t = level / (levelCount - 1);
      const point = lerp2D(this.centerPoint, top, t);
      const color = "rgb(30," + lerp(50, 200, t) + ",70)";
      const size = lerp(this.size, 40, t);
      point.draw(ctx, { size, color });
    }

    // draw a line between the top and centerPoint (tree trunk)
    // new Segment(this.centerPoint, top).draw(ctx, { color: "#000" });
  }
}
