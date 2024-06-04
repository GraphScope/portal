import * as React from 'react';
import ImportApp from '@graphscope/studio-importor';
import { transSchemaToOptions } from './utils/schema';
import { SegmentedSection } from '@graphscope/studio-components';
import { TOOLS_MENU } from '../../layouts/const';
import { useContext } from '../../layouts/useContext';
import { history } from 'umi';
import { Utils } from '@graphscope/studio-components';

import {
  createGraph,
  queryPrimitiveTypes,
  uploadFile,
  createDataloadingJob,
  getSchema,
  getDataloadingConfig,
} from './services';

interface ISchemaPageProps {}
const { GS_ENGINE_TYPE } = window;

const ModelingPage: React.FunctionComponent<ISchemaPageProps> = props => {
  /**查询数据导入 */
  const { store } = useContext();
  const onChange = (value: any) => {
    history.push(value);
  };
  const queryImportData = async () => {
    // const { graph_id } = getUrlParams();
    const schema = await getSchema('2');
    /** options 包含nodes,edges */
    const options = await getDataloadingConfig('2', schema);
    return options;
  };
  /** 查询图 */
  const queryGraphSchema = async () => {
    const graph_id = Utils.searchParamOf('graph_id');
    let schema: any = { vertex_types: [], edge_types: [] };
    if (graph_id) {
      schema = await getSchema(graph_id);
      if (!schema) {
        schema = { vertex_types: [], edge_types: [] };
      }
      console.log('DDDADADDADA schema', schema);
    }
    // const schema = { vertex_types: [], edge_types: [] };
    return transSchemaToOptions(schema as any);
  };
  const saveModeling = (schema: any) => {
    const { nodes, edges } = schema;
    console.log('nodes', nodes, edges);
    createGraph('2', {
      graphName: 'test',
      nodes,
      edges,
    });
  };

  return (
    <SegmentedSection withNav={store.navStyle === 'inline'} options={TOOLS_MENU} value="/modeling" onChange={onChange}>
      <ImportApp
        /** 创建图模型 */
        appMode="DATA_MODELING"
        //@ts-ignore
        queryGraphSchema={queryGraphSchema}
        disabled={true}
        //@ts-ignore
        saveModeling={saveModeling}
        /** 属性下拉选项值 */
        queryPrimitiveTypes={() => {
          return ['DT_DOUBLE', 'DT_STRING', 'DT_SIGNED_INT32', 'DT_SIGNED_INT64'].map(item => {
            return { label: item, value: item };
          });
        }}
        GS_ENGINE_TYPE={GS_ENGINE_TYPE}
      />
    </SegmentedSection>
  );
};

export default ModelingPage;
