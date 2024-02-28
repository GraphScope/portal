import { ProcedureApiFactory } from '@graphscope/studio-server';
import type { Procedure } from '@graphscope/studio-server';

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
