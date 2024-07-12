import * as React from 'react';
import ImportApp, { ISchemaOptions } from '@graphscope/studio-importor';
import { queryPrimitiveTypes, uploadFile, getSchema, getDatasourceById } from './services';
import { useContext } from '../../layouts/useContext';
import { Toolbar } from '@graphscope/studio-components';
import StartImporting from './start-importing';
import { transMappingSchemaToOptions } from './utils/import';
import SelectGraph from '@/layouts/select-graph';
import EmptyModelCase from './empty-model-case';
import EmptyMappingCase from './empty-mapping-case';
interface ISchemaPageProps {}
const { GS_ENGINE_TYPE } = window;
const SchemaPage: React.FunctionComponent<ISchemaPageProps> = props => {
  const { store } = useContext();
  const { graphId, draftId } = store;

  const queryBoundSchema = async (): Promise<ISchemaOptions> => {
    if (graphId === draftId) {
      return { nodes: [], edges: [] };
    }
    if (graphId) {
      const graphSchema = await getSchema(graphId);
      if (!graphSchema) {
        return { nodes: [], edges: [] };
      }
      const schemaMapping = await getDatasourceById(graphId);
      const options = transMappingSchemaToOptions(graphSchema as any, schemaMapping);
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
      handleUploadFile={uploadFile}
      /** 数据绑定 */
      GS_ENGINE_TYPE={GS_ENGINE_TYPE}
      defaultRightStyles={{
        collapsed: false,
        width: 500,
      }}
    >
      <Toolbar style={{ top: '12px', right: '74px', left: 'unset' }} direction="horizontal">
        <SelectGraph />
        <StartImporting />
      </Toolbar>
      <EmptyModelCase />
      <EmptyMappingCase />
    </ImportApp>
  );
};

export default SchemaPage;
