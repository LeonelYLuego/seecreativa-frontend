import { RuleObject } from "antd/es/form";

export function ValidateFloat(message: string) {
  function validator(
    rule: RuleObject,
    value: string,
    callback: (error?: string | undefined) => void
  ) {
    if (value == "" || value == undefined) callback();
    if (/^\d+(?:\.\d+)?$/.test(value)) callback();
    else callback(message);
  }

  return validator;
}

export function ValidateRequiredFloat(message: string) {
  function validator(
    rule: RuleObject,
    value: string,
    callback: (error?: string | undefined) => void
  ) {
    if (value == "" || value == undefined) callback(message);
    if (/^\d+(?:\.\d+)?$/.test(value)) callback();
    else callback(message);
  }

  return validator;
}
