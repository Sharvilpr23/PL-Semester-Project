import React, { useState } from "react";
import PT from "prop-types";
import { noop } from "ramda-adjunct";

//*****************************************************************************
// Interface
//*****************************************************************************

const propTypes = {
  label: PT.string,
  clearOnSubmit: PT.bool,
  placeholder: PT.string,
  onSubmit: PT.func,
  className: PT.string, // className string applied to root of this component
};

const defaultProps = {
  label: "",
  clearOnSubmit: false,
  placeholder: "",
  onSubmit: noop,
  className: "",
};

//*****************************************************************************
// Components
//*****************************************************************************

const UserInput = ({
  label,
  clearOnSubmit,
  placeholder,
  onSubmit,
  className,
}) => {
  const [state, setState] = useState("");
  const cn = {
    root: `${className}`,
    label: "flex",
    labelText: "px-4 w-1/6 my-auto text-right",
    input: "rounded-md px-2 border-2 border-slate-900 grow",
  };

  const ParseSubmit = (event) => {
    event.preventDefault();
    onSubmit(state);
    if (clearOnSubmit) event.target.reset();
  };

  return (
    <form className={cn.root} onSubmit={ParseSubmit}>
      <label className={cn.label}>
        <div className={cn.labelText}>{label}</div>
        <input
          onChange={({ target }) => setState(target.value)}
          type="text"
          name="name"
          placeholder={placeholder}
          className={cn.input}
        />
      </label>
    </form>
  );
};

UserInput.propTypes = propTypes;
UserInput.defaultProps = defaultProps;
export default UserInput;
