class StopEditor {
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
      // this.world.graph.segments,
      this.world.laneGuides, // for stop sign we want to place it on either right or left lane
      10 * this.viewport.zoom
    );
    if (seg) {
      // this.intent = seg; // this will show the line segment closer to the mouse

      // we want to project the center point on the segment
      const proj = seg.projectPoint(this.mousePoint);
      if (proj.offset >= 0 && proj.offset <= 1) {
        // this.intent = proj.point;

        this.intent = new StopSign(
          proj.point,
          seg.directionVector(),
          world.roadWidth / 2,
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
  }

  display() {
    if (this.intent) {
      this.intent.draw(this.ctx);
    }
  }
}
