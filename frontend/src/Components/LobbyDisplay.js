import React from "react";
import PT from "prop-types";
import { useConnectionContext } from "../App/AppContext";

//*****************************************************************************
// Interface
//*****************************************************************************

const propTypes = {
  currentUsers: PT.array,
  maxUsers: PT.number,
  className: PT.string, // className string applied to root of this component
};

const defaultProps = {
  currentUsers: [],
  maxUsers: 0,
  className: "",
};

//*****************************************************************************
// Components
//*****************************************************************************

const LobbyDisplay = ({ currentUsers, maxUsers, className }) => {
  const { clientId } = useConnectionContext();

  const userListingBase = "my-[2px] pl-2 border-2 border-slate-900";
  const cn = {
    root: ` ${className}`,
    lobbyFill: "",
    users: "flex flex-col py-4",
    userListing: userListingBase,
    myUserListing: `${userListingBase} bg-green-200`,
  };

  return (
    <div className={cn.root}>
      <div className={cn.lobbyFill}>
        {currentUsers.length} / {maxUsers > 0 ? maxUsers : "ERROR"}
      </div>

      <div className={cn.users}>
        {currentUsers.map((user, idx) => (
          <UserListing
            user={user}
            key={idx}
            className={
              user?.Id === clientId ? cn.myUserListing : cn.userListing
            }
          />
        ))}
      </div>
    </div>
  );
};

const UserListing = ({ user, className }) => {
  const cn = {
    root: ` ${className}`,
  };

  return (
    <div className={cn.root}>{user?.UserName || "ERROR GETTING NAME"}</div>
  );
};

LobbyDisplay.propTypes = propTypes;
LobbyDisplay.defaultProps = defaultProps;
export default LobbyDisplay;
