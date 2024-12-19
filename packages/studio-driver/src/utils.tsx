export function safeParse(input) {
  try {
    // 尝试直接解析
    return JSON.parse(input);
  } catch (error) {
    // 如果直接解析失败，检查是否可以通过添加双引号来修复
    if (typeof input === 'string' && !input.startsWith('"') && !input.endsWith('"')) {
      try {
        // 尝试添加双引号并重新解析
        return JSON.parse(`"${input}"`);
      } catch (innerError) {
        // 如果仍然无法解析，则返回原始输入或者抛出错误
        console.error('Failed to parse the input:', innerError);
        return input;
      }
    } else {
      // 如果输入已经是有效的 JSON 字符串或其他类型的数据，直接返回
      return input;
    }
  }
}

export const storage = {
  get<T>(key: string): T | undefined {
    try {
      const values = localStorage.getItem(key);
      if (values) {
        return safeParse(values);
      }
    } catch (error) {
      console.error('Error while retrieving data from localStorage:', error);
    }
  },
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value, null, 2));
    } catch (error) {
      console.error('Error while storing data in localStorage:', error);
    }
  },
};

/** 数据去重 */
export const uniqueElementsBy = (arr: any[], fn: (arg0: any, arg1: any) => any) =>
  arr.reduce((acc, v) => {
    if (!acc.some((x: any) => fn(v, x))) acc.push(v);
    return acc;
  }, []);

export function transNeo4jSchema(raw): { nodes: []; edges: [] } {
  try {
    const nodes: any[] = [];
    const edges: any[] = [];
    const [obj] = raw.records[0]['_fields'];
    Object.keys(obj).forEach(label => {
      const item = obj[label];
      const { type, relationships } = item;
      if (type === 'node') {
        nodes.push({
          id: label,
          label: label,
          properties: Object.keys(item.properties).map(property => {
            return {
              name: property,
              type: item.properties[property].type,
            };
          }),
        });
        Object.keys(relationships).forEach(edgeLabel => {
          const edge = relationships[edgeLabel];
          const { direction } = edge;
          const source = direction === 'out' ? label : relationships[edgeLabel].labels[0];
          const target = direction === 'out' ? relationships[edgeLabel].labels[0] : label;
          edges.push({
            id: edgeLabel,
            label: edgeLabel,
            source,
            target,
            type: 'edge',
            properties: Object.keys(relationships[edgeLabel].properties).map(property => {
              return {
                name: property,
                type: relationships[edgeLabel].properties[property].type,
              };
            }),
          });
        });
      }
    });

    const _edges = uniqueElementsBy(edges, (a, b) => {
      return a.id + a.source + a.target === b.id + b.source + b.target;
    });
    return {
      nodes: nodes as [],
      edges: _edges,
    };
  } catch (error) {
    console.log('error', error);
    return {
      nodes: [],
      edges: [],
    };
  }
}
