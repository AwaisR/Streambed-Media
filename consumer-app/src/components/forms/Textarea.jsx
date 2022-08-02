import React from "react";
import { styled } from "twin.macro";
import clsx from "clsx";
import PropTypes from "prop-types";

const DefaultTextarea = styled.textarea`
  border-radius: 8px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.16);
  padding: 8px 12px;
  color: #707070;
`;

const Textarea = ({
  name,
  label: inputLabel,
  className,
  containerClassName,
  ...rest
}) => {
  return (
    <div className={clsx("w-full my-0", containerClassName)}>
      {inputLabel ? (
        <label
          className="block mb-2 text-primary font-bold text-xs"
          htmlFor={name}
        >
          {inputLabel}
        </label>
      ) : null}
      <DefaultTextarea
        id={name}
        name={name}
        className={clsx(
          "w-full text-base placeholder-gray-300 border-transparent border-2 cursor-default focus:outline-none focus:border-primary sm:text-sm",
          className
        )}
        {...rest}
      ></DefaultTextarea>
    </div>
  );
};

Textarea.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  className: PropTypes.string,
  containerClassName: PropTypes.string,
};

Textarea.defaultProps = {};

export default Textarea;
