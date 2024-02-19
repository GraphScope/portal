import React, { useEffect } from 'react';
import { Table } from 'antd';

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
const NodeTable = ({ data }) => {
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
  const dataSource = data.map(item => {
    const { id, label, properties } = item;
    return {
      key: id,
      id,
      label,
      properties: JSON.stringify(properties, null, 2),
    };
  });
  return <Table columns={columns} dataSource={dataSource} />;
};
const EdgeTable = ({ data }) => {
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
      title: 'source',
      dataIndex: 'label',
      key: 'source',
    },
    {
      title: 'target',
      dataIndex: 'label',
      key: 'target',
    },
    {
      title: 'properties',
      dataIndex: 'properties',
      key: 'properties',
    },
  ];
  const dataSource = data.map(item => {
    const { id, label, source, target, properties } = item;
    return {
      key: id,
      id,
      label,
      source,
      target,
      properties: JSON.stringify(properties, null, 2),
    };
  });
  return <Table columns={columns} dataSource={dataSource} />;
};

const TableView: React.FunctionComponent<ITableViewProps> = props => {
  const { table = [], nodes = [], edges = [] } = props.data;

  return (
    <div>
      {nodes.length !== 0 && <NodeTable data={nodes} />}
      {edges.length !== 0 && <EdgeTable data={edges} />}
      {table.length !== 0 && <RowTable data={table} />}
    </div>
  );
};

export default TableView;
