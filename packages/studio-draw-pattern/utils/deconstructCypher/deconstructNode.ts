import { Node } from "../../types/node";
import { Property } from "../../types/property";
import { Variable } from "../../types/variable";
import deconstructProperty from "./deconstructProperty";
import deconstructVariable from "./deconstructVariable";

const deconstructNode = (
  nodes: RegExpMatchArray | null,
): { returnNodes: Node[]; returnVariables: Variable[] } | null => {
  if (nodes === null) return null;
  const returnNodes: Node[] = [];
  const returnVariables: Variable[] = [];
  const labelsRegexp = /\:[\d\w\s\:]+?(?=[\{\)])/g;
  const labelRegexp = /(?<=\:)[\d\w]+/g;
  nodes.forEach((node, nodeIndex) => {
    returnNodes.push({
      nodeKey: `${node}-${nodeIndex}`,
      inRelations: [],
      outRelations: [],
    });
    // deconstruct labels
    const labels = node.match(labelsRegexp);
    let labelsArray: RegExpMatchArray | null = null;
    if (labels) labelsArray = labels![0].match(labelRegexp);
    labelsArray?.length !== 0 &&
      (returnNodes[nodeIndex].labels = labelsArray as string[]);
    // deconstruct properties
    const propertyArray = deconstructProperty(node);
    propertyArray.length && (returnNodes[nodeIndex].properties = propertyArray);
    // deconstruct variable
    const variable = deconstructVariable(
      node,
      "NODE",
      returnNodes[nodeIndex].nodeKey,
    );
    if (variable) {
      returnNodes[nodeIndex].variables = variable.variableKey;
      returnVariables.push(variable);
    }
  });
  return { returnNodes, returnVariables };
};

export default deconstructNode;
