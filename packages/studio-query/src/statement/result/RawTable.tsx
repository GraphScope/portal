import React from 'react';
import { Table, Flex } from 'antd';
import { v4 as uuidv4 } from 'uuid';
import { UpOutlined, DownOutlined } from '@ant-design/icons';
import { Icons } from '@graphscope/studio-components';
import JSONPretty from 'react-json-pretty';

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

  //   const containerStyles = {
  //     marginLeft: '12px',
  //     width: `${100 / firstRowKeys.length}%`,
  //   };
  //   const recursion = (data, size = '12px', textIndent = '-8px') => {
  //     return (
  //       <>
  //         {Object.entries(data).map(([key, value]) => {
  //           return (
  //             <p
  //               style={{
  //                 paddingLeft: '16px',
  //                 overflowWrap: 'break-word',
  //                 wordBreak: 'break-all',
  //                 whiteSpace: 'pre-wrap',
  //               }}
  //               key={key}
  //             >
  //               <span style={{ color: '#F9822F', paddingLeft: size }}>"{key}" : </span>
  //               <span
  //                 style={{
  //                   color: '#393534',
  //                   paddingLeft: '6px',
  //                   textIndent,
  //                 }}
  //               >
  //                 {Object.prototype.toString.call(value) === '[object Object]' ? (
  //                   <>&#123; {recursion(value, '24px', '16px')} &#125;</>
  //                 ) : (
  //                   JSON.stringify(value, null, 2)
  //                 )}
  //               </span>
  //             </p>
  //           );
  //         })}
  //       </>
  //     );
  //   };
  return (
    <Table
      size="small"
      columns={columns}
      dataSource={dataSource}
      expandable={{
        expandIconColumnIndex: columns.length,
        expandedRowRender: record => (
          <Flex>
            {Object.values(record).map(item => {
              return (
                item.key && (
                  <JSONPretty
                    style={{
                      width: `${100 / firstRowKeys.length}%`,
                      maxWidth: '800px',
                      whiteSpace: 'pre-wrap',
                      wordWrap: 'break-word',
                      padding: '0px 10px',
                    }}
                    data={item.data}
                    theme={{
                      main: 'line-height:1.3;color:#66d9ef;background:#FAFAFA;overflow:auto;',
                      error: 'line-height:1.3;color:#66d9ef;background:#272822;overflow:auto;',
                      key: 'color:#fd971f;',
                      string: 'color:#383333;',
                      value: 'color:#a6e22e;',
                      boolean: 'color:#ac81fe;',
                    }}
                  ></JSONPretty>
                )
              );
            })}
          </Flex>
          // <Flex>
          //   {Object.values(record).map(
          //     item =>
          //       item.key && (
          //         <div style={containerStyles} key={item.key}>
          //           &#123;
          //           {recursion(item.data)}
          //           &#125;
          //         </div>
          //       ),
          //   )}
          // </Flex>
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
