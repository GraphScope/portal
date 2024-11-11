import * as React from 'react';
import { Typography, Flex, Space, Button, theme, Divider, Tooltip } from 'antd';

import { useNavigate } from 'react-router-dom';

import { GraphList, GraphSchema } from '../../components';
import type { IDataset } from '../typing';
import GraphView from '../embed/view';
import { downloadDataset, deleteDataset } from '../service';
import { SettingOutlined, FileZipOutlined, DeploymentUnitOutlined, DeleteOutlined } from '@ant-design/icons';
import Steps from './steps';
// import Steps from './step-custom';

const { useToken } = theme;

export const styles: Record<string, React.CSSProperties> = {
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

const List: React.FunctionComponent<IDataset & { refreshList: () => any }> = props => {
  const { id, schema, entity, status, refreshList } = props;
  console.log(props);
  let summarized = false;
  if (entity.length > 0) {
    summarized = entity.every(item => {
      return item.summarized === true;
    });
  }
  const navigation = useNavigate();
  const handleDelete = () => {
    deleteDataset(id);
    refreshList();
  };

  return (
    <Flex vertical flex={1} style={styles.container} gap={8}>
      <Steps {...props} />
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
