class StopSign extends Marking {
  constructor(projectPoint, directionVector, width, height) {
    super(projectPoint, directionVector, width, height);
    this.border = this.poly.segments[2];
  }

  draw(ctx) {
    // this.support.draw(ctx, { color: "#000" }); // this is the line
    // this.poly.draw(ctx);  // this is for us to see the area of the stop sign

    //this.border.draw(ctx, { width: 5, color: "#fff" }); // the border in front of the 'STOP' text

    ctx.save();
    ctx.translate(this.projectPoint.x, this.projectPoint.y);
    ctx.rotate(getAngle(this.directionVector) - Math.PI / 2); // ensure text is perpendicular to the road
    ctx.scale(1, 2); // stretching the sign vertically

    ctx.beginPath();
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.fillStyle = "#fff";
    ctx.font = `bold ${this.height * 0.3}px Arial`;
    ctx.fillText("STOP", 0, 0);

    ctx.restore();
  }
}
