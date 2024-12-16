import React, { useEffect } from 'react';
import { useContext } from '../../';

interface IClearStatatusProps {}

const ClearStatatus: React.FunctionComponent<IClearStatatusProps> = props => {
  const { store, updateStore } = useContext();
  const { emitter } = store;
  useEffect(() => {
    const handleClear = e => {
      updateStore(draft => {
        draft.nodeStatus = {};
        draft.edgeStatus = {};
        draft.focusNodes = [];
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

export default ClearStatatus;
