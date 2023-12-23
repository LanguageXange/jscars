// phase one - write simple functions and interfaces ( buttons )

const myCanvas = document.getElementById("mycanvas");

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

const graph = new Graph(points, segments);
graph.draw(ctx);

function redrawCanvas() {
  ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);
  graph.draw(ctx);
}

function removeAll() {
  graph.dispose();
  redrawCanvas();
}

function addRandomPoint() {
  let x = Math.random() * myCanvas.width;
  let y = Math.random() * myCanvas.height;
  const result = graph.tryAddPoint(new Point(x, y));
  // refresh canvas
  redrawCanvas();
}

function addRandomSegment() {
  const index1 = Math.floor(Math.random() * graph.points.length);
  const index2 = Math.floor(Math.random() * graph.points.length);
  const success = graph.tryAddSegment(
    new Segment(graph.points[index1], graph.points[index2])
  );
  //console.log(graph.segments);
  redrawCanvas();
}

// remove segment
function removeRandomSegment() {
  let segLength = graph.segments.length;
  if (segLength) {
    const index = Math.floor(Math.random() * segLength);
    graph.removeSegment(graph.segments[index]);
    redrawCanvas();
  } else {
    console.log("nothing to remove");
    return;
  }
}
// remove pint
function removeRandomPoint() {
  let pointLen = graph.points.length;
  if (pointLen) {
    const index = Math.floor(Math.random() * pointLen);
    graph.removePoint(graph.points[index]);
    redrawCanvas();
  } else {
    console.log("no point to remove");
  }
}
