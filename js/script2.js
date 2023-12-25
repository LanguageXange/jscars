// step 2 - using graphEditor & viewport
console.log("script 2");

const myCanvas = document.getElementById("mycanvas");
const saveBtn = document.getElementById("save-btn");
const deleteBtn = document.getElementById("delete-btn");
const graphBtn = document.getElementById("graph-btn");
const stopBtn = document.getElementById("stop-btn");

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
const stopEditor = new StopEditor(viewport, world); // road markings / stop sign require info from world

let currentGraphHash = graph.hash();

setMode("graph"); // set initial mode to graph editor

updateCanvas();

function updateCanvas() {
  //console.log("update canvas!");
  viewport.reset();
  // next step - generate roads
  // new Polygon(graph.points).draw(ctx); // for testing polygon
  // new Envelope(graph.segments[0], 80).draw(ctx); // for testing
  // next step - (re)generate world but only when things are updated !
  if (graph.hash() !== currentGraphHash) {
    world.generate();
    currentGraphHash = graph.hash();
  }

  // viewPoint is for pseudo 3d effect
  const viewPoint = scale(viewport.getOffset(), -1);
  world.draw(ctx, viewPoint);
  ctx.globalAlpha = 0.5; // add transparency so that graphEditor (node and segment is less obvious)
  graphEditor.display();
  stopEditor.display();

  requestAnimationFrame(updateCanvas);
}

// button event handlers

function setMode(mode) {
  disableEditors();
  switch (mode) {
    case "graph":
      graphBtn.style.filter = "none";
      graphBtn.style.background = "#fff";
      graphEditor.enable();
      break;
    case "stop":
      stopBtn.style.filter = "none";
      stopBtn.style.background = "#fff";
      stopEditor.enable();
      break;

    default:
      return null;
  }
}

function disableEditors() {
  graphBtn.style.filter = "grayscale(80%)";
  graphBtn.style.background = "#888";
  graphEditor.disable();
  stopBtn.style.background = "#888";
  stopBtn.style.filter = "grayscale(80%)";
  stopEditor.disable();
}
function dispose() {
  graphEditor.dispose();
  localStorage.removeItem("graph");
}
function save() {
  localStorage.setItem("graph", JSON.stringify(graph));
}
saveBtn.addEventListener("click", save);
deleteBtn.addEventListener("click", dispose);
graphBtn.addEventListener("click", () => setMode("graph"));
stopBtn.addEventListener("click", () => setMode("stop"));
