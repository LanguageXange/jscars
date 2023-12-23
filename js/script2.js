// phase 2 - using graphEditor
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
const graphEditor = new GraphEditor(myCanvas, graph);

updateCanvas();

function updateCanvas() {
  //console.log("update canvas!");
  ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);
  graphEditor.display();
  requestAnimationFrame(updateCanvas);
}
