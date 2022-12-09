import React, { useEffect, useRef, useState } from "react";
import PT from "prop-types";
import { useConnectionContext } from "../App/AppContext";
import { isNotNil, isNotNilOrEmpty, isObject } from "ramda-adjunct";
import {
  generateAsteroid,
  generateAsteroidPoints,
} from "./AsteroidRenderers/asteroid";
import {
  drawProjectile,
  generateProjectile,
} from "./AsteroidRenderers/projectile";
import {
  borderMove,
  checkBorder,
  checkCollisions,
  dpDt,
  drawPoints,
  useAnimationFrame,
} from "./AsteroidRenderers/helper";
import { applyAcceleration, drawShip } from "./AsteroidRenderers/ship";

//*****************************************************************************
// Interface
//*****************************************************************************

const propTypes = {
  className: PT.string, // className string applied to root of this component
};

const defaultProps = {
  className: "",
};

//*****************************************************************************
// Components
//*****************************************************************************

const getCurrentPlayer = (players, playerId) => {
  return players.filter((player) => player?.Uid === playerId)[0];
};

const Asteroids = (props) => {
  const { isOpen, data, sendData, clientId } = useConnectionContext();
  const canvasRef = useRef(null);
  const [context, setContext] = useState();
  // const [asteroids, setAsteroids] = useState([]);
  const [projectiles, setProjectiles] = useState([]);
  const [lastShot, setLastShot] = useState(0);
  const [players, setPlayers] = useState([
    // {
    //   // test player ship
    //   PlayerShip: {
    //     Position: {
    //       X: 5,
    //       Y: 5,
    //     },
    //     Radius: 1,
    //     Angle: (-7 * Math.PI) / 4,
    //     Velocity: { X: 0, Y: 0 },
    //     ProjectileLimit: 3,
    //   },
    //   Uid: -1,
    // },
  ]);
  const [angularVelocity, setAngularVelocity] = useState(0);
  const [playerVelocity, setPlayerVelocity] = useState(0);
  const [dimensions, setDimensions] = useState([160, 90]);
  const drawScalar = 7;

  useEffect(() => {
    // TELL LOBBY WE ENTERED THE GAME
    if (isOpen) {
      sendData(JSON.stringify({ Name: "", GameId: 4, GameData: "" }));
    }
  }, [sendData, isOpen]);

  useEffect(() => {
    if (isNotNilOrEmpty(data?.Players)) {
      setPlayers(data?.Players);
    }
    // if (isNotNilOrEmpty(data?.Rocks)) {
    //   setAsteroids(
    //     (data?.Rocks || []).map((rock) => {
    //       return { points: generateAsteroidPoints(rock, drawScalar), ...rock };
    //     })
    //   );
    // } else {
    //   setAsteroids(
    //     [
    //       generateAsteroid(
    //         Math.floor(Math.random() * dimensions[0]),
    //         Math.floor(Math.random() * dimensions[1])
    //       ),
    //       generateAsteroid(
    //         Math.floor(Math.random() * dimensions[0]),
    //         Math.floor(Math.random() * dimensions[1])
    //       ),
    //     ].map((rock) => {
    //       return { points: generateAsteroidPoints(rock, drawScalar), ...rock };
    //     })
    //   );
    // }
    if (isNotNilOrEmpty(data?.GameWidth) && isNotNilOrEmpty(data?.GameHeight)) {
      setDimensions([data.GameWidth, data.GameHeight]);
    }
  }, [
    setPlayers,
    setDimensions,
    dimensions,
    data.GameHeight,
    data.GameWidth,
    data?.Players,
  ]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    setContext(ctx);
    ctx.fillStyle = "#000000";
    ctx.fillRect(
      0,
      0,
      ctx.canvas.width * drawScalar,
      ctx.canvas.height * drawScalar
    );
  }, [setContext]);

  useAnimationFrame((deltaTime) => {
    deltaTime = (deltaTime / 1000) * 24; // velocities were developed assuming ~24 fps, so after implementing deltaTime this is what feels normal

    // const deltaTime = 1;
    if (isNotNil(canvasRef) && isNotNil(context)) {
      canvasRef.current.width = dimensions[0] * drawScalar;
      canvasRef.current.height = dimensions[1] * drawScalar;
      context.fillStyle = "#000000";
      context.fillRect(
        0,
        0,
        dimensions[0] * drawScalar,
        dimensions[1] * drawScalar
      );

      if (isNotNilOrEmpty(projectiles)) {
        projectiles.forEach((projectile) =>
          drawProjectile(context, projectile, drawScalar)
        );
      }
      if (isNotNilOrEmpty(data?.Rocks)) {
        data?.Rocks.forEach((asteroid) => {
          drawPoints(
            context,
            {
              X: asteroid?.Position?.X,
              Y: asteroid?.Position?.Y,
            },
            asteroid?.points || [],
            drawScalar
          );
        });
      }

      if (isNotNilOrEmpty(players)) {
        players.forEach((player) => {
          var color = "#F00";
          if (player.Uid === clientId) {
            color = "#0FF";
          }
          drawShip(
            context,
            player?.PlayerShip?.Position?.X * drawScalar,
            player?.PlayerShip?.Position?.Y * drawScalar,
            player?.PlayerShip?.Radius * drawScalar,
            color,
            color,
            player?.PlayerShip?.Angle
          );
        });
      }
    }
    // PHYSICS LOOP
    players.forEach((player) => {
      dpDt(player.PlayerShip, deltaTime);
      player.PlayerShip.Angle += (angularVelocity * deltaTime) / (Math.PI * 2); // maybe can do 1
      // turn every second? Depends on fps. Should multiply by some kind of delta
      // time variable, like back when I did unity
      borderMove(player.PlayerShip, dimensions);
      applyAcceleration(player.PlayerShip, playerVelocity);
      sendData(
        JSON.stringify({
          Name: "",
          GameId: 0,
          GameData: JSON.stringify(player),
        })
      );
    });

    // data?.rocks?.forEach((rock) => {
    //   dpDt(rock, deltaTime);
    //   borderMove(rock, dimensions);
    // });

    // const projectilesToDelete = [];
    // projectiles.forEach((projectile) => {
    //   if (checkBorder(projectile, dimensions)) {
    //     projectilesToDelete.push(projectile.ObjectId);
    //   } else {
    //     dpDt(projectile, deltaTime);
    //     const collision = checkCollisions(
    //       projectile,
    //       projectiles,
    //       asteroids,
    //       players,
    //       ["projectiles"],
    //       [projectile.Owner]
    //     );
    //     if (isObject(collision)) {
    //       // delete this projectile and what it hit
    //       console.log("COLLISION");
    //       projectilesToDelete.push(projectile.ObjectId);
    //       if (collision?.type === "rock") {
    //         setAsteroids((current) => {
    //           const next = current.filter(
    //             (rock) =>
    //               rock?.ObjectId !== collision?.ObjectId && isObject(rock)
    //           ); // remove collided rock
    //           // push two rocks of half size, unless size < 2 or so
    //           if (collision.Radius <= 2) {
    //             return next;
    //           }
    //           const newRocks = [
    //             generateAsteroid(
    //               collision.Position.X,
    //               collision.Position.Y,
    //               collision.Radius / 2
    //             ),
    //             generateAsteroid(
    //               collision.Position.X,
    //               collision.Position.Y,
    //               collision.Radius / 2
    //             ),
    //           ].map((rock) => {
    //             return {
    //               points: generateAsteroidPoints(rock, drawScalar),
    //               ...rock,
    //             };
    //           });
    //           next.push(newRocks[0]);
    //           next.push(newRocks[1]);
    //           return next;
    //         });
    //       }
    //     }
    //   }
    // });
    // setProjectiles((current) => {
    //   const res = current.filter((projectile) => {
    //     const marked = projectilesToDelete.includes(projectile.ObjectId);
    //     if (marked)
    //       getCurrentPlayer(
    //         players,
    //         projectile.Owner
    //       ).PlayerShip.ProjectileLimit += 1;
    //     return !marked; // per filter
    //   });
    //   return res;
    // });
  });

  const keyUp = ({ key }) => {
    if (key === "a" && angularVelocity === -1) {
      setAngularVelocity(0);
    }
    if (key === "d" && angularVelocity === 1) {
      setAngularVelocity(0);
    }
    if (key === "w" && playerVelocity === 1) {
      setPlayerVelocity(0);
    }
    if (key === "s" && playerVelocity === -1) {
      setPlayerVelocity(0);
    }
  };

  const keyDown = ({ key }) => {
    if (key === "a") {
      setAngularVelocity(-1);
    } else if (key === "d") {
      setAngularVelocity(1);
    } else if (key === "w") {
      setPlayerVelocity(1);
    } else if (key === "s") {
      setPlayerVelocity(-1);
    } else if (key === " ") {
      const thePlayer = getCurrentPlayer(players, clientId);
      const coolDown = 0.5;
      const now = new Date();
      if (isNotNil(thePlayer) && (now - lastShot) / 1000 > coolDown) {
        setLastShot(new Date());
        thePlayer.PlayerShip.ProjectileLimit -= 1;
        setProjectiles((current) => {
          current.push(
            generateProjectile({
              Position: { ...thePlayer.PlayerShip.Position },
              Angle: thePlayer.PlayerShip.Angle,
              Owner: thePlayer.Uid,
            })
          );
          return current;
        });
      }
    }
  };
  return (
    <div
      className="w-fit h-fit border-4 border-red-400 focus:border-blue-400" // goofy way to show user they can use controls lol
      tabIndex="0"
      autoFocus
      onKeyUp={keyUp}
      onKeyDown={keyDown}
    >
      <canvas ref={canvasRef} />
    </div>
  );
};

Asteroids.propTypes = propTypes;
Asteroids.defaultProps = defaultProps;
export default Asteroids;
