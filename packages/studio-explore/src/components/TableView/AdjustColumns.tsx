import React, { useEffect, useState } from 'react';
import { Button, Popover, Select } from 'antd';
import { ControlOutlined } from '@ant-design/icons';
import { useContext } from '@graphscope/studio-graph';
import { getTable } from './getTableData';
interface IAdjustColumnsProps {
  onChange: (columnIds: string[]) => void;
  columnKeys: string[];
}

export function getTableColumns(columnIds: string[]) {
  return columnIds?.map(key => {
    return {
      title: key,
      dataIndex: key,
      key: key,
      sorter: (a, b) => a[key] - b[key],
    };
  })||[];
}
const AdjustColumns: React.FunctionComponent<IAdjustColumnsProps> = props => {
  const { store } = useContext();
  const { source } = store;
  const { columns } = getTable(source.nodes);
  const { onChange, columnKeys } = props;

  const [state, setState] = useState({
    columnIds: columnKeys,
    tableColumns: getTableColumns(columnKeys),
  });

  useEffect(()=>{
    setState(preState => {
      return {
        ...preState,
        columnIds: columnKeys,
        tableColumns: getTableColumns(columnKeys),
      };
    });
  },[columnKeys])

  const { columnIds } = state;
  const onChangeColumns = value => {
    setState(preState => {
      return {
        ...preState,
        columnIds: value,
        tableColumns: getTableColumns(value),
      };
    });
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
