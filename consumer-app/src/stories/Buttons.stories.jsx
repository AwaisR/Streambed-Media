import React from "react";
import Button from "../components/common/Button";

export default {
  title: "Common/Buttons",
  component: Button,
};

export const Primary = (args) => <Button {...args}>Sign in</Button>
Primary.args = {
  theme: "primary",
};

export const Cancel = (args) => <Button {...args}>Cancel</Button>
Cancel.args = {
  theme: "cancel",
};

export const Inactive = (args) => <Button {...args}>Sign in</Button>
Inactive.args = {
  theme: "inactive",
};

export const Active = (args) => <Button {...args}>Sign in</Button>
Active.args = {
  theme: "active",
};