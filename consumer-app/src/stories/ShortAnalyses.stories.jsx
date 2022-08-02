import React from "react";
import ShortAnalysis from "../components/analytics/ShortAnalysis";

export default {
  title: "Analytics/ShortAnalyses",
  component: ShortAnalysis,
};

export const Default = (args) => <ShortAnalysis {...args} />
Default.args = {
  title: "Your Reach",
  className: "max-w-xs",
  tooltip: "Reach for the stars",
  summaryTitle: "Likes in past week",
  points: [120, 50, 120, 50],
  unit: 'likes',
};