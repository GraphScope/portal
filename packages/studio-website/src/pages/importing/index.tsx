import * as React from 'react';
import ImportApp from '@graphscope/studio-importor';
import { SegmentedSection } from '@graphscope/studio-components';
import {
  createGraph,
  queryPrimitiveTypes,
  uploadFile,
  createDataloadingJob,
  getSchema,
  getDataloadingConfig,
} from './services';
import { TOOLS_MENU } from '../../layouts/const';
import { useContext } from '../../layouts/useContext';
import { Utils } from '@graphscope/studio-components';
import { history } from 'umi';
interface ISchemaPageProps {}
const { GS_ENGINE_TYPE } = window;
const SchemaPage: React.FunctionComponent<ISchemaPageProps> = props => {
  const { store } = useContext();
  const onChange = (value: any) => {
    history.push(value);
  };

  const queryBoundSchema = async () => {
    const graph_id = Utils.searchParamOf('graph_id');
    if (graph_id) {
      const graphSchema = await getSchema(graph_id);
      /** options 包含nodes,edges */
      const options = await getDataloadingConfig(graph_id, graphSchema);
      return options;
    }
    return { nodes: [], edges: [] };
  };

  return (
    <SegmentedSection withNav={store.navStyle === 'inline'} options={TOOLS_MENU} value="/importing" onChange={onChange}>
      <ImportApp
        appMode="DATA_IMPORTING"
        queryBoundSchema={queryBoundSchema}
        /** 属性下拉选项值 */
        queryPrimitiveTypes={queryPrimitiveTypes}
        /** 绑定数据中上传文件 */
        uploadFile={uploadFile}
        /** 数据绑定 */
        createDataloadingJob={createDataloadingJob}
        GS_ENGINE_TYPE={GS_ENGINE_TYPE}
      />
    </SegmentedSection>
  );
};

export default SchemaPage;
