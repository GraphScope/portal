import * as React from 'react';
import { Steps } from 'antd';

import { Space, Button, theme, Divider, Tooltip, Flex } from 'antd';

import { useNavigate } from 'react-router-dom';
import type { IDataset } from '../typing';
import { Utils } from '@graphscope/studio-components';
import { downloadDataset, runExtract, deleteDataset, useKuzuGraph } from '../service';
import { styles } from './item';
import {
  SettingOutlined,
  FileZipOutlined,
  DeploymentUnitOutlined,
  DeleteOutlined,
  GlobalOutlined,
} from '@ant-design/icons';
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
  if (status === 'waiting_cluster') {
    return 2;
  }
  if (status === 'summarized') {
    return 2;
  }
};
const DatasetSteps: React.FunctionComponent<IDataset> = props => {
  const { id, schema, entity, status, refreshList } = props;
  const navigation = useNavigate();
  const current = getCurrentValue(status);

  const handleStartExtract = async () => {
    const data = await runExtract(id);
    refreshList && refreshList();
  };

  return (
    <Flex justify="space-between" align="center" style={styles.card} gap={100}>
      <Steps
        //   style={{ marginTop: '12px' }}
        //   progressDot
        current={current}
        percent={status === 'extracting' ? 50 : 100}
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
                  Define Extract Workflow
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
                {status === 'extracting' ? 'Extracting' : 'Run Extract Entity'}
              </Button>
            ),
          },
        ]}
      />
    </Flex>
  );
};

export default DatasetSteps;
