import React, { useEffect, useState } from "react";
import PT from "prop-types";
import { useConnectionContext } from "../App/AppContext";
import { isNotNil, isNotNilOrEmpty } from "ramda-adjunct";
import LobbyDisplay from "../Components/LobbyDisplay";
import UserInput from "../Components/UserInput";

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
  const { data, isOpen, isError, sendData, clientId } = useConnectionContext();
  const [messages, setMessages] = useState([]);
  const [maxUsers, setMaxUsers] = useState(undefined);
  const [currentUsers, setCurrentUsers] = useState([]);

  useEffect(() => {
    // Hack because I really do not want to go through the effort of making another lobby endpoint and dealing with all of that nonsense
    if (isNotNilOrEmpty(data?.Messages)) {
      setMessages(data?.Messages);
    }
    if (isNotNilOrEmpty(data?.CurrentUsers)) {
      setCurrentUsers(data?.CurrentUsers);
    }
    if (isNotNil(data?.MaxUsers)) {
      setMaxUsers(data?.MaxUsers);
    }
  }, [data, setMessages, setMaxUsers, setCurrentUsers]);

  useEffect(() => {
    if (isOpen) {
      sendData(JSON.stringify({ Name: "", GameId: 1, GameData: "" }));
    }
  }, [sendData, isOpen]);

  const handleSubmit = (message) => {
    if (!isOpen || isError) return;

    sendData(JSON.stringify({ Name: "", GameId: 0, GameData: message }));
  };

  const messageBase = "w-3/4 border-2 border-slate-900 px-2 rounded-md mx-2";
  const cn = {
    root: `flex gap-8 h-full ${className}`,
    input: "bg-slate-100",
    messages: "flex flex-col gap-2 justify-end bg-zinc-700 h-3/4 w-1/2",
    message: `${messageBase} bg-slate-200`,
    myMessage: `${messageBase} ml-auto bg-green-300`,
    lobbyDisplay: "bg-zinc-200 grow p-4",
  };

  return (
    <div className={cn.root}>
      <div className={cn.messages}>
        {(messages || []).map((message, idx) => (
          <MessageInstance
            key={idx}
            SenderName={message?.SenderName}
            Timestamp={message?.Timestamp}
            Body={message?.Body}
            className={
              message?.SenderId === clientId ? cn.myMessage : cn.message
            }
          />
        ))}
        <UserInput
          className={cn.input}
          onSubmit={handleSubmit}
          label="Message: "
          placeholder="..."
          clearOnSubmit={true}
        />
      </div>
      <LobbyDisplay
        maxUsers={maxUsers}
        currentUsers={currentUsers}
        className={cn.lobbyDisplay}
      />
    </div>
  );
};

const MessageInstance = ({ SenderName, Timestamp, Body, className }) => {
  const cn = {
    root: `flex ${className}`,
    sender: "w-1/6",
    ts: "w-1/6",
    body: "grow",
  };

  return (
    <div className={cn.root}>
      <div className={cn.sender}>{SenderName}</div>
      <div className={cn.ts}>{Timestamp}</div>
      <div className={cn.body}>{Body}</div>
    </div>
  );
};

ChatRoom.propTypes = propTypes;
ChatRoom.defaultProps = defaultProps;
export default ChatRoom;
