import React, { useEffect } from 'react';
import { useContext } from '../../';

interface IClearStatatusProps {}

const ClearStatus: React.FunctionComponent<IClearStatatusProps> = props => {
  const { store, updateStore } = useContext();
  const { emitter } = store;
  useEffect(() => {
    const handleClear = e => {
      updateStore(draft => {
        const isEmpty =
          Object.keys(draft.nodeStatus).length === 0 &&
          Object.keys(draft.edgeStatus).length === 0 &&
          draft.selectNodes.length === 0 &&
          draft.selectEdges.length === 0;

        if (isEmpty) {
          return;
        }
        draft.nodeStatus = {};
        draft.edgeStatus = {};
        // draft.focusNodes = [];
        draft.selectNodes = [];
        draft.selectEdges = [];
      });
    };
    emitter?.on('canvas:click', handleClear);
    return () => {
      emitter?.off('canvas:click', handleClear);
    };
  }, [emitter]);
  return null;
};

export default ClearStatus;
