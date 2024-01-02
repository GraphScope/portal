import { notification } from 'antd';
import neo4j, { Driver, Node, Path, Relationship, Session } from 'neo4j-driver';

export interface GraphNode {
  id: string; // 节点id
  label: string; // 节点标签
  nodeType: string;
  nodeTypeKeyFromProperties: string;
  data: Record<string, any>; // 节点属性
}

export interface GraphEdge {
  id: string;
  source: string; // 边的起点
  target: string; // 边的终点
  label: string; // 边的标签
  edgeType: string;
  edgeTypeKeyFromProperties: string;
  data: Record<string, any>; // 边的属性
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
        this.driver = neo4j.driver(uri, neo4j.auth.basic(username, password));
      } else {
        this.driver = neo4j.driver(uri);
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
      if (!this.session) {
        const session = this.driver.session();
        this.session = session;
      }
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
      console.log('%c[Neo4j Driver] NeighborsQuery 查询语句', 'color:yellow', value);
      console.log('%c[Neo4j Driver] NeighborsQuery 查询结果', 'color:green', result);

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
  async queryCypher(cypher: string): Promise<Graph | Table> {
    try {
      const session = await this.getSession();
      if (!session) {
        notification.error({
          message: 'Session 失效',
        });
        return {
          nodes: [],
          edges: [],
        };
      }
      const result = await session.run(cypher);
      console.log('%c[Neo4j Driver] QueryCypher 查询语句', 'color:yellow', cypher);
      console.log('%c[Neo4j Driver] QueryCypher 查询结果', 'color:green', result);
      session.close();
      return processResult(result);
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

/**
 * 将查询结果转化为图结构，如果不能转化为图结构，转化为table结构
 * @param result 查询结果
 * @returns 如果能够转化为图结构，返回图结构，否则返回table结构
 */
export function processResult(result) {
  const nodes: GraphNode[] = [];
  const edges: GraphEdge[] = [];
  const table: Table = {
    headers: [],
    rows: [],
  };
  result.records.forEach(record => {
    //@ts-ignore
    record._fields.forEach(item => {
      const isNode = item.__isNode__;
      const isEdge = item.__isRelationship__;
      const isPath = item.__isPath__;
      const isInteger = item.__isInteger__;

      if (isNode) {
        const { labels, properties, identity } = item as Node;
        const nodeLabel = labels[0];
        nodes.push({
          id: identity.low.toString(),
          label: nodeLabel,
          nodeType: nodeLabel,
          nodeTypeKeyFromProperties: 'GI_TYPE',
          data: {
            label: nodeLabel,
            GI_TYPE: nodeLabel,
            ...properties,
          },
        });
      }
      if (isEdge) {
        const { start, end, properties, type, identity } = item as Relationship;
        const source = start.low.toString();
        const target = end.low.toString();
        const label = type;
        edges.push({
          id: identity.low.toString(),
          source,
          target,
          label,
          edgeType: label,
          edgeTypeKeyFromProperties: 'GI_TYPE',
          data: {
            source,
            target,
            GI_TYPE: label,
            label,
            ...properties,
          },
        });
      }
      if (isPath) {
        const { segments } = item as Path;
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
              nodeType: startLabels[0],
              nodeTypeKeyFromProperties: 'GI_TYPE',
              data: {
                label: startLabels[0],
                GI_TYPE: startLabels[0],
                ...startProperties,
              },
            });
          }
          if (!hasEndNode) {
            nodes.push({
              id: endIdentity.low.toString(),
              label: endLabels[0],
              nodeType: endLabels[0],
              nodeTypeKeyFromProperties: 'GI_TYPE',
              data: {
                label: endLabels[0],
                GI_TYPE: endLabels[0],
                ...endProperties,
              },
            });
          }
          const { identity, type, start: source, end: target, properties } = relationship;
          const hasRelationship = edges.find(d => d.id === identity.low.toString());
          if (!hasRelationship) {
            edges.push({
              id: identity.low.toString(),
              source: source.low.toString(),
              target: target.low.toString(),
              label: type,
              edgeType: type,
              edgeTypeKeyFromProperties: 'GI_TYPE',
              data: {
                source: source.low.toString(),
                target: target.low.toString(),
                GI_TYPE: type,
                ...properties,
              },
            });
          }
        });
      }
      if (isInteger) {
        table.headers.push(...(record.keys as string[]));
        table.rows.push(item.low);
      }
    });
  });

  console.log({ nodes, edges, table });
  return { nodes, edges, table };
}
