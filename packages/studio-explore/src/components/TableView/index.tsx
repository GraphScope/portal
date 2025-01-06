import * as React from 'react';
import { Table } from 'antd';
import { useContext } from '@graphscope/studio-graph';
import { getTable } from './getTableData';
interface ITableViewProps {}

const TableView: React.FunctionComponent<ITableViewProps> = props => {
  const { store } = useContext();
  const { source } = store;
  const { dataSource, columns } = getTable([...source.nodes]);

  return (
    <div>
      <Table
        size="large"
        dataSource={dataSource}
        columns={columns}
        bordered
        scroll={{ x: 'max-content' }}
        pagination={{
          simple: true,
          size: 'small',
        }}
      />
    </div>
  );
};

export default TableView;
