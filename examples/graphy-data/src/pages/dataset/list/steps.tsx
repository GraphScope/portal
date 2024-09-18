import * as React from 'react';
import { Steps } from 'antd';

import { Space, Button, theme, Divider, Tooltip, Flex } from 'antd';

import { useNavigate } from 'react-router-dom';
import type { IDataset } from '../typing';
import { Utils } from '@graphscope/studio-components';
import { downloadDataset, runExtract, deleteDataset } from '../service';
import { styles } from './item';
import { SettingOutlined, FileZipOutlined, DeploymentUnitOutlined, DeleteOutlined } from '@ant-design/icons';
const { useToken } = theme;

const getCurrentValue = status => {
  if (status === 'initialized') {
    return 0;
  }
  if (status === 'waiting_workflow_config') {
    return 1;
  }
  if (status === 'waiting_extract') {
    return 2;
  }
  if (status === 'extracting') {
    return 2;
  }
};
const DatasetSteps: React.FunctionComponent<IDataset> = props => {
  const { id, schema, entity, status, refreshList } = props;
  const navigation = useNavigate();
  const current = getCurrentValue(status);

  const handleStartExtract = async () => {
    const data = await runExtract(id);
    console.log('data', data);
  };
  const handleDownload = async () => {
    const data = await runExtract(id);
    console.log('data', data);
  };
  const handleDelete = () => {
    deleteDataset(id);
    refreshList && refreshList();
  };

  return (
    <Flex justify="space-between" align="center" style={styles.card} gap={100}>
      <Steps
        //   style={{ marginTop: '12px' }}
        //   progressDot
        current={current}
        percent={status === 'extracting' ? 50 : 50}
        items={[
          {
            title: (
              <Tooltip title="Configure the llm server parameters">
                <Button
                  onClick={() => {
                    navigation(`/dataset/extract?id=${id}`);
                  }}
                  type={current === 0 ? 'primary' : 'text'}
                >
                  Setting LLM Config
                </Button>
              </Tooltip>
            ),
          },
          {
            title: (
              <Tooltip title="Embed the graph and inform the LLM how to extract your unstructured data.">
                <Button
                  onClick={() => {
                    navigation(`/dataset/embed?id=${id}`);
                  }}
                  type={current === 1 ? 'primary' : 'text'}
                >
                  Embed Graph Schema
                </Button>
              </Tooltip>
            ),
          },
          {
            title: (
              <Button
                type={status === 'waiting_extract' ? 'primary' : 'text'}
                size="small"
                onClick={handleStartExtract}
              >
                Run Extract Entity
              </Button>
            ),
          },
        ]}
      />

      <Space>
        <Tooltip title="Download extracted graph dataset">
          <Button
            icon={<FileZipOutlined />}
            onClick={() => {
              downloadDataset(id);
            }}
          ></Button>
        </Tooltip>
        <Tooltip title="Delete dataset">
          <Button onClick={handleDelete} icon={<DeleteOutlined />}></Button>
        </Tooltip>
      </Space>
    </Flex>
  );
};

export default DatasetSteps;
