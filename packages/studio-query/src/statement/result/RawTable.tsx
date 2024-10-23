import React from 'react';
import { Table, Flex } from 'antd';
import { v4 as uuidv4 } from 'uuid';
import { Icons } from '@graphscope/studio-components';

interface IRawTableProps {
  data: any;
}

const RawTable: React.FC<IRawTableProps> = ({ data }) => {
  const dataSource = data.records.map(item => {
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
  });

  const firstRowKeys = data.records[0].keys;

  const columns = [
    {
      title: '#',
      dataIndex: 'index',
      key: 'index',
      width: '30px',
      render: (text, record, index) => index + 1,
    },
    ...firstRowKeys.map(item => ({
      title: item,
      width: `${100 / firstRowKeys.length}%`,
      key: uuidv4(),
      render: record => {
        const fieldData = record[item];
        const { startNodeElementId, endNodeElementId, type, elementId, labels } = fieldData;
        if (startNodeElementId && endNodeElementId) {
          return (
            <span>
              &#123;
              <Icons.Arrow style={{ color: '#F97108' }} />
              {type} &#125; ID {elementId}
            </span>
          );
        }

        return (
          <span>
            &#123;
            <Icons.Punctuation style={{ color: '#B668B0' }} /> :{labels} &#125; ID {elementId}
          </span>
        );
      },
    })),
  ];

  const containerStyles = {
    marginLeft: '12px',
    width: `${100 / firstRowKeys.length}%`,
  };
  const recursion = data => {
    return (
      <>
        {Object.entries(data).map(([key, value]) => {
          console.log('value74', Object.prototype.toString.call(value) === '[object Object]');
          return (
            <p style={{ paddingLeft: '16px' }} key={key}>
              <span style={{ color: '#F9822F' }}>"{key}" : </span>
              <span style={{ color: '#393534', paddingLeft: '12px', textIndent: '-8px' }}>
                {Object.prototype.toString.call(value) === '[object Object]' ? (
                  <>&#123; {recursion(value)} &#125;</>
                ) : (
                  JSON.stringify(value, null, 2)
                )}
              </span>
            </p>
          );
        })}
      </>
    );
  };
  return (
    <Table
      columns={columns}
      dataSource={dataSource}
      expandable={{
        expandIconColumnIndex: columns.length - 1,
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
      }}
    />
  );
};

export default RawTable;
