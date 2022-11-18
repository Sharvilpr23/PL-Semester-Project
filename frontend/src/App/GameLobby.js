import React, { useEffect, useState } from "react";
import PT from "prop-types";
import { useConnectionContext } from "./AppContext";
import { isNotNilOrEmpty } from "ramda-adjunct";

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

const ServerLobby = ({ className }) => {
  const userListingBase = "border-2 px-2";
  const cn = {
    root: ` ${className}`,
    users: "flex flex-col gap-2",
    userListing: userListingBase,
    myUser: `${userListingBase} border-green-200`,
  };
  const [userName, setUserName] = useState("Anonymous");
  const [users, setUsers] = useState("");
  const { data, isOpen, isError, sendData, clientId } = useConnectionContext();

  useEffect(() => {
    if (isNotNilOrEmpty(data?.Sessions)) {
      setUsers(data?.Sessions);
    }
  }, [data, setUsers]);

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
      {(users || []).map((user, idx) => (
        <UserListing
          className={user?.Id === clientId ? cn.myUser : cn.userListing}
          user={user?.UserName}
          key={idx}
        />
      ))}
    </div>
  );
};

const UserListing = ({ user, className }) => {
  const cn = {
    root: ` ${className}`,
  };
  return <div className={cn.root}>{user}</div>;
};

ServerLobby.propTypes = propTypes;
ServerLobby.defaultProps = defaultProps;
export default ServerLobby;
