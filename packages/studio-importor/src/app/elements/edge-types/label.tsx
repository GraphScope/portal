import * as React from 'react';
import { EdgeLabelRenderer } from 'reactflow';
import { EditableText, useThemeContainer, useSection } from '@graphscope/studio-components';
import { useContext } from '../../useContext';
import { CheckOutlined } from '@ant-design/icons';
import { Button, theme } from 'antd';
const { useToken } = theme;
interface ILabelProps {
  id: string;
  label: string;
  style?: React.CSSProperties;
  filelocation?: string;
}

const Label: React.FunctionComponent<ILabelProps> = props => {
  const { id, label, style, filelocation } = props;
  const { store, updateStore } = useContext();
  const { toggleRightSide } = useSection();
  const { token } = useToken();
  const { currentId, theme, elementOptions } = store;
  const isSelected = id === currentId;
  const { algorithm } = useThemeContainer();
  const isDark = algorithm === 'darkAlgorithm';
  const onEdgeClick = () => {
    updateStore(draft => {
      draft.currentId = id;
      draft.currentType = 'edges';
      // draft.collapsed.right = false;
    });
    toggleRightSide(false);
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
  const getBackground = () => {
    if (isDark) {
      return isSelected ? `${theme.primaryColor}` : '#161616';
    }
    return isSelected ? `${theme.primaryColor}` : '#fff';
  };
  const getBorder = () => {
    if (isDark) {
      return isSelected ? `2px solid ${theme.primaryColor}` : '1px solid #d7d7d7';
    }
    return isSelected ? `2px solid ${theme.primaryColor}` : '1px solid #000';
  };
  const getColor = () => {
    if (isDark) {
      return isSelected ? '#fff' : '#D7D7D7';
    }
    return isSelected ? '#fff' : '#000';
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
              // transform: 'translate(100%,0px)',
              right: '-16px',
              top: '-6px',
            }}
          >
            <CheckOutlined style={{ color: token.colorSuccessActive, fontSize: 12 }} />
          </div>
        )}
        <div
          className="edgebutton"
          onClick={onEdgeClick}
          style={{
            borderRadius: '4px',
            background: getBackground(),
            border: getBorder(),
          }}
        >
          <EditableText
            disabled={!elementOptions.isEditable}
            id={id}
            text={label || id}
            onTextChange={onLabelChange}
            style={{ color: getColor() }}
          />
        </div>
      </div>
    </EdgeLabelRenderer>
  );
};

export default Label;
