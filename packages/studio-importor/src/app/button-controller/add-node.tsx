import * as React from 'react';
import { Button, Tooltip } from 'antd';
import { uuid } from 'uuidv4';
import { useReactFlow } from 'reactflow';
import { Icons } from '@graphscope/studio-components';
const AddNodeIcon = Icons.AddNode;

import { createNodeLabel } from '../utils';
interface IAddNodeProps {
  style?: React.CSSProperties;
}
import { useContext } from '../useContext';
let addNodeIndex = 0;
const AddNode: React.FunctionComponent<IAddNodeProps> = props => {
  const { style } = props;
  const { setCenter } = useReactFlow();
  const { updateStore, store } = useContext();
  const { elementOptions } = store;
  const disabled = !elementOptions.isConnectable;
  const tooltipText = disabled
    ? 'The current mode is preview only, and does not support creating new vertex'
    : 'Create new vertex';

  const handleAddVertex = () => {
    updateStore(draft => {
      const label = createNodeLabel();
      const x = addNodeIndex * 200;
      const y = addNodeIndex * 100;
      addNodeIndex++;
      draft.nodes.push({
        id: uuid(),
        position: {
          x,
          y,
        },
        type: 'graph-node',
        data: { label },
      });
      setCenter(x + 100 / 2, y + 100 / 2, { duration: 600, zoom: 1 });
    });
  };

  return (
    <Tooltip title={tooltipText} placement="right">
      <Button
        disabled={!elementOptions.isConnectable}
        onClick={handleAddVertex}
        style={style}
        type="text"
        icon={<AddNodeIcon />}
      ></Button>
    </Tooltip>
  );
};

export default AddNode;
