import React, { useState, useEffect, useRef, memo } from "react";
import { Link } from "react-router-dom";
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

const Underline = () => <p className="w-full h-px mt-1 p-0 bg-copy"></p>;
const Tab = ({ label, tab, onClick }) => (
  <h5
    className={clsx(
      "block sm:inline-block text-copy text-xs md:text-sm cursor-pointer transition-all duration-150",
      {
        "text-sm md:text-lg": tab === label,
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
 * @param {object} props.instagramAnalytics
 * @param {number[]} props.instagramAnalytics.reach
 * @param {number[]} props.instagramAnalytics.engagement
 * @param {number[]} props.instagramAnalytics.shares
 */
const AnalyticsGraph = ({
  instagramAnalytics,
  tiktokAnalytics,
  youtubeAnalytics,
  twitterAnalytics,
  analyticsViewRange,
  graphRange,
  range,
}) => {
  const [tab, setTab] = useState("Reach");
  const [mediaFilters, setMediaFilters] = useState([]);
  const [showAllMedia, setShowAllMedia] = useState(true);
  const canvasRef = useRef(null);
  const colors = analyticsColors;
  const toggleMediaFilter = (media, value) => {
    if (value) {
      setMediaFilters(mediaFilters.concat([media]));
    } else {
      setMediaFilters(mediaFilters.filter((m) => m !== media));
    }
  };

  const handleMediaFilterCheckboxChange = (evt) => {
    const { name, checked } = evt.target;
    toggleMediaFilter(name, checked);
  };

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }

    if (!mediaFilters.length && !showAllMedia) {
      return;
    }

    const category = tab.toLowerCase();
    const shouldShow = (media) => showAllMedia || mediaFilters.includes(media);
    const datasets = [
      // shouldShow("instagram") && {
      //   data: instagramAnalytics[category],
      //   fill: false,
      //   borderColor: colors["instagram"],
      //   cubicInterpolationMode: "monotone",
      //   tension: 0.4,
      // },
      // shouldShow("tiktok") && {
      //   data: tiktokAnalytics[category],
      //   fill: false,
      //   borderColor: colors["tiktok"],
      //   cubicInterpolationMode: "monotone",
      //   tension: 0.4,
      // },
      shouldShow("youtube") && {
        data: youtubeAnalytics[category],
        fill: false,
        borderColor: colors["youtube"],
        cubicInterpolationMode: "monotone",
        tension: 0.4,
      },
      // shouldShow("twitter") && {
      //   data: twitterAnalytics[category],
      //   fill: false,
      //   borderColor: colors["twitter"],
      //   cubicInterpolationMode: "monotone",
      //   tension: 0.4,
      // },
    ].filter(Boolean);

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
  }, [canvasRef, tab, mediaFilters, showAllMedia, range, youtubeAnalytics]);
  const handleChangeTimeRange = (evnt) => {
    analyticsViewRange(evnt.target.value);
  };
  return (
    <Card className="bg-white">
      <CardContent>
        <div className="flex justify-between">
          <div className="space-y-2 sm:space-y-0 sm:space-x-2 md:space-x-6">
            <Tab label="Reach" tab={tab} onClick={setTab} />
            <Tab label="Engagement" tab={tab} onClick={setTab} />
            <Tab label="Shares" tab={tab} onClick={setTab} />
          </div>
          <div>
            <RangeSelect
              label=""
              name="range"
              className="border border-gray-300"
              value={graphRange}
              options={analyticsSelectRange}
              onChange={handleChangeTimeRange}
            />
          </div>
        </div>

        <div className="my-3 p-2">
          {!mediaFilters.length && !showAllMedia ? (
            <p className="text-center pb-8">Select a media filter</p>
          ) : (
            <canvas ref={canvasRef} height="90"></canvas>
          )}
        </div>

        <div className="mt-3 flex flex-col space-y-2 lg:flex-row lg:justify-between lg:space-y-0">
          <Link to="/analytics" className="text-copy text-xs md:text-sm">
            View all analytics
          </Link>
          <div className="space-x-4">
            <CustomCheckbox
              id="instagram"
              name="instagram"
              label="Instagram"
              checkedClassName="bg-blue-400"
              labelClassName="ml-1 text-xs md:text-sm"
              onChange={handleMediaFilterCheckboxChange}
            />
            {/* <CustomCheckbox
              id="tiktok"
              name="tiktok"
              label="TikTok"
              checkedClassName="bg-blue-600"
              labelClassName="ml-1 text-xs md:text-sm"
              onChange={handleMediaFilterCheckboxChange}
            /> */}
            <CustomCheckbox
              id="youtube"
              name="youtube"
              label="YouTube"
              checkedClassName="bg-purple-400"
              labelClassName="ml-1 text-xs md:text-sm"
              onChange={handleMediaFilterCheckboxChange}
            />
            <CustomCheckbox
              id="twitter"
              name="twitter"
              label="Twitter"
              checkedClassName="bg-purple-700"
              labelClassName="ml-1 text-xs md:text-sm"
              onChange={handleMediaFilterCheckboxChange}
            />
            <CustomCheckbox
              id="combined"
              name="combined"
              label="Combined"
              checkedClassName="bg-purple-900"
              labelClassName="ml-1 text-xs md:text-sm"
              checked={showAllMedia}
              onChange={(evt) => setShowAllMedia(evt.target.checked)}
            />
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

export default memo(AnalyticsGraph);

const analyticsSelectRange = (() => {
  const arr = ["Day", "Month", "Quarter", "Year"];
  return arr.reduce((rangeObj, opt) => {
    rangeObj[opt] = opt;
    return rangeObj;
  }, {});
})();
