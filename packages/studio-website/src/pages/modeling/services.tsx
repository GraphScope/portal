import { GraphApiFactory, UtilsApiFactory } from '@graphscope/studio-server';
import { transOptionsToSchema, ISchemaNode } from '@graphscope/studio-importor';
import { cloneDeep } from 'lodash';
import { notification } from '../../pages/utils';
import { Utils, Property } from '@graphscope/studio-components';

const { getSearchParams } = Utils;

export const createGraph = async (params: { graphName: string; nodes: any[]; edges: any[] }, graph_id?: string) => {
  const { graphName, nodes, edges } = params;
  const { GS_ENGINE_TYPE } = window;
  let graphs;
  const schemaJSON = transOptionsToSchema(cloneDeep({ nodes: nodes, edges: edges }));
  if (GS_ENGINE_TYPE === 'interactive' || GS_ENGINE_TYPE === 'gart') {
    const data = {
      name: String(graphName).trim(),
      description: '',
      schema: schemaJSON,
    };
    graphs = await GraphApiFactory(undefined, location.origin).createGraph(data);
  }
  /** groot 创建 */
  if (GS_ENGINE_TYPE === 'groot' && graph_id) {
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
  if (window.GS_ENGINE_TYPE === 'interactive' || window.GS_ENGINE_TYPE === 'gart') {
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
  label: string,
  sourceVertexType?: string,
  destinationVertexType?: string,
) => {
  if (window.GS_ENGINE_TYPE === 'interactive' || window.GS_ENGINE_TYPE === 'gart') {
    // interactive 图引擎，一旦创建模型，就无法删除，永远返回true
    return false;
  }
  let response: boolean = false;
  const graph_id = getSearchParams('graph_id') || '';
  if (type === 'nodes') {
    try {
      const res = await GraphApiFactory(undefined, location.origin).deleteVertexTypeByName(graph_id, label);
      response = true;
      notification('success', res.data);
    } catch (error) {
      notification('error', error);
    }
  }
  if (type === 'edges' && sourceVertexType && destinationVertexType) {
    try {
      const res = await GraphApiFactory(undefined, location.origin).deleteEdgeTypeByName(
        graph_id,
        label,
        sourceVertexType,
        destinationVertexType,
      );
      response = true;
      notification('success', res.data);
    } catch (error) {
      notification('error', error);
    }
  }
  return response;
};

/** groot 单独创建节点或边 */
export const createVertexTypeOrEdgeType = async (
  type: string,
  params: { nodes?: ISchemaNode[]; label: string; source?: string; target?: string; properties: Property[] },
  nodes?: any,
) => {
  let response: boolean = false;
  const graph_id = getSearchParams('graph_id') || '';
  const { label, source = '', target = '', properties } = params;
  if (type === 'nodes') {
    // const vertexType = transformGrootCreateVertexToOptions({ label, properties });
    //@ts-ignore
    const { vertex_types } = transOptionsToSchema({ nodes: [params], edges: [] });
    try {
      const res = await GraphApiFactory(undefined, location.origin).createVertexType(graph_id, vertex_types[0]);
      notification('success', res.data);
      response = true;
    } catch (error) {
      notification('error', error);
    }
  }
  if (type === 'edges') {
    //@ts-ignore
    const { edge_types } = transOptionsToSchema({ nodes: nodes, edges: [params] });
    console.log('edge_types', edge_types, params);
    try {
      const res = await GraphApiFactory(undefined, location.origin).createEdgeType(graph_id, edge_types[0]);
      notification('success', res.data);
      response = true;
    } catch (error) {
      notification('error', error);
    }
  }
  return response;
};
export const queryPrimitiveTypes = () => {
  if (window.GS_ENGINE_TYPE === 'groot') {
    return ['DT_DOUBLE', 'DT_STRING', 'DT_SIGNED_INT32', 'DT_SIGNED_INT64'].map(item => {
      return { label: item, value: item };
    });
  }
  if (window.GS_ENGINE_TYPE === 'interactive' || window.GS_ENGINE_TYPE === 'gart') {
    return ['DT_SIGNED_INT32', 'DT_SIGNED_INT64', 'DT_DOUBLE', 'DT_STRING'].map(item => {
      return { label: item, value: item };
    });
  }
  return [];
};
