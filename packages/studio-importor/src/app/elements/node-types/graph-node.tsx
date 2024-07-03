import React, { memo, useState } from 'react';
import { Handle, NodeProps, Position } from 'reactflow';
import { Tag } from 'antd';
import { LinkOutlined } from '@ant-design/icons';
import { EditableText, useThemeContainer, useSection } from '@graphscope/studio-components';

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
  const { data = {}, id } = props;
  const { label, filelocation } = data;
  const { store, updateStore } = useContext();
  const { currentId, theme, elementOptions } = store;
  const { algorithm } = useThemeContainer();
  const { toggleRightSide } = useSection();
  const isSelected = id === currentId;
  const isDark = algorithm === 'darkAlgorithm';

  const [state, updateState] = useState({
    isHover: false,
    contentEditable: false,
  });

  const onMouseEnter = () => {
    if (!elementOptions.isConnectable) {
      return;
    }
    updateState(preState => {
      return {
        ...preState,
        isHover: true,
      };
    });
  };
  const onMouseLeave = () => {
    if (!elementOptions.isConnectable) {
      return;
    }
    updateState(preState => {
      return {
        ...preState,
        isHover: false,
      };
    });
  };
  const hanleChangeLabel = value => {
    updateStore(draft => {
      //@ts-ignore
      const match = draft.nodes.find(node => node.id === id);
      if (match) {
        //@ts-ignore
        match.data.label = value;
      }
    });
  };
  const onClick = () => {
    updateStore(draft => {
      draft.currentType = 'nodes';
      draft.currentId = id;
      // draft.collapsed.right = false;
    });
    toggleRightSide(false);
  };
  const haloStyle = elementOptions.isConnectable
    ? {
        ...styles.handler,
        border: state.isHover ? `2px dashed ${theme.primaryColor}` : 'none',
        background: state.isHover ? '#fafafa' : 'transparent',
        cursor: 'copy',
      }
    : {
        cursor: 'not-allow',
        background: 'transparent',
        border: 'none',
      };
  const getBorder = () => {
    if (isDark) {
      return isSelected ? `4px solid ${theme.primaryColor}` : '2px solid #d7d7d7';
    }
    return isSelected ? `4px solid ${theme.primaryColor}` : '2px solid #000';
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
          border: 'none',
        }}
      />

      <Handle type="source" position={Position.Right} id="right" style={haloStyle}></Handle>

      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          border: getBorder(),
          backgroundColor: isDark ? '#161616' : '#fafafa',
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
        {filelocation && (
          <div
            style={{
              position: 'absolute',
              transform: 'translate(50px,-100%)',
            }}
          >
            <Tag color="green">
              <LinkOutlined /> Mapped
            </Tag>
          </div>
        )}
        <EditableText
          id={id}
          text={label}
          onTextChange={hanleChangeLabel}
          disabled={!elementOptions.isEditable}
          style={{ color: isDark ? '#D7D7D7' : '#000' }}
        />
      </div>
    </div>
  );
};

export default memo(GraphNode);
