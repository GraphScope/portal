import * as React from 'react';
import { Space, Tooltip, Upload, Button, message } from 'antd';
import { FormattedMessage } from 'react-intl';
import { download, transformSchema, transformSchemaToOptions } from './utils';
import { useContext } from '../useContext';
import yaml from 'js-yaml';
interface IExportConfigProps {}

const ExportConfig: React.FunctionComponent<IExportConfigProps> = props => {
  const { store, updateStore } = useContext();
  const { edgeList, nodeList } = store;
  console.log('edgeList & nodeList', nodeList, edgeList);
  const handleUpload = async (file: any) => {
    try {
      const yamlContent = (await readFile(file)) as string;
      const parsedYaml = yaml.load(yamlContent);
      //@ts-ignore
      console.log(
        'Parsed YAML:',
        parsedYaml,
        //@ts-ignore
        transformSchema(parsedYaml.schema),
        //@ts-ignore
        transformSchemaToOptions(parsedYaml.schema, false),
      );
      message.success('文件上传成功');
      //@ts-ignore
      const options = transformSchemaToOptions(parsedYaml.schema, false);
      updateStore(draft => {
        draft.edgeList = options.edges;
        draft.nodeList = options.nodes;
        draft.nodeActiveKey = options.nodes[0].key;
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

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <Space>
        <Upload
          onChange={info => {
            if (info.file.status === 'done') {
              handleUpload(info.file.originFileObj);
            }
          }}
          showUploadList={false}
        >
          <Tooltip title="导入提示，待确认">
            <Button>
              <FormattedMessage id="Import" />
            </Button>
          </Tooltip>
        </Upload>
        <Tooltip title="导出提示，待确认">
          <Button onClick={() => download(`xxx.json`, '')}>
            <FormattedMessage id="Export" />
          </Button>
        </Tooltip>
      </Space>
    </div>
  );
};

export default ExportConfig;
