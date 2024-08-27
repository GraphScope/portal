import React, { ChangeEvent, memo, MouseEventHandler, useEffect, useRef, useState } from 'react';
import { Handle, NodeProps, Position } from 'reactflow';
import { Tag, Button, theme, Popover, Input } from 'antd';
import { CheckCircleOutlined, CheckOutlined } from '@ant-design/icons';
import { EditableText, useThemeContainer, useSection, PropertiesList, Property } from '@graphscope/studio-components';
const { useToken } = theme;
import { useContext } from '../../canvas/useContext';
import { LazyLoad } from '../middle-component/lazy-load';
import { GraphContext, useGraphContext } from '../..';
import { Option } from '@graphscope/studio-components/lib/PropertiesList';

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
  const { onNodeClick } = useGraphContext();
  const { data = {}, id } = props;
  const { label, filelocation, disabled } = data;
  const { store, updateStore } = useContext();
  const { currentId, theme, elementOptions } = store;
  const { algorithm } = useThemeContainer();
  const { toggleRightSide, toggleLeftSide } = useSection();
  const { token } = useToken();
  const isSelected = id === currentId;
  const isDark = algorithm === 'darkAlgorithm';
  const isConnectable = !elementOptions.isConnectable;
  const [state, updateState] = useState({
    isHover: false,
    contentEditable: false,
  });
  const [visible, setVisible] = useState<boolean>(false);
  const nodeRef = useRef<HTMLDivElement>(null);
  const {
    isShowPopover = false,
    triggerPopover = 'click',
    disabled: graphDisabled = false,
    popoverCustomContent,
  } = useGraphContext();

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

  const currentNode = store.nodes.find(node => node.id === id);

  const hanleChangeLabel = value => {
    updateStore(draft => {
      //@ts-ignore
      // const match = draft.nodes.find(node => node.id === id);
      const match = draft.nodes.find(node => node.id === id);
      if (match) {
        //@ts-ignore
        match.data.label = value;
      }
    });
  };

  const onClick: MouseEventHandler<HTMLDivElement> = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    updateStore(draft => {
      draft.currentType = 'nodes';
      draft.currentId = id;
      // draft.collapsed.right = false;
    });
    // toggleRightSide(false);
    // toggleLeftSide(true);
    onNodeClick && onNodeClick(data, event);
    triggerPopover === 'click' && setVisible(true);
  };
  const haloStyle =
    graphDisabled || isConnectable
      ? { cursor: 'not-allow', background: 'transparent', border: 'none' }
      : {
          ...styles.handler,
          cursor: 'copy',
          background: state.isHover ? '#fafafa' : 'transparent',
          border: state.isHover ? `2px dashed ${theme.primaryColor}` : 'none',
        };

  const getBorder = () => {
    if (isDark) {
      return isSelected ? `4px solid ${theme.primaryColor}` : '2px solid #d7d7d7';
    }
    return isSelected ? `4px solid ${theme.primaryColor}` : '2px solid #000';
  };

  // 监听用户 click || hover position
  useEffect(() => {
    function handleClickOutside(event) {
      if (nodeRef.current && !nodeRef.current.contains(event.target)) setVisible(false);
    }

    triggerPopover === 'click' && document.addEventListener('click', handleClickOutside);
    return () => {
      triggerPopover === 'click' && document.removeEventListener('click', handleClickOutside);
    };
  }, [nodeRef]);

  const handleLabelChange = (event: ChangeEvent) => {
    // @ts-ignore

    updateStore(draft => {
      //@ts-ignore
      const match = draft.nodes.find(node => node.id === id);
      if (match) {
        //@ts-ignore
        match.data.label = event.target.value;
      }
    });
  };

  const typeColumn: Option[] = [
    {
      label: 'string',
      value: 'string',
    },
    {
      label: 'number',
      value: 'number',
    },
  ];
  const handleChange = list => {
    console.log('properties', list);
  };

  return (
    <div
      ref={nodeRef}
      onMouseLeave={() => triggerPopover === 'hover' && setVisible(false)}
      onMouseEnter={() => triggerPopover === 'hover' && setVisible(true)}
    >
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
            text={currentNode?.data.label ?? props.data.label}
            onTextChange={hanleChangeLabel}
            disabled={disabled || graphDisabled}
            style={{ color: isDark ? '#D7D7D7' : '#000' }}
          />
        </div>
      </div>
      {visible && isShowPopover && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '110px',
            backgroundColor: 'white',
            width: '400px',
            minHeight: '300px',
            border: '1px solid #D7D7D7',
            borderRadius: '12px',
            boxShadow: '0 0 8px #f6f6f6',
            transform: 'translateY(-50%)',
            padding: '20px',
          }}
        >
          <span>label</span>
          <Input value={currentNode.data.label} onChange={handleLabelChange}></Input>
          {popoverCustomContent ?? (
            <PropertiesList typeColumn={{ options: typeColumn }} onChange={handleChange}></PropertiesList>
          )}
        </div>
      )}
    </div>
  );
};

const LazyGraphNode = (props: NodeProps) => (
  <LazyLoad type="NODE">
    <GraphNode {...props} />
  </LazyLoad>
);

export default memo(LazyGraphNode);
