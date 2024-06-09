import * as React from 'react';
import { Button } from 'antd';

import { Icons } from '@graphscope/studio-components';
import { useReactFlow } from 'reactflow';
import { resetIndex } from '../utils';

interface IAddNodeProps {
  style?: React.CSSProperties;
}
import { useContext } from '../useContext';

const ClearCanvas: React.FunctionComponent<IAddNodeProps> = props => {
  const { style } = props;

  const { updateStore, store } = useContext();
  const { elementOptions } = store;

  const handleClear = () => {
    resetIndex();
    updateStore(draft => {
      draft.nodes = [];
      draft.edges = [];
    });
  };

  return (
    <Button
      disabled={!elementOptions.isConnectable}
      onClick={handleClear}
      style={style}
      type="text"
      icon={<Icons.Trash />}
    ></Button>
  );
};

export default ClearCanvas;
