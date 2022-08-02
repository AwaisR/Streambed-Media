import React, { useState } from "react";
import Select from "../components/forms/Select";

export default {
  title: "Forms/Menus",
  component: Select,
};

const options = {
  aerospace: "Aerospace",
  agriculture: "Agriculture",
  chemical: "Chemical",
  computer: "Computer",
  construction: "Construction",
  defence: "Defense",
  energy: "Energy",
};

export const NativeSelect = (args) => {
  const [value, setValue] = useState("");
  const handle = (e) => {
    const { value: v } = e.target;
    setValue(v);
  };
  return <Select {...args} value={value} onChange={handle} />;
};

NativeSelect.args = {
  name: "company",
  placeholder: "Select Industry",
  className: "max-w-sm",
  options,
};
