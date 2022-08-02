import React from "react";
import { styled } from "twin.macro";
import clsx from "clsx";
import PropTypes from "prop-types";

const DefaultInput = styled.input`
  border-radius: 8px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.16);
  padding: 8px 12px;
  color: #707070;
  &.outlineInputs {
    background: #ffffff;
    border: 1px solid #7bc0de;
    border-radius: 5px;
    opacity: 1;
    box-shadow: none;
    padding: 5px 10px;
    max-width: 97px;
  }
`;

const RoundedInput = ({
  type,
  name,
  label: inputLabel,
  className,
  containerClassName,
  id,
  ...rest
}) => {
  id = id || name;
  return (
    <div className={clsx("w-full", containerClassName)}>
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
          "w-full text-base placeholder-gray-300 border-transparent border-2 cursor-default focus:outline-none focus:border-primary sm:text-sm",
          className
        )}
        {...rest}
      />
    </div>
  );
};

RoundedInput.propTypes = {
  type: PropTypes.oneOf(["text", "number", "password", "tel", "search"]),
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  className: PropTypes.string,
  containerClassName: PropTypes.string,
  id: PropTypes.string,
};

RoundedInput.defaultProps = {
  type: "text",
};

export default RoundedInput;
