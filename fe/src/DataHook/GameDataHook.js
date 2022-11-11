import { noop } from "ramda-adjunct";
import { useState, useRef, useEffect } from "react";

export const useGameData = () => {
  const webSocket = useRef(null);
  const [error, setError] = useState(undefined);
  const [isError, setIsError] = useState(false);
  const [data, setData] = useState(undefined);
  const [sendData, setSendData] = useState(noop);
  const _url = "ws://localhost:8080/ws";

  useEffect(() => {
    try {
      const ws = new WebSocket(_url);
      webSocket.current = ws;
      setSendData(() => (data) => ws.send(data));
      setIsError(false);
    } catch (err) {
      setIsError(true); // Not sure when this is reached, but even if it failed to connect, it's not here
      return;
    }

    webSocket.current.onmessage = ({ data }) => {
      setData(JSON.parse(data));

      console.debug(`Data recieved`, data);
    };

    webSocket.current.onopen = (event) => {
      console.debug(`Web Sockets connection opened`);
    };

    webSocket.current.onclose = (event) => {
      console.debug(`Web Sockets connection closed`);
    };

    webSocket.current.onerror = (e) => {
      console.error("Websocket error", e.message);
      setIsError(true);
      setError(e.message || "Unknown error, possibly failed to connect");
    };

    // closes websocket when the component using this hook
    // Per react, putting this in a useEffect and having this is similar to having
    // a componentWillUnmount, except this works for functional components.
    return () => webSocket.current.close();
  }, [setSendData]);
  return { data, isError, error, sendData };
};
