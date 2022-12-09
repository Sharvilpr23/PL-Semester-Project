var id_count = 1;
export const generateAsteroid = (startX, startY, radius = 8) => {
  return {
    Position: { X: startX, Y: startY },
    Radius: radius,
    ObjectId: id_count++,
    Velocity: {
      X: Math.random() / 2 - 0.5,
      Y: Math.random() / 2 - 0.5,
    },
  };
};

export const generateAsteroidPoints = (asteroid, drawScalar) => {
  const numPoints = Math.floor(Math.random() * 10) + 10; // 5 - 10 points
  const interval = 2 * Math.PI;
  const stepSize = interval / numPoints;
  const points = [];
  for (var angle = 0; angle < interval; angle += stepSize) {
    const rOffset = -Math.ceil(Math.random() * drawScalar);
    points.push([
      (asteroid.Radius * drawScalar + rOffset) * Math.cos(angle),
      (asteroid.Radius * drawScalar + rOffset) * Math.sin(angle),
    ]);
  }
  return points;
};
