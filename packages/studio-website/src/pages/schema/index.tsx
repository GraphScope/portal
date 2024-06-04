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
import { transSchemaToOptions } from './utils/schema';
import { getUrlParams } from './utils';
interface ISchemaPageProps {}
const { GS_ENGINE_TYPE } = window;
const SchemaPage: React.FunctionComponent<ISchemaPageProps> = props => {
  /**查询数据导入 */
  const queryImportData = async () => {
    // const { graph_id } = getUrlParams();
    const schema = await getSchema('2');
    /** options 包含nodes,edges */
    const options = await getDataloadingConfig('2', schema);
    return options;
  };
  /** 查询图 */
  const queryGrsph = async () => {
    const schema = await getSchema('2');
    return transSchemaToOptions(schema);
  };
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
        queryImportData={queryGrsph}
        GS_ENGINE_TYPE={GS_ENGINE_TYPE}
        appMode="DATA_MODELING"
      />
    </div>
  );
};

export default SchemaPage;
