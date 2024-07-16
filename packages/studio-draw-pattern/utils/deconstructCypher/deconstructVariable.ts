import { Variable } from "../../types/variable";

type VariableBelong = "NODE" | "RELATION";
const deconstructVariable = (
  sentence: string,
  belong: VariableBelong,
  nodeKey: string,
): Variable | null => {
  const variableRegexp = /(?<=[\(\[])[\d\w]+(?=[\:\)\]\s\{])/g;
  const variable = sentence.match(variableRegexp);
  if (!variable) return null;
  return {
    variableKey: `${variable[0]}-${sentence}`,
    name: variable[0],
    belongKey: nodeKey,
    belongType: belong,
  };
};
export default deconstructVariable;
