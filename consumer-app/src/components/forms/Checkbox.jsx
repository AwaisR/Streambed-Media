import React from "react";
import clsx from "clsx";
import PropTypes from "prop-types";

const Checkbox = ({
  id,
  name,
  label: inputLabel,
  className,
  labelClassName,
  ...rest
}) => {
  id = id || name;
  return (
    <label htmlFor={id} className="inline-flex justify-start items-center">
      <input
        type="checkbox"
        id={id}
        name={name}
        className={clsx("bg-primary rounded-sm text-white", className)}
        {...rest}
      />
      {inputLabel && (
        <span className={clsx("ml-2", labelClassName)}>{inputLabel}</span>
      )}
    </label>
  );
};

Checkbox.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  labelClassName: PropTypes.string,
  checked: PropTypes.bool,
  className: PropTypes.string,
};

Checkbox.defaultProps = {};

export default Checkbox;
