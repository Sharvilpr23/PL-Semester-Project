import React, { useState } from "react";
import PT from "prop-types";
import { useGameData } from "../DataHook/GameDataHook";

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
    root: ` ${className}`,
    title: "text-4xl",
  };

  const [userName, setUserName] = useState("");
  const { data, sendData, isError, error } = useGameData("ws");

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!isError) {
      sendData(JSON.stringify({ Name: userName }));
    }
  };

  return (
    <div className={cn.root}>
      <div className={cn.title}>Game title!</div>
      {isError && <div>Connection error: {error}</div>}
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input
            onChange={({ target }) => setUserName(target.value)}
            type="text"
            name="name"
            className="border-2"
            value={userName}
          />
        </label>
      </form>
      <div>{String(Object.values(data || {}))}</div>
    </div>
  );
};

ExampleView.propTypes = propTypes;
ExampleView.defaultProps = defaultProps;
export default ExampleView;
