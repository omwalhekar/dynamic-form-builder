import { camelCase } from "lodash";

export const toCamelCase = (key: string) => {
  const cleanedStr = key.replace(/[^a-zA-Z0-9 ]/g, "");
  return camelCase(cleanedStr);
};
