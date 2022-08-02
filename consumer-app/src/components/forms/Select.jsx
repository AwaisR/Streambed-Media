import React, { useMemo } from "react";
import clsx from "clsx";
import { styled } from "twin.macro";
import PropTypes from "prop-types";

const DefaultSelect = styled.select`
  border-radius: 8px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.16);
  padding: 8px 12px;
  color: #707070;
`;

const n00p = () => void 0;

const Select = ({
  label: inputLabel,
  name,
  value,
  options,
  className,
  containerClassName,
  onChange,
  ...rest
}) => {
  const optionKeys = useMemo(() => Object.keys(options), [options]);

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
      <DefaultSelect
        className={clsx(
          "w-full text-base placeholder-gray-300 border-transparent border-2 cursor-default focus:outline-none sm:text-sm",
          className
        )}
        value={value}
        onChange={onChange}
        id={name}
        name={name}
        {...rest}
      >
        {optionKeys.map((key) => (
          <option key={key} value={key}>
            {options[key]}
          </option>
        ))}
      </DefaultSelect>
    </div>
  );
};

Select.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  value: PropTypes.string,
  options: PropTypes.object,
  className: PropTypes.string,
  containerClassName: PropTypes.string,
  onChange: PropTypes.func,
};

Select.defaultProps = {
  onChange: n00p,
};

export default Select;
