import React, { useEffect, useRef, useState } from "react";
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
  const [scrolled, setScrolled] = useState(false);
  const scroller = useRef();
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
    const interval = setInterval(() => {
      if (!scrolled) {
        scroller.current.scrollTop =
          scroller.current.scrollHeight - scroller.current.offsetHeight;
      }
    }, 100);
    return () => clearInterval(interval);
  }, [scroller, scrolled]);
  useEffect(() => {
    if (isOpen) {
      sendData(JSON.stringify({ Name: "", GameId: 1, GameData: "" }));
    }
  }, [sendData, isOpen]);

  const handleSubmit = (message) => {
    if (!isOpen || isError) return;

    sendData(JSON.stringify({ Name: "", GameId: 0, GameData: message }));
  };

  const messageBase =
    "w-3/4 border-2 border-slate-900 px-2 rounded-md mx-2 my-2";
  const cn = {
    root: `flex gap-8 max-h-full h-full min-h-0 ${className}`,
    input: "bg-slate-100 mt-4 py-2",
    leftColumn: "h-3/4 w-2/3 min-h-0",
    messages: "relative flex flex-col-reverse bg-zinc-700 w-full h-full",
    trueMessages: "absolute overflow-y-auto inset-0",
    message: `${messageBase} bg-slate-200`,
    myMessage: `${messageBase} ml-auto bg-green-300`,
    rightColumn: "w-1/3 flex flex-col gap-4",
    title: "text-4xl bg-zinc-200 w-full h-fit py-2 px-4",
    lobbyDisplay: "bg-zinc-200 p-4",
  };

  const handleScroll = () => {
    setScrolled(true);
    if (
      scroller.current.scrollTop ===
      scroller.current.scrollHeight - scroller.current.offsetHeight
    ) {
      // they scrolled back to the bottom, reattach
      setScrolled(false);
    }
  };

  return (
    <div className={cn.root}>
      <div className={cn.leftColumn}>
        <div className={cn.messages}>
          <div
            ref={scroller}
            onScroll={(e) => handleScroll(e)}
            className={cn.trueMessages}
          >
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
          </div>
        </div>
        <UserInput
          className={cn.input}
          onSubmit={handleSubmit}
          label="Message: "
          placeholder="..."
          clearOnSubmit={true}
        />
      </div>
      <div className={cn.rightColumn}>
        <div className={cn.title}>Chat Room</div>
        <LobbyDisplay
          maxUsers={maxUsers}
          currentUsers={currentUsers}
          className={cn.lobbyDisplay}
        />
      </div>
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
