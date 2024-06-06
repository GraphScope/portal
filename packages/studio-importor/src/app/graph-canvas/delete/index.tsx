import * as React from 'react';
import { Button } from 'antd';

import { Icons } from '@graphscope/studio-components';
import { useReactFlow } from 'reactflow';

interface IAddNodeProps {
  style?: React.CSSProperties;
}
import { useContext } from '../../useContext';

const Delete: React.FunctionComponent<IAddNodeProps> = props => {
  const { style } = props;

  const { updateStore, store } = useContext();
  const { elementOptions } = store;

  const handleDelete = () => {
    updateStore(draft => {
      console.log('draft', draft.nodes, draft.edges);
    });
  };

  return (
    <Button
      disabled={!elementOptions.isConnectable}
      onClick={handleDelete}
      style={style}
      type="text"
      icon={<Icons.Trash />}
    ></Button>
  );
};

export default Delete;
