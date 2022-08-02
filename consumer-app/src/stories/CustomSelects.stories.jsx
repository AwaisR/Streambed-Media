import React, { useState } from "react";
import Select from "../components/forms/CustomSelect";

export default {
  title: "Forms/Custom Menus",
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

export const CustomSelect = (args) => {
  const [value, setValue] = useState("");
  const handle = (v) => setValue(v);
  return <Select {...args} value={value} onChange={handle} />;
}

CustomSelect.args = {
  name: "company",
  placeholder: "Select Industry",
  className: "max-w-sm",
  options,
};
