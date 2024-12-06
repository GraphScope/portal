import * as React from 'react';
import { Table, Typography } from 'antd';
import { GraphData, NodeData } from '@graphscope/studio-graph';
import { TypingText } from '@graphscope/studio-components';
interface IPropertiesTableProps {
  data: GraphData['edges'] | GraphData['nodes'];
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
  const { data } = props;
  const { dataSource, columns } = getTable(data);
  console.log(' dataSource, columns', dataSource, columns);
  return (
    <div style={{ maxHeight: '50vh', overflowY: 'scroll' }}>
      <Table
        size="large"
        pagination={false}
        dataSource={dataSource}
        columns={columns}
        bordered
        scroll={{ x: 'max-content' }}
      />
    </div>
  );
};

export default PropertiesTable;
