import React from 'react';
import { Table } from 'antd';
import { v4 as uuidv4 } from 'uuid';
import { UpOutlined, DownOutlined } from '@ant-design/icons';
import { Icons } from '@graphscope/studio-components';
import type { TableColumnsType } from 'antd';
import InteranctiveExpand from './interanctive-expand';
import type { InteranctiveDataType } from './typing';

export interface IInteranctiveTableProps {
  data: { keys: string[]; _fields: InteranctiveDataType[] }[];
}

const InteranctiveTable: React.FC<IInteranctiveTableProps> = ({ data }) => {
  const dataSource = data.map(item => {
    const { keys, _fields } = item;
    return keys.reduce((acc, key, index) => {
      const field = _fields[index];
      acc[key] = {
        key: uuidv4(),
        elementId: field.elementId,
        data: field,
        labels: field.labels ? field.labels[0] : undefined,
        type: field.type,
        startNodeElementId: field.startNodeElementId,
        endNodeElementId: field.endNodeElementId,
      };
      acc['key'] = uuidv4();
      return acc;
    }, {});
  }) as InteranctiveDataType[];

  const columnKeys = data[0].keys;
  /** 根据列数量计算每列宽度 */
  const width = 100 / columnKeys.length;
  const renderFieldData = (fieldData: Partial<InteranctiveDataType>) => {
    const { startNodeElementId, endNodeElementId, type, elementId, labels } = fieldData;
    return startNodeElementId && endNodeElementId ? (
      <span>
        &#123;
        <Icons.Arrow style={{ color: '#F97108' }} /> : {type} &#125; ID {elementId}
      </span>
    ) : (
      <span>
        &#123;
        <Icons.Punctuation style={{ color: '#B668B0' }} /> : {labels} &#125; ID {elementId}
      </span>
    );
  };

  const columns: TableColumnsType<InteranctiveDataType> = [
    {
      title: '#',
      dataIndex: 'index',
      key: 'index',
      width: '30px',
      render: (text, record, index) => index + 1,
    },
    ...columnKeys.map(item => ({
      title: item,
      width: `${width}%`,
      key: uuidv4(),
      render: record => renderFieldData(record[item]),
    })),
    Table.EXPAND_COLUMN,
  ];
  return (
    <Table
      size="small"
      columns={columns}
      dataSource={dataSource}
      expandable={{
        // expandIconColumnIndex: columns.length,
        expandedRowRender: record => <InteranctiveExpand expandData={record} width={width} />,
        expandIcon: ({ expanded, onExpand, record }) =>
          expanded ? (
            <UpOutlined style={{ color: '#F97108' }} onClick={e => onExpand(record, e)} />
          ) : (
            <DownOutlined onClick={e => onExpand(record, e)} />
          ),
        expandRowByClick: true,
      }}
    />
  );
};

export default InteranctiveTable;
