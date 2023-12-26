class Polygon {
  constructor(points) {
    this.points = points;
    // generate segments / lines between each point in our Polygon
    this.segments = [];
    for (let i = 1; i <= points.length; i++) {
      // using modulo here so that the segment will loop around
      this.segments.push(new Segment(points[i - 1], points[i % points.length]));
    }
  }

  static load(polyInfo) {
    return new Polygon(polyInfo.points.map((p) => new Point(p.x, p.y)));
  }

  // basically merging overlapping envelopes
  static union(polys) {
    Polygon.multiBreak(polys);
    const keptSegments = [];
    for (let i = 0; i < polys.length; i++) {
      for (const seg of polys[i].segments) {
        let keep = true;
        for (let j = 0; j < polys.length; j++) {
          if (i != j) {
            if (polys[j].containsSegment(seg)) {
              // util function
              keep = false;
              break;
            }
          }
        }
        if (keep) {
          keptSegments.push(seg);
        }
      }
    }
    return keptSegments;
  }

  static multiBreak(polys) {
    for (let i = 0; i < polys.length - 1; i++) {
      for (let j = i + 1; j < polys.length; j++) {
        Polygon.break(polys[i], polys[j]);
      }
    }
  }

  static break(poly1, poly2) {
    const segs1 = poly1.segments;
    const segs2 = poly2.segments;
    const intersections = [];

    for (let i = 0; i < segs1.length; i++) {
      for (let j = 0; j < segs2.length; j++) {
        const int = getIntersection(
          segs1[i].p1,
          segs1[i].p2,
          segs2[j].p1,
          segs2[j].p2
        );
        if (int && int.offset !== 1 && int.offset !== 0) {
          // has intersection but not intersects at the tip
          const point = new Point(int.x, int.y);
          intersections.push(point);
          // keep a reference to p2
          let aux = segs1[i].p2;
          segs1[i].p2 = point;
          segs1.splice(i + 1, 0, new Segment(point, aux));

          aux = segs2[j].p2;
          segs2[j].p2 = point;
          segs2.splice(j + 1, 0, new Segment(point, aux));
        }
      }
    }

    return intersections;
  }

  // check if two polygons intersects ( aka collides)
  isIntersectsWith(poly) {
    for (let s1 of this.segments) {
      for (let s2 of poly.segments) {
        if (getIntersection(s1.p1, s1.p2, s2.p1, s2.p2)) {
          return true;
        }
      }
    }
    return false;
  }

  distanceToPoly(poly) {
    return Math.min(...this.points.map((p) => poly.polyDistanceToPoint(p)));
  }
  polyDistanceToPoint(p) {
    return Math.min(...this.segments.map((s) => s.distanceToPoint(p)));
  }
  // similar to ray casting
  containsPoint(point) {
    const outerPoint = new Point(-2000, -2000);
    let intersectionCount = 0;
    for (const seg of this.segments) {
      const int = getIntersection(outerPoint, point, seg.p1, seg.p2);
      if (int) {
        intersectionCount++;
      }
    }

    return intersectionCount % 2 == 1; // if the count is even (the poly contains the point)
  }
  containsSegment(seg) {
    // not the best implementation & naming but for this project it should be sufficient to check the midpoint
    const midpoint = average(seg.p1, seg.p2); // math util function
    return this.containsPoint(midpoint);
  }
  drawSegments(ctx) {
    for (const seg of this.segments) {
      seg.draw(ctx, { color: getRandomColor(), width: 5 });
    }
  }

  draw(
    ctx,
    { stroke = "#333", fill = "rgba(0,0,255,0.25)", lineWidth = 2 } = {}
  ) {
    ctx.beginPath();
    ctx.strokeStyle = stroke;
    ctx.lineWidth = lineWidth;
    ctx.fillStyle = fill;
    if (this.points.length) {
      ctx.moveTo(this.points[0].x, this.points[0].y);

      for (let i = 1; i < this.points.length; i++) {
        ctx.lineTo(this.points[i].x, this.points[i].y);
      }
    }

    ctx.closePath();

    ctx.stroke();
    ctx.fill();
  }
}
