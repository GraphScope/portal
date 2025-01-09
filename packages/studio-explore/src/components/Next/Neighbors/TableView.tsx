import React, { useEffect, useState } from 'react';
import { Flex, theme, Table, Typography, Button, Space, Tooltip } from 'antd';

import { getTable } from './getTableData';

import type { TableColumnsType, TableProps } from 'antd';
import { NodeData } from '@graphscope/studio-graph';
import { PlayCircleOutlined } from '@ant-design/icons';
import { FullScreen, Utils } from '@graphscope/studio-components';
import AdjustColumns, { getTableColumns } from '../../TableView/AdjustColumns';

export interface IPropertiesPanelProps {
  items: NodeData[];
  counts: number;
  name: string;
  onQuery: (ids: string[]) => void;
  containerRef: React.RefObject<HTMLDivElement>;
}

const TableView: React.FunctionComponent<IPropertiesPanelProps> = props => {
  const { items, counts, name, onQuery, containerRef } = props;
  const { dataSource, columns } = getTable([...items]);
  // const defaultSelectedRowKeys = dataSource.map(item => item.key);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  // const containerRef = React.useRef<HTMLDivElement>(null);

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

  // useEffect(() => {
  //   const { dataSource } = getTable([...items]);
  //   const defaultSelectedRowKeys = dataSource.map(item => item.key);
  //   setSelectedRowKeys(defaultSelectedRowKeys);
  // }, [items]);

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection: TableProps<any>['rowSelection'] = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const handleClick = () => {
    onQuery(selectedRowKeys as string[]);
  };

  if (items.length === 0) {
    return null;
  }
  return (
    <Flex
      vertical
      style={{
        width: '100%',
        maxHeight: '450px',
      }}
      // ref={containerRef}
    >
      <Flex justify="space-between" align="center" style={{ paddingBottom: '6px' }}>
        <Typography.Text type="secondary">
          Total {counts} data items, {selectedRowKeys.length} selected.
        </Typography.Text>
        <Space>
          <Tooltip title="Appand selected items to the graph">
            <Button icon={<PlayCircleOutlined />} type="text" onClick={handleClick}></Button>
          </Tooltip>
          <AdjustColumns onChange={handleChangeColumns} />
          <FullScreen containerRef={containerRef} />
        </Space>
      </Flex>
      <Table
        rowSelection={rowSelection}
        size="large"
        pagination={{
          simple: true,
          size: 'small',
        }}
        // pagination={false}
        dataSource={dataSource}
        columns={tableColumns}
        bordered
        scroll={{ x: 'max-content' }}
      />
    </Flex>
  );
};

export default TableView;
