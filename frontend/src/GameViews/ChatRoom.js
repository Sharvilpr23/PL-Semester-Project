import React, { useEffect, useState } from "react";
import PT from "prop-types";
import { useGameData } from "../DataHook/GameDataHook";
import { useConnectionContext } from "../App/AppContext";
import { isNotNilOrEmpty } from "ramda-adjunct";

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

const ChatRoom = ({ className }) => {
  const { data, isOpen, isError, error, sendData } = useConnectionContext();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Hack because I really do not want to go through the effort of making another lobby endpoint and dealing with all of that nonsense
    if (isNotNilOrEmpty(data?.messages)) {
      setMessages(data?.messages);
    }
  }, [data, setMessages]);

  useEffect(() => {
    if (isOpen) {
      sendData(JSON.stringify({ Name: "", GameId: 1, GameData: "" }));
    }
  }, [sendData, isOpen]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!isOpen || isError) return;

    // Name: "" and GameId: 0 to indicate to reader that those aren't meant to be updated.
    // Ideally client would know client id and send a message to a lobby endpoint that
    // states the client id, but I am very short on time and this was quick to hack together.
    // That said it is a hack and I apologize.
    sendData(JSON.stringify({ Name: "", GameId: 0, GameData: message }));
  };

  const cn = {
    root: ` ${className}`,
  };

  return (
    <div className={cn.root}>
      <form onSubmit={handleSubmit}>
        <label>
          Message:
          <input
            onChange={({ target }) => setMessage(target.value)}
            type="text"
            name="name"
            className="border-2"
            // value={message}
          />
        </label>
      </form>
      {(messages || []).map((message, idx) => (
        <p
          key={idx}
        >{`From: ${message?.name} | At: ${message?.time} => ${message?.body}`}</p>
      ))}
    </div>
  );
};

ChatRoom.propTypes = propTypes;
ChatRoom.defaultProps = defaultProps;
export default ChatRoom;
