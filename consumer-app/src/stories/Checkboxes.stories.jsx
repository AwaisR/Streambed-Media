import React from "react";
import Checkbox from "../components/forms/Checkbox";

export default {
  title: "Forms/Checkboxes",
  component: Checkbox,
};

export const DefaultCheckbox = (args) => <Checkbox {...args} />
DefaultCheckbox.args = {
  name: "remember",
  label: "Remember me",
};

export const UncheckedBox = (args) => <Checkbox {...args} />
UncheckedBox.args = {
  name: "remember",
  label: "Remember me",
  checked: false,
};

export const CheckedBox = (args) => <Checkbox {...args} />
CheckedBox.args = {
  name: "remember",
  label: "Remember me",
  checked: true,
};