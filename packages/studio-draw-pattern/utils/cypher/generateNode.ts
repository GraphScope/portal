import type { Node } from "../../types/node";
import type { Variable } from "../../types/variable";
import generateProperty from "./generateProperty";

const generateNode = (nodes: Node[], variables: Variable[]): Node[] => {
  let returnNodes: Node[] = [];
  nodes.forEach((node, index) => {
    let statement: string = "";
    //  检测当前节点是否有variable,同时拿到variable的name
    const currentVariable = variables.find(
      (variable) => node.variables && variable.variableKey === node.variables,
    );
    if (currentVariable?.name) statement += currentVariable.name;
    // 拿到当前节点的所有的label
    node.labels?.forEach((label, index) => {
      statement = statement + `:${label}`;
    });
    const propertiesArray: string[] = generateProperty(node);
    // 拿到当前节点的所有的property
    const propertiesStatement =
      propertiesArray.length !== 0 ? ` {${propertiesArray.join(",")}}` : "";
    statement = "(" + statement + propertiesStatement + ")";
    returnNodes.push({
      ...node,
      statement: statement,
    });
  });
  return returnNodes;
};
export default generateNode;
