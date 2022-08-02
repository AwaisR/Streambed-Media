import React from "react";
import Input from "../components/forms/Input";

export default {
  title: "Forms/Inputs",
  component: Input,
};

export const TextInput = (args) => <Input {...args} />;
TextInput.args = {
  type: "text",
  label: "Company Name",
  name: "company",
  value: "",
  placeholder: "LuLuLemon Athletica",
  className: "max-w-md"
};

export const TextInputWithValue = (args) => <Input {...args} />;
TextInputWithValue.args = {
  type: "text",
  label: "Company Name",
  name: "company",
  value: "Hello world",
  placeholder: "LuLuLemon Athletica",
  className: "max-w-md"
};

export const NumberInput = (args) => <Input {...args} />;
NumberInput.args = {
  type: "number",
  name: "zip",
  value: "hello world",
  label: "ZIP / Postal Code",
  placeholder: "E.g. 10003",
  className: "max-w-md",
};

export const NumberInputWithValue = (args) => <Input {...args} />;
NumberInputWithValue.args = {
  type: "number",
  name: "zip",
  value: "10001",
  label: "ZIP / Postal Code",
  placeholder: "E.g. 10003",
  className: "max-w-md",
};

export const PasswordInput = (args) => <Input {...args} />;
PasswordInput.args = {
  type: "password",
  name: "password",
  value: "passwordhehe",
  label: "New Password",
  placeholder: "********",
  className: "max-w-md",
};