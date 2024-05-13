import React, { memo, useState, useRef } from 'react';
import { Handle, NodeProps, Position } from 'reactflow';
import { List, Popover, Flex, Typography, Input } from 'antd';
import EditableText from '../../../components/EditableText';
const style = {
  padding: 5,
  background: '#fff',
  border: '1px solid #ddd',
};
import Arrow from './arrow';
import { useContext } from '../../useContext';
const styles = {
  handler: {
    width: '126px',
    height: '126px',
    zIndex: 0,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    transition: 'all 0.3s ease',
  },
};
const GraphNode = (props: NodeProps) => {
  const { data, isConnectable, id } = props;

  const { store, updateStore } = useContext();
  const { currentId, theme } = store;
  const isSelected = id === currentId;
  const [state, updateState] = useState({
    isHover: false,
    label: id,
    contentEditable: false,
  });

  const onMouseEnter = () => {
    updateState(preState => {
      return {
        ...preState,
        isHover: true,
      };
    });
  };
  const onMouseLeave = () => {
    updateState(preState => {
      return {
        ...preState,
        isHover: false,
      };
    });
  };
  const hanleChangeLabel = value => {
    updateState(preState => {
      return {
        ...preState,
        label: value,
      };
    });
    updateStore(draft => {
      //@ts-ignore
      const match = draft.nodes.find(node => node.id === id);
      if (match) {
        match.label = value;
      }
    });
  };
  const onClick = () => {
    updateStore(draft => {
      draft.currentType = 'nodes';
      draft.currentId = id;
    });
  };
  return (
    <div
      data-nodeid={id}
      style={{ boxSizing: 'border-box', width: '100px', height: '100px' }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
    >
      <Handle
        type="target"
        position={Position.Left}
        id="left"
        style={{
          background: 'transparent',
          position: 'relative',

          //  top: '50%', left: '50%', transform: 'translate(-50%,-50%)'
        }}
      />
      {/* 
      <Handle
        type="target"
        position={Position.Right}
        id="left-revert"
        style={{
          background: 'red',
          // top: '50%', left: '50%', transform: 'translate(-50%,-50%)'
        }}
      /> */}

      <Handle
        type="source"
        position={Position.Right}
        id="right"
        style={{
          ...styles.handler,
          border: state.isHover ? `2px dashed ${theme.primaryColor}` : 'none',
          background: state.isHover ? '#fafafa' : 'transparent',
        }}
      ></Handle>
      {/* <Handle
        type="source"
        position={Position.Left}
        id="right-revert"
        style={{
          background: 'blue',
          //  top: '50%', left: '50%', transform: 'translate(-50%,-50%)'
        }}
      /> */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          border: isSelected ? `4px solid ${theme.primaryColor}` : '2px solid #ddd',
          backgroundColor: isSelected ? '#fafafa' : '#fafafa',
          borderRadius: '50%',
          height: '100px',
          width: '100px',
          boxSizing: 'border-box',
          zIndex: 0,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          fontSize: '20px',
        }}
        data-nodeid={id}
      >
        <EditableText id={id} text={state.label} onTextChange={hanleChangeLabel} />
      </div>
    </div>
  );
};

export default memo(GraphNode);
