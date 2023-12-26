// step 2 - using graphEditor & viewport
console.log("script 2");

const myCanvas = document.getElementById("mycanvas");
const saveBtn = document.getElementById("save-btn");
const deleteBtn = document.getElementById("delete-btn");
const graphBtn = document.getElementById("graph-btn");
const stopBtn = document.getElementById("stop-btn");
const crossingBtn = document.getElementById("crossing-btn");
const startBtn = document.getElementById("start-btn");
const fileInput = document.getElementById("fileInput");

myCanvas.width = 800;
myCanvas.height = 800;
const ctx = myCanvas.getContext("2d");

const worldString = localStorage.getItem("world"); // if no localstorage it would be null
const worldInfo = worldString ? JSON.parse(worldString) : null;

let world = worldInfo ? World.load(worldInfo) : new World(new Graph());

const graph = world.graph;

const logger = new Logger(myCanvas, document.getElementById("action")); // for logging

const viewport = new Viewport(myCanvas, world.zoom, world.offset, logger);

// grouping editors into tools object
const tools = {
  graph: { button: graphBtn, editor: new GraphEditor(viewport, graph, logger) },
  stop: { button: stopBtn, editor: new StopEditor(viewport, world) },
  crossing: {
    button: crossingBtn,
    editor: new CrossingEditor(viewport, world),
  },
  start: {
    button: startBtn,
    editor: new StartEditor(viewport, world),
  },
};

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
  ctx.globalAlpha = 0.5; // add transparency so that graphEditor & stopEditor (node and segment is less obvious)

  for (const tool of Object.values(tools)) {
    tool.editor.display();
  }

  requestAnimationFrame(updateCanvas);
}

// BUTTON EVENT HANDLERS

function setMode(mode) {
  disableEditors();
  tools[mode].button.style.filter = "none";
  tools[mode].button.style.background = "#fff";
  tools[mode].editor.enable();
}

function disableEditors() {
  for (const tool of Object.values(tools)) {
    tool.button.style.filter = "grayscale(80%)";
    tool.button.style.background = "#888";
    tool.editor.disable();
  }
}
function dispose() {
  tools["graph"].editor.dispose();
  localStorage.removeItem("graph");
  world.markings.length = 0; // delete road markings
}
function save() {
  // saving zoom level
  world.zoom = viewport.zoom;
  world.offset = viewport.offset;

  const element = document.createElement("a");
  element.setAttribute(
    "href",
    "data:application/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(world))
  );

  const fileName = "name.world";
  element.setAttribute("download", fileName);
  element.click();
  localStorage.setItem("world", JSON.stringify(world));
}

function loadFile(event) {
  const file = event.target.files[0];
  if (!file) {
    alert("no file selected");
    return;
  }

  const reader = new FileReader();
  reader.readAsText(file);
  reader.onload = (e) => {
    const fileContent = e.target.result;
    const jsonData = JSON.parse(fileContent);
    world = World.load(jsonData);
    localStorage.setItem("world", JSON.stringify(world));
    location.reload(); // reload the page
  };
}
fileInput.addEventListener("change", loadFile);
saveBtn.addEventListener("click", save);
deleteBtn.addEventListener("click", dispose);

// set mode buttons
for (let [toolName, tool] of Object.entries(tools)) {
  tool.button.addEventListener("click", () => setMode(toolName));
}
