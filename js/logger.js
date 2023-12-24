console.log("logger!");

class Logger {
  constructor(canvas, dom) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.dom = dom;
  }

  log(action) {
    this.dom.textContent = `User performs ${action}`;
  }
}
