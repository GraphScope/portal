import neo4j, { Driver, Node, Path, Relationship, Session } from 'neo4j-driver';

export interface GraphNode {
  id: string; // 节点id
  label: string; // 节点标签
  properties: Record<string, any>; // 节点属性
}

export interface GraphEdge {
  id: string;
  source: string; // 边的起点
  target: string; // 边的终点
  label: string; // 边的标签
  properties: Record<string, any>; // 边的属性
}

export interface Graph {
  nodes: GraphNode[]; // 图的节点
  edges: GraphEdge[]; // 图的边
}

export interface Table {
  headers: string[]; // 表头
  rows: Record<string, any>[]; // 表的行
}

class CypherDriver {
  private driver: Driver | undefined;
  private session: Session | undefined;

  constructor(uri: string, username?: string, password?: string) {
    try {
      if (username && password) {
        this.driver = neo4j.driver(uri, neo4j.auth.basic(username, password), { encrypted: false });
      } else {
        this.driver = neo4j.driver(uri, undefined, { encrypted: false });
      }
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * 获取数据库名称
   * @returns 数据库名称
   */
  async connect() {
    if (this.driver) {
      await this.driver.verifyConnectivity();
      return true;
    }
    return false;
  }
  async getSession() {
    if (this.driver) {
      //@ts-ignore
      // const IS_OPEN = this.session && this.session._open;
      // if (!IS_OPEN) {
      const session = this.driver.session();
      this.session = session;
      // }
      return this.session;
    }
  }

  /**
   * 获取指定节点的k度关系，如果能够转化为图结构，返回图结构，否则返回table结构
   * @param nodeIds 节点id数组
   * @param degree k度
   * @returns 如果能够转化为图结构，返回图结构，否则返回table结构
   */
  async getKDegreeRelationships(nodeIds: string[], degree: number): Promise<Graph | Table> {
    try {
      if (!this.driver) return { nodes: [], edges: [] };

      const session = this.driver.session({});

      const value = `
      match data=(n)-[*..${degree}]-(m) WHERE id(n) in [${nodeIds}] RETURN data LIMIT 200
      `;

      const result = await session.run(value);
      console.log('%c[Cypher Query Driver] NeighborsQuery 查询语句', 'color:blue', value);
      console.log('%c[Cypher Query Driver] NeighborsQuery 查询结果', 'color:green', result);

      session.close();

      return processResult(result);
    } catch (error: any) {
      console.log('error', error);

      return {
        nodes: [],
        edges: [],
        //@ts-ignore
        raw: error,
        mode: 'error',
      };
    }
  }

  /**
   * 查询cypher语句
   * @param cypher cypher语句
   * @returns 如果能够转化为图结构，返回图结构，否则返回table结构
   */
  async query(cypher: string): Promise<Graph | Table> {
    try {
      console.log('%c[Cypher Query Driver] Statement', 'color:blue', cypher);
      const session = await this.getSession();
      if (!session) {
        return {
          nodes: [],
          edges: [],
        };
      }
      const result = await session.run(cypher);
      console.log('%c[Cypher Query Driver] Result', 'color:green', result);

      const { nodes_need_properties, ...data } = processResult(result);
      if (nodes_need_properties.length === 0) {
        session.close();
        return data;
      } else {
        /** path 中的node 不包含属性，需要在这里额外请求一次 **/
        const script = `
        Match (n) where elementId(n) in [${nodes_need_properties}] return n;
        `;
        const result_nodes = await session.run(script);
        const { nodes } = processResult(result_nodes);
        const nodeMap = nodes.reduce((acc, curr) => {
          acc[curr.id] = curr;
          return acc;
        }, {});
        /** 将属性追加到数据中 */
        data.nodes.forEach(item => {
          if (nodeMap[item.id]) {
            item.properties = { ...item.properties, ...nodeMap[item.id].properties };
          }
        });
        session.close();
        return data;
      }
    } catch (error: any) {
      return {
        nodes: [],
        edges: [],
        //@ts-ignore
        raw: error,
        mode: 'error',
      };
    }
  }

  /**
   * 关闭数据库连接
   */
  async close(): Promise<void> {
    if (!this.driver) return;
    await this.driver.close();
  }
}

export default CypherDriver;

// todo: 和Neo4j官方的数据处理逻辑保持一致：https://github.com/neo4j/neo4j-browser/blob/master/src/browser/modules/Stream/CypherFrame/VisualizationView/VisualizationView.tsx#L129
/**
 * 将查询结果转化为图结构，如果不能转化为图结构，转化为table结构
 * @param result 查询结果
 * @returns 如果能够转化为图结构，返回图结构，否则返回table结构
 */
export function processResult(result) {
  const nodes: GraphNode[] = [];
  const edges: GraphEdge[] = [];
  const table: any[] = [];
  const nodes_need_properties: Set<any> = new Set();
  result.records.forEach(record => {
    let tempRow = {};
    //@ts-ignore
    record._fields.forEach((item, idx) => {
      const isString = typeof item === 'string';
      const isNode = item.__isNode__;
      const isEdge = item.__isRelationship__;
      const isPath = item.__isPath__;
      const isInteger = item.__isInteger__;
      const properties = processProperties(item.properties);
      if (isNode) {
        const { labels, identity, elementId } = item as Node;
        const nodeLabel = labels[0];
        nodes.push({
          id: elementId,
          label: nodeLabel,
          properties,
        });
      }
      if (isEdge) {
        const { type, startNodeElementId, endNodeElementId, elementId } = item as Relationship;
        const source = startNodeElementId; //  start.low.toString();
        const target = endNodeElementId; //end.low.toString();
        const label = type;
        edges.push({
          id: elementId,
          source,
          target,
          label,
          properties,
        });
      }
      if (isPath) {
        const { start, segments, end } = item as Path;

        segments.forEach(c => {
          const { start, end, relationship } = c;
          const { elementId: startElementId, labels: startLabels, properties: startProperties } = start;
          const { elementId: endElementId, labels: endLabels, properties: endProperties } = end;
          let hasStarNode, hasEndNode;

          nodes.forEach(item => {
            if (item.id === startElementId) hasStarNode = true;
            if (item.id === endElementId) hasEndNode = true;
          });

          if (!hasStarNode) {
            nodes.push({
              id: startElementId,
              label: startLabels[0],
              properties: processProperties(start.properties),
            });
            nodes_need_properties.add(startElementId);
          }
          if (!hasEndNode) {
            nodes.push({
              id: endElementId,
              label: endLabels[0],
              properties: processProperties(end.properties),
            });
            nodes_need_properties.add(endElementId);
          }
          const { elementId: edgeElementId, type, startNodeElementId, endNodeElementId } = relationship;
          const hasRelationship = edges.find(d => d.id === edgeElementId);
          if (!hasRelationship) {
            edges.push({
              id: edgeElementId,
              source: startNodeElementId,
              target: endNodeElementId,
              label: type,
              properties: processProperties(relationship.properties),
            });
          }
        });
      }
      if (isInteger) {
        tempRow[record.keys[idx]] = item.low;
      }
      if (isString) {
        //@ts-ignore
        tempRow[record.keys[idx]] = item;
      }
    });
    if (Object.keys(tempRow).length !== 0) {
      table.push(tempRow);
    }
  });

  return {
    ...transformData(nodes, edges),
    table,
    raw: result,
    nodes_need_properties: [...nodes_need_properties.values()],
  };
}

export function transformData(_nodes, _edges) {
  const nodesMap = new Map();
  _nodes.forEach(item => {
    nodesMap.set(item.id, item);
  });
  const edges = _edges.filter(item => {
    const { source, target } = item;
    const sourceNode = nodesMap.get(source);
    const targetNode = nodesMap.get(target);
    return sourceNode && targetNode;
  });

  return {
    nodes: [...nodesMap.values()],
    edges,
  };
}

export function deduplicateNodes(nodes) {
  const res = nodes.reduce(
    (acc, curr) => {
      if (!acc.taken[curr.id]) {
        acc.nodes.push(curr);
        acc.taken[curr.id] = true;
      }
      return acc;
    },
    { nodes: [], taken: {}, nodeLimitHit: false },
  );
  return res.nodes;
}

export function processProperties(properties) {
  if (!properties) {
    return {};
  }
  Object.keys(properties).forEach(key => {
    const value = properties[key];
    const isInteger = value.__isInteger__;
    if (isInteger) {
      properties[key] = value.low;
    }
  });
  return properties;
}
