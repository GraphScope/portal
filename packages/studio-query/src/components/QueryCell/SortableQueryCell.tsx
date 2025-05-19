import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import QueryCell, { IQueryCellProps } from './index';

interface ISortableQueryCellProps extends Omit<IQueryCellProps, 'dragHandleProps'> {
  index: number;
}

const SortableQueryCell: React.FC<ISortableQueryCellProps> = (props) => {
  const { 
    id, 
    index, 
    graphs, 
    onGraphChange,
    graphId,
    onMoveUp,
    onMoveDown,
    // 其他属性
    ...restProps 
  } = props;
  
  const { 
    attributes, 
    listeners, 
    setNodeRef, 
    transform, 
    transition,
    isDragging
  } = useSortable({ 
    id: id,
    data: {
      index,
      id
    }
  });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 999 : 'auto',
  };
  
  return (
    <div 
      ref={setNodeRef} 
      style={style}
    >
      <QueryCell 
        id={id}
        onMoveUp={onMoveUp}
        onMoveDown={onMoveDown}
        index={index}
        graphs={graphs}
        onGraphChange={(cellId, newGraphId) => {
          if (onGraphChange) {
            onGraphChange(cellId, newGraphId);
          }
        }}
        graphId={graphId}
        {...restProps}
        dragHandleProps={{
          ...attributes,
          ...listeners
        }}
      />
    </div>
  );
};

export default SortableQueryCell; 