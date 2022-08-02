import React from "react";
import clsx from "clsx";
import PropTypes from "prop-types";
import { Card, CardContent } from "../layouts/Card";
import TooltipIcon from "../icons/TooltipIcon";
import ArrowIcon from "../icons/ArrowIcon";

const ShortAnalysisWithNoGraph = ({
  title,
  tooltip,
  points,
  summaryTitle,
  className,
}) => {
  const currentValue = points[points.length - 1];
  const previousValue = points.length > 1 ? points[points.length - 2] : 0;
  const diff = Number(currentValue) - Number(previousValue);
  const percent =
    previousValue > 0 ? ((diff / Number(previousValue)) * 100).toFixed(1) : 0;
  const value = percent === "Infinity" ? "0" : percent;
  return (
    <Card className={className}>
      <CardContent className="py-4 px-4 h-full flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <h4 className="w-9/12 text-base text-copy font-medium">{title}</h4>
          <span title={tooltip}>
            <TooltipIcon />
          </span>
        </div>
        <div className="pt-2 pb-0 flex justify-between">
          <div className="flex items-end">
            <ArrowIcon
              className={clsx("text-base transform fill-current mb-1", {
                "text-secondary": percent < 0,
                "rotate-180 text-primary": percent >= 0,
              })}
            />
            <span className="ml-1 text-2xl text-gray-400 font-medium">
              {currentValue}
            </span>
          </div>
          <div className="flex items-end">
            <ArrowIcon
              className={clsx("text-xs transform fill-current mb-1", {
                "text-secondary": percent < 0,
                "rotate-180 text-primary": percent >= 0,
              })}
            />
            <div className="ml-1 text-copy">
              <span className="block text-xs font-light text-right">
                {summaryTitle}
              </span>
              <span className="block text-base font-normal">
                {Math.abs(value)}%
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

ShortAnalysisWithNoGraph.propTypes = {
  title: PropTypes.string.isRequired,
  tooltip: PropTypes.string.isRequired,
  summaryTitle: PropTypes.string.isRequired,
};

export default ShortAnalysisWithNoGraph;
