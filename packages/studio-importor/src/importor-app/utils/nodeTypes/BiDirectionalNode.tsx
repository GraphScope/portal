import React, { memo } from 'react';
import { Handle, NodeProps, Position } from 'reactflow';
import { List, Popover, Flex } from 'antd';
const style = {
  padding: 5,
  background: '#fff',
  border: '1px solid #ddd',
};
const PopoverList = ({ data }) => {
  return (
    <List
      style={{
        position: 'absolute',
        transform: `translate(-50%, -50%) translate(${55}px,${0}px)`,
        background: '#ddd',
        borderRadius: 5,
        lineHeight: '10px',
      }}
      size="small"
      header={<>{data.label}</>}
      bordered
      dataSource={['Racing car sprays burning fuel into crowd.', 'Japanese princess to wed commoner.']}
      renderItem={item => (
        <List.Item style={{ height: '24px' }}>
          <List.Item.Meta description="123" />
          <div style={{ marginLeft: '48px' }}>Content</div>
        </List.Item>
      )}
    />
  );
};
const BiDirectionalNode = ({ data, isConnectable }: NodeProps) => {
  const properties = Object.entries(data.properties);
  return (
    <div>
      <Handle type="source" position={Position.Left} id="left" />
      <div style={{ border: '1px solid #ddd', backgroundColor: '#F6F7F9', borderRadius: '6px' }}>
        <div style={{ borderBottom: '1px solid #ddd', padding: '3px 12px' }}>{data.label}</div>
        {properties.map((item, index) => {
          return (
            <Flex
              justify="space-between"
              style={{
                lineHeight: '0px',
                borderBottom: properties.length - 1 === index ? '' : '1px solid #ddd',
                padding: 10,
              }}
            >
              <span>{item[0]}</span>
              <span style={{ marginLeft: '24px' }}>{item[1]}</span>
            </Flex>
          );
        })}
      </div>
      <Handle
        type="target"
        position={Position.Left}
        style={{ bottom: 10, background: '#555' }}
        onConnect={params => console.log('handle onConnect', params)}
        isConnectable={isConnectable}
      />
    </div>
  );
};

export default memo(BiDirectionalNode);
