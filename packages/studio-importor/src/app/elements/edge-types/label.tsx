import * as React from 'react';
import { EdgeLabelRenderer } from 'reactflow';
import EditableText from '../../../components/EditableText';
import { useContext } from '../../useContext';
interface ILabelProps {
  id: string;
  label: string;
  style?: React.CSSProperties;
}

const Label: React.FunctionComponent<ILabelProps> = props => {
  const { id, label, style } = props;
  const { store, updateStore } = useContext();
  const { currentId, theme } = store;
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
