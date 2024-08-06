//@ts-nocheck

import gremlin from '@graphscope/_test_gremlin_';

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
  private uri: string;
  constructor(uri: string, username: string = '', password: string = '') {
    try {
      const authenticator = new gremlin.driver.auth.PlainTextSaslAuthenticator(username, password);
      const client = new gremlin.driver.Client(uri, {
        traversalSource: 'g',
        authenticator,
      });
      this.uri = uri;
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
   * 查询cypher语句
   * @param cypher cypher语句
   * @returns 如果能够转化为图结构，返回图结构，否则返回table结构
   */
  async query(cypher: string): Promise<Graph | Table> {
    let result = [];
    try {
      console.log('%c[Query] 查询语句', 'color:blue', cypher);
      result = await this.driver.submit(cypher);
      console.log('%c[Query] 查询结果', 'color:green', result);
    } catch (error: any) {
      return {
        nodes: [],
        edges: [],
        raw: error,
        mode: 'error',
      };
    }

    let mode = 'graph';
    const tableResult: any[] = [];

    const edgeItemsMapping = {};
    const nodeItemsMapping = {};
    const nodeIds = new Set();
    for (const value of result) {
      if (value instanceof gremlin.structure.Vertex) {
        await this.handleVertexMapping(nodeItemsMapping, nodeIds, value);
      } else if (value instanceof gremlin.structure.Edge) {
        await this.handleEdgeMapping(nodeItemsMapping, edgeItemsMapping, nodeIds, value);
      } else if (value instanceof gremlin.structure.Path) {
        // path isn't supported in graphscope yet.
        // https://graphscope.io/docs/interactive_engine/tinkerpop/supported_gremlin_steps
        // TODO: waiting for GIE engine.
      } else if (this.isGSExpandPath(value)) {
        for (const current of value) {
          if (current instanceof gremlin.structure.Vertex) {
            await this.handleVertexMapping(nodeItemsMapping, nodeIds, current);
          } else {
            await this.handleEdgeMapping(nodeItemsMapping, edgeItemsMapping, nodeIds, current);
          }
        }
        // also set tableResult
        await this.handleTableResult(tableResult, value);
      } else {
        mode = 'table';
        if (typeof value === 'number' || typeof value === 'string' || value instanceof BigNumber) {
          // e.g. `g.V().count()`, `g.V().id()`, `g.V().label()`
          tableResult.push(value);
        } else {
          // e.g. `valueMap()`, `elementMap()`, `expandPath()`
          // https://graphscope.io/docs/interactive_engine/tinkerpop/supported_gremlin_steps
          await this.handleTableResult(tableResult, value);
        }
      }
    }

    // query properties in batch
    if (mode === 'graph') {
      // now graphscope only support to query properties of vertex
      const vertexPropertyMap = await this.queryNodesProperties([...nodeIds]);
      for (let key in vertexPropertyMap) {
        if (key in nodeItemsMapping) {
          nodeItemsMapping[key].properties = vertexPropertyMap[key];
        }
      }
    }

    if (mode === 'graph') {
      // convert map into arraylist
      const nodes = [];
      const edges = [];
      for (const nodeKey in nodeItemsMapping) {
        nodes.push(nodeItemsMapping[nodeKey]);
      }
      for (const edgeKey in edgeItemsMapping) {
        edges.push(edgeItemsMapping[edgeKey]);
      }
      console.log({
        nodes,
        edges,
        mode,
        tableResult,
      });
      return {
        nodes,
        edges,
        mode,
        table: tableResult,
        raw: result,
      };
    }
  }

  /**
   * Whether the value was generated by GraphScope pathExpand operator.
   * https://graphscope.io/docs/interactive_engine/tinkerpop/supported_gremlin_steps#pathexpand
   * @param value: the result fetching from the gremlin server
   */
  isGSExpandPath(value) {
    if ((!value) instanceof Array) {
      return false;
    }
    try {
      let isGSPath = true;
      let hasEdge = false;
      for (const current of value) {
        // the result of PathExpand operator is a path consisting of a set of vertex and edge
        isGSPath &&= current instanceof gremlin.structure.Vertex || current instanceof gremlin.structure.Edge;
        // edgeInfo is needed for graph visualization
        if (current instanceof gremlin.structure.Edge) {
          hasEdge = true;
        }
      }
      return isGSPath && hasEdge;
    } catch (error) {
      return false;
    }
    return false;
  }

  /**
   * Convert gremlin vertex/edge data structure into js object.
   * @param client: gremlin client
   * @param value: gremlin data structure
   */
  async jsonGraphData(value) {
    const obj = {};
    const { id, label, properties } = value;
    // id, label
    obj.id = `${id}`;
    obj.label = label;
    // properties
    if (properties) {
      // general gremlin standard
      const elementProp = {};
      for (const key in properties) {
        const currentProp = properties[key];
        if (currentProp && currentProp[0]) {
          elementProp[`${key}`] = currentProp[0].value;
        }
      }
      obj.properties = elementProp;
    }
    // edge also need src/dst information
    if (value instanceof gremlin.structure.Edge) {
      const { inV, outV } = value;
      obj.inV = await this.jsonGraphData(inV);
      obj.outV = await this.jsonGraphData(outV);
    }
    return obj;
  }

  /**
   * Private function to handle vertex.
   * @param client: gremlin client
   * @param nodeItemsMapping: {vertexId: object}
   * @param nodeIds: [vertexId], used to query vertex property in batch
   * @param value: gremlin vertex data structure
   */
  async handleVertexMapping(nodeItemsMapping, nodeIds, value) {
    const vertexInfo = await this.jsonGraphData(value);
    nodeItemsMapping[vertexInfo.id] = {
      ...vertexInfo,
      nodeType: vertexInfo.label,
    };
    nodeIds.add(vertexInfo.id);
  }

  /**
   * Private function to handle edge.
   * @param client: gremlin client
   * @param nodeItemsMapping: {vertexId: object}
   * @param edgeItemsMapping: {edgeId: object}
   * @param nodeIds: [vertexId], used to query vertex property in batch
   * @param value: gremlin edge data structure
   */
  async handleEdgeMapping(nodeItemsMapping, edgeItemsMapping, nodeIds, value) {
    const edgeInfo = await this.jsonGraphData(value);
    const srcVertexInfo = edgeInfo.outV;
    const dstVertexInfo = edgeInfo.inV;
    // edge
    edgeItemsMapping[edgeInfo.id] = {
      ...edgeInfo,
      edgeType: edgeInfo.label,
      source: srcVertexInfo.id,
      target: dstVertexInfo.id,
    };
    // source vertex
    nodeItemsMapping[srcVertexInfo.id] = {
      ...srcVertexInfo,
      nodeType: srcVertexInfo.label,
    };
    nodeIds.add(srcVertexInfo.id);
    // destination vertex
    nodeItemsMapping[dstVertexInfo.id] = {
      ...dstVertexInfo,
      nodeType: dstVertexInfo.label,
    };
    nodeIds.add(dstVertexInfo.id);
  }

  /**
   * Private function to handle table result
   * @param client: gremlin client
   * @param tableResult: any[]
   * @param value: gremlin data structure
   */
  async handleTableResult(tableResult, value) {
    const entries = value.entries();
    const currentObj = {} as any;
    for (const current of entries) {
      let [key, v] = current;
      if (key instanceof gremlin.process.EnumValue) {
        // `elementMap()`
        key = `~${key.elementName}`;
      }
      if (typeof v === 'number') {
        currentObj[key] = v;
      } else if (v instanceof gremlin.structure.Vertex || v instanceof gremlin.structure.Edge) {
        currentObj[key] = await this.jsonGraphData(v);
      } else {
        currentObj[key] = JSON.stringify(v);
      }
    }
    tableResult.push(currentObj);
  }

  /**
   * Query the properties of nodes in batch.
   * @param client: The gremlin client
   * @param nodeIds: List of node's id
   */
  async queryNodesProperties(nodeIds) {
    // { id: properties }
    const propertiesMap = {};
    if (!nodeIds || nodeIds.length === 0) {
      return propertiesMap;
    }
    // gremlin
    const gremlinCode = `g.V(${nodeIds.join(',')}).elementMap()`;

    const allVertexPropertyResult = await this.driver.submit(gremlinCode);
    // parse result
    for (let properties of allVertexPropertyResult) {
      // Map(4) {
      //   EnumValue { typeName: 'T', elementName: 'label' } => 'software',
      //   EnumValue { typeName: 'T', elementName: 'id' } => BigNumber { s: -1, e: 18, c: [ 81562, 17893511750342 ] },
      //   'id' => 10,
      //   'name' => 'gremlin'
      // }
      let nodeId = null;
      const entries = properties.entries();
      const currentObj = {};
      for (const current of entries) {
        const [key, value] = current;
        if (key instanceof gremlin.process.EnumValue) {
          // EnumValue represents the id and label
          if (key.elementName === 'id') {
            nodeId = value;
          }
        } else {
          // actually properties
          currentObj[key] = value;
        }
      }
      propertiesMap[nodeId] = currentObj;
    }
    return propertiesMap;
  }

  /**
   * Query the properties of edges in batch.
   * @param client: The gremlin client
   * @param edgeIds: List of edge's id
   */
  async queryEdgesProperties(edgeIds) {
    // TODO: Query edge properties isn't support in GraphScope yet.
    // Need to consider the dummy edge of PathExpand operator.
    const propertiesMap = {};
    return propertiesMap;
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
