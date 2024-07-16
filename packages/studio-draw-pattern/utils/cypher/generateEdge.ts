import type { Edge } from "../../types/edge";
import { Variable } from "../../types/variable";
import generateProperty from "./generateProperty";

const generateEdge = (edges: Edge[], variables: Variable[]): Edge[] => {
  let returnEdges: Edge[] = [];
  edges.forEach((edge, index) => {
    // 拿到所有的relations的type并且进行字符串拼接
    const variableIndex: number = variables.findIndex(
      (variable, index) => variable.variableKey === edge.variable,
    );
    const propertiesArray = generateProperty(edge);
    const propertiesStatement =
      propertiesArray.length !== 0 ? ` {${propertiesArray.join(",")}}` : "";

    const statement: string = `[${edge.variable ? variables[variableIndex].name : ""}${edge.type ? `:${edge.type}` : ""}${propertiesStatement}]`;

    returnEdges.push({
      ...edge,
      statement: statement,
    });
  });
  return returnEdges;
};

export default generateEdge;
