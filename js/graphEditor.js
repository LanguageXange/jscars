console.log("editor!");
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Private_properties
class GraphEditor {
  constructor(viewport, graph, logger) {
    this.viewport = viewport;
    this.canvas = viewport.canvas;
    this.graph = graph;
    this.logger = logger;

    this.ctx = this.canvas.getContext("2d");

    this.selectedPoint = null;
    this.hoveredPoint = null;
    this.mousePoint = null; // for mousemove
    this.dragging = false;
    this.#eventListener(); // private method
  }
  #eventListener() {
    this.canvas.addEventListener("mousedown", this.#handleMouseDown.bind(this));
    // mouse move event - updating point when dragging is true
    this.canvas.addEventListener("mousemove", (e) => this.#handleMouseMove(e));
    this.canvas.addEventListener("mouseup", () => (this.dragging = false));
    // prevent context menu from displaying when we right click
    this.canvas.addEventListener("contextmenu", (e) => e.preventDefault());
  }

  #handleMouseMove(e) {
    //this.mousePoint = new Point(e.offsetX, e.offsetY);
    this.mousePoint = this.viewport.getMouse(e, true);
    this.hoveredPoint = getNearestPoint(
      this.mousePoint,
      this.graph.points,
      10 * this.viewport.zoom
    );
    if (this.dragging) {
      this.selectedPoint.x = this.mousePoint.x;
      this.selectedPoint.y = this.mousePoint.y;

      this.logger.log("mouse move: dragging ");
    }
  }
  #handleMouseDown(e) {
    if (e.button === 2) {
      this.logger.log("mouse down - right click");
      // 0 = left; 1 = middle ; 2 = right
      // on right click, we want to delete the node
      if (this.selectedPoint) {
        this.selectedPoint = null; // allow us to unselect node so that we can connect different dots
      } else if (this.hoveredPoint) {
        this.#removePoint(this.hoveredPoint);
      }
    }
    // left click
    if (e.button === 0) {
      this.logger.log("mouse down - left click");
      // if this hoveredPoint is greater than the threshold then it's null
      if (this.hoveredPoint) {
        // add segment between existing points
        this.#select(this.hoveredPoint);
        this.dragging = true;

        return;
      }
      this.graph.tryAddPoint(this.mousePoint);

      // adding segment for new nodes
      this.#select(this.mousePoint);
      this.hoveredPoint = this.mousePoint; // to address the weird issue that you create a point and right click it won't delete because at this time hoverPoint is null
    }
  }
  // we want to set hovered to null otherwise we still see the point
  #removePoint(point) {
    this.graph.removePoint(point);
    this.hoveredPoint = null;
    if (this.selectedPoint == point) {
      this.selectedPoint = null;
    }
  }

  // refactor to reuse function to add segment
  #select(point) {
    if (this.selectedPoint) {
      this.graph.tryAddSegment(new Segment(this.selectedPoint, point));
    }
    // set this.selectedPoint to the point after drawing the line
    this.selectedPoint = point;
  }

  dispose() {
    this.graph.dispose();
    this.selectedPoint = null;
    this.hoveredPoint = null;
  }
  // DISPLAY the points
  display() {
    this.graph.draw(this.ctx);

    // show hover state
    if (this.hoveredPoint) {
      this.hoveredPoint.draw(this.ctx, { fill: true });
    }

    if (this.selectedPoint) {
      let intentPoint = this.hoveredPoint ?? this.mousePoint; // snap to the existing hovered point
      new Segment(this.selectedPoint, intentPoint).draw(this.ctx, {
        dashed: [5, 3],
        color: "#333",
      });
      // draw itself again with different style
      this.selectedPoint.draw(this.ctx, { outline: true });
    }
  }
}
