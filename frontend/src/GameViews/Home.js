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

const Home = ({ className }) => {
  const cn = {
    root: `text-4xl ${className}`,
  };

  return <div className={cn.root}>Welcome to our Go Project</div>;
};

Home.propTypes = propTypes;
Home.defaultProps = defaultProps;
export default Home;
