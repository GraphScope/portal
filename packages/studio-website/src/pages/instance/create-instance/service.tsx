import { GraphApiFactory, LegacyApiFactory } from '@graphscope/studio-server';
import { transOptionsToSchema } from '@/components/utils/schema';
import { transOptionsToGrootSchema } from '@/components/utils/schema-groot';
import { cloneDeep } from 'lodash';
import { setNotification } from '@/pages/utils';
const { GS_ENGINE_TYPE } = window;

export const createGraph = async (graphName: string, storeType: string, nodeList: any[], edgeList: any[]) => {
  let graphs;
  if (GS_ENGINE_TYPE === 'interactive') {
    const schemaJSON = transOptionsToSchema(cloneDeep({ nodes: nodeList, edges: edgeList }));
    const data = {
      name: String(graphName).trim(),
      store_type: storeType,
      stored_procedures: {
        directory: 'plugins',
      },
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
        setNotification('error', error.toString());
        return [];
      });
  }
  /** groot 创建 */
  if (GS_ENGINE_TYPE === 'groot') {
    const schemagrootJSON = transOptionsToGrootSchema(cloneDeep({ nodes: nodeList, edges: edgeList }));
    graphs = await LegacyApiFactory(undefined, location.origin)
      .importGrootSchema(String(graphName).trim(), schemagrootJSON)
      .then(res => {
        if (res.status === 200) {
          return res.data;
        }
        return [];
      })
      .catch(error => {
        setNotification('error', error.toString());
        return [];
      });
  }
  return graphs;
};

export const getPrimitiveTypes = () => {
  if (GS_ENGINE_TYPE === 'groot') {
    return ['DT_DOUBLE', 'DT_STRING', 'DT_SIGNED_INT32', 'DT_SIGNED_INT64'];
  }
  if (GS_ENGINE_TYPE === 'interactive') {
    return ['DT_DOUBLE', 'DT_STRING', 'DT_SIGNED_INT32', 'DT_SIGNED_INT64', 'DT_DATE32'];
  }
  return [''];
};
