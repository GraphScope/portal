import React, { useEffect, useState } from 'react';
import { Table, TableProps, Flex, Typography, Button, Popover, Select } from 'antd';
import { useContext } from '@graphscope/studio-graph';
import { getTable } from './getTableData';
import { ControlOutlined } from '@ant-design/icons';
import { Utils } from '@graphscope/studio-components';
interface ITableViewProps {}

const TableView: React.FunctionComponent<ITableViewProps> = props => {
  const { store, updateStore } = useContext();
  const { source, selectNodes, data } = store;
  const { dataSource, columns } = getTable([...source.nodes]);
  const selectKeys = selectNodes.map(item => item.id);
  const keys = selectKeys.join('__');
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>(selectKeys);
  const [state, setState] = useState({
    columnIds: (Utils.storage.get('explore_table_view_column_ids') as string[]) || columns.map(item => item.key),
  });
  const { columnIds } = state;

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

  const content = <div>ddd</div>;
  const handleChangeColumns = value => {
    console.log('value', value);
    setState(preState => {
      return {
        ...preState,
        columnIds: value,
      };
    });
    Utils.storage.set('explore_table_view_column_ids', value);
  };
  const options = columns.map(item => {
    return {
      label: item.key,
      value: item.key,
    };
  });
  const tableColumns = columnIds.map(key => {
    return {
      title: key,
      dataIndex: key,
      key: key,
      sorter: (a, b) => a[key] - b[key],
    };
  });

  return (
    <Flex vertical gap={12}>
      <Flex justify="space-between" align="center">
        <Typography.Text type="secondary">{data.nodes.length + data.edges.length} records</Typography.Text>
        <Select
          suffixIcon={<ControlOutlined />}
          maxTagCount="responsive"
          mode="multiple"
          allowClear
          style={{ width: '160px' }}
          placeholder="Adjust Columns"
          value={columnIds}
          onChange={handleChangeColumns}
          options={options}
        />
        {/* <Popover placement="bottomRight" title={'x'} content={content} trigger="click">
          <Button icon={<SettingOutlined />} type="text"></Button>
        </Popover> */}
      </Flex>
      <Table
        rowSelection={rowSelection}
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
        // scroll={{ x: 10000, y: 800 }}
      />
    </Flex>
  );
};

export default TableView;
