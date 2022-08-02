import clsx from "clsx";
import React from "react";
import { Card, CardContent } from "./Card";

import ArrowUpIcon from "../icons/ArrowUpIcon";
import ArrowDownIcon from "../icons/ArrowDownIcon";

export const Accordion = ({
  className,
  open,
  onOpen,
  onClose,
  header,
  body,
}) => {
  const toggleOpen = () => (open ? onClose() : onOpen());

  return (
    <Card className={clsx(className)}>
      <CardContent>
        {header && (
          <div className="py-1" onClick={toggleOpen}>
            {header}
          </div>
        )}
      
        <div
          className={clsx("transition-all duration-150 px-2 ease-out overflow-y-hidden", {
            "py-2 max-h-screen": open,
            "max-h-0": !open,
          })}
        >
          {open ? body : null}
        </div>
      </CardContent>
    </Card>
  );
};

export const AccordionHeader = ({ label, labelClassName, right, open }) => (
  <div className="flex items-center justify-between">
    <h5 className={clsx(labelClassName)}>{label}</h5>
    <div className="flex items-center flex-wrap space-x-2">
      {right}
      {open ? <ArrowUpIcon /> : <ArrowDownIcon />}
    </div>
  </div>
);
