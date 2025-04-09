import React, { useEffect, useState } from 'react';
import { Table, Flex, Typography, Space } from 'antd';
import { useContext } from '@graphscope/studio-graph';
import { getTable } from './getTableData';

import SaveSelected from './SaveSelected';
import { getTableColumns } from './AdjustColumns';
import AdjustColumns from './AdjustColumns';
import SelectAll from './SelectAll';
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

const sortDatasource = (dataSource, selectedKeys) => {
  // 根据选中的 keys 对数据重新排序
  const sortedData = [...dataSource].sort((a, b) => {
    const aSelected = selectedKeys.includes(a.key);
    const bSelected = selectedKeys.includes(b.key);
    if (aSelected && !bSelected) return -1; // a 在前
    if (!aSelected && bSelected) return 1; // b 在前
    return 0; // 保持原顺序
  });
  return sortedData;
};

const TableView: React.FunctionComponent<ITableViewProps> = props => {
  const { store } = useContext();
  const { selectNodes, data, source } = store;
  const { dataSource, columns } = getTable(source.nodes);
  const { selectedRowKeys, onSelectChange } = useRowSelection();
  /** filter cloumns */
  const [state, setState] = useState({
    columnIds: columns.map(item => item.key),
  });
  useEffect(() => {
    const value = columns.map(item => item.key);
    setState(preState => {
      return {
        ...preState,
        columnIds: value,
      };
    });
  }, [source.nodes]);
  
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
  const _dataSource = sortDatasource(dataSource, selectedRowKeys);
  return (
    <Flex vertical gap={12}>
      <Flex justify="space-between" align="center">
        <Typography.Text type="secondary">
          Total {data.nodes.length} node items, {selectNodes.length} selected.
        </Typography.Text>
        <Space size={0}>
          <SelectAll />
          <AdjustColumns onChange={handleChangeColumns} columnKeys={columnIds}/>
          <SaveSelected />
        </Space>
      </Flex>
      <Table
        rowSelection={{
          selectedRowKeys,
          onChange: onSelectChange,
        }}
        size="large"
        dataSource={_dataSource}
        columns={tableColumns}
        bordered
        // scroll={{ x: 'max-content' }}
        pagination={{
          simple: true,
          size: 'small',
        }}
      />
    </Flex>
  );
};

export default TableView;
