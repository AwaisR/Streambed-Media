import React, { useState, useEffect, useRef } from "react";
import { styled } from "twin.macro";
import clsx from "clsx";
import Chart from "chart.js";

// components
import { Card, CardContent } from "../../../components/layouts/Card";
import Select from "../../../components/forms/Select";
import CustomCheckbox from "../../../components/forms/CustomCheckbox";
import { analyticsColors } from "../shared/analyticsUtil";

// helpers
import { formatNumberWithCommas } from "../../../helpers/helper";
import { PLATFORM_TITLE_MAP } from "../../../components/helpers/platforms";

const Underline = () => <p className="w-full h-px mt-px p-0 bg-current"></p>;
const Tab = ({ label, tab, onClick }) => (
  <h5
    className={clsx(
      "inline-block text-xs cursor-pointer transition-all duration-150",
      {
        "text-primary": tab === label,
        "text-copy": tab !== label,
      }
    )}
    onClick={() => onClick(label)}
  >
    {label}
    {tab === label && <Underline />}
  </h5>
);

/**
 *
 * @param {object} props
 * @param {object} props.platform lowercase
 * @param {object} props.data
 * @param {number[]} props.data.reach
 * @param {number[]} props.data.engagement
 * @param {number[]} props.data.shares
 */
const AnalyticsGraph = ({ data, platform }) => {
  const [graphRange, setGraphRange] = useState("Day");
  const [tab, setTab] = useState("Reach");
  const [showDerivativeContent, setShowDerivativeContent] = useState(false);
  const canvasRef = useRef(null);
  const platformTitle = PLATFORM_TITLE_MAP[platform];

  const colors = analyticsColors;

  const toggleDerivativeContent = (_evt) => {
    setShowDerivativeContent(!showDerivativeContent);
  };

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }

    const category = tab.toLowerCase();
    const datasets = [
      {
        data: data[category],
        fill: false,
        borderColor: colors[platform],
        cubicInterpolationMode: "monotone",
        tension: 0.4,
      },
    ];

    const { current: canvas } = canvasRef;
    const ctx = canvas.getContext("2d");
    const chart = new Chart(ctx, {
      type: "line",
      data: {
        labels: datasets[0].data.map((_, i) => i + 1),
        datasets,
      },
      options: {
        responsive: true,
        legend: {
          display: false,
        },
        tooltips: {
          callbacks: {
            title() {
              return null;
            },
            label(opts) {
              return formatNumberWithCommas(opts.value);
            },
          },
        },
        elements: {
          point: {
            radius: 2,
          },
        },
        layout: {
          padding: {
            top: 2,
            bottom: 2,
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
              display: true,
              gridLines: {
                borderDash: [5, 5],
                drawBorder: false,
              },
              ticks: {
                beginAtZero: true,
                stepSize: 250000,
                callback(value) {
                  const ranges = [
                    { divider: 1e6, suffix: "m" },
                    { divider: 1e3, suffix: "k" },
                  ];
                  function formatNumber(n) {
                    for (let i = 0; i < ranges.length; i++) {
                      if (n >= ranges[i].divider) {
                        return (
                          Math.round(n / ranges[i].divider).toString() +
                          ranges[i].suffix
                        );
                      }
                    }
                    return n;
                  }
                  return formatNumber(value);
                },
              },
            },
          ],
        },
      },
    });

    return () => {
      chart.destroy();
    };
    // eslint-disable-next-line
  }, [canvasRef, tab]);

  return (
    <Card className="bg-white">
      <CardContent>
        <div className="flex justify-between">
          <h3 className="text-xl text-copy">Analytics</h3>

          <div>
            <RangeSelect
              label=""
              name="range"
              className="border border-gray-300"
              value={graphRange}
              options={analyticsSelectRange}
              onChange={(evt) => {
                setGraphRange(evt.target.value);
              }}
            />
          </div>
        </div>

        <div className="mt-2 space-x-2">
          <Tab label="Reach" tab={tab} onClick={setTab} />
          <Tab label="Engagement" tab={tab} onClick={setTab} />
          <Tab label="Shares" tab={tab} onClick={setTab} />
        </div>

        <div className="my-4">
          <canvas ref={canvasRef} height="120"></canvas>
        </div>

        <div className="mt-3 flex flex-col space-y-2 lg:flex-row lg:justify-between lg:space-y-0">
          <div className="text-copy text-xs">
            <CustomCheckbox
              name="includeDerivativeContent"
              id="includeDerivativeContent"
              label="Include derivative content"
              checkedClassName="bg-blue-400"
              labelClassName="ml-1 text-xs"
              onChange={toggleDerivativeContent}
            />
          </div>
          <div className="space-x-1 flex items-center">
            <div
              className="inline-block w-8 h-1 mr-1 rounded-md"
              style={{
                backgroundColor: analyticsColors[platform],
              }}
            ></div>
            <span className="text-xs">{platformTitle}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const RangeSelect = styled(Select)`
  box-shadow: none;
  padding: 4px 12px;
`;

export default AnalyticsGraph;

const analyticsSelectRange = (() => {
  const arr = ["Day", "Month", "Quarter", "Year"];
  return arr.reduce((rangeObj, opt) => {
    rangeObj[opt] = opt;
    return rangeObj;
  }, {});
})();
