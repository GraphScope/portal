import * as React from 'react';
import { Typography, Flex, Space, Button, theme, Divider, Tooltip } from 'antd';

import { useNavigate } from 'react-router-dom';

import { GraphList, GraphSchema } from '../../components';
import type { IDataset } from '../typing';
import GraphView from '../embed/view';
import { downloadDataset } from '../service';
import { SettingOutlined, FileZipOutlined, DeploymentUnitOutlined } from '@ant-design/icons';
const { useToken } = theme;

const styles: Record<string, React.CSSProperties> = {
  container: {
    margin: '24px 0px',
    padding: '12px',
    background: '#f4f6f8',
  },
  card: {
    borderRadius: '4px',
    padding: '12px',
    background: '#fff',
  },
};

const List: React.FunctionComponent<IDataset> = props => {
  const { id, schema, entity, status } = props;
  console.log(props);
  let summarized = false;
  if (entity.length > 0) {
    summarized = entity.every(item => {
      return item.summarized === true;
    });
  }
  const navigation = useNavigate();

  return (
    <Flex vertical flex={1} style={styles.container} gap={8}>
      <Flex justify="space-between" align="center" style={styles.card}>
        <Typography.Text type="secondary">Currently, 255 PDF files have been uploaded</Typography.Text>
        <Space>
          <Tooltip title="Embed the graph and inform the LLM how to extract your unstructured data.">
            <Button
              icon={<DeploymentUnitOutlined />}
              onClick={() => {
                navigation(`/dataset/embed?id=${id}`);
              }}
              type={status === 'WAITING_EMBEDDING' ? 'primary' : 'default'}
            >
              STEP 1
            </Button>
          </Tooltip>

          <Divider style={{ width: '40px' }} />
          <Tooltip title="Configure the server parameters and start extracting entities and relationships.">
            <Button
              onClick={() => {
                navigation(`/dataset/extract?id=${id}`);
              }}
              icon={<SettingOutlined />}
              disabled={status === 'WAITING_EMBEDDING'}
              type={status === 'WAITING_EXTRACT' ? 'primary' : 'default'}
            >
              STEP 2
            </Button>
          </Tooltip>
          <Divider style={{ width: '40px' }} />
          <Tooltip title="Download the dataset and import it into the graph database for further analysis.">
            <Button
              icon={<FileZipOutlined />}
              disabled={!summarized}
              type={summarized ? 'primary' : 'default'}
              onClick={downloadDataset}
            >
              STEP 3
            </Button>
          </Tooltip>
          <Divider style={{ width: '40px' }} />
          <Tooltip title="Download the dataset and import it into the graph database for further analysis.">
            <Button
              icon={<FileZipOutlined />}
              type={summarized ? 'primary' : 'default'}
              onClick={() => {
                navigation(`/explore?id=${id}`);
              }}
            >
              Explore
            </Button>
          </Tooltip>
        </Space>
      </Flex>
      <Flex justify="space-between" gap={8}>
        <Flex style={{ ...styles.card, flexBasis: '300px' }}>
          <GraphView data={schema} />
        </Flex>
        <Flex flex={1} style={styles.card}>
          <GraphList dataSource={entity} datasetId={id}></GraphList>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default List;
