import React from "react";
import PT from "prop-types";
import NavButton from "../Components/NavButton";
import { Link, useLocation } from "react-router-dom";

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
  const { pathname } = useLocation();

  const linkBase = "p-2 rounded-l-md";
  const cn = {
    root: `py-4 ${className}`,
    title: "ml-4 text-4xl",
    gameLink: `${linkBase} zinc-500`,
    currentLink: `${linkBase} bg-blue-200 text-black`,
    games: "mt-4 flex flex-col gap-2 ml-8",
  };

  const games = [
    ["Chat Room", "/first"],
    ["Second Game", "/second"],
    ["Third Game", "/third"],
    ["Space rocks", "/asteroids"],
  ];

  return (
    <div className={cn.root}>
      <Link className={cn.title} to="/">
        Games
      </Link>
      <div className={cn.games}>
        {games.map((game, idx) => {
          return (
            <NavButton
              key={idx}
              className={pathname === game[1] ? cn.currentLink : cn.gameLink}
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
