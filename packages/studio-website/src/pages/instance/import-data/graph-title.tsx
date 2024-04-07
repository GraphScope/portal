import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Flex, Button, Space, Upload, Tooltip, message } from 'antd';
import type { UploadProps } from 'antd';
import { useContext, updateDataMap, clearDataMap } from './useContext';
import {
  transformMappingSchemaToImportOptions,
  transformImportOptionsToSchemaMapping,
} from '@/components/utils/import';
import { download } from '@/components/utils/index';
import yaml from 'js-yaml';
import { cloneDeep } from 'lodash';
import { submitParams } from './source-title';
import FileExportIcon from '@/components/icons/file-export';
import FileImportIcon from '@/components/icons/file-import';

const GraphTitle: React.FunctionComponent = () => {
  const { store, updateStore } = useContext();
  const { nodes, edges, schema, graphName } = store;
  const readFile = (file: any) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsText(file);
    });
  };
  const Json2Yaml = () => {
    //@ts-ignore
    const schemaJSON = transformImportOptionsToSchemaMapping(cloneDeep({ nodes, edges }));
    const params = submitParams(schemaJSON, graphName);
    const yamlFile = yaml.dump(params);
    download('schema.yaml', yamlFile);
  };
  const handleUpload = async (file: any) => {
    try {
      const yamlContent = (await readFile(file)) as string;
      const parsedYaml = yaml.load(yamlContent);
      message.success('文件上传成功');
      readFile(file).then(() => {
        console.log(yaml.load(yamlContent));
      });
      //@ts-ignore
      console.log('parsedYaml.schema, schema', parsedYaml, schema);
      //@ts-ignore
      const options = transformMappingSchemaToImportOptions(parsedYaml, schema);
      console.log(options);
      updateStore(draft => {
        draft.nodes = options.nodes;
        draft.edges = options.edges;
      });
      clearDataMap();
      updateDataMap(draft => {
        options.nodes.forEach(item => {
          //@ts-ignore
          draft[item.key] = item;
        });
        options.edges.forEach(item => {
          //@ts-ignore
          draft[item.key] = item;
        });
      });
    } catch (error) {
      console.error('解析 YAML 文件失败:', error);
      message.error('解析文件失败，请确保上传的文件是有效的 YAML 格式');
    }
  };
  const customRequest: UploadProps['customRequest'] = async options => {
    const { file } = options;
    handleUpload(file);
  };
  return (
    <>
      <Flex gap="middle" justify="end" align="center">
        <Space>
          <Upload customRequest={customRequest} showUploadList={false}>
            <Tooltip placement="topRight" title={<FormattedMessage id="Import" />}>
              <Button type="text" icon={<FileImportIcon />}></Button>
            </Tooltip>
          </Upload>
          <Tooltip placement="topRight" title={<FormattedMessage id="Export" />}>
            <Button type="text" onClick={Json2Yaml} icon={<FileExportIcon />}></Button>
          </Tooltip>
        </Space>
      </Flex>
    </>
  );
};

export default GraphTitle;
