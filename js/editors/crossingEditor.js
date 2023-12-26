class CrossingEditor extends MarkingEditor {
  constructor(viewport, world) {
    super(viewport, world, world.graph.segments);
  }

  createMarking(centerPoint, directionVector) {
    return new Crossing(
      centerPoint,
      directionVector,
      world.roadWidth,
      world.roadWidth / 2
    );
  }
}
