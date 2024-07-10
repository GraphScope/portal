import { GraphApiFactory, UtilsApiFactory } from '@graphscope/studio-server';

import { transOptionsToSchema } from '@graphscope/studio-importor';
import { cloneDeep } from 'lodash';
import { notification } from '@/pages/utils';

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
