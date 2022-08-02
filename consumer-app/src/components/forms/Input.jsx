import React from "react";
import { styled } from "twin.macro";
import clsx from "clsx";
import PropTypes from "prop-types";

const DefaultInput = styled.input`
  padding: 8px 12px;
  color: #707070;
`;

const Input = ({ type, name, label: inputLabel, className, id, ...rest }) => {
  id = id || name;
  return (
    <div className="w-full">
      {inputLabel ? (
        <label
          className="block mb-2 text-primary font-bold text-xs"
          htmlFor={name}
        >
          {inputLabel}
        </label>
      ) : null}
      <DefaultInput
        type={type}
        id={id}
        name={name}
        className={clsx(
          "w-full border-primary border-b-2 text-base placeholder-gray-300 cursor-default focus:outline-none focus:border-gray-400 sm:text-sm",
          className
        )}
        {...rest}
      />
    </div>
  );
};

Input.propTypes = {
  type: PropTypes.oneOf([
    "text",
    "number",
    "password",
    "tel",
    "search",
    "email",
  ]),
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  className: PropTypes.string,
  id: PropTypes.string,
};

Input.defaultProps = {
  type: "text",
};

export default Input;
