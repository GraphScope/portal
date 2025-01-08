import React, { useState } from 'react';
import { Button, Popover, Select } from 'antd';
import { ControlOutlined } from '@ant-design/icons';
import { Utils } from '@graphscope/studio-components';
import { useContext } from '@graphscope/studio-graph';
import { getTable } from './getTableData';
interface IAdjustColumnsProps {
  onChange: (columnIds: string[]) => void;
}

export function getTableColumns(columnIds: string[]) {
  return columnIds.map(key => {
    return {
      title: key,
      dataIndex: key,
      key: key,
      sorter: (a, b) => a[key] - b[key],
    };
  });
}
const AdjustColumns: React.FunctionComponent<IAdjustColumnsProps> = props => {
  const { store } = useContext();
  const { source } = store;
  const { columns } = getTable(source.nodes);
  const { onChange } = props;

  const defaultColumnIds =
    (Utils.storage.get('explore_table_view_column_ids') as string[]) || columns.map(item => item.key);
  const [state, setState] = useState({
    columnIds: defaultColumnIds,
    tableColumns: getTableColumns(defaultColumnIds),
  });
  const { columnIds, tableColumns } = state;
  const onChangeColumns = value => {
    setState(preState => {
      return {
        ...preState,
        columnIds: value,
        tableColumns: getTableColumns(value),
      };
    });
    Utils.storage.set('explore_table_view_column_ids', value);
    if (onChange) {
      onChange(value);
    }
  };

  const options = columns.map(item => {
    return {
      label: item.key,
      value: item.key,
    };
  });

  return (
    <Popover
      title="Select Display Columns"
      arrow={false}
      placement="bottomRight"
      style={{ padding: '0px' }}
      content={
        <Select
          // maxTagCount="responsive"
          mode="multiple"
          allowClear
          style={{ width: '300px' }}
          variant="borderless"
          placeholder="Adjust Table Columns"
          value={columnIds}
          onChange={onChangeColumns}
          options={options}
        />
      }
    >
      <Button style={{ padding: '12px 0px' }} type="text" icon={<ControlOutlined />}></Button>
    </Popover>
  );
};

export default React.memo(AdjustColumns);
