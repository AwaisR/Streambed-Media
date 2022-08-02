import React from "react";
import RadioButton from "../components/forms/RadioButton";

export default {
  title: "Forms/RadioButtons",
  component: RadioButton,
};

export const Default = (args) => <RadioButton {...args} />
Default.args = {
  id: "dog",
  name: "animals",
  label: "Dog",
};

export const Selected = (args) => <RadioButton {...args} />
Selected.args = {
  id: "pterodactyl",
  name: "animals",
  label: "Pterodactyl",
  checked: true,
};