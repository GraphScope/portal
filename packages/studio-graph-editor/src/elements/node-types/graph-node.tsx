import React, { memo, useState } from 'react';
import { Handle, NodeProps, Position } from 'reactflow';
import { theme } from 'antd';
import { CheckOutlined } from '@ant-design/icons';
import { EditableText, useThemeProvider, useSection } from '@graphscope/studio-components';
const { useToken } = theme;
import { useContext } from '../../canvas/useContext';

const R = 50;
const HALO_LINE_WIDTH = 16;
const NODE_WIDTH = R * 2 + 'px';
const HALO_WIDTH = R * 2 + HALO_LINE_WIDTH + 'px';

const styles = {
  handler: {
    width: HALO_WIDTH,
    height: HALO_WIDTH,
    zIndex: 0,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    transition: 'all 0.3s ease',
  },
};
const GraphNode = (props: NodeProps) => {
  const { data = {}, id } = props;
  const { label, filelocation, disabled } = data;
  const { store, updateStore } = useContext();
  const { currentId, theme, elementOptions } = store;
  const { isLight } = useThemeProvider();
  const { toggleRightSide, toggleLeftSide } = useSection();
  const { token } = useToken();
  const isSelected = id === currentId;
  const isConnectable = !elementOptions.isConnectable;
  const [state, updateState] = useState({
    isHover: false,
    contentEditable: false,
  });

  const onMouseEnter = () => {
    if (isConnectable) {
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
    if (isConnectable) {
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
    toggleLeftSide(true);
  };
  const haloStyle = !isConnectable
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
    if (!isLight) {
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
          backgroundColor: !isLight ? '#161616' : '#fafafa',
          borderRadius: '50%',
          height: NODE_WIDTH,
          width: NODE_WIDTH,
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
              top: '0px',
              right: '-16px',
            }}
          >
            <CheckOutlined style={{ color: token.colorSuccessActive, fontSize: 20 }} />
          </div>
        )}
        <EditableText
          id={id}
          text={label}
          onTextChange={hanleChangeLabel}
          disabled={disabled}
          style={{ color: !isLight ? '#D7D7D7' : '#000' }}
        />
      </div>
    </div>
  );
};

export default memo(GraphNode);
