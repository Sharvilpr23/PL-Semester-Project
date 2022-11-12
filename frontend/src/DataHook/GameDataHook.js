import { noop } from "ramda-adjunct";
import { useState, useRef, useEffect } from "react";

export const useGameData = (endpoint) => {
  const webSocket = useRef(null);
  const [error, setError] = useState(undefined);
  const [isError, setIsError] = useState(false);
  const [data, setData] = useState(undefined);
  const [isOpen, setIsOpen] = useState(false);
  const [sendData, setSendData] = useState(() => noop);
  const _url = `ws://localhost:8080/${endpoint}`;

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
      console.log("data", String(data));
      // If JSON string, parse into object, otherwise leave it as string
      try {
        data = JSON.parse(data);
      } catch (e) {}
      setData(data);

      console.debug(`Data recieved`, data);
    };

    webSocket.current.onopen = (event) => {
      console.debug(`Web Sockets connection opened`);
      setIsOpen(true);
    };

    webSocket.current.onclose = (event) => {
      console.debug(`Web Sockets connection closed`);
      setIsOpen(false);
    };

    webSocket.current.onerror = (e) => {
      console.error("Websocket error", e.message);
      setIsError(true);
      setError(e.message || "Unknown error, possibly failed to connect");
      setIsOpen(false);
    };

    // closes websocket when the component using this hook
    // Per react, putting this in a useEffect and having this is similar to having
    // a componentWillUnmount, except this works for functional components.
    return () => webSocket.current.close();
  }, [setSendData, _url]);
  return { data, isOpen, isError, error, sendData };
};
