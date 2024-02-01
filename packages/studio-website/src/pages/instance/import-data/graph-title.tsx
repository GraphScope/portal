import React from 'react';
import { Typography, Flex, Button, Space, Upload, Tooltip } from 'antd';
import { useContext } from './useContext';
import { download } from '../create-instance/create-schema/utils';

type IGraphTitleProps = {};
const { Text } = Typography;
const GraphTitle: React.FunctionComponent<IGraphTitleProps> = () => {
  const { store, updateStore } = useContext();
  const { sourceList } = store;
  return (
    <>
      <Flex gap="middle" justify="space-between" align="center">
        <Text type="secondary">预览</Text>
        <Space>
          <Upload
            beforeUpload={file => {
              let reader = new FileReader();
              reader.readAsText(file, 'utf-8');
              reader.onload = () => {
                updateStore(draft => {
                  //@ts-ignore
                  draft.sourceList = JSON.parse(reader.result);
                });
              };
            }}
            showUploadList={false}
          >
            <Tooltip placement="topRight" title="导入「数据导入」的配置文件">
              <Button>导入配置</Button>
            </Tooltip>
          </Upload>
          <Tooltip placement="topRight" title="导出「数据导入」的配置文件">
            <Button onClick={() => download('source', JSON.stringify(sourceList))}>导出配置</Button>
          </Tooltip>
        </Space>
      </Flex>
    </>
  );
};

export default GraphTitle;
