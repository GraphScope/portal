import React, { memo } from 'react';
import { Handle, NodeProps, Position } from 'reactflow';
import { List, Popover, Flex } from 'antd';
const style = {
  padding: 5,
  background: '#fff',
  border: '1px solid #ddd',
};
const GraphNode = ({ data, isConnectable }: NodeProps) => {
  const properties = Object.entries(data.properties);
  return (
    <div>
      <Handle
        type="target"
        position={Position.Left}
        id="left"
        style={{ background: 'red', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }}
      />
      <Handle
        type="target"
        position={Position.Right}
        id="left-revert"
        style={{ background: 'red', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }}
      />

      <Handle
        type="source"
        position={Position.Right}
        id="right"
        style={{ background: 'blue', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }}
      />
      <Handle
        type="source"
        position={Position.Left}
        id="right-revert"
        style={{ background: 'blue', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }}
      />

      <div
        style={{
          border: '1px solid #ddd',
          // backgroundColor: '#F6F7F9',
          borderRadius: '50%',
          height: '120px',
          width: '120px',
        }}
      >
        {data.label}
      </div>
    </div>
  );
};

export default memo(GraphNode);
