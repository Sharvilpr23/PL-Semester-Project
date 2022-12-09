export const drawProjectile = (context, projectile, drawScalar) => {
  context.fillStyle = "#FFF";
  context.beginPath();
  context.moveTo(
    projectile.Position.X * drawScalar,
    projectile.Position.Y * drawScalar
  );
  context.lineTo(
    projectile.Position.X * drawScalar +
      Math.cos(projectile.Angle) * projectile.Radius * drawScalar,
    projectile.Position.Y * drawScalar +
      Math.sin(projectile.Angle) * projectile.Radius * drawScalar
  );
  context.strokeStyle = "#FFF";
  context.stroke();
};

var id_count = 1;

export const generateProjectile = ({ Position, Angle, Owner }) => {
  const v = 2;
  return {
    ...{
      Position,
      Radius: 1,
      Velocity: {
        X: Math.cos(Angle) * v,
        Y: Math.sin(Angle) * v,
      },
      Angle,
      ObjectId: id_count++,
      Owner,
    },
  };
};
