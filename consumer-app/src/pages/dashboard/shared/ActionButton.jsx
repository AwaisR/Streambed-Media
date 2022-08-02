import React from "react";

import { Card } from "../../../components/layouts/Card";

import { PLATFORM_ICON_MAP } from "../../../components/helpers/platforms";
import clsx from "clsx";

const ActionButton = ({ className, icon, platform, label, onClick }) => (
  <Card
    onClick={onClick}
    className={clsx(
      "text-center flex flex-col justify-center items-center py-2 px-2 cursor-pointer space-y-1",
      className
    )}
  >
    {icon || PLATFORM_ICON_MAP[platform]({ className: "w-auto h-6" })}
    <span className="text-xs text-copy">{label}</span>
  </Card>
);

export default ActionButton;
