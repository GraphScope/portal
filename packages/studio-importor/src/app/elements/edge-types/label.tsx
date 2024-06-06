import * as React from 'react';
import { EdgeLabelRenderer } from 'reactflow';
import { EditableText } from '@graphscope/studio-components';
import { useContext } from '../../useContext';
import { LinkOutlined } from '@ant-design/icons';
import { Tag } from 'antd';
interface ILabelProps {
  id: string;
  label: string;
  style?: React.CSSProperties;
  filelocation?: string;
}

const Label: React.FunctionComponent<ILabelProps> = props => {
  const { id, label, style, filelocation } = props;
  const { store, updateStore } = useContext();
  const { currentId, theme, elementOptions } = store;
  const isSelected = id === currentId;

  const onEdgeClick = () => {
    updateStore(draft => {
      draft.currentId = id;
      draft.currentType = 'edges';
      draft.collapsed.right = false;
    });
  };

  const onLabelChange = value => {
    updateStore(draft => {
      const match = draft.edges.find(edge => edge.id === id);
      if (match) {
        //@ts-ignore
        match.data.label = value;
      }
    });
  };

  return (
    <EdgeLabelRenderer>
      <div
        style={{
          cursor: 'pointer',
          position: 'absolute',
          fontSize: 12,
          pointerEvents: 'all',
          ...style,
        }}
        className="nodrag nopan"
      >
        {filelocation && (
          <div
            style={{
              position: 'absolute',
              transform: 'translate(120%,-2px)',
              right: '0px',
            }}
          >
            <Tag color="success">
              <LinkOutlined />
            </Tag>
          </div>
        )}
        <div
          className="edgebutton"
          onClick={onEdgeClick}
          style={{
            borderRadius: '4px',
            background: isSelected ? `${theme.primaryColor}` : '#fff',
            border: isSelected ? `2px solid ${theme.primaryColor}` : '1px solid #000',
          }}
        >
          <EditableText
            disabled={!elementOptions.isEditable}
            id={id}
            text={label || id}
            onTextChange={onLabelChange}
            style={{ color: isSelected ? '#fff' : '#000' }}
          />
        </div>
      </div>
    </EdgeLabelRenderer>
  );
};

export default Label;
