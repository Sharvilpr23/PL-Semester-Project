import React from "react";
import PT from "prop-types";
import AppMain from "./AppMain";
import GameNav from "./GameNav";

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
    root: `flex ${className}`,
    navBar: "w-1/6 h-full bg-zinc-400",
    view: "w-5/6 h-full",
  };

  return (
    <div className={cn.root}>
      <GameNav className={cn.navBar} />
      <AppMain className={cn.view} />
    </div>
  );
};

AppLayout.propTypes = propTypes;
AppLayout.defaultProps = defaultProps;
export default AppLayout;
