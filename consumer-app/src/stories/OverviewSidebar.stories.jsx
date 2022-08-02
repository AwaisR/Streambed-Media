import React from "react";
import OverviewSidebar from "../components/dashboard/OverviewSidebar";

export default {
  title: "Dashboard/Overview Sidebar",
  component: OverviewSidebar,
};

export const Default = (args) => <OverviewSidebar {...args} />
Default.args = {
  className: "w-96",
};