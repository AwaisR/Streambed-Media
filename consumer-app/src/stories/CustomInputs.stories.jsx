import React from "react";
import CustomInputs from "../components/forms/CustomInputs";

export default {
  title: "Forms/Inputs",
  component: CustomInputs,
};

export const TextInput = (args) => <CustomInputs {...args} />;
TextInput.args = {
  type: "text",
  label: "Company Name",
  name: "company",
  value: "",
  placeholder: "LuLuLemon Athletica",
  className: "max-w-md",
};

export const TextInputWithValue = (args) => <CustomInputs {...args} />;
TextInputWithValue.args = {
  type: "text",
  label: "Company Name",
  name: "company",
  value: "Hello world",
  placeholder: "LuLuLemon Athletica",
  className: "max-w-md",
};

export const NumberInput = (args) => <CustomInputs {...args} />;
NumberInput.args = {
  type: "number",
  name: "zip",
  value: "hello world",
  label: "ZIP / Postal Code",
  placeholder: "E.g. 10003",
  className: "max-w-md",
};

export const NumberInputWithValue = (args) => <CustomInputs {...args} />;
NumberInputWithValue.args = {
  type: "number",
  name: "zip",
  value: "10001",
  label: "ZIP / Postal Code",
  placeholder: "E.g. 10003",
  className: "max-w-md",
};

export const PasswordInput = (args) => <CustomInputs {...args} />;
PasswordInput.args = {
  type: "password",
  name: "password",
  value: "passwordhehe",
  label: "New Password",
  placeholder: "********",
  className: "max-w-md",
};
