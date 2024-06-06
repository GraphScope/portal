import * as React from 'react';
import ImportApp from '@graphscope/studio-importor';
import { transSchemaToOptions } from './utils/schema';
import { useContext } from '../../layouts/useContext';
import { Toolbar } from '@graphscope/studio-components';
import { createGraph, getSchema, getDataloadingConfig } from './services';
import Save from './save-modeling';
interface ISchemaPageProps {}
const { GS_ENGINE_TYPE } = window;

const ModelingPage: React.FunctionComponent<ISchemaPageProps> = props => {
  /**查询数据导入 */
  const { store } = useContext();
  const { graphId, graphs } = store;
  const match = graphs.find(item => item.id === graphId);
  const isEmpty = match?.schema.vertices === 0;

  const queryImportData = async () => {
    // const { graphId } = getUrlParams();
    const schema = await getSchema('2');
    /** options 包含nodes,edges */
    const options = await getDataloadingConfig('2', schema);
    return options;
  };
  /** 查询图 */
  const queryGraphSchema = async () => {
    let schema: any = { vertex_types: [], edge_types: [] };
    if (graphId) {
      schema = await getSchema(graphId);
      if (!schema) {
        schema = { vertex_types: [], edge_types: [] };
      }
    }
    // const schema = { vertex_types: [], edge_types: [] };
    return transSchemaToOptions(schema as any);
  };
  const saveModeling = (schema: any) => {
    const { nodes, edges } = schema;
    console.log('nodes', nodes, edges);
    createGraph(graphId || '', {
      graphName: 'pomelo',
      nodes,
      edges,
    });
  };
  console.log('match', match);

  return (
    <ImportApp
      /** 创建图模型 */
      appMode="DATA_MODELING"
      //@ts-ignore
      queryGraphSchema={queryGraphSchema}
      //@ts-ignore
      saveModeling={saveModeling}
      /** 属性下拉选项值 */
      queryPrimitiveTypes={() => {
        return ['DT_DOUBLE', 'DT_STRING', 'DT_SIGNED_INT32', 'DT_SIGNED_INT64'].map(item => {
          return { label: item, value: item };
        });
      }}
      GS_ENGINE_TYPE={GS_ENGINE_TYPE}
      defaultLeftStyles={{
        width: 350,
        collapsed: isEmpty ? false : true,
      }}
    >
      <Toolbar style={{ top: '12px', right: '74px', left: 'unset' }} direction="horizontal">
        <Save />
      </Toolbar>
    </ImportApp>
  );
};

export default ModelingPage;
