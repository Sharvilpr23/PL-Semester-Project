import { isNotNil } from "ramda-adjunct";
import { createContext, useContext, useEffect, useState } from "react";
import { useGameData } from "../DataHook/GameDataHook";

const ConnectionContext = createContext();

export function useConnectionContext() {
  return useContext(ConnectionContext);
}

const ConnectionProvider = ({ children }) => {
  const { data, isOpen, isError, error, sendData } = useGameData("server");
  const [clientId, setClientId] = useState(-1);
  useEffect(() => {
    if (isNotNil(data?.YourId)) {
      setClientId(data?.YourId);
    }
  }, [data]);

  return (
    <ConnectionContext.Provider
      value={{ data, isOpen, isError, error, sendData, clientId }}
    >
      {children}
    </ConnectionContext.Provider>
  );
};

export default ConnectionProvider;
