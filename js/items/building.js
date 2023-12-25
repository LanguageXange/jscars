class Building {
  constructor(basePoly, heightCoef = 0.2) {
    this.base = basePoly;
    this.heightCoef = heightCoef;
  }

  draw(ctx, viewPoint) {
    // same formula as in tree.js
    const topPoints = this.base.points.map((p) =>
      addOffset(p, scale(subtractOffset(p, viewPoint), this.heightCoef))
    );

    const ceiling = new Polygon(topPoints);

    const sides = []; // connecting points between ceiling and base
    for (let i = 0; i < this.base.points.length; i++) {
      const nextI = (i + 1) % this.base.points.length; // to loop back
      const poly = new Polygon([
        this.base.points[i],
        this.base.points[nextI],
        topPoints[nextI],
        topPoints[i],
      ]);
      sides.push(poly);
    }

    // address weird sides issue by sorting the sides poly according to the viewpoint
    // the closer one will be the last one to be drawn
    sides.sort(
      (a, b) =>
        b.polyDistanceToPoint(viewPoint) - a.polyDistanceToPoint(viewPoint)
    );
    this.base.draw(ctx, { fill: "#fff", stroke: "#333" });
    for (const side of sides) {
      side.draw(ctx, { fill: "#dcdcdc" });
    }
    ceiling.draw(ctx, { fill: "#ff6666", stroke: "#000" });
  }
}
