import * as React from 'react';
import ImportApp from '@graphscope/studio-importor';
import { queryPrimitiveTypes, uploadFile, createDataloadingJob, getSchema, getDataloadingConfig } from './services';
import { useContext } from '../../layouts/useContext';

interface ISchemaPageProps {}
const { GS_ENGINE_TYPE } = window;
const SchemaPage: React.FunctionComponent<ISchemaPageProps> = props => {
  const { store } = useContext();
  const { graphId } = store;

  const queryBoundSchema = async () => {
    if (graphId) {
      const graphSchema = await getSchema(graphId);
      /** options 包含nodes,edges */
      const options = await getDataloadingConfig(graphId, graphSchema);

      return options;
    }
    return { nodes: [], edges: [] };
  };

  return (
    <ImportApp
      key={graphId}
      appMode="DATA_IMPORTING"
      queryBoundSchema={queryBoundSchema}
      /** 属性下拉选项值 */
      queryPrimitiveTypes={queryPrimitiveTypes}
      /** 绑定数据中上传文件 */
      uploadFile={uploadFile}
      /** 数据绑定 */
      createDataloadingJob={createDataloadingJob}
      GS_ENGINE_TYPE={GS_ENGINE_TYPE}
      defaultRightStyles={{
        collapsed: false,
        width: 500,
      }}
    />
  );
};

export default SchemaPage;
