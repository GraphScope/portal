import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Typography, Flex, Button, Space, Upload, Tooltip, message } from 'antd';
import { useContext, updateDataMap, clearDataMap } from './useContext';
import {
  transformMappingSchemaToImportOptions,
  transformImportOptionsToSchemaMapping,
} from '@/components/utils/import';
import { download } from '@/components/utils/index';
import yaml from 'js-yaml';
import { cloneDeep } from 'lodash';
import { submitParams } from './source-title';

type IGraphTitleProps = {};
const { Text } = Typography;
const GraphTitle: React.FunctionComponent<IGraphTitleProps> = () => {
  const { store, updateStore } = useContext();
  const { nodes, edges, schema, graphName } = store;
  const handleUpload = async (file: any) => {
    try {
      const yamlContent = (await readFile(file)) as string;
      const parsedYaml = yaml.load(yamlContent);
      message.success('文件上传成功');
      readFile(file).then(res => {
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
  return (
    <>
      <Flex gap="middle" justify="end" align="center">
        <Space>
          <Upload
            onChange={info => {
              if (info.file.status === 'done') {
                handleUpload(info.file.originFileObj);
              }
            }}
            showUploadList={false}
          >
            <Tooltip placement="topRight" title="导入「数据导入」的配置文件">
              <Button type="text">
                <FormattedMessage id="Import Config" />
              </Button>
            </Tooltip>
          </Upload>
          <Tooltip placement="topRight" title="导出「数据导入」的配置文件">
            <Button type="text" onClick={Json2Yaml}>
              <FormattedMessage id="Export Config" />
            </Button>

          </Tooltip>
        </Space>
      </Flex>
    </>
  );
};

export default GraphTitle;
