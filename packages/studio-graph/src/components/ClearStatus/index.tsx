import React, { useEffect } from 'react';
import { useContext } from '../../';
import { Button, Tooltip } from 'antd';
import { ClearOutlined } from '@ant-design/icons';

interface IClearStatatusProps {
  trigger?: 'canvas' | 'button';
}

const ClearStatus: React.FunctionComponent<IClearStatatusProps> = props => {
  const { trigger } = props;
  const { store, updateStore } = useContext();
  const { emitter } = store;
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
  useEffect(() => {
    const triggerCanvas = !(trigger === 'button');
    triggerCanvas && emitter?.on('canvas:click', handleClear);
    return () => {
      triggerCanvas && emitter?.off('canvas:click', handleClear);
    };
  }, [emitter, trigger]);

  if (trigger === 'button') {
    return (
      <Tooltip title="Clear Canvas Status" placement="left">
        <Button type="text" onClick={handleClear} icon={<ClearOutlined />}></Button>
      </Tooltip>
    );
  }
  return null;
};

export default ClearStatus;
