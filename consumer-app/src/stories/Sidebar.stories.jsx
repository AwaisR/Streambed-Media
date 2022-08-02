import React from "react";
import Sidebar from "../components/navigation/Sidebar";

export default {
  title: "Layouts/Sidebar",
  component: Sidebar,
};

export const Default = (args) => <Sidebar {...args} />
Default.args = {
  page: "Analytics",
};