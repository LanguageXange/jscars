console.log("segment.js");
class Segment {
  constructor(p1, p2) {
    this.p1 = p1;
    this.p2 = p2;
  }

  getLength() {
    return calculateDistance(this.p1, this.p2);
  }
  directionVector() {
    return normalize(subtractOffset(this.p2, this.p1));
  }

  // formula explained here -  https://www.youtube.com/watch?v=jvqomjmMsPI
  distanceToPoint(point) {
    const proj = this.projectPoint(point);
    if (proj.offset > 0 && proj.offset < 1) {
      return calculateDistance(point, proj.point);
    }
    const distToP1 = calculateDistance(point, this.p1);
    const distToP2 = calculateDistance(point, this.p2);
    return Math.min(distToP1, distToP2);
  }

  // formula explained here -  https://www.youtube.com/watch?v=jvqomjmMsPI
  projectPoint(point) {
    const a = subtractOffset(point, this.p1);
    const b = subtractOffset(this.p2, this.p1);
    const normB = normalize(b);
    const scaler = dot(a, normB);
    const proj = {
      point: addOffset(this.p1, scale(normB, scaler)),
      offset: scaler / magnitude(b),
    };
    return proj;
  }
  // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/setLineDash
  draw(ctx, { width = 2, color = "#dcdcdc90", dashed = [] } = {}) {
    ctx.beginPath();
    ctx.lineWidth = width;
    ctx.strokeStyle = color;
    ctx.setLineDash(dashed);
    ctx.moveTo(this.p1.x, this.p1.y);
    ctx.lineTo(this.p2.x, this.p2.y);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  includesPoint(point) {
    return this.p1.equals(point) || this.p2.equals(point);
  }
  // need to check 2 ways
  equals(seg) {
    return this.includesPoint(seg.p1) && this.includesPoint(seg.p2);
  }
}
