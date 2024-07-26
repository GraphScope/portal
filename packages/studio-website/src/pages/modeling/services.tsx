import { GraphApiFactory, UtilsApiFactory } from '@graphscope/studio-server';
import type { CreateVertexType, CreateEdgeType } from '@graphscope/studio-server';
import { transOptionsToSchema } from '@graphscope/studio-importor';
import { cloneDeep } from 'lodash';
import { message } from 'antd';
import { notification } from '@/pages/utils';
import { Utils } from '@graphscope/studio-components';
import {
  transformGrootCreateVertexToOptions,
  transformGrootCreateEdgeToOptions,
} from '@/components/utils/schema-groot';

const { getSearchParams } = Utils;
const { GS_ENGINE_TYPE } = window;
export const createGraph = async (graph_id: string, params: { graphName: string; nodes: any[]; edges: any[] }) => {
  const { graphName, nodes, edges } = params;
  let graphs;
  const schemaJSON = transOptionsToSchema(cloneDeep({ nodes: nodes, edges: edges }));
  if (GS_ENGINE_TYPE === 'interactive') {
    const data = {
      name: String(graphName).trim(),
      description: '',
      schema: schemaJSON,
    };
    graphs = await GraphApiFactory(undefined, location.origin).createGraph(data);
  }
  /** groot 创建 */
  if (GS_ENGINE_TYPE === 'groot') {
    // const schemagrootJSON = transOptionsToGrootSchema(cloneDeep({ nodes: nodes, edges: edges }));
    graphs = await GraphApiFactory(undefined, location.origin)
      .importSchemaById(graph_id, schemaJSON)
      .then(res => {
        if (res.status === 200) {
          return res.data;
        }
        return [];
      })
      .catch(error => {
        notification('error', error);
        return [];
      });
  }
  return graphs;
};
/** upload file */
export const uploadFile = async (file: File) => {
  return UtilsApiFactory(undefined, location.origin)
    .uploadFile(file)
    .then(res => {
      if (res.status === 200) {
        return res.data;
      }
    })
    .catch(error => {
      notification('error', error);
    });
};

export const getSchema = async (graph_id: string) => {
  let schema;
  if (window.GS_ENGINE_TYPE === 'interactive') {
    schema = await GraphApiFactory(undefined, location.origin)
      .getGraphById(graph_id)
      .then(res => {
        if (res.status === 200) {
          return res.data.schema;
        }
        return { vertex_types: [], edge_types: [] };
      })
      .catch(error => {
        notification('error', error);
        return { vertex_types: [], edge_types: [] };
      });
  }
  if (window.GS_ENGINE_TYPE === 'groot') {
    schema = await GraphApiFactory(undefined, location.origin)
      .getSchemaById(graph_id)
      .then(res => {
        if (res.status === 200) {
          return res.data;
        }
        return { nodes: [], edges: [] };
      })
      .catch(error => {
        notification('error', error);
      });
    // schema = transformDataMapToGrootSchema(JSON.parse(JSON.stringify(schema)));
  }
  return schema;
};
/** groot interface */
/** 删除节点或边 */
export const deleteVertexTypeOrEdgeType = async (
  type: string,
  typeName: string,
  sourceVertexType?: string,
  destinationVertexType?: string,
  nodes?: any,
) => {
  let response: boolean = false;
  const graph_id = getSearchParams('graph_id') || '';
  if (type === 'nodes') {
    try {
      const res = await GraphApiFactory(undefined, location.origin).deleteVertexTypeByName(graph_id, typeName);
      response = true;
      message.success(res.data);
    } catch (error) {
      message.error(error.response.data);
    }
  }
  if (type === 'edges') {
    const nodeMap: Record<string, string> = {};
    nodes.map((item: { id: string | number; data: { label: string } }) => {
      nodeMap[item.id] = item.data.label;
      return item.data.label;
    });
    try {
      const res = await GraphApiFactory(undefined, location.origin).deleteEdgeTypeByName(
        graph_id,
        typeName,
        nodeMap[sourceVertexType as string],
        nodeMap[destinationVertexType as string],
      );
      response = true;
      message.success(res.data);
    } catch (error) {
      message.error(error.response.data);
    }
  }
  return response;
};

/** groot 单独创建节点或边 */
export const createVertexTypeOrEdgeType = async (
  type: string,
  params: { nodes?: any; label: string; source?: string; target?: string; properties: any },
) => {
  const graph_id = getSearchParams('graph_id') || '';
  let response: boolean = false;
  if (type === 'nodes') {
    const vertexType = transformGrootCreateVertexToOptions(params) as CreateVertexType;
    try {
      const res = await GraphApiFactory(undefined, location.origin).createVertexType(graph_id, vertexType);
      message.success(res.data);
      response = true;
    } catch (error) {
      error && message.error(`${error}`);
    }
  }
  if (type === 'edges') {
    const { nodes, label, source = '', target = '', properties } = params;
    const edgeType = transformGrootCreateEdgeToOptions(nodes, { label, source, target }, properties) as CreateEdgeType;
    try {
      const res = await GraphApiFactory(undefined, location.origin).createEdgeType(graph_id, edgeType);
      message.success(res.data);
      response = true;
    } catch (error) {
      error && message.error(`${error}`);
    }
  }
};
export const queryPrimitiveTypes = () => {
  if (GS_ENGINE_TYPE === 'groot') {
    return ['DT_DOUBLE', 'DT_STRING', 'DT_SIGNED_INT32', 'DT_SIGNED_INT64'].map(item => {
      return { label: item, value: item };
    });
  }
  if (GS_ENGINE_TYPE === 'interactive') {
    return ['DT_SIGNED_INT32', 'DT_SIGNED_INT64', 'DT_DOUBLE', 'DT_STRING'].map(item => {
      return { label: item, value: item };
    });
  }
  return [];
};
