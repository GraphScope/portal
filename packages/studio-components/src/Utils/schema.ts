export interface INode {
  id: string;
  label?: string;
  data: Record<string, any>;
  [key: string]: any;
}
export interface IEdge {
  id: string;
  label?: string;
  data: Record<string, any>;
  source: string;
  target: string;
  [key: string]: any;
}
export interface ISchema {
  nodes: INode[];
  edges: IEdge[];
}

const defaultlabelKey = 'label';
/**
 * 通过 graphData 生成 Schema
 * @param graphData 图数据
 */
export const generatorSchemaByGraphData = (graphData: ISchema, defaultOptions?: any): ISchema => {
  const { nodes, edges } = graphData;
  const nodeSchemas = new Map();
  const edgeSchemas = new Map();
  const { nodeLabelFromProperties, edgeLabelFromProperties } = defaultOptions || {};

  /**
   * 递归提取属性
   * @param {object} data - 要提取属性的对象
   * @param {string} [prefix] - 用于嵌套对象属性的前缀
   * @returns {Array} - 提取后的属性数组
   */
  const extractProperties = (data, prefix = '') => {
    const properties: { name: string; type: string }[] = [];
    for (const key in data) {
      if (!data.hasOwnProperty(key)) continue;
      const value = data[key];
      const prefixedKey = prefix ? `${prefix}.${key}` : key;
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        properties.push(...extractProperties(value, prefixedKey));
      } else {
        properties.push({ name: prefixedKey, type: getType(value) });
      }
    }
    return properties;
  };
  /**
   * 获取值的类型
   * @param {any} value - 要获取类型的值
   * @returns {string} - 值的类型
   */
  const getType = value => {
    if (value === null) return 'null';
    if (Array.isArray(value)) return 'array';
    if (value instanceof Date) return 'date';
    if (!isNaN(value) && typeof value !== 'boolean') return 'number';
    if (typeof value === 'string' && isValidDate(value)) return 'date';
    return typeof value;
  };
  /**
   * 检查字符串是否为有效日期
   * @param {string} dateStr - 要检查的字符串
   * @returns {boolean} - 是否为有效日期
   */
  const isValidDate = dateStr => {
    const date = Date.parse(dateStr);
    return !isNaN(date) && new Date(dateStr).toISOString() === dateStr;
  };
  const getLabel = (entity, labelKey, labelKeyFromProperties) => {
    if (labelKeyFromProperties && entity.data[labelKeyFromProperties]) {
      return entity.data[labelKeyFromProperties];
    }
    if (labelKey) {
      return entity[labelKey];
    }
    return 'undefined';
  };

  const nodeMap = new Map(nodes.map(node => [node.id, node]));

  nodes.forEach(node => {
    const label = getLabel(node, defaultlabelKey, nodeLabelFromProperties);
    if (!nodeSchemas.has(label)) {
      const nodeSchema = {
        label,
        properties: extractProperties(node.data),
      };
      nodeSchemas.set(label, nodeSchema);
    }
  });

  edges.forEach(edge => {
    const label = getLabel(edge, defaultlabelKey, edgeLabelFromProperties);
    const currentSource = nodeMap.get(edge.source);
    const currentTarget = nodeMap.get(edge.target);

    if (!currentSource || !currentTarget) {
      console.warn(`数据不合法, 找不到 ${!currentSource ? `Source ID：${edge.source}` : `Target ID：${edge.target}`}`);
      return;
    }

    if (!edgeSchemas.has(label)) {
      const edgeSchema = {
        label,
        source: getLabel(currentSource, defaultlabelKey, nodeLabelFromProperties),
        target: getLabel(currentTarget, defaultlabelKey, nodeLabelFromProperties),
        properties: extractProperties(edge.data),
      };
      edgeSchemas.set(label, edgeSchema);
    }
  });

  return {
    nodes: Array.from(nodeSchemas.values()),
    edges: Array.from(edgeSchemas.values()),
  };
};
