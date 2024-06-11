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
  const { graphId, graphs, draftGraph, draftId } = store;
  const match = [...graphs, draftGraph]
    .filter(item => {
      return Object.keys(item).length > 0;
    })
    .find(item => item.id === graphId);
  const isEmpty = match?.schema.vertices === 0;

  /** 查询图 */
  const queryGraphSchema = async () => {
    if (graphId === draftId) {
      return transSchemaToOptions({ vertex_types: [], edge_types: [] } as any);
    }
    let schema: any = { vertex_types: [], edge_types: [] };
    if (graphId) {
      schema = await getSchema(graphId);
      if (!schema) {
        schema = { vertex_types: [], edge_types: [] };
      }
    }
    return transSchemaToOptions(schema as any);
  };

  return (
    <ImportApp
      key={graphId}
      /** 创建图模型 */
      appMode="DATA_MODELING"
      //@ts-ignore
      queryGraphSchema={queryGraphSchema}
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
