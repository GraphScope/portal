import * as React from 'react';
import { Button, Tooltip } from 'antd';
import { v4 as uuidv4 } from 'uuid';
import { useReactFlow } from 'reactflow';
import { Icons } from '@graphscope/studio-components';
import { FormattedMessage } from 'react-intl';
import { useGraphStore } from '../store';
import { useAddNode } from '../hooks/useAddNode';
import { createNodeLabel } from '../utils';

const AddNodeIcon = Icons.AddNode;

interface IAddNodeProps {
  style?: React.CSSProperties;
}
let addNodeIndex = 0;
const AddNode: React.FunctionComponent<IAddNodeProps> = props => {
  const { style } = props;
  const { store } = useGraphStore();
  const { elementOptions } = store;
  const disabled = !elementOptions.isConnectable;
  const tooltipText = disabled ? (
    <FormattedMessage id="The current mode is preview only, and does not support creating new vertex" />
  ) : (
    <FormattedMessage id="Create new vertex" />
  );
  const { handleAddVertex } = useAddNode();

  return (
    <Tooltip title={tooltipText} placement="right">
      <Button disabled={disabled} onClick={handleAddVertex} style={style} type="text" icon={<AddNodeIcon />}></Button>
    </Tooltip>
  );
};

export default AddNode;
