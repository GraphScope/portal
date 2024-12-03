import * as React from 'react';
import { Table, Flex, Typography } from 'antd';
import { GraphData, NodeData } from '../../index';
import { Button } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';

interface IPropertiesTableProps {
  data: GraphData['edges'] | GraphData['nodes'];
  style: React.CSSProperties;
}

const getTable = (data: NodeData[]) => {
  const columns = new Map();
  columns.set('id', {
    title: 'id',
    dataIndex: 'id',
    key: 'id',
  });
  columns.set('label', {
    title: 'label',
    dataIndex: 'label',
    key: 'label',
  });
  const dataSource = data.map(item => {
    const { id, properties = {}, label } = item;
    Object.keys(properties).forEach(key => {
      columns.set(key, {
        title: key,
        dataIndex: key,
        key,
      });
    });
    return {
      id,
      label,
      ...properties,
    };
  });

  return {
    dataSource,
    columns: Array.from(columns.values()),
  };
};

const PropertiesTable: React.FunctionComponent<IPropertiesTableProps> = props => {
  const { data, style } = props;
  const { dataSource, columns } = getTable(data);

  return (
    <Flex style={{ overflowY: 'scroll', ...style }} vertical gap={12}>
      <Flex justify="space-between">
        <Typography.Title level={5}>Inspect Infos</Typography.Title>
        <Button icon={<DownloadOutlined />} type="text"></Button>
      </Flex>
      <Table
        size="large"
        pagination={false}
        dataSource={dataSource}
        columns={columns}
        bordered
        scroll={{ x: 'max-content' }}
      />
    </Flex>
  );
};

export default PropertiesTable;
