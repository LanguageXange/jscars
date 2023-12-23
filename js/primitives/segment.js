console.log("segment.js");
class Segment {
  constructor(p1, p2) {
    this.p1 = p1;
    this.p2 = p2;
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/setLineDash
  draw(ctx, { width = 2, color = "blue", dashed = [] } = {}) {
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
