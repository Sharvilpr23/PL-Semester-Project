import { createContext, useContext } from "react";
import { useGameData } from "../DataHook/GameDataHook";

const ConnectionContext = createContext();

export function useConnectionContext() {
  return useContext(ConnectionContext);
}

const ConnectionProvider = ({ children }) => {
  const { data, isOpen, isError, error, sendData } = useGameData("server");

  return (
    <ConnectionContext.Provider
      value={{ data, isOpen, isError, error, sendData }}
    >
      {children}
    </ConnectionContext.Provider>
  );
};

export default ConnectionProvider;
