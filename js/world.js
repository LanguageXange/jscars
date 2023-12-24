console.log("world");
class World {
  constructor(
    graph,
    roadWidth = 100,
    roadRoundness = 10,

    buildingWidth = 150,
    buildingMinLength = 150,
    spacing = 50
  ) {
    this.graph = graph;
    this.roadWidth = roadWidth;
    this.roadRoundness = roadRoundness;

    this.buildingWidth = buildingWidth;
    this.buildingMinLength = buildingMinLength;
    this.spacing = spacing;

    // stuff
    this.envelopes = [];
    this.roadBorders = []; // for use to see the union result (i.e. remove overlapping segments)
    this.buildings = [];
    this.generate(); // generate the initial world
  }
  generate() {
    // regenerate world (called in updateCanvas )
    this.envelopes.length = 0;
    for (const seg of this.graph.segments) {
      this.envelopes.push(
        new Envelope(seg, this.roadWidth, this.roadRoundness)
      );
    }

    // for testing intersections
    // this.intersections = Polygon.break(
    //   this.envelopes[0].poly,
    //   this.envelopes[1].poly
    // );

    // for testing multiple intersections
    // Polygon.multiBreak(this.envelopes.map((e) => e.poly));

    this.roadBorders = Polygon.union(this.envelopes.map((e) => e.poly)); // this returns keptSegments

    // generate buildings
    this.buildings = this.#generateBuildings();
  }
  //( draw envelopes around segments, find the union, get the roadborder , use that draw polygon)
  #generateBuildings() {
    const tmpEnvelopes = [];
    for (const seg of this.graph.segments) {
      tmpEnvelopes.push(
        new Envelope(
          seg,
          this.roadWidth + this.buildingWidth + this.spacing * 2,
          this.roadRoundness
        )
      );
    }

    const guides = Polygon.union(tmpEnvelopes.map((e) => e.poly));

    // discard segment that's too short
    for (let i = 0; i < guides.length; i++) {
      const seg = guides[i];
      if (seg.getLength() < this.buildingMinLength) {
        guides.splice(i, 1);
        i--;
      }
    }

    // divide segment line into multiple lines
    const supports = [];
    for (let seg of guides) {
      const len = seg.getLength() + this.spacing;
      const buildingCount = Math.floor(
        len / (this.buildingMinLength + this.spacing)
      );
      const buildingLength = len / buildingCount - this.spacing;

      const dir = seg.directionVector(); // return a normalize Point

      let q1 = seg.p1;
      let q2 = addOffset(q1, scale(dir, buildingLength));
      supports.push(new Segment(q1, q2));

      for (let i = 2; i <= buildingCount; i++) {
        q1 = addOffset(q2, scale(dir, this.spacing));
        q2 = addOffset(q1, scale(dir, buildingLength));
        supports.push(new Segment(q1, q2));
      }
    }

    // generate bases

    const bases = [];
    for (const seg of supports) {
      bases.push(new Envelope(seg, this.buildingWidth).poly);
    }

    // return tmpEnvelopes;
    // return guides;
    // return supports;
    return bases;
  }
  draw(ctx) {
    // draw the road
    for (const env of this.envelopes) {
      // using same fill and stroke color so that we don't see the lines inside
      env.draw(ctx, { fill: "#888", stroke: "#888", lineWidth: 10 });
    }

    // for testing intersections
    // for (const int of this.intersections) {
    //   // each intersection is a Point
    //   int.draw(ctx, { color: "red", size: 6 });
    // }

    // for seeing union result
    for (const seg of this.roadBorders) {
      seg.draw(ctx, { color: "#fff", width: 3 });
    }

    // to draw dashed line
    for (const seg of this.graph.segments) {
      seg.draw(ctx, { color: "#fff", width: 4, dashed: [8, 10] });
    }

    // draw building
    for (const build of this.buildings) {
      build.draw(ctx);
    }
  }
}
