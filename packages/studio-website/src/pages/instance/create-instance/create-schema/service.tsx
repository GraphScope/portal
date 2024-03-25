import { GraphApiFactory } from '@graphscope/studio-server';
import type { VertexType } from '@graphscope/studio-server';
import {
  transformGrootDeleteEdgeToOptions,
  transformGrootCreateVertexToOptions,
  transformGrootCreateEdgeToOptions,
} from '@/components/utils/schema-groot';

export const deleteVertexType = async (graphName: string, typeName: string) => {
  const graphs = await GraphApiFactory(undefined, location.origin)
    .deleteVertexType(graphName, typeName)
    .then(res => {
      if (res.status === 200) {
        return res.data;
      }
      return [];
    });

  return graphs;
};
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
    });

  return graphs;
};
export const createVertexType = async (graphName: string, schema: { label: string }, options: any) => {
  const vertexType = transformGrootCreateVertexToOptions(schema, options);
  const graphs = await GraphApiFactory(undefined, location.origin)
    .createVertexType(graphName, vertexType)
    .then(res => {
      if (res.status === 200) {
        return res.data;
      }
      return [];
    });

  return graphs;
};
export const createEdgeType = async (graphName: string, nodeList: any[], schema: any, options: any) => {
  const edgeType = transformGrootCreateEdgeToOptions(nodeList, schema, options);
  const graphs = await GraphApiFactory(undefined, location.origin)
    .createEdgeType(graphName, edgeType)
    .then(res => {
      if (res.status === 200) {
        return res.data;
      }
      return [];
    });

  return graphs;
};
