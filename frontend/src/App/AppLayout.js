import React from "react";
import PT from "prop-types";
import AppMain from "./AppMain";
import GameNav from "./GameNav";
import ServerLobby from "./GameLobby";

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

const AppLayout = ({ className }) => {
  const cn = {
    root: `flex min-h-0 h-screen w-screen ${className}`,
    sidebar: "w-1/6 h-full bg-zinc-400",
    gamenav: "",
    lobby: "",
    view: "w-5/6 h-full min-h-0",
  };

  return (
    <div className={cn.root}>
      <div className={cn.sidebar}>
        <GameNav className={cn.gamenav} />
        <ServerLobby className={cn.lobby} />
      </div>
      <AppMain className={cn.view} />
    </div>
  );
};

AppLayout.propTypes = propTypes;
AppLayout.defaultProps = defaultProps;
export default AppLayout;
