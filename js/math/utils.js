console.log("utils!");

function calculateDistance(p1, p2) {
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/hypot
  let xDiff = Math.abs(p1.x - p2.x);
  let yDiff = Math.abs(p1.y - p2.y);
  return Math.hypot(xDiff, yDiff);
}

// for graphEditor.js
function getNearestPoint(currentPoint, pointsArr, threshold = Infinity) {
  // calculate the min distance
  let minDist = Infinity;
  let nearestPoint = null;

  for (const point of pointsArr) {
    const dist = calculateDistance(currentPoint, point);
    if (dist < minDist && dist <= threshold) {
      minDist = dist;
      nearestPoint = point;
    }
  }

  return nearestPoint;
}

// for viewport.js

function addOffset(p1, p2) {
  return new Point(p1.x + p2.x, p1.y + p2.y);
}

function subtractOffset(p1, p2) {
  return new Point(p1.x - p2.x, p1.y - p2.y);
}

function dot(p1, p2) {
  return p1.x * p2.x + p1.y * p2.y;
}

function scale(p, scaler) {
  return new Point(p.x * scaler, p.y * scaler);
}
function normalize(p) {
  return scale(p, 1 / magnitude(p));
}
function magnitude(p) {
  return Math.hypot(p.x, p.y);
}
function average(p1, p2) {
  return new Point((p1.x + p2.x) / 2, (p1.y + p2.y) / 2);
}

// for envelope.js

function translate(point, angle, offset) {
  return new Point(
    point.x + Math.cos(angle) * offset,
    point.y + Math.sin(angle) * offset
  );
}

function getAngle(p) {
  return Math.atan2(p.y, p.x);
}

// formula explained https://www.youtube.com/watch?v=fHOLQJo0FjQ
function getIntersection(A, B, C, D) {
  const tTop = (D.x - C.x) * (A.y - C.y) - (D.y - C.y) * (A.x - C.x);
  const uTop = (C.y - A.y) * (A.x - B.x) - (C.x - A.x) * (A.y - B.y);
  const bottom = (D.y - C.y) * (B.x - A.x) - (D.x - C.x) * (B.y - A.y);

  // checking if bottom!==0 won't work sometimes due to floating point issue
  let eps = 0.0001;
  if (Math.abs(bottom) > eps) {
    const t = tTop / bottom;
    const u = uTop / bottom;
    if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
      return {
        x: lerp(A.x, B.x, t),
        y: lerp(A.y, B.y, t),
        offset: t,
      };
    }
  }

  return null;
}

// linear interpolation
function lerp(a, b, t) {
  return a + (b - a) * t;
}

function lerp2D(A, B, t) {
  return new Point(lerp(A.x, B.x, t), lerp(A.y, B.y, t));
}

function getRandomColor() {
  const hue = 290 + Math.random() * 260;
  return "hsl(" + hue + ", 100%, 60%)";
}
