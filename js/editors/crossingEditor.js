class CrossingEditor {
  constructor(viewport, world) {
    this.viewport = viewport;
    this.world = world;

    this.canvas = viewport.canvas;
    this.ctx = this.canvas.getContext("2d");

    this.mousePoint = null;
    this.intent = null;
    this.markings = world.markings;
    this.#eventListener();
  }

  enable() {
    this.#eventListener();
  }

  disable() {
    this.#removeListener();
  }

  #eventListener() {
    this.boundMouseDown = this.#handleMouseDown.bind(this);
    this.boundMouseMove = this.#handleMouseMove.bind(this);
    this.boundContextMenu = (e) => e.preventDefault();

    this.canvas.addEventListener("mousedown", this.boundMouseDown);
    this.canvas.addEventListener("mousemove", this.boundMouseMove);
    this.canvas.addEventListener("contextmenu", this.boundContextMenu);
  }
  #removeListener() {
    this.canvas.removeEventListener("mousedown", this.boundMouseDown);
    this.canvas.removeEventListener("mousemove", this.boundMouseMove);
    this.canvas.removeEventListener("contextmenu", this.boundContextMenu);
  }

  // mouse move should see the stop sign intent
  #handleMouseMove(e) {
    this.mousePoint = this.viewport.getMouse(e, true);
    // as we move the mouse, we should indicate to the user which segment is the nearest to place the road sign
    const seg = getNearestSegment(
      this.mousePoint,
      this.world.graph.segments,
      10 * this.viewport.zoom
    );
    if (seg) {
      // this.intent = seg; // this will show the line segment closer to the mouse

      // we want to project the center point on the segment
      const proj = seg.projectPoint(this.mousePoint);
      if (proj.offset >= 0 && proj.offset <= 1) {
        // this.intent = proj.point;

        this.intent = new Crossing(
          proj.point,
          seg.directionVector(),
          world.roadWidth,
          world.roadWidth / 2
        );
      } else {
        this.intent = null;
      }
    } else {
      this.intent = null;
    }
  }

  #handleMouseDown(e) {
    if (e.button === 0) {
      // left click
      if (this.intent) {
        this.markings.push(this.intent); // world.js will draw the marking
        this.intent = null;
      }
    }

    // remove sign
    if (e.button === 2) {
      // right click
      for (let i = 0; i < this.markings.length; i++) {
        const poly = this.markings[i].poly;
        // if our mouse is inside the stop sign poly
        if (poly.containsPoint(this.mousePoint)) {
          this.markings.splice(i, 1);
          return;
        }
      }
    }
  }

  display() {
    if (this.intent) {
      this.intent.draw(this.ctx);
    }
  }
}
