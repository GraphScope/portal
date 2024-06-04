import * as React from 'react';
import ImportApp from '@graphscope/studio-importor';
import Section from '@/components/section';
import {
  createGraph,
  getPrimitiveTypes,
  uploadFile,
  createDataloadingJob,
  getSchema,
  getDataloadingConfig,
} from './services';
import { getUrlParams } from './utils';
interface ISchemaPageProps {}
const { GS_ENGINE_TYPE } = window;
const SchemaPage: React.FunctionComponent<ISchemaPageProps> = props => {
  const { graph_id } = getUrlParams();
  const schema = getSchema(graph_id);
  /** options 包含nodes,edges */
  const options = getDataloadingConfig(graph_id, schema);
  return (
    <div style={{ padding: '12px', height: '100%', boxSizing: 'border-box' }}>
      <ImportApp
        /** 创建图模型 */
        //@ts-ignore
        handleModeling={createGraph}
        /** 属性下拉选项值 */
        getPrimitiveTypes={getPrimitiveTypes}
        /** 绑定数据中上传文件 */
        uploadFile={uploadFile}
        /** 数据绑定 */
        handleImporting={createDataloadingJob}
        GS_ENGINE_TYPE={GS_ENGINE_TYPE}
        appMode="DATA_IMPORTING"
      />
    </div>
  );
};

export default SchemaPage;
