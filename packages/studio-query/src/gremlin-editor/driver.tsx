import { notification } from 'antd';
import gremlin from '@graphscope/_test_gremlin_';

console.log('gremlin', gremlin);

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
  private driver: any;

  constructor(uri: string, username: string = 'admin', password: string = 'password') {
    try {
      const authenticator = new gremlin.driver.auth.PlainTextSaslAuthenticator(username, password);
      console.log('authenticator', authenticator);
      const client = new gremlin.driver.Client(uri, {
        traversalSource: 'g',
        authenticator,
      });
      this.driver = client;
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
      return this.driver;
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
      notification.error({
        message: '邻居查询出错',
        description: error.toString(),
      });
      return {
        nodes: [],
        edges: [],
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
      console.log('%c[Query] 查询语句', 'color:blue', cypher);
      const result = await this.driver.submit(cypher);
      console.log('%c[Query] 查询结果', 'color:green', result);
      return processResult(result.toArray());
    } catch (error: any) {
      console.log(error);
      notification.error({
        message: 'Cypher 查询出错',
        description: error.toString(),
      });
      return {
        nodes: [],
        edges: [],
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
  console.log('result', result);
  for (const value of result) {
    console.log('value', value);
  }

  const nodes: GraphNode[] = [];
  const edges: GraphEdge[] = [];
  const table: any[] = [];
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
        const { labels, identity } = item as any;
        const nodeLabel = labels[0];
        nodes.push({
          id: identity.low.toString(),
          label: nodeLabel,
          properties,
        });
      }
      if (isEdge) {
        const { start, end, type, identity } = item as any;
        const source = start.low.toString();
        const target = end.low.toString();
        const label = type;
        edges.push({
          id: 'e_' + identity.low.toString(),
          source,
          target,
          label,
          properties,
        });
      }
      if (isPath) {
        const { segments } = item as any;
        segments.forEach(c => {
          const { start, end, relationship } = c;
          const { identity: startIdentity, labels: startLabels, properties: startProperties } = start;
          const { identity: endIdentity, labels: endLabels, properties: endProperties } = end;
          let hasStarNode, hasEndNode;

          nodes.forEach(item => {
            if (item.id === startIdentity.low.toString()) hasStarNode = true;
            if (item.id === endIdentity.low.toString()) hasEndNode = true;
          });

          if (!hasStarNode) {
            nodes.push({
              id: startIdentity.low.toString(),
              label: startLabels[0],
              properties: processProperties(start.properties),
            });
          }
          if (!hasEndNode) {
            nodes.push({
              id: endIdentity.low.toString(),
              label: endLabels[0],
              properties: processProperties(end.properties),
            });
          }
          const { identity, type, start: source, end: target } = relationship;
          const hasRelationship = edges.find(d => d.id === identity.low.toString());
          if (!hasRelationship) {
            edges.push({
              id: 'e_' + identity.low.toString(),
              source: source.low.toString(),
              target: target.low.toString(),
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

  console.log({ nodes: deduplicateNodes(nodes), edges, table });
  return { nodes: deduplicateNodes(nodes), edges, table };
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
