// step 2 - using graphEditor & viewport
console.log("script 2");

const myCanvas = document.getElementById("mycanvas");
const saveBtn = document.getElementById("save-btn");
const deleteBtn = document.getElementById("delete-btn");

myCanvas.width = 800;
myCanvas.height = 800;

const ctx = myCanvas.getContext("2d");

const p1 = new Point(200, 200);
const p2 = new Point(400, 200);
const p3 = new Point(500, 400);
const p4 = new Point(100, 300);
const points = [p1, p2, p3, p4];
const seg1 = new Segment(p1, p2);
const seg2 = new Segment(p2, p3);
const seg3 = new Segment(p1, p4);
const seg4 = new Segment(p3, p4);
const segments = [seg1, seg2, seg3, seg4];
// const graph = new Graph(points, segments);
const graphString = localStorage.getItem("graph"); // if no localstorage it would be null
const graphInfo = graphString ? JSON.parse(graphString) : null;

const graph = graphInfo ? Graph.load(graphInfo) : new Graph();

const world = new World(graph);

const logger = new Logger(myCanvas, document.getElementById("action")); // for logging

const viewport = new Viewport(myCanvas, logger);
const graphEditor = new GraphEditor(viewport, graph, logger);

updateCanvas();

function updateCanvas() {
  //console.log("update canvas!");

  viewport.reset();

  // next step - generate roads
  // new Polygon(graph.points).draw(ctx); // for testing polygon
  // new Envelope(graph.segments[0], 80).draw(ctx); // for testing

  // next step - generate world
  world.generate();
  world.draw(ctx);
  graphEditor.display();

  requestAnimationFrame(updateCanvas);
}

// button event handlers
function dispose() {
  graphEditor.dispose();
  localStorage.removeItem("graph");
}
function save() {
  localStorage.setItem("graph", JSON.stringify(graph));
}
saveBtn.addEventListener("click", save);
deleteBtn.addEventListener("click", dispose);
