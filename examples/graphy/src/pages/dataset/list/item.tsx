import * as React from 'react';
import { Typography, Flex, Space, Button, theme, Divider, Tooltip, Card } from 'antd';

import { useNavigate } from 'react-router-dom';

import { GraphList, GraphSchema } from '../../components';
import type { IDataset } from '../typing';
import GraphView from '../embed/view';
import { downloadDataset, deleteDataset } from '../service';
import {
  SettingOutlined,
  FileZipOutlined,
  DeploymentUnitOutlined,
  DeleteOutlined,
  DatabaseOutlined,
} from '@ant-design/icons';
import Steps from './steps';
import Action from './action';
// import Steps from './step-custom';

const { useToken } = theme;

export const styles: Record<string, React.CSSProperties> = {
  container: {
    margin: '0px',
    padding: '1px',
    // background: '#f4f6f8',
  },
  card: {
    borderRadius: '4px',
    padding: '12px',
    background: '#fff',
    // border: '1px solid #ddd',
  },
};

const List: React.FunctionComponent<IDataset & { refreshList: () => any }> = props => {
  const { id, schema, entity } = props;
  console.log(props);
  let summarized = false;
  if (entity.length > 0) {
    summarized = entity.every(item => {
      return item.summarized === true;
    });
  }

  return (
    <Card
      title={
        <Typography.Text>
          <Button icon={<DatabaseOutlined />} type="text" />
          {id}
        </Typography.Text>
      }
      extra={<Action {...props} />}
      styles={{
        body: { padding: '0px', margin: '0px' },
        header: {
          padding: '12px',
        },
      }}
    >
      <Flex vertical flex={1} style={styles.container}>
        <Steps {...props} />
        <Divider style={{ margin: 0 }} />

        <Flex justify="space-between" gap={8}>
          <Flex style={{ ...styles.card, flexBasis: '300px' }}>
            <GraphView data={schema} />
          </Flex>
          <Divider type="vertical" style={{ height: '327px' }} />
          <Flex flex={1} style={styles.card}>
            <GraphList dataSource={entity} datasetId={id}></GraphList>
          </Flex>
        </Flex>
      </Flex>
    </Card>
  );
};

export default List;
