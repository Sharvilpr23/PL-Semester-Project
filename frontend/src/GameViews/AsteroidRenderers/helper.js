import { isNotNilOrEmpty } from "ramda-adjunct";
import { useCallback, useEffect, useRef } from "react";

export const drawPoints = (context, offset, points, drawScalar) => {
  context.fillStyle = "#FFF";
  context.beginPath();
  if (isNotNilOrEmpty(points)) {
    context.moveTo(
      offset.X * drawScalar + points[0][0] * drawScalar,
      offset.Y * drawScalar + points[0][1] * drawScalar
    );
    points.forEach((point) => {
      context.lineTo(
        offset.X * drawScalar + point[0] * drawScalar,
        offset.Y * drawScalar + point[1] * drawScalar
      );
    });
    context.lineTo(
      // add in last line
      offset.X * drawScalar + points[0][0] * drawScalar,
      offset.Y * drawScalar + points[0][1] * drawScalar
    );
  }
  context.strokeStyle = "#FFF";
  context.stroke();
};

const checkCollision = (obj1, obj2) => {
  const { X: obj1X, Y: obj1Y } = obj1.Position;
  const { X: obj2X, Y: obj2Y } = obj2.Position;
  const distance =
    (obj1X - obj2X) * (obj1X - obj2X) + (obj1Y - obj2Y) * (obj1Y - obj2Y);
  const twoRad = obj1.Radius + obj2.Radius;
  return distance <= twoRad * twoRad; // distance^2 < twoRad^2 === distance < twoRad
};

export const dpDt = (object, deltaTime) => {
  object.Position.X += object.Velocity.X * deltaTime;
  object.Position.Y += object.Velocity.Y * deltaTime;
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

// https://css-tricks.com/using-requestanimationframe-with-react-hooks/
export const useAnimationFrame = (callback) => {
  // Use useRef for mutable variables that we want to persist
  // without triggering a re-render on their change
  const requestRef = useRef();
  const previousTimeRef = useRef();

  const animate = useCallback(
    (time) => {
      if (previousTimeRef.current !== undefined) {
        const deltaTime = time - previousTimeRef.current;
        callback(deltaTime);
      }
      previousTimeRef.current = time;
      requestRef.current = requestAnimationFrame(animate);
    },
    [callback]
  );

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [animate]); // Make sure the effect runs only once
};
