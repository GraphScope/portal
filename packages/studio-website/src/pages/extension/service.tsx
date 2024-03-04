import { ProcedureApiFactory, DeploymentApiFactory } from '@graphscope/studio-server';
import type { Procedure } from '@graphscope/studio-server';
/** 获取插件列表 */
export const listProcedures = async () => {
  const message = await ProcedureApiFactory(undefined, location.origin)
    .listProcedures()
    .then(res => {
      if (res.status === 200) {
        return res.data;
      }
      return [];
    });
  const info = message.map((item: Procedure) => {
    return {
      ...item,
      key: '',
    };
  });
  return info;
};
/** 创建插件 */
export const createProcedure = async (graph_name: string, procedure: Procedure) => {
  return await ProcedureApiFactory(undefined, location.origin)
    .createProcedure(graph_name, procedure)
    .then(res => {
      if (res.status === 200) {
        return res.data;
      }
      return [];
    });
};
/** 删除插件 */
export const deleteProcedure = async (graph_name: string, procedureName: string) => {
  return await ProcedureApiFactory(undefined, location.origin)
    .deleteProcedure(graph_name, procedureName)
    .then(res => {
      if (res.status === 200) {
        return res.data;
      }
      return [];
    });
};
/** 修改插件 */
export const updateProcedure = async (graph_name: string, procedureName: string, procedure: Procedure) => {
  return await ProcedureApiFactory(undefined, location.origin)
    .updateProcedure(graph_name, procedureName, procedure)
    .then(res => {
      if (res.status === 200) {
        return res.data;
      }
      return [];
    });
};
/** 获取详情 */
export const listProceduresByGraph = async (graph_name: string) => {
  return await ProcedureApiFactory(undefined, location.origin)
    .listProceduresByGraph(graph_name)
    .then(res => {
      if (res.status === 200) {
        return res.data;
      }
      return [];
    });
};
export const listGraphs = async () => {
  const deployments = await DeploymentApiFactory(undefined, location.origin)
    .getDeploymentInfo()
    .then(res => {
      return res.data;
    });
  const { graphs_info } = deployments;

  const info = Object.values(graphs_info!).map(item => {
    const { name } = item;

    return {
      label: name,
      value: name,
    };
  });

  return info;
};
