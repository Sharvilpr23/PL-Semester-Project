export const drawPoints = (context, offset, points) => {
  context.fillStyle = "#FFF";
  context.beginPath();
  context.moveTo(offset.X + points[0][0], offset.Y + points[0][1]);
  points.forEach((point) => {
    context.lineTo(offset.X + point[0], offset.Y + point[1]);
  });
  context.lineTo(
    // add in last line
    offset.X + points[0][0],
    offset.Y + points[0][1]
  );
  context.strokeStyle = "#FFF";
  context.stroke();
};

const checkCollision = (obj1, obj2) => {
  const { X: obj1X, Y: obj1Y } = obj1.Position;
  const { X: obj2X, Y: obj2Y } = obj2.Position;
  const distance = Math.sqrt(
    (obj1X - obj2X) * (obj1X - obj2X) + (obj1Y - obj2Y) * (obj1Y - obj2Y)
  );
  return distance <= obj1.Radius + obj2.Radius;
};

export const dpDt = (object) => {
  object.Position.X += object.Velocity.X;
  object.Position.Y += object.Velocity.Y;
};

export const checkBorder = (object, dimensions) => {
  return (
    object.Position.X > dimensions[0] ||
    object.Position.Y > dimensions[1] ||
    object.Position.X < 0 ||
    object.Position.Y < 0
  );
};

export const borderMove = (object, dimensions) => {
  if (object.Position.X > dimensions[0]) {
    object.Position.X = 0;
  } else if (object.Position.X < 0) {
    object.Position.X = dimensions[0];
  }
  if (object.Position.Y > dimensions[1]) {
    object.Position.Y = 0;
  } else if (object.Position.Y < 0) {
    object.Position.Y = dimensions[1];
  }
};

export const checkCollisions = (
  object,
  projectiles,
  rocks,
  players,
  typeBlackList = [],
  idBlackList = []
) => {
  const hits = [];
  if (!typeBlackList.includes("projectiles")) {
    projectiles.forEach((projectile) => {
      if (checkCollision(object, projectile)) {
        return projectile;
      }
    });
  }
  if (!typeBlackList.includes("rocks")) {
    rocks.forEach((rock) => {
      if (checkCollision(object, rock)) {
        hits.push({ ...rock, type: "rock" });
      }
    });
  }
  if (!typeBlackList.includes("players")) {
    players.forEach((player) => {
      if (!idBlackList.includes(player.Uid) && checkCollision(object, player)) {
        hits.push({ ...player, type: "player" });
      }
    });
  }
  return hits[0];
};
