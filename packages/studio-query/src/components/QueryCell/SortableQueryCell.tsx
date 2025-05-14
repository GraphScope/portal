import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import QueryCell, { IQueryCellProps } from './index';

interface ISortableQueryCellProps extends Omit<IQueryCellProps, 'dragHandleProps'> {
  index: number;
}

const SortableQueryCell: React.FC<ISortableQueryCellProps> = (props) => {
  const { id, index } = props;
  
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
        {...props} 
        index={index}
        dragHandleProps={{
          ...attributes,
          ...listeners
        }}
      />
    </div>
  );
};

export default SortableQueryCell; 