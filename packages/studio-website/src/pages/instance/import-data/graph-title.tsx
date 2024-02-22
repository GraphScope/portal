import React from 'react';
import { Typography, Flex, Button, Space, Upload, Tooltip, message } from 'antd';
import { useContext } from './useContext';
import { download, transOptionsToSchema, transformSchemaToOptions } from '../create-instance/create-schema/utils';
import yaml from 'js-yaml';
import { cloneDeep } from 'lodash';

type IGraphTitleProps = {};
const { Text } = Typography;
const GraphTitle: React.FunctionComponent<IGraphTitleProps> = () => {
  const { store, updateStore } = useContext();
  const { sourceList } = store;
  const handleUpload = async (file: any) => {
    try {
      const yamlContent = (await readFile(file)) as string;
      const parsedYaml = yaml.load(yamlContent);
      message.success('文件上传成功');
      readFile(file).then(res => {
        console.log(yaml.load(yamlContent));
      });

      //@ts-ignore
      const options = transformSchemaToOptions(parsedYaml.schema, false);
      console.log(options);
      updateStore(draft => {
        draft.sourceList = options;
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
    const schemaJSON = transOptionsToSchema(cloneDeep(sourceList));
    const schemaYaml = yaml.dump(schemaJSON);
    download('schema.yaml', schemaYaml);
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
              <Button type="text">Import Config</Button>
            </Tooltip>
          </Upload>
          <Tooltip placement="topRight" title="导出「数据导入」的配置文件">
            <Button type="text" onClick={Json2Yaml}>
              Export Config
            </Button>
          </Tooltip>
        </Space>
      </Flex>
    </>
  );
};

export default GraphTitle;
