import React, { useState } from 'react';
import { Table, ConfigProvider } from 'antd';
import MiddleWare from './middle-ware';
interface IQueryTableProps {
  data: {
    fields: { [key: string]: string; analyticType: 'dimension' | 'measure' }[];
    dataSource: { [key: string]: string }[];
  };
}
const QueryTable: React.FC<IQueryTableProps> = props => {
  const { data } = props;
  const [state, updateState] = useState({
    fields: data.fields,
    dataSource: data.dataSource,
  });
  const { fields, dataSource } = state;
  const handleEditHeader = (id: string, val: string) => {
    const data = fields.map(item => {
      if (item.fid === id) {
        return {
          ...item,
          fid: val,
        };
      }
      return item;
    });

    updateState(preset => {
      return {
        ...preset,
        fields: data,
        dataSource: preset.dataSource.map(item => {
          return {
            ...item,
            [val]: item.Name,
          };
        }),
      };
    });
  };

  const newcolumns = fields.map(item => {
    const { fid, semanticType, analyticType } = item;
    return {
      title: <MiddleWare id={fid} analyticType={analyticType} data={dataSource} handleEditHeader={handleEditHeader} />,
      dataIndex: fid,
      key: fid,
      width: 220,
    };
  });

  return (
    <div style={{ overflowX: 'scroll' }}>
      <ConfigProvider
        theme={{
          components: {
            Table: {
              headerBg: '#fff',
              colorText: '#353535',
              fontSize: 12,
            },
          },
        }}
      >
        <Table columns={newcolumns} dataSource={dataSource} bordered scroll={{ x: 500, y: 500 }} pagination={false} />
      </ConfigProvider>
    </div>
  );
};

export default QueryTable;
