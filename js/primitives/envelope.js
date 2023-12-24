console.log("envelop");
class Envelope {
  // draw road based on segment aka skeleton
  constructor(skeleton, width, roundness = 0) {
    this.skeleton = skeleton;

    this.poly = this.#generatePolygon(width, roundness);
  }

  #generatePolygon(width, roundness) {
    const { p1, p2 } = this.skeleton;
    const radius = width / 2;

    const alpha = getAngle(subtractOffset(p1, p2)); // angle between p1 and p2
    const alpha_cw = alpha + Math.PI / 2; // clockwise (angle + 90 degrees )
    const alpha_ccw = alpha - Math.PI / 2; // counter-clockwise

    const p1_ccw = translate(p1, alpha_ccw, radius);
    const p2_ccw = translate(p2, alpha_ccw, radius);
    const p2_cw = translate(p2, alpha_cw, radius);
    const p1_cw = translate(p1, alpha_cw, radius);

    const points = [];
    const step = Math.PI / (roundness + 1);
    const eps = step / 2;
    for (let i = alpha_ccw; i <= alpha_cw + eps; i += step) {
      points.push(translate(p1, i, radius));
    }

    for (let i = alpha_ccw; i <= alpha_cw + eps; i += step) {
      points.push(translate(p2, Math.PI + i, radius));
    }
    //return new Polygon([p1_ccw, p2_ccw, p2_cw, p1_cw]);
    return new Polygon(points);
  }

  draw(ctx, options) {
    this.poly.draw(ctx, options);
    // this.poly.drawSegments(ctx); // for seeing different segments to make sure we are breaking the intersection into different segments
  }
}
