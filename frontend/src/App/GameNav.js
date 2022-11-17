import React from "react";
import PT from "prop-types";
import NavButton from "../Components/NavButton";

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

const GameNav = ({ className }) => {
  const cn = {
    root: `py-4 ${className}`,
    title: "ml-4 text-4xl",
    gameLink: "p-2 bg-zinc-500",
    games: "mt-4 flex flex-col gap-2 ml-8",
  };

  const games = [
    ["Chat room", "/first"],
    ["Second Game", "/second"],
    ["Third Game", "/third"],
  ];

  return (
    <div className={cn.root}>
      <div className={cn.title}>Games</div>
      <div className={cn.games}>
        {games.map((game, idx) => {
          return (
            <NavButton
              key={idx}
              className={cn.gameLink}
              linkto={game[1]}
              text={game[0]}
            />
          );
        })}
      </div>
    </div>
  );
};

GameNav.propTypes = propTypes;
GameNav.defaultProps = defaultProps;
export default GameNav;
