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
      if (res.status >= 200 || res.status <= 300) {
        notification.success({
          message: 'Delete the point type',
          description: 'operation successful',
        });
        // @TODO 等后端返回
        return [{ status: 200 }];
      }
      return [];
    })
    .catch(error => {
      notification.error({
        message: 'Failed to delete the point type',
        description: error.toString(),
      });
      return [{ status: 500 }];
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
      if (res.status >= 200 || res.status <= 300) {
        notification.success({
          message: 'Delete the edge type',
          description: 'operation successful',
        });
        // @TODO 等后端返回
        return [{ status: 200 }];
      }
      return [];
    })
    .catch(error => {
      notification.error({
        message: 'Failed to delete edge type',
        description: error.toString(),
      });
      return [{ status: 500 }];
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
    return deleteVertexType(graphName, typeName!);
  }
  if (type === 'edge') {
    return deleteEdgeType(graphName, { nodes, edges });
  }
};
/** 创建点类型 */
export const createVertexType = async (graphName: string, schema: { label: string }, options: any) => {
  const vertexType = transformGrootCreateVertexToOptions(schema, options);
  const graphs = await GraphApiFactory(undefined, location.origin)
    .createVertexType(graphName, vertexType)
    .then(res => {
      if (res.status >= 200 || res.status <= 300) {
        notification.success({
          message: 'Create a point type',
          description: 'operation successful',
        });
        // @TODO 等后端返回
        return [{ status: 200 }];
      }
      return [];
    })
    .catch(error => {
      notification.error({
        message: 'Failed to create a point type',
        description: error.toString(),
      });
      return [{ status: 500 }];
    });
  return graphs;
};
/** 创建边类型 */
export const createEdgeType = async (graphName: string, nodeList: any[], schema: any, options: any) => {
  const edgeType = transformGrootCreateEdgeToOptions(nodeList, schema, options);
  const graphs = await GraphApiFactory(undefined, location.origin)
    .createEdgeType(graphName, edgeType)
    .then(res => {
      if (res.status >= 200 || res.status <= 300) {
        notification.success({
          message: 'Create a edge type',
          description: 'operation successful',
        });
        // @TODO 等后端返回
        return [{ status: 200 }];
      }
      return [];
    })
    .catch(error => {
      notification.error({
        message: 'Failed to create an edge type',
        description: error.toString(),
      });
      // @TODO 等后端返回
      return [{ status: 500 }];
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
    return createVertexType(graphName, schema, options);
  }
  if (type === 'edge') {
    return createEdgeType(graphName, nodeList, schema, options);
  }
};
