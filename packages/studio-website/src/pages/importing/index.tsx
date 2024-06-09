import * as React from 'react';
import ImportApp from '@graphscope/studio-importor';
import { queryPrimitiveTypes, uploadFile, getSchema, getDataloadingConfig } from './services';
import { useContext } from '../../layouts/useContext';
import { Toolbar } from '@graphscope/studio-components';
import StartImporting from './start-importing';
import BindDataFields from './bind-datafields';
import { Divider } from 'antd';
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
      GS_ENGINE_TYPE={GS_ENGINE_TYPE}
      defaultRightStyles={{
        collapsed: false,
        width: 500,
      }}
    >
      {/* <Toolbar style={{ top: '12px', right: '184px', left: 'unset' }} direction="horizontal">
        <BindDataFields />
      </Toolbar> */}
      <Toolbar style={{ top: '12px', right: '74px', left: 'unset' }} direction="horizontal">
        {/* <BindDataFields />
        <Divider type="vertical" style={{ margin: '0px' }} /> */}
        <StartImporting />
      </Toolbar>
    </ImportApp>
  );
};

export default SchemaPage;
