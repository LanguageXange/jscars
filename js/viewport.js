class Viewport {
  constructor(canvas, logger) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.logger = logger;

    this.zoom = 1;
    this.center = new Point(canvas.width / 2, canvas.height / 2);
    this.offset = scale(this.center, -1); // util function
    //this.offset = new Point(0, 0); //

    this.drag = {
      start: new Point(0, 0),
      end: new Point(0, 0),
      offset: new Point(0, 0), // offset between 2 drag points (mouse up to mouse down)
      active: false,
    };

    this.#eventListener();
  }
  getMouse(e, shouldSubtractDragOffset = false) {
    // address issue when the line intent doesn't match with cursor when we use pan movement
    const p = new Point(
      (e.offsetX - this.center.x) * this.zoom - this.offset.x,
      (e.offsetY - this.center.y) * this.zoom - this.offset.y
    );

    return shouldSubtractDragOffset ? subtractOffset(p, this.drag.offset) : p;
  }

  getOffset() {
    return addOffset(this.offset, this.drag.offset);
  }

  #eventListener() {
    this.canvas.addEventListener("mousewheel", (e) =>
      this.#handleMouseWheel(e)
    );
    this.canvas.addEventListener("mouseup", (e) => this.#handleMouseUp(e));
    this.canvas.addEventListener("mousedown", (e) => this.#handleMouseDown(e));
    this.canvas.addEventListener("mousemove", (e) => this.#handleMouseMove(e));
  }

  #handleMouseWheel(e) {
    const dir = Math.sign(e.deltaY); // return 1 or -1 or 0
    const step = 0.1;
    this.zoom += dir * step;
    this.zoom = Math.max(0.75, Math.min(5, this.zoom)); // gives zoom level ranges from 0.75 to 5
    //console.log(this.zoom);

    this.logger.log(`mouse wheel: zoom ${dir > 0 ? "out" : "in"}`);
  }

  #handleMouseUp() {
    this.logger.log("mouse up");
    this.canvas.style.cursor = "default";
    if (this.drag.active) {
      // update the offset
      this.offset = addOffset(this.offset, this.drag.offset); // util function

      // reset this.drag to initial value
      this.drag = {
        start: new Point(0, 0),
        end: new Point(0, 0),
        offset: new Point(0, 0), // offset between 2 drag points (mouse up to mouse down)
        active: false,
      };
    }
  }

  #handleMouseDown(e) {
    if (e.button == 1) {
      // middle button
      this.canvas.style.cursor = "grab";
      this.logger.log("mouse down - middle button click");
      this.drag.start = this.getMouse(e);
      this.drag.active = true;
    }
  }

  #handleMouseMove(e) {
    if (this.drag.active) {
      this.logger.log("pan movement");
      this.drag.end = this.getMouse(e);
      this.drag.offset = subtractOffset(this.drag.end, this.drag.start); // util function
    }
  }

  // reset will be called in updateCanvas() so its' fine to place ctx.restore() first
  reset() {
    this.ctx.restore();
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.save();
    this.ctx.translate(this.center.x, this.center.y); // make sure zoom on the center
    this.ctx.scale(1 / this.zoom, 1 / this.zoom);
    const offset = this.getOffset(); // to see immediate pan movement
    this.ctx.translate(offset.x, offset.y);
  }
}
