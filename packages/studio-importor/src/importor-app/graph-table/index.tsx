import React, { useState } from 'react';
import { Space } from 'antd';
import { FormOutlined, EllipsisOutlined, MinusSquareOutlined } from '@ant-design/icons';
import PrimaryKey from './primary-key';
interface IGraphTable {
  tableData: {
    label: string;
    properties: any[];
  };
  type?: string;
}
const GraphTable: React.FC<IGraphTable> = props => {
  const { tableData, type } = props;
  const [state, updateState] = useState({
    isHovered: false,
    hoveredField: -1,
  });
  const { isHovered, hoveredField } = state;
  const properties = Object.entries(tableData.properties);
  return (
    <>
      {type === 'view' ? (
        <div
          style={{
            width: '60px',
            textAlign: 'center',
            lineHeight: '60px',
            border: '1px solid #ddd',
            borderRadius: '50%',
          }}
        >
          {tableData.label}
        </div>
      ) : (
        <div
          style={{
            border: isHovered ? '1px dashed #3B83F6' : '1px solid #ddd',
            backgroundColor: '#F6F7F9',
            borderRadius: '6px',
          }}
          onMouseEnter={() =>
            updateState(preset => {
              return {
                ...preset,
                isHovered: true,
              };
            })
          }
          onMouseLeave={() =>
            updateState(preset => {
              return {
                ...preset,
                isHovered: false,
              };
            })
          }
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              borderBottom: '1px solid #ddd',
              padding: '3px 8px',
            }}
          >
            <span>{tableData.label}</span>
            {isHovered && (
              <Space size={[3, 6]}>
                <FormOutlined />
                <EllipsisOutlined />
              </Space>
            )}
          </div>
          {properties.map((item, index) => {
            const [keys, value] = item;
            return (
              <div
                key={index}
                style={{
                  width: '200px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  borderBottom: properties.length - 1 === index ? '' : '1px solid #ddd',
                  padding: '3px 8px',
                }}
                onMouseEnter={() => {
                  updateState(preset => {
                    return {
                      ...preset,
                      hoveredField: index,
                    };
                  });
                }}
                onMouseLeave={() =>
                  updateState(preset => {
                    return {
                      ...preset,
                      hoveredField: -1,
                    };
                  })
                }
              >
                <div style={{ color: hoveredField === index ? '#A1A1AA' : '#28282B' }}>{keys}</div>
                {hoveredField === index ? (
                  <MinusSquareOutlined style={{ color: '#DF6A64' }} />
                ) : (
                  <Space size={[3, 6]} style={{ marginLeft: '16px', color: '#A1A1AA' }}>
                    <PrimaryKey />
                    <span>{value}</span>
                  </Space>
                )}
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};

export default GraphTable;
