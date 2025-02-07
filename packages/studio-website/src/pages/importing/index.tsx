import * as React from 'react';
import ImportApp, { ISchemaOptions, transMappingSchemaToOptions } from '@graphscope/studio-importor';
import { queryPrimitiveTypes, uploadFile, getSchema, getDatasourceById } from './services';
import { useContext } from '../../layouts/useContext';
import { Toolbar, Utils } from '@graphscope/studio-components';
import StartImporting from './start-importing';

import SelectGraph from '../../layouts/select-graph';
import EmptyModelCase from './empty-model-case';
import Section from '../../components/section';
import localforage from 'localforage';
import { FormattedMessage } from 'react-intl';
import DownloadLoadConfig from './download-load-config';
import FeatureCase from '../../components/feature-case';
interface ISchemaPageProps {}
const { GS_ENGINE_TYPE } = window;
const SchemaPage: React.FunctionComponent<ISchemaPageProps> = props => {
  const { store, id } = useContext();
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

  const getLocalFiles = async () => {
    const schemaMapping = await getDatasourceById(graphId as string);
    const graphSchema = await getSchema(graphId as string);
    const options = transMappingSchemaToOptions(graphSchema as any, schemaMapping);
    if ('vertex_mappings' in schemaMapping) {
      const { vertex_mappings = [], edge_mappings = [] } = schemaMapping;
      const emptyMapping = vertex_mappings.length === 0 && edge_mappings.length === 0;
      if (emptyMapping) {
        const localFiles = await localforage.getItem<File[]>('DRAFT_GRAPH_FILES');
        return localFiles;
      }
    }
  };

  const batchUploadFiles = async () => {
    const localFiles = getLocalFiles();
    return localFiles;
  };

  return (
    <Section
      breadcrumb={[
        {
          title: <FormattedMessage id="Importing" />,
        },
      ]}
      style={{ padding: '0px' }}
    >
      <EmptyModelCase />
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
        defaultCollapsed={{
          leftSide: true,
          rightSide: false,
        }}
        batchUploadFiles={batchUploadFiles}
      >
        <Toolbar style={{ top: '12px', left: '24px', right: 'unset' }} direction="horizontal">
          <SelectGraph id={id} />
          <FeatureCase match="BATCH_LOAD_DATA">
            <StartImporting id={id} />
          </FeatureCase>
          <FeatureCase match="DOWNLOAD_DATA_TASK_CONFIG">
            <DownloadLoadConfig id={id} graphId={graphId} />
          </FeatureCase>
        </Toolbar>
      </ImportApp>
    </Section>
  );
};

export default SchemaPage;
