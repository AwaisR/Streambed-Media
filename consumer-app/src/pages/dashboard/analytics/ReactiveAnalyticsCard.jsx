import React from "react";
import clsx from "clsx";
import PropTypes from "prop-types";

// components
import { Card, CardContent } from "../../../components/layouts/Card";
import TooltipIcon from "../../../components/icons/TooltipIcon";
import ArrowIcon from "../../../components/icons/ArrowIcon";

// helpers
import { formatNumberWithCommas } from "../../../helpers/helper";

const ReactiveAnalyticsCard = ({
  title,
  tooltip,
  currentValue,
  previousValue,
  rangeText,
  className,
  selected,
  range,
  valueFormatter = formatNumberWithCommas,
  ...rest
}) => {
  // const percent = diff > 0 ? diff / 2 : 0;
  // const percent =
  //   previousValue > 1 ? ((diff / previousValue) * 100).toFixed(2) : 0;
  let diffDays;
  if (range) {
    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    const firstDate = new Date(range.startDate && range.startDate);
    const secondDate = new Date(range.endDate && range.endDate);
    diffDays = Math.round(Math.abs((firstDate - secondDate) / oneDay));
  }
  // const currentValue = points[points.length - 1];
  // const previousValue = points.length > 1 ? points[points.length - 2] : 0;
  // const diff = current + previous;
  const percent = diffDays ? (currentValue / diffDays).toFixed(2) : 0;
  return (
    <Card
      className={clsx(className, {
        "bg-primary text-white": selected,
        "bg-white": !selected,
      })}
      {...rest}
    >
      <CardContent className="py-4 px-4">
        <div
          className={clsx({
            "text-white": selected,
          })}
        >
          <div className="flex justify-between items-start">
            <h4 className="text-sm text-current font-medium h-8">{title}</h4>
            <span title={tooltip}>
              <TooltipIcon className="text-current" />
            </span>
          </div>
          <div
            className={clsx("mt-1 text-md md:text-2xl font-medium", {
              "text-white": selected,
              "text-primary": !selected,
            })}
          >
            {valueFormatter(currentValue)}
          </div>
          <div className="pt-4">
            <h6 className="text-xs text-current font-light">{rangeText}</h6>
            <div className="mt-1 flex justify-between">
              <div className="flex items-end">
                <ArrowIcon
                  className={clsx("text-sm transform fill-current mb-1", {
                    "text-secondary": percent < 0,
                    "rotate-180 text-primary": percent >= 0 && !selected,
                    "rotate-180 text-white": percent >= 0 && selected,
                  })}
                />
                <span className="ml-1 text-sm text-current font-medium">
                  {Math.abs(percent)}%
                </span>
              </div>
              <div className="text-sm text-current font-medium">
                {valueFormatter(Math.abs(previousValue))}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

ReactiveAnalyticsCard.propTypes = {
  title: PropTypes.string.isRequired,
  tooltip: PropTypes.string.isRequired,
  currentValue: PropTypes.number.isRequired,
  previousValue: PropTypes.number.isRequired,
  rangeText: PropTypes.string.isRequired,
  className: PropTypes.string,
  selected: PropTypes.bool,
  valueFormatter: PropTypes.func,
};

export default ReactiveAnalyticsCard;
