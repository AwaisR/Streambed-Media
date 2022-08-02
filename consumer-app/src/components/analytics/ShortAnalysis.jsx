import React, { useEffect, useRef } from "react";
import clsx from "clsx";
import PropTypes from "prop-types";
import Chart from "chart.js";
import { Card, CardContent } from "../layouts/Card";
import TooltipIcon from "../icons/TooltipIcon";
import ArrowIcon from "../icons/ArrowIcon";

const ShortAnalysis = ({
  title,
  tooltip,
  points,
  summaryTitle,
  className,
  current,
  previous,
  range,
}) => {
  let diffDays;
  if (range) {
    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    const firstDate = new Date(range.startDate && range.startDate);
    const secondDate = new Date(range.endDate && range.endDate);
    diffDays = Math.round(Math.abs((firstDate - secondDate) / oneDay));
  }
  const canvasRef = useRef(null);
  // const currentValue = points[points.length - 1];
  // const previousValue = points.length > 1 ? points[points.length - 2] : 0;
  // const diff = current + previous;
  const percent = (current / diffDays).toFixed(2);

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }

    const { current: canvas } = canvasRef;
    const ctx = canvas.getContext("2d");
    const chart = new Chart(ctx, {
      type: "line",
      data: {
        labels: points.map((_, i) => i + 1),
        datasets: [
          {
            data: points,
            borderColor: "#A8E4F7",
            fill: false,
            cubicInterpolationMode: "monotone",
            tension: 0.4,
          },
        ],
      },
      options: {
        responsive: true,
        legend: {
          display: false,
        },
        tooltips: {
          enabled: false,
        },
        elements: {
          point: {
            radius: 0,
          },
        },
        layout: {
          padding: {
            top: 5,
            bottom: 5,
          },
        },
        scales: {
          xAxes: [
            {
              display: false,
            },
          ],
          yAxes: [
            {
              display: false,
            },
          ],
        },
      },
    });

    return () => {
      chart.destroy();
    };
  }, [canvasRef, points]);

  return (
    <Card className={className}>
      <CardContent className="py-4 px-4">
        <div className="flex justify-between items-center">
          <h4 className="text-base text-copy font-medium">{title}</h4>
          <span title={tooltip}>
            <TooltipIcon />
          </span>
        </div>
        <div className="flex items-end pt-4 pb-0">
          <ArrowIcon
            className={clsx("text-2xl transform fill-current mb-1", {
              "text-secondary": percent < 0,
              "rotate-180 text-primary": percent >= 0,
            })}
          />
          <span className="ml-3 text-6xl text-gray-400 font-medium">
            {Math.abs(percent)}%
          </span>
        </div>
        <div className="p-0">
          <canvas ref={canvasRef} height="40"></canvas>
        </div>
        <div className="pt-4">
          <h6 className="text-sm text-copy font-light">{summaryTitle}</h6>
          <div className="flex items-end mt-1">
            <ArrowIcon
              className={clsx("text-sm transform fill-current mb-1", {
                "text-secondary": percent < 0,
                "rotate-180 text-primary": percent >= 0,
              })}
            />
            <span className="ml-1 text-base text-copy font-medium">
              {current}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

ShortAnalysis.propTypes = {
  title: PropTypes.string.isRequired,
  tooltip: PropTypes.string.isRequired,
  summaryTitle: PropTypes.string.isRequired,
};

export default ShortAnalysis;
