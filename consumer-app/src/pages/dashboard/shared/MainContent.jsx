import React from "react";
import clsx from "clsx";

export const PADDING_Y = "py-8";

const MainContent = ({ className, children }) => (
  <div className={clsx("w-full min-h-screen px-3 sm:px-8", PADDING_Y, className)}>
    {children}
  </div>
);

export default MainContent;
