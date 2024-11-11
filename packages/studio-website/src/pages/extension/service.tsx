import { StoredProcedureApiFactory, GraphApiFactory } from '@graphscope/studio-server';
import type { CreateStoredProcRequest, UpdateStoredProcRequest } from '@graphscope/studio-server';
import { notification } from '../../pages/utils';
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
  // const info = message.reduce((pre, cur) => {
  //   //@ts-ignore
  //   return pre.concat(cur.stored_procedures);
  // }, []);
  const info = message.flatMap(item =>
    (item?.stored_procedures || []).map(V => ({
      ...V,
      bound_graph: !!V['bound_graph'] ? V['bound_graph'] : item.id,
    })),
  );

  return info;
};
/** 创建插件 */
export const createProcedure = async (graphId: string, procedure: CreateStoredProcRequest) => {
  return await StoredProcedureApiFactory(undefined, location.origin)
    .createStoredProcedure(graphId, procedure)
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
export const deleteProcedure = async (graphId: string, procedureName: string) => {
  return await StoredProcedureApiFactory(undefined, location.origin)
    .deleteStoredProcedureById(graphId, procedureName)
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
export const updateProcedure = async (graphId: string, procedureId: string, procedure: UpdateStoredProcRequest) => {
  return await StoredProcedureApiFactory(undefined, location.origin)
    .updateStoredProcedureById(graphId, procedureId, procedure)
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
export const getProcedure = async (graphId: string, procedureId: string) => {
  return await StoredProcedureApiFactory(undefined, location.origin)
    .getStoredProcedureById(graphId, procedureId)
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
  //@ts-ignore
  let info = deployments?.map((item: { name: string; id: string }) => {
    const { name, id } = item;
    return {
      label: name,
      value: id,
    };
  });
  /** 过滤相同属性 */
  info = info?.filter(
    (item: { value: string }, index: number) =>
      info.findIndex((i: { value: string }) => i.value === item.value) === index,
  );
  return info;
};
