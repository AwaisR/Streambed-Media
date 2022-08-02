import React, { useState } from "react";
import clsx from "clsx";
import PropTypes from "prop-types";
import { styled } from "twin.macro";

const Checkmark = styled.div`
  width: 30%;
  height: 60%;
  border: solid currentColor;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
`;

const CustomCheckbox = ({
  id,
  name,
  label: inputLabel,
  className,
  labelClassName,
  checkedClassName,
  ...rest
}) => {
  id = id || name;
  const [checked, setChecked] = useState(!!rest.checked);

  return (
    <label htmlFor={id} className="inline-flex justify-start items-center">
      <input
        type="checkbox"
        id={id}
        name={name}
        {...rest}
        onChange={(...args) => {
          setChecked(!checked);
          rest.onChange && rest.onChange(...args);
        }}
        hidden
      />
      <div
        className={clsx("flex items-center border justify-center text-white w-3 h-3 md:w-4 md:h-4 rounded-sm relative", className, {
          "border-gray-300": !checked,
          [clsx("border-transparent", checkedClassName)]: checked,
        })}
      >
        {checked ? <Checkmark className="absolute mb-px" /> : null}
      </div>
      {inputLabel && (
        <span className={clsx("ml-2", labelClassName)}>{inputLabel}</span>
      )}
    </label>
  );
};

CustomCheckbox.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  labelClassName: PropTypes.string,
  checkedClassName: PropTypes.string,
  checked: PropTypes.bool,
  className: PropTypes.string,
};

CustomCheckbox.defaultProps = {};

export default CustomCheckbox;
