console.log("point.js");
class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  draw(
    ctx,
    { size = 18, color = "black", outline = false, fill = false } = {}
  ) {
    const rad = size / 2;
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.arc(this.x, this.y, rad, 0, 2 * Math.PI);
    ctx.fill();
    if (outline) {
      // draw the dot on top of itself
      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.fillStyle = "green";
      ctx.strokeStyle = "#fff";
      ctx.arc(this.x, this.y, rad * 0.65, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.fill();
    }
    if (fill) {
      ctx.beginPath();
      ctx.fillStyle = "orange";
      ctx.arc(this.x, this.y, rad * 0.5, 0, 2 * Math.PI);
      ctx.fill();
    }
  }

  equals(point) {
    return this.x == point.x && this.y == point.y;
  }
}
