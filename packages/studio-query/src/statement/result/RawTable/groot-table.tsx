import React, { useMemo } from 'react';
import { Table, Flex } from 'antd';
import { v4 as uuidv4 } from 'uuid';
import { UpOutlined, DownOutlined } from '@ant-design/icons';
import { Icons } from '@graphscope/studio-components';
import type { TableColumnsType } from 'antd';
import { JsonShow } from './json-show';
import type { GrootDataType } from './typing';

export interface IGrootTableProps {
  grootData: GrootDataType[];
}

const renderFieldData = (fieldData: Pick<GrootDataType, 'id' | 'label' | 'inV' | 'outV'>, type?: string) => {
  const { inV, outV, id, label } = fieldData;
  let content;
  switch (type) {
    case 'inV':
      content = (
        <>
          {'{'}
          <Icons.Punctuation style={{ color: '#F97108' }} />
          {inV?.label} {'}'}ID {inV?.id}
        </>
      );
      break;
    case 'outV':
      content = (
        <>
          {'{'}
          <Icons.Punctuation style={{ color: '#F97108' }} /> {outV?.label} {'}'} ID {outV?.id}
        </>
      );
      break;
    default:
      if (!inV && !outV)
        content = (
          <>
            {'{'}
            <Icons.Punctuation style={{ color: '#B668B0' }} />:{label} {'}'} ID {id}
          </>
        );
      else
        content = (
          <>
            {'{'} <Icons.Arrow style={{ color: '#B668B0' }} /> {label} {'}'} ID {id}
          </>
        );
  }

  return <span>{content}</span>;
};

const getColumns = (data: GrootDataType[]): TableColumnsType<GrootDataType> => {
  const width =
    Object.prototype.toString.call(data[0]?.inV) === '[object Object]' &&
    Object.prototype.toString.call(data[0]?.outV) === '[object Object]'
      ? '33%'
      : '100%';

  const columns: TableColumnsType<GrootDataType> = [
    {
      title: '#',
      dataIndex: 'index',
      key: 'index',
      width: '30px',
      render: (_, __, index) => index + 1,
    },
    {
      title: 'label',
      width: width,
      key: uuidv4(),
      render: record => renderFieldData(record),
    },
  ];

  if (Object.prototype.toString.call(data[0]?.inV) === '[object Object]') {
    columns.push({
      title: 'inV',
      width: '33%',
      key: uuidv4(),
      render: record => renderFieldData(record, 'inV'),
    });
  }

  if (Object.prototype.toString.call(data[0]?.outV) === '[object Object]') {
    columns.push({
      title: 'outV',
      width: '33%',
      key: uuidv4(),
      render: record => renderFieldData(record, 'outV'),
    });
  }

  columns.splice(columns.length, 0, Table.EXPAND_COLUMN);

  return columns;
};

const GrootTable: React.FC<IGrootTableProps> = ({ grootData }) => {
  const columns = useMemo(() => getColumns(grootData), []);

  return (
    <Table
      size="small"
      columns={columns}
      dataSource={grootData}
      expandable={{
        expandedRowRender: record => {
          const { inV, outV } = record;
          return (
            <Flex>
              <div style={{ width: '33%', marginLeft: '12px' }}>
                {'{'}
                {JsonShow(record)}
                {'}'}
              </div>
              {Object.prototype.toString.call(inV) === '[object Object]' && (
                <div style={{ width: '33%', marginLeft: '12px' }}>
                  {'{'}
                  {JsonShow(inV)}
                  {'}'}
                </div>
              )}
              {Object.prototype.toString.call(outV) === '[object Object]' && (
                <div style={{ width: '33%', marginLeft: '12px' }}>
                  {'{'}
                  {JsonShow(outV)}
                  {'}'}
                </div>
              )}
            </Flex>
          );
        },
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

export default GrootTable;
