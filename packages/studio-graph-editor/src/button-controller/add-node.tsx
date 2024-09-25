import React, { memo } from 'react';
import { Button, Tooltip } from 'antd';
import { v4 as uuidv4 } from 'uuid';
import { useReactFlow } from 'reactflow';
import { Icons } from '@graphscope/studio-components';
import { FormattedMessage } from 'react-intl';
const AddNodeIcon = Icons.AddNode;
import { createNodeLabel } from '../elements/utils';
import { useContext } from '../canvas/useContext';
import { useGraphContext } from '..';

interface IAddNodeProps {
  style?: React.CSSProperties;
}

let addNodeIndex = 0;
const AddNode: React.FunctionComponent<IAddNodeProps> = props => {
  const { style } = props;
  const { setCenter } = useReactFlow();
  const { updateStore } = useContext();
  const { isLabelEmpty } = useGraphContext();

  const tooltipText = <FormattedMessage id="Create new vertex" />;

  const handleAddVertex = () => {
    updateStore(draft => {
      const label = createNodeLabel();
      const x = addNodeIndex * 200;
      const y = addNodeIndex * 100;
      addNodeIndex++;
      draft.nodes = [
        ...draft.nodes,
        {
          id: uuidv4(),
          position: {
            x,
            y,
          },
          type: 'graph-node',
          data: { label: isLabelEmpty ? '' : label },
        },
      ];
      setCenter(x + 100 / 2, y + 100 / 2, { duration: 600, zoom: 1 });
    });
  };

  return (
    <Tooltip title={tooltipText} placement="right">
      <Button onClick={handleAddVertex} style={style} type="text" icon={<AddNodeIcon />}></Button>
    </Tooltip>
  );
};

export default memo(AddNode);
