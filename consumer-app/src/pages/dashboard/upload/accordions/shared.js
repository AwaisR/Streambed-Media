import React from "react";
import clsx from "clsx";
import ArrowRightIcon from "../../../../components/icons/ArrowRightIcon";

export const NEXT_BUTTON_INACTIVE_CLASSNAME =
  "bg-gray-300 border-transparent text-copy cursor-default";
export const NEXT_BUTTON_ACTIVE_CLASSNAME =
  "border-primary text-primary cursor-pointer hover:bg-primary hover:text-white";
export const NEXT_BUTTON_DEFAULT_CLASSNAME =
  "flex items-center justify-center px-3 py-1 rounded-xl border";

export const NextButton = ({ className, disabled, children, ...rest }) => (
  <button
    disabled={disabled}
    className={clsx(
      NEXT_BUTTON_DEFAULT_CLASSNAME,
      {
        [NEXT_BUTTON_INACTIVE_CLASSNAME]: disabled,
        [NEXT_BUTTON_ACTIVE_CLASSNAME]: !disabled,
      },
      className
    )}
    {...rest}
  >
    {children} <ArrowRightIcon className="ml-2" />
  </button>
);
