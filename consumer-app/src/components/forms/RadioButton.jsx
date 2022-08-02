import React from "react";
import clsx from "clsx";
import PropTypes from "prop-types";

const RadioButton = ({
  id,
  name,
  label: inputLabel,
  value,
  className,
  ...rest
}) => {
  if (id === undefined) id = name;
  return (
    <label htmlFor={id} className="inline-flex justify-start items-center mr-4">
      <input
        type="radio"
        id={id}
        name={name}
        className={clsx("text-primary h-5 w-5", className)}
        {...rest}
      />
      <span className="ml-2 text-copy text-base sm:text-sm">{inputLabel}</span>
    </label>
  );
};

RadioButton.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.any,
  className: PropTypes.string,
};

RadioButton.defaultProps = {};

export default RadioButton;
