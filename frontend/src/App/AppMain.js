import React from "react";
import PT from "prop-types";
import { Route, Routes } from "react-router-dom";
import ExampleView from "../GameViews/ExampleView";
import { useGameData } from "../DataHook/GameDataHook";
import ChatRoom from "../GameViews/ChatRoom";
import ConnectionProvider from "./AppContext";

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

const AppMain = ({ className }) => {
  const cn = {
    root: ` ${className}`,
  };

  return (
    <div className={cn.root}>
      <Routes>
        <Route exact path="/first" element={<ChatRoom />} />
        <Route exact path="/second" element={<ExampleView />} />
        <Route exact path="/third" element={<ExampleView />} />
      </Routes>
    </div>
  );
};

AppMain.propTypes = propTypes;
AppMain.defaultProps = defaultProps;
export default AppMain;
