import { GraphApiFactory } from '@graphscope/studio-server';
import { transOptionsToSchema } from '@/components/utils/schema';
import { cloneDeep } from 'lodash';
import { notification } from '@/pages/utils';
const { GS_ENGINE_TYPE } = window;

export const createGraph = async (
  graph_id: string,
  graphName: string,
  storeType: string,
  nodeList: any[],
  edgeList: any[],
) => {
  let graphs;
  const schemaJSON = transOptionsToSchema(cloneDeep({ nodes: nodeList, edges: edgeList }));
  if (GS_ENGINE_TYPE === 'interactive') {
    const data = {
      name: String(graphName).trim(),
      description: '',
      store_type: storeType,
      // stored_procedures: [],
      schema: schemaJSON,
    };
    graphs = await GraphApiFactory(undefined, location.origin)
      .createGraph(data)
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
  /** groot 创建 */
  if (GS_ENGINE_TYPE === 'groot') {
    // const schemagrootJSON = transOptionsToGrootSchema(cloneDeep({ nodes: nodeList, edges: edgeList }));
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

export const queryPrimitiveTypes = () => {
  if (GS_ENGINE_TYPE === 'groot') {
    return ['DT_DOUBLE', 'DT_STRING', 'DT_SIGNED_INT32', 'DT_SIGNED_INT64'];
  }
  if (GS_ENGINE_TYPE === 'interactive') {
    return ['DT_SIGNED_INT32', 'DT_SIGNED_INT64', 'DT_DOUBLE', 'DT_STRING'];
  }
  return [''];
};
