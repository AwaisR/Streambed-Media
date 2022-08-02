import React, { useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import { styled } from "twin.macro";
import PropTypes from "prop-types";

const Container = styled.div`
  border-radius: 8px;
  box-shadow: 0 3px 10px rgba(0,0,0,0.16);
`;

const SelectButton = styled.button`
  border-radius: 8px;
  padding: 8px 12px;
  color: #707070;
`;

const Menu = styled.ul`
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
`;

const MenuItem = styled.li`
  padding: 8px 12px;
  &:not(.bg-primary) {
    color: #707070;
  }
`;

const n00p = () => void 0;

const CustomSelect = ({
  label: inputLabel,
  name,
  value,
  options,
  placeholder = "",
  className,
  onChange,
}) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const optionKeys = useMemo(() => Object.keys(options), [options]);

  const toggleMenu = () => setMenuVisible(!menuVisible);
  const handleMenuItemClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const { value } = event.target.dataset;
    onChange(value);
    toggleMenu();
  };
  // the timeout is a hack for times when the blur occured because a
  // menu item was clicked. the 200ms window allows for the item click
  // to be handled. could've figured out if we're within container 
  // bounds but meh, for now.
  const handleButtonBlur = 
    () => menuVisible && setTimeout(() => setMenuVisible(false), 200);
  
  let buttonText = placeholder;
  if (value && value in options) {
    buttonText = options[value];
  }

  useEffect(() => {
    // hide menu when the document is clicked
    const hide = (event) => {
      menuVisible && setMenuVisible(false);
    };
    document.addEventListener("click", hide, false);
    return () => {
      document.removeEventListener("click", hide, false);
    };
  }, [menuVisible]);

  return (
    <div className="w-full">
      {
        inputLabel
        ? <label
            className="block mb-2 text-primary font-bold text-xs"
            htmlFor={name}
          >
            {inputLabel}
          </label>
        : null
      }
      <Container className={clsx("relative w-full", className)}>
        <SelectButton 
          type="button" 
          className={clsx("flex justify-between items-center w-full text-left cursor-default focus:outline-none text-base sm:text-sm", {
            "rounded-b-none": menuVisible,
            "focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500": !menuVisible,
          })}
          aria-haspopup="listbox" 
          aria-expanded="true" 
          aria-labelledby="listbox-label"
          onClick={toggleMenu}
          // onBlur={handleButtonBlur}
        >
          <span className="truncate">
            {buttonText}
          </span>
          <span className="pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </span>
        </SelectButton>

        {menuVisible && (
          <Menu 
            className="z-10 w-full mt-1 bg-white shadow-lg max-h-60 overflow-auto focus:outline-none" 
            tabindex="-1" 
            role="listbox" 
            aria-labelledby="listbox-label" 
          >
            {optionKeys.map((key) => (
              <MenuItem 
                key={key}
                className={clsx("hover:bg-gray-200 hover:text-gray-900 text-base sm:text-sm cursor-default select-none relative w-full flex items-center justify-between", {
                  "bg-primary text-white": value === key,
                })}
                role="option"
                data-value={key}
                onClick={handleMenuItemClick}
              >
                <span className="truncate">
                  {options[key]}
                </span>
              </MenuItem>
            ))}
          </Menu>
        )}
      </Container>
    </div>
  );
};

CustomSelect.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.string,
  options: PropTypes.object,
  placeholder: PropTypes.string,
  className: PropTypes.string,
  onChange: PropTypes.func,
};

CustomSelect.defaultProps = {
  onChange: n00p,
};

export default CustomSelect;