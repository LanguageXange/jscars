class StopEditor extends MarkingEditor {
  constructor(viewport, world) {
    super(viewport, world, world.laneGuides);
  }

  createMarking(centerPoint, directionVector) {
    return new StopSign(
      centerPoint,
      directionVector,
      world.roadWidth / 2,
      world.roadWidth / 2
    );
  }
}
