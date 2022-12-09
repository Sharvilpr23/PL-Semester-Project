import React from "react";
import PT from "prop-types";
import { Route, Routes } from "react-router-dom";
import ExampleView from "../GameViews/ExampleView";
import ChatRoom from "../GameViews/ChatRoom";
import Home from "../GameViews/Home";
import Asteroids from "../GameViews/Asteroids";

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
    root: `px-4 py-8 ${className}`,
  };

  return (
    <div className={cn.root}>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/first" element={<ChatRoom />} />
        <Route exact path="/second" element={<ExampleView />} />
        <Route exact path="/third" element={<ExampleView />} />
        <Route exact path="/asteroids" element={<Asteroids />} />
      </Routes>
    </div>
  );
};

AppMain.propTypes = propTypes;
AppMain.defaultProps = defaultProps;
export default AppMain;
