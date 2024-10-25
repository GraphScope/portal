import React from 'react';
import { Table, Flex } from 'antd';
import { v4 as uuidv4 } from 'uuid';
import { UpOutlined, DownOutlined } from '@ant-design/icons';
import { Icons } from '@graphscope/studio-components';
import type { TableColumnsType } from 'antd';

interface DataType {
  elementId: string;
  startNodeElementId?: string;
  endNodeElementId?: string;
  key: string;
  labels?: string[];
  type?: string;
  data?: {
    [key: string]: string | string[] | { [key: string]: string };
  };
}

interface IRawTableProps {
  dataSource: DataType[];
  columnsName: string[];
}

const RawTable: React.FC<IRawTableProps> = ({ dataSource, columnsName }) => {
  const width = 100 / columnsName.length;

  const renderFieldData = (fieldData: any) => {
    const { startNodeElementId, endNodeElementId, type, elementId, labels } = fieldData;

    return startNodeElementId && endNodeElementId ? (
      <span>
        &#123;
        <Icons.Arrow style={{ color: '#F97108' }} />
        {type} &#125; ID {elementId}
      </span>
    ) : (
      <span>
        &#123;
        <Icons.Punctuation style={{ color: '#B668B0' }} /> :{labels} &#125; ID {elementId}
      </span>
    );
  };

  const columns: TableColumnsType<DataType> = [
    {
      title: '#',
      dataIndex: 'index',
      key: 'index',
      width: '30px',
      render: (text, record, index) => index + 1,
    },
    ...columnsName.map(item => ({
      title: item,
      width: `${width}%`,
      key: uuidv4(),
      render: record => renderFieldData(record[item]),
    })),
  ];

  const containerStyles = {
    marginLeft: '12px',
    width: `${width}%`,
  };

  const recursion = (data: any, size = '12px', textIndent = '-8px') => (
    <div>
      {Object.entries(data).map(([key, value]) => (
        <p
          style={{
            paddingLeft: '16px',
            overflowWrap: 'break-word',
            wordBreak: 'break-all',
            whiteSpace: 'pre-wrap',
          }}
          key={key}
        >
          <span style={{ color: '#F9822F', paddingLeft: size }}>"{key}" : </span>
          <span style={{ paddingLeft: '6px', textIndent }}>
            {typeof value === 'object' && value !== null ? (
              <>&#123; {recursion(value, '24px', '16px')} &#125;</>
            ) : (
              JSON.stringify(value, null, 2)
            )}
          </span>
        </p>
      ))}
    </div>
  );

  return (
    <Table
      size="small"
      columns={columns}
      dataSource={dataSource}
      expandable={{
        expandIconColumnIndex: columns.length,
        expandedRowRender: record => (
          <Flex>
            {Object.values(record).map(
              item =>
                item.key && (
                  <div style={containerStyles} key={item.key}>
                    &#123;
                    {recursion(item.data)}
                    &#125;
                  </div>
                ),
            )}
          </Flex>
        ),
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

export default RawTable;
