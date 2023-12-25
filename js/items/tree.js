class Tree {
  constructor(centerPoint, size, heightCoefficient = 0.5) {
    this.centerPoint = centerPoint;
    this.size = size; // size of the base
    this.heightCoefficient = heightCoefficient;
    this.base = this.#generateLevel(centerPoint, size);
  }
  #generateLevel(point, size) {
    const points = [];
    const rad = size / 2;
    for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 16) {
      const kindofRandom =
        Math.cos(((angle + this.centerPoint.x) * size) % 17) ** 2; // square the cos return values between 0 & 1
      // if we use Math.random(); it will generate new tree every time
      const noisyRadius = rad * lerp(0.5, 1, kindofRandom);
      points.push(translate(point, angle, noisyRadius));
    }
    return new Polygon(points);
  }
  draw(ctx, viewPoint) {
    const diff = subtractOffset(this.centerPoint, viewPoint); // pseudo 3d effect
    // this.centerPoint.draw(ctx, { size: this.size, color: "green" }); // the first point is drawn inside the for loop below
    const top = addOffset(
      this.centerPoint,
      scale(diff, this.heightCoefficient)
    );

    // layers of tree
    const levelCount = 7;

    for (let level = 0; level < levelCount; level++) {
      const t = level / (levelCount - 1);
      const point = lerp2D(this.centerPoint, top, t);
      const color = "rgb(30," + lerp(50, 200, t) + ",70)";
      const size = lerp(this.size, 40, t);
      //   point.draw(ctx, { size, color });
      const poly = this.#generateLevel(point, size);
      poly.draw(ctx, { fill: color, stroke: "rgba(0,0,0,0.25)" });
    }

    // this.base.draw(ctx); // base of the tree - we can use this for detecting collisions
    // draw a line between the top and centerPoint (tree trunk)
    // new Segment(this.centerPoint, top).draw(ctx, { color: "#000" });
  }
}
