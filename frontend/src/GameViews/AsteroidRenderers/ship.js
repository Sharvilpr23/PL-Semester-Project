// https://stackoverflow.com/questions/38238282/how-to-rotate-a-triangle-without-rotating-the-entire-canvas
export const drawShip = (
  ctx,
  centerX,
  centerY,
  size,
  bodyColor,
  headColor,
  radians
) => {
  ctx.beginPath();
  ctx.lineWidth = 1;
  ctx.moveTo(
    centerX + size * Math.cos(radians),
    centerY + size * Math.sin(radians)
  );
  ctx.lineTo(
    centerX + size * Math.cos((2 * Math.PI) / 3 + radians),
    centerY + size * Math.sin((2 * Math.PI) / 3 + radians)
  );
  ctx.lineTo(
    centerX + size * Math.cos((4 * Math.PI) / 3 + radians),
    centerY + size * Math.sin((4 * Math.PI) / 3 + radians)
  );
  ctx.closePath();
  ctx.fillStyle = bodyColor;
  ctx.fill();
  // draw "GUN"
  ctx.lineWidth = 3;
  ctx.moveTo(
    centerX + size * Math.cos(radians),
    centerY + size * Math.sin(radians)
  );
  ctx.lineTo(
    centerX + 1.5 * size * Math.cos(radians),
    centerY + 1.5 * size * Math.sin(radians)
  );
  ctx.strokeStyle = headColor;
  ctx.stroke();
};

export const applyAcceleration = (PlayerShip, velocity) => {
  const maxVelocity = 1.5;

  if (velocity === 1) {
    // smooth acceleration, not that it's noticable but it's there
    const maxX = maxVelocity * Math.cos(PlayerShip.Angle);
    const maxY = maxVelocity * Math.sin(PlayerShip.Angle);

    PlayerShip.Velocity.X += (1 / 4) * (maxX - PlayerShip.Velocity.X);
    PlayerShip.Velocity.Y += (1 / 4) * (maxY - PlayerShip.Velocity.Y);
  } else if (velocity === -1) {
    PlayerShip.Velocity.X *= 0.7;
    PlayerShip.Velocity.Y *= 0.7;
  } else {
    PlayerShip.Velocity.X *= 0.93;
    PlayerShip.Velocity.Y *= 0.93;
  }
};
