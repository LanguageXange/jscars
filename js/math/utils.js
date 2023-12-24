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

function scale(p, scaler) {
  return new Point(p.x * scaler, p.y * scaler);
}
