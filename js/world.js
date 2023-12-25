console.log("world");
class World {
  constructor(
    graph,
    roadWidth = 100,
    roadRoundness = 10,

    buildingWidth = 150,
    buildingMinLength = 150,
    spacing = 50,

    treeSize = 120
  ) {
    // attributes
    this.graph = graph;
    this.roadWidth = roadWidth;
    this.roadRoundness = roadRoundness;
    this.buildingWidth = buildingWidth;
    this.buildingMinLength = buildingMinLength;
    this.spacing = spacing;
    this.treeSize = treeSize;

    // things related to the world
    this.envelopes = [];
    this.roadBorders = []; // for use to see the union result (i.e. remove overlapping segments)
    this.buildings = [];
    this.trees = [];
    this.laneGuides = [];

    // generate the initial world
    this.generate();
  }
  generate() {
    // regenerate world (called in updateCanvas )
    this.envelopes.length = 0;
    this.laneGuides.length = 0;
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
    // generate trees
    this.trees = this.#generateTrees();
    // generate lane guides to visualize the lane ( to place the stop sign on the correct position)
    this.laneGuides = this.#generateLaneGuides();

    // road markings
    this.markings = [];
  }
  #generateLaneGuides() {
    const tmpEnvelopes = [];
    for (const seg of this.graph.segments) {
      tmpEnvelopes.push(
        new Envelope(seg, this.roadWidth / 2, this.roadRoundness)
      );
    }
    const segments = Polygon.union(tmpEnvelopes.map((e) => e.poly));
    return segments;
  }
  //( draw envelopes around segments, find the union, get the roadborder , use that to draw polygon)
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

    // lines
    const guides = Polygon.union(tmpEnvelopes.map((e) => e.poly));

    // discard segment that's too short
    for (let i = 0; i < guides.length; i++) {
      const seg = guides[i];
      if (seg.getLength() < this.buildingMinLength) {
        guides.splice(i, 1);
        i--;
      }
    }

    // divide longer line into multiple shorter lines
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

    // generate bases polygon from the supports array
    const bases = [];
    for (const seg of supports) {
      bases.push(new Envelope(seg, this.buildingWidth).poly);
    }

    // fixing building collisions by removing the adjacent building if it intersects
    let eps = 0.001; // to address floating point issue
    for (let i = 0; i < bases.length - 1; i++) {
      for (let j = i + 1; j < bases.length; j++) {
        if (
          bases[i].isIntersectsWith(bases[j]) ||
          bases[i].distanceToPoly(bases[j]) < this.spacing - eps // ensure buildings are not super close on a straight line with multiple subsegments
        ) {
          bases.splice(j, 1); // splice will shift the index so need to decrement j by one
          j--;
        }
      }
    }

    // return guides;
    // return supports;
    // return bases // (bases are Polygons)
    return bases.map((b) => new Building(b));
  }

  // draw trees around buildings and roads
  #generateTrees() {
    const points = [
      ...this.roadBorders.map((s) => [s.p1, s.p2]).flat(),
      ...this.buildings.map((b) => b.base.points).flat(),
    ];
    //console.log(points, "what is points");

    const left = Math.min(...points.map((p) => p.x));
    const right = Math.max(...points.map((p) => p.x));
    const top = Math.min(...points.map((p) => p.y));
    const bottom = Math.max(...points.map((p) => p.y));

    const illegalPolys = [
      ...this.buildings.map((b) => b.base),
      ...this.envelopes.map((e) => e.poly),
    ];

    const trees = [];
    let tryCount = 0;
    while (tryCount < 50) {
      // randomly generate trees with lerp
      const p = new Point(
        lerp(left, right, Math.random()),
        lerp(bottom, top, Math.random())
      );

      // we don't want to trees on the buildings and roads and need to consider the tree size
      let keep = true;
      for (const poly of illegalPolys) {
        if (
          poly.containsPoint(p) ||
          poly.polyDistanceToPoint(p) < this.treeSize / 2
        ) {
          keep = false;
          break;
        }
      }

      // avoid trees intersect with each other
      if (keep) {
        for (const tree of trees) {
          if (calculateDistance(tree.centerPoint, p) < this.treeSize) {
            keep = false;
            break;
          }
        }
      }

      // we only want trees close to the buildings and roads
      if (keep) {
        let closeToSomething = false;
        for (const poly of illegalPolys) {
          if (poly.polyDistanceToPoint(p) < this.treeSize * 2) {
            closeToSomething = true;
            break;
          }
        }
        keep = closeToSomething;
      }

      // update trees array and reset tryCount
      if (keep) {
        trees.push(new Tree(p, this.treeSize));
        tryCount = 0;
      }

      tryCount++;
    }
    return trees;
  }
  draw(ctx, viewPoint) {
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

    // to draw dashed line on the main road segment
    for (const seg of this.graph.segments) {
      seg.draw(ctx, { color: "#fff", width: 4, dashed: [8, 10] });
    }

    // draw building and trees with pseudo 3D effect and in the correct order
    const items = [...this.buildings, ...this.trees]; // both build and tree have `this.base`
    items.sort(
      (a, b) =>
        b.base.polyDistanceToPoint(viewPoint) -
        a.base.polyDistanceToPoint(viewPoint)
    );
    for (const item of items) {
      item.draw(ctx, viewPoint);
    }

    // drawing lane guides
    // better visualize where the stop sign should be
    // for (const seg of this.laneGuides) {
    //   seg.draw(ctx, { color: "darkred", dashed: [10, 15] });
    // }

    // draw markings (e.g. stop sign)
    for (const mark of this.markings) {
      mark.draw(ctx);
    }
  }
}
