import React, { useEffect, useState } from 'react';
import { Flex, theme, Table, Typography, Button, Space } from 'antd';

import { getTable } from './getTableData';

import type { TableColumnsType, TableProps } from 'antd';
import { NodeData } from '@graphscope/studio-graph';
import { PlayCircleOutlined } from '@ant-design/icons';
import { FullScreen } from '@graphscope/studio-components';

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
  const defaultSelectedRowKeys = dataSource.map(item => item.key);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>(defaultSelectedRowKeys);
  // const containerRef = React.useRef<HTMLDivElement>(null);
  useEffect(() => {
    const { dataSource } = getTable([...items]);
    const defaultSelectedRowKeys = dataSource.map(item => item.key);
    setSelectedRowKeys(defaultSelectedRowKeys);
  }, [items]);

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
          <Button icon={<PlayCircleOutlined />} type="text" onClick={handleClick}></Button>
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
        columns={columns}
        bordered
        scroll={{ x: 'max-content' }}
      />
    </Flex>
  );
};

export default TableView;
