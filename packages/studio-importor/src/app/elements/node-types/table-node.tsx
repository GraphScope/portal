import React, { memo } from 'react';
import { Handle, NodeProps, Position } from 'reactflow';
import { List, Popover, Flex } from 'antd';
import TableCard from '../../../components/TableCard';
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
const TableNode = (props: NodeProps) => {
  const { id, data } = props;
  const { _fromEdge } = data || {};

  // const properties = Object.entries(data.properties);
  const handleStyle = _fromEdge
    ? {
        top: '30px',
        backgroundColor: 'transparent',
        border: 'none',
      }
    : {
        top: '60px',
        backgroundColor: 'transparent',
        border: 'none',
      };
  const tableStyle = _fromEdge
    ? {
        border: '1px dashed #000',
        backgroundColor: '#F6F7F9',
        borderRadius: '6px',
        height: '60px',
        width: '250px',
      }
    : {
        border: '1px solid #ddd',
        backgroundColor: '#F6F7F9',
        borderRadius: '6px',
        width: '250px',
        height: '200px',
      };
  return (
    <div>
      <Handle type="target" position={Position.Left} id="left" style={handleStyle} />
      <Handle type="target" position={Position.Right} id="left-revert" style={handleStyle} />
      {/* <Handle type="target" position={Position.Right} id="left-revert" style={{ background: 'red' }} /> */}
      <Handle type="source" position={Position.Right} id="right" style={handleStyle} />
      <Handle type="source" position={Position.Left} id="right-revert" style={handleStyle} />
      {/* <Handle type="source" position={Position.Left} id="right-revert" style={{ background: 'blue' }} /> */}
      {/* <div style={tableStyle}> */}
      {/* <div style={{ borderBottom: '1px solid #ddd', padding: '3px 12px' }}>{id}</div> */}
      <TableCard data={data} _fromEdge={_fromEdge} />
      {/* </div> */}
    </div>
  );
};

export default memo(TableNode);
