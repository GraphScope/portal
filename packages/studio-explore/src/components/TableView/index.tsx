import React, { useEffect, useState } from 'react';
import { Table, TableProps } from 'antd';
import { useContext } from '@graphscope/studio-graph';
import { getTable } from './getTableData';
interface ITableViewProps {}

const TableView: React.FunctionComponent<ITableViewProps> = props => {
  const { store, updateStore } = useContext();
  const { source, selectNodes, data } = store;
  const { dataSource, columns } = getTable([...source.nodes]);
  const selectKeys = selectNodes.map(item => item.id);
  const keys = selectKeys.join('__');
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>(selectKeys);

  useEffect(() => {
    const ids = keys.split('__');
    setSelectedRowKeys(ids);
  }, [keys]);
  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
    updateStore(draft => {
      const newSelectNodes = data.nodes.filter(item => {
        return newSelectedRowKeys.includes(item.id);
      });
      draft.selectNodes = newSelectNodes;
      draft.nodeStatus = newSelectNodes.reduce((acc, cur) => {
        acc[cur.id] = {
          selected: true,
        };
        return acc;
      }, {});
    });
  };

  const rowSelection: TableProps<any>['rowSelection'] = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  return (
    <div>
      <Table
        rowSelection={rowSelection}
        size="large"
        dataSource={dataSource}
        columns={columns}
        bordered
        // scroll={{ x: 'max-content' }}
        pagination={{
          simple: true,
          size: 'small',
          pageSize: 10,
        }}
        // scroll={{ x: 10000, y: 800 }}
      />
    </div>
  );
};

export default TableView;
