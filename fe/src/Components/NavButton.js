import React from "react";
import PT from "prop-types";
import { Link } from "react-router-dom";

//*****************************************************************************
// Interface
//*****************************************************************************

const propTypes = {
  linkto: PT.string,
  text: PT.string,
  className: PT.string, // className string applied to root of this component
};

const defaultProps = {
  linkto: "/",
  text: "",
  className: "",
};

//*****************************************************************************
// Components
//*****************************************************************************

const NavButton = ({ linkto, text, className }) => {
  const cn = {
    root: `bg-zinc-700 text-white rounded-sm ${className}`,
  };

  return (
    <Link to={linkto} className={cn.root}>
      {text}
    </Link>
  );
};

NavButton.propTypes = propTypes;
NavButton.defaultProps = defaultProps;
export default NavButton;
