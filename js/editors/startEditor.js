class StartEditor extends MarkingEditor {
  constructor(viewport, world) {
    super(viewport, world, world.laneGuides);
  }

  createMarking(centerPoint, directionVector) {
    return new Start(
      centerPoint,
      directionVector,
      world.roadWidth / 2,
      world.roadWidth / 2
    );
  }
}
