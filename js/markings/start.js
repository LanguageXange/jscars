class Start extends Marking {
  constructor(projectPoint, directionVector, width, height) {
    super(projectPoint, directionVector, width, height);

    this.img = new Image();
    this.img.src = "car.png"; // 30*50px
    this.type = "start";
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.projectPoint.x, this.projectPoint.y);
    ctx.rotate(getAngle(this.directionVector) - Math.PI / 2); // ensure text is perpendicular to the road

    ctx.drawImage(this.img, -this.img.width / 2, -this.img.height / 2);

    ctx.restore();
  }
}
