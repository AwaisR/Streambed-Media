import React from "react";
import ShortAnalysisWithNoGraph from "../components/analytics/ShortAnalysisWithNoGraph";

export default {
  title: "Analytics/ShortAnalysisWithNoGraph",
  component: ShortAnalysisWithNoGraph,
};

export const Default = (args) => <ShortAnalysisWithNoGraph {...args} />
Default.args = {
  title: "Your Reach",
  className: "max-w-xs",
  tooltip: "Reach for the stars",
  summaryTitle: "past week",
  points: [20, 130, 40, 25, 50],
};

export const WithPercents = (args) => <ShortAnalysisWithNoGraph {...args} />
WithPercents.args = {
  title: "Contribution Shares",
  className: "max-w-xs",
  tooltip: "Reach for the stars",
  summaryTitle: "past week",
  points: ["1.01", "1.004"],
};