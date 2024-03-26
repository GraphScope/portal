import { GraphApiFactory } from '@graphscope/studio-server';
import {
  transformGrootDeleteEdgeToOptions,
  transformGrootCreateVertexToOptions,
  transformGrootCreateEdgeToOptions,
} from '@/components/utils/schema-groot';
import { notification } from 'antd';

/** 删除点类型 */
export const deleteVertexType = async (graphName: string, typeName: string) => {
  const graphs = await GraphApiFactory(undefined, location.origin)
    .deleteVertexType(graphName, typeName)
    .then(res => {
      if (res.status === 200) {
        return res.data;
      }
      return [];
    })
    .catch(error => {
      notification.error({
        message: '删除点类型失败',
        description: error.toString(),
      });
      return [];
    });

  return graphs;
};
/** 删除边类型 */
export const deleteEdgeType = async (graphName: string, options: any) => {
  //@ts-ignore
  const { typeName, sourceVertexType, destinationVertexType } = transformGrootDeleteEdgeToOptions(options)[0];
  const graphs = await GraphApiFactory(undefined, location.origin)
    .deleteEdgeType(graphName, typeName, sourceVertexType, destinationVertexType)
    .then(res => {
      if (res.status === 200) {
        return res.data;
      }
      return [];
    })
    .catch(error => {
      notification.error({
        message: '删除边类型失败',
        description: error.toString(),
      });
      return [];
    });

  return graphs;
};
/** 删除边或点类型 */
export const deleteVertexOrEdge = (
  type: string,
  graphName: string,
  options: { graphName: string; typeName?: string; nodes?: any[]; edges?: any[] },
) => {
  const { typeName, nodes, edges } = options;
  if (type === 'node') {
    deleteVertexType(graphName, typeName!);
  }
  if (type === 'edge') {
    deleteEdgeType(graphName, { nodes, edges });
  }
};
/** 创建点类型 */
export const createVertexType = async (graphName: string, schema: { label: string }, options: any) => {
  const vertexType = transformGrootCreateVertexToOptions(schema, options);
  const graphs = await GraphApiFactory(undefined, location.origin)
    .createVertexType(graphName, vertexType)
    .then(res => {
      if (res.status === 200) {
        return res.data;
      }
      return [];
    })
    .catch(error => {
      notification.error({
        message: '创建边点型失败',
        description: error.toString(),
      });
      return [];
    });
  return graphs;
};
/** 创建边类型 */
export const createEdgeType = async (graphName: string, nodeList: any[], schema: any, options: any) => {
  const edgeType = transformGrootCreateEdgeToOptions(nodeList, schema, options);
  const graphs = await GraphApiFactory(undefined, location.origin)
    .createEdgeType(graphName, edgeType)
    .then(res => {
      if (res.status === 200) {
        return res.data;
      }
      return [];
    })
    .catch(error => {
      notification.error({
        message: '创建边类型失败',
        description: error.toString(),
      });
      return [];
    });

  return graphs;
};
/** 创建点或边类型 */
export const createVertexOrEdgeType = async (
  type: String,
  graphName: string,
  nodeList: any[],
  schema: any,
  options: any,
) => {
  if (type === 'node') {
    createVertexType(graphName, schema, options);
  }
  if (type === 'edge') {
    createEdgeType(graphName, nodeList, schema, options);
  }
};
