import React, { useEffect, useState } from 'react';
import { Table, Space, Typography, Flex, Button, Tooltip, Segmented } from 'antd';
import { FileExcelOutlined, BarChartOutlined, TableOutlined } from '@ant-design/icons';
import ChartView from './chart';
interface ITableViewProps {
  data: any;
}

const RowTable = ({ data }) => {
  /** table */
  const FirstRow = data[0];
  const columns = Object.keys(FirstRow).map(key => {
    return {
      title: key,
      dataIndex: key,
      key: key,
    };
  });
  const dataSource = data.map(item => {
    return {
      ...item,
      key: item.id,
    };
  });

  return <Table columns={columns} dataSource={dataSource} />;
};
const GraphTable = ({ nodes, edges }) => {
  const columns = [
    {
      title: 'id',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'label',
      dataIndex: 'label',
      key: 'label',
    },
    {
      title: 'properties',
      dataIndex: 'properties',
      key: 'properties',
    },
  ];
  const nodeLabelMap = {};
  const nodeSource = nodes.map(item => {
    const { id, label, properties } = item;
    nodeLabelMap[id] = label;
    return {
      key: id,
      id,
      label,
      properties: JSON.stringify({ ...properties, ...{ id1: 2, name1: 'vadas', age1: 27 } }, null, 2),
    };
  });
  const edgeSource = edges.map(item => {
    const { id, label, properties, source, target } = item;

    return {
      key: id,
      id,
      label: `(${nodeLabelMap[source]})-[:${label}]-(${nodeLabelMap[target]})`,
      properties: JSON.stringify(properties, null, 2),
    };
  });

  const dataSource = [...nodeSource, ...edgeSource];
  return <Table columns={columns} dataSource={dataSource} />;
};

const TableView: React.FunctionComponent<ITableViewProps> = props => {
  const { table = [], nodes = [], edges = [] } = props.data;
  const nodeCount = nodes.length;
  const edgeCount = edges.length;
  const totalCount = table.length;
  let description: string;
  if (nodeCount === 0 && edgeCount === 0 && totalCount !== 0) {
    description = `A total of ${totalCount} records were retrieved`;
  } else {
    description = `A total of ${
      nodeCount + edgeCount
    } records were retrieved, including ${nodeCount} nodes and  ${edgeCount} edges.`;
  }

  const [mode, setMode] = useState<'table' | 'chart'>('table');

  return (
    <div style={{ overflowX: 'scroll' }}>
      <Flex justify="space-between" style={{ padding: '0px 10px 10px 10px' }} align="center">
        <Typography.Text>{description}</Typography.Text>
        <Space>
          <Segmented
            value={mode}
            onChange={value => {
              setMode(value as 'table' | 'chart');
            }}
            options={[
              { value: 'chart', icon: <BarChartOutlined />, label: 'chart' },
              { value: 'table', icon: <TableOutlined /> },
            ]}
          />
          <Tooltip title="download">
            <Button icon={<FileExcelOutlined />} type="text"></Button>
          </Tooltip>
        </Space>
      </Flex>
      {mode === 'table' && nodes.length !== 0 && <GraphTable nodes={nodes} edges={edges} />}
      {mode === 'table' && table.length !== 0 && <RowTable data={table} />}
      {mode === 'chart' && table.length !== 0 && <ChartView table={table} />}
    </div>
  );
};

export default TableView;
