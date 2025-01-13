import React, { useEffect, useState } from 'react';
import { Table, Flex, Typography, Space } from 'antd';
import { useContext } from '@graphscope/studio-graph';
import { getTable } from './getTableData';

import SaveSelected from './SaveSelected';
import { getTableColumns } from './AdjustColumns';
import AdjustColumns from './AdjustColumns';
import SelectAll from './SelectAll';
import { Utils } from '@graphscope/studio-components';
interface ITableViewProps {}

const useRowSelection = () => {
  const { store, updateStore } = useContext();
  const { selectNodes, data } = store;
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
  return {
    onSelectChange,
    selectedRowKeys,
  };
};

const TableView: React.FunctionComponent<ITableViewProps> = props => {
  const { store } = useContext();
  const { selectNodes, data, source } = store;
  const { dataSource, columns } = getTable(source.nodes);
  const { selectedRowKeys, onSelectChange } = useRowSelection();
  /** filter cloumns */
  const [state, setState] = useState({
    columnIds: (Utils.storage.get('explore_table_view_column_ids') as string[]) || columns.map(item => item.key),
  });
  const { columnIds } = state;
  const tableColumns = getTableColumns(columnIds);
  const handleChangeColumns = value => {
    setState(preState => {
      return {
        ...preState,
        columnIds: value,
      };
    });
  };
  /** filter cloumns end */

  return (
    <Flex vertical gap={12}>
      <Flex justify="space-between" align="center">
        <Typography.Text type="secondary">
          Total {data.nodes.length} node items, {selectNodes.length} selected.
        </Typography.Text>
        <Space size={0}>
          <SelectAll />
          <AdjustColumns onChange={handleChangeColumns} />
          <SaveSelected />
        </Space>
      </Flex>
      <Table
        rowSelection={{
          selectedRowKeys,
          onChange: onSelectChange,
        }}
        size="large"
        dataSource={dataSource}
        columns={tableColumns}
        bordered
        // scroll={{ x: 'max-content' }}
        pagination={{
          simple: true,
          size: 'small',
          pageSize: 10,
        }}
      />
    </Flex>
  );
};

export default TableView;
