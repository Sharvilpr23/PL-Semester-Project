import React from "react";
import PT from "prop-types";

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

const ExampleView = ({ className }) => {
  const cn = {
    root: `text-4xl h-full w-full bg-red-800 text-purple ${className}`,
  };

  return <div className={cn.root}>YOUR GAME HERE</div>;
};

ExampleView.propTypes = propTypes;
ExampleView.defaultProps = defaultProps;
export default ExampleView;
