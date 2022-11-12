import React, { useState } from "react";
import { useQuery } from "react-query";
import PT from "prop-types";

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

  const [users, setUsers] = useState("");

  const { isLoading, error, data } = useQuery("idk", async () => {
    const data = await fetch("http://localhost:8080/users").then((response) =>
      response.json()
    );
    console.log(data);
  });

  return <div className={cn.root}>{users}</div>;
};

GameLobby.propTypes = propTypes;
GameLobby.defaultProps = defaultProps;
export default GameLobby;
