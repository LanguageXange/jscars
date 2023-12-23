console.log("graph.js");
class Graph {
  constructor(points = [], segments = []) {
    this.points = points;
    this.segments = segments;
  }

  addPoint(newpoint) {
    this.points.push(newpoint);
  }
  addSegment(newSegment) {
    this.segments.push(newSegment);
  }
  containsSegment(segment) {
    return this.segments.find((s) => s.equals(segment));
  }
  // we don't want to add random point on the same spot
  containsPoint(newpoint) {
    return this.points.find((p) => p.equals(newpoint));
  }
  tryAddSegment(newSegment) {
    // make sure point 1 !== point2 in the segment
    // make sure there are points !
    if (this.points.length === 0) {
      return false;
    }
    if (
      !this.containsSegment(newSegment) &&
      !newSegment.p1.equals(newSegment.p2)
    ) {
      this.addSegment(newSegment);
      return true;
    }
    return false;
  }
  // we only want to add point if it doesn't exist yet
  tryAddPoint(newpoint) {
    if (!this.containsPoint(newpoint)) {
      this.addPoint(newpoint);
      return true;
    }
    return false;
  }

  getSegmentsWithPoint(point) {
    return this.segments.filter((seg) => seg.includesPoint(point));
  }
  removeSegment(segment) {
    this.segments = this.segments.filter((seg) => !seg.equals(segment));
  }
  // we should also remove segments that contain the point to be removed
  removePoint(point) {
    const segs = this.getSegmentsWithPoint(point);
    for (const seg of segs) {
      this.removeSegment(seg);
    }
    this.points = this.points.filter((p) => !p.equals(point));
  }

  dispose() {
    this.points.length = 0;
    this.segments.length = 0;
  }

  draw(ctx) {
    for (const seg of this.segments) {
      seg.draw(ctx);
    }
    for (const point of this.points) {
      point.draw(ctx);
    }
  }
}
