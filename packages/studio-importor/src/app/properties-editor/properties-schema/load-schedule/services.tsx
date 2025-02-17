import { JobApiFactory } from '@graphscope/studio-server';
import { Utils } from '@graphscope/studio-components';
/** 获取周期导入的配置文件，only for groot engine*/
export const getLoadScheduleConfig = async (graphSchema: any, type?: string): Promise<any> => {
  const graph_id = Utils.getSearchParams('graph_id');
  let NODE_LABEL_MAP: any = {};
  const schema = {
    vertices: graphSchema.nodes.map((item: any) => {
      const { id, data } = item;
      NODE_LABEL_MAP[id] = data.label;
      return {
        type_name: data.label,
      };
    }),
    edges: graphSchema.edges.map((item: any) => {
      const { id, source, data, target } = item;
      return {
        type_name: data.label,
        source_vertex: NODE_LABEL_MAP[source],
        destination_vertex: NODE_LABEL_MAP[target],
      };
    }),
  };

  const { vertices, edges } = schema;

  let particalSchema = {
    vertices,
    edges,
  };

  if (type === 'nodes') {
    particalSchema = {
      vertices,
      edges: [],
    };
  }
  if (type === 'edges') {
    particalSchema = {
      vertices: [],
      edges,
    };
  }

  const res = await JobApiFactory(undefined, window.COORDINATOR_URL).getDataloadingJobConfig(graph_id, {
    ...particalSchema,
    loading_config: {},
    repeat: 'once',
    schedule: '',
  });
  if (res.data && res.data.config) {
    return res.data.config;
  }
  return false;
};
