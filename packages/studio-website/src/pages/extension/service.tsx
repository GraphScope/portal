import { ProcedureApiFactory, DeploymentApiFactory, GraphApiFactory } from '@graphscope/studio-server';
import type { Procedure } from '@graphscope/studio-server';
import { notification } from '@/pages/utils';
/** 获取插件列表 */
export const listProcedures = async () => {
  const message = await GraphApiFactory(undefined, location.origin)
    .listGraphs()
    .then(res => {
      if (res.status === 200) {
        return res.data;
      }
      return [];
    });
  const info = message.reduce((pre, cur) => {
    return pre.concat(cur.stored_procedures);
  }, []);
  return info;
};
/** 创建插件 */
export const createProcedure = async (graphId: string, procedure: Procedure) => {
  return await ProcedureApiFactory(undefined, location.origin)
    .createProcedure(graphId, procedure)
    .then(res => {
      if (res.status === 200) {
        return res.data;
      }
      return [];
    })
    .catch(error => {
      notification('error', error);
    });
};
/** 删除插件 */
export const deleteProcedure = async (graph_name: string, procedureName: string) => {
  return await ProcedureApiFactory(undefined, location.origin)
    .deleteProcedureById(graph_name, procedureName)
    .then(res => {
      if (res.status === 200) {
        return res.data;
      }
      return [];
    })
    .catch(error => {
      notification('error', error);
    });
};
/** 修改插件 */
export const updateProcedure = async (graph_name: string, procedureName: string, procedure: Procedure) => {
  return await ProcedureApiFactory(undefined, location.origin)
    .updateProcedureById(graph_name, procedureName, procedure)
    .then(res => {
      if (res.status === 200) {
        return res.data;
      }
      return [];
    })
    .catch(error => {
      notification('error', error);
    });
};
/** 获取某条插件数据 */
export const getProcedure = async (graphId: string, procedure_id: string) => {
  return await ProcedureApiFactory(undefined, location.origin)
    .getProcedureById(graphId, procedure_id)
    .then(res => {
      if (res.status === 200) {
        return res.data;
      }
      return [];
    })
    .catch(error => {
      notification('error', error);
    });
};
/** 获取 Binding graph 列表 */
export const listGraphs = async () => {
  const deployments = await GraphApiFactory(undefined, location.origin)
    .listGraphs()
    .then(res => {
      if (res.status === 200) {
        return res.data;
      }
      return {};
    })
    .catch(error => {
      notification('error', error);
    });
  let info = deployments.map(item => {
    const { name, id } = item;
    return {
      label: name,
      value: id,
    };
  });
  /** 过滤相同属性 */
  info = info.filter((item, index) => info.findIndex(i => i.value === item.value) === index);
  return info;
};
