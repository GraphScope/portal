import { Edge } from "../../types/edge";
import { Node } from "../../types/node";

const generateProperty = (value: Node | Edge): string[] => {
  // 拿到当前节点的所有的property
  let propertiesArray: string[] = [];
  value.properties?.forEach((property, index) => {
    let propertyStatement: string = "";
    propertyStatement += property.name;
    // 当value为字符串时需要在value的两边加上引号""
    if (typeof property.value === "number") {
      propertyStatement += `:${property.value}`;
      // 当value为数字类型时value的两边直接引用不用引号""
    } else {
      propertyStatement += `:"${property.value}"`;
    }
    propertiesArray.push(propertyStatement);
  });

  return propertiesArray;
};

export default generateProperty;
