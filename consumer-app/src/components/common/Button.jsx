import React from "react";
import clsx from "clsx";
import { styled } from "twin.macro";
import PropTypes from "prop-types";

const buttonThemes = {
  primary: "text-white bg-primary hover:bg-primary-hover",
  cancel: "text-white bg-cancel",
  inactive: "bg-gray-200 text-gray-600",
  active: "bg-white text-primary border-2 border-primary",
  default: "",
  none: "",
};

buttonThemes.default = buttonThemes.primary;

const DefaultButton = styled.button`
  border-radius: 8px;
  text-align: center;
  padding: 8px 12px;
  min-width: 100px;
  cursor: pointer;
  &:hover {
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.16);
  }
`;

const Button = ({ children, theme, className, disabled, ...rest }) => {
  const styles =
    theme && theme in buttonThemes ? buttonThemes[theme] : buttonThemes.default;

  return (
    <DefaultButton
      className={clsx("text-sm sm:text-base", styles, className)}
      disabled={disabled}
      {...rest}
    >
      {children}
    </DefaultButton>
  );
};

Button.propTypes = {
  theme: PropTypes.oneOf(Object.keys(buttonThemes)),
  disabled: PropTypes.bool,
};

Button.defaultProps = {
  theme: "primary",
  disabled: false,
};

export default Button;
