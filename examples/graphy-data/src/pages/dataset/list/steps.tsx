import * as React from 'react';
import { Steps } from 'antd';

import { Space, Button, theme, Divider, Tooltip } from 'antd';

import { useNavigate } from 'react-router-dom';
import type { IDataset } from '../typing';
import { Utils } from '@graphscope/studio-components';
import { downloadDataset, runExtract } from '../service';
import { SettingOutlined, FileZipOutlined, DeploymentUnitOutlined } from '@ant-design/icons';
const { useToken } = theme;

const DatasetSteps: React.FunctionComponent<IDataset> = props => {
  const { id, schema, entity, status } = props;
  const navigation = useNavigate();

  const handleStartExtract = async () => {
    const data = await runExtract(id);
    console.log('data', data);
  };
  const handleDownload = async () => {
    const data = await runExtract(id);
    console.log('data', data);
  };

  return (
    <Steps
      //   style={{ marginTop: '12px' }}
      //   progressDot
      current={2}
      items={[
        {
          title: (
            <Tooltip title="Configure the llm server parameters">
              <Button
                onClick={() => {
                  navigation(`/dataset/extract?id=${id}`);
                }}
                disabled={status === 'WAITING_EMBEDDING'}
                type={status === 'WAITING_EXTRACT' ? 'primary' : 'text'}
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
                type={status === 'WAITING_EMBEDDING' ? 'primary' : 'text'}
              >
                Embed Graph Schema
              </Button>
            </Tooltip>
          ),
        },
        {
          title: (
            <Button type="text" size="small" onClick={handleStartExtract}>
              Run Extract Entity
            </Button>
          ),
        },
        {
          title: (
            // <Button type="text" size="small">
            //   Explore Graph data
            // </Button>
            <Tooltip title="Download the dataset and import it into the graph database for further analysis.">
              <Button
                // icon={<FileZipOutlined />}
                type={'text'}
                onClick={() => {
                  //   navigation(`/explore?id=${id}`);
                  downloadDataset(id);
                }}
              >
                Download Graph data
              </Button>
            </Tooltip>
          ),
        },
      ]}
    />
  );
};

export default DatasetSteps;
