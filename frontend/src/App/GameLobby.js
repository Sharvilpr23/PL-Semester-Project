import React, { useState } from "react";
import { useQuery } from "react-query";
import PT from "prop-types";
import { useGameData } from "../DataHook/GameDataHook";

//*****************************************************************************
// Interface
//*****************************************************************************

const propTypes = {
  className: PT.string,
};

const defaultProps = {
  className: "",
};

//*****************************************************************************
// Components
//*****************************************************************************

const GameLobby = ({ className }) => {
  const cn = {
    root: ` ${className}`,
  };
  const [userName, setUserName] = useState("Anonymous");
  const { data, isOpen, isError, error, sendData } = useGameData("server");

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!isOpen || isError) return;

    sendData(JSON.stringify({ Name: userName }));
  };

  return (
    <div className={cn.root}>
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
      {((data || "").split("\n") || []).map((user) => (
        <p>{user}</p>
      ))}
    </div>
  );
};

GameLobby.propTypes = propTypes;
GameLobby.defaultProps = defaultProps;
export default GameLobby;
