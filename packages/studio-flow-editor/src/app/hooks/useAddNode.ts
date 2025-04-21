import {useRef} from 'react'
import { v4 as uuidv4 } from 'uuid';
import { useReactFlow } from 'reactflow';
import { useGraphStore } from '../store';
import { createNodeLabel } from '../utils';

export const useAddNode = () => {
  const addNodeIndexRef = useRef(0);
  const { setCenter } = useReactFlow();
  const {updateStore } = useGraphStore();
  const handleAddVertex = () => {
    updateStore(draft => {
      const label = createNodeLabel();
      const x = addNodeIndexRef.current * 200;
      const y = addNodeIndexRef.current * 100;
      addNodeIndexRef.current++;
      draft.nodes = [
        ...draft.nodes,
        {
          id: uuidv4(),
          position: {
            x,
            y,
          },
          type: 'graph-node',
          data: { label },
        },
      ];

      setCenter(x + 100 / 2, y + 100 / 2, { duration: 600, zoom: 1 });
    });
  };

  return { handleAddVertex };
};