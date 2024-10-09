import * as React from 'react';
import { Button, TooltipProps, Tooltip } from 'antd';
import { useContext } from '../../hooks/useContext';
import { Icons } from '@graphscope/studio-components';
const { Graph3D, Graph2D } = Icons;
export interface ISwitchEngineProps {
  title?: TooltipProps['title'];
  placement?: TooltipProps['placement'];
}

const SwitchEngine: React.FunctionComponent<ISwitchEngineProps> = props => {
  const { updateStore, store } = useContext();
  const { render } = store;
  const { title = 'Switch graph view dimensions', placement = 'left' } = props;
  const handleSwitch = () => {
    updateStore(draft => {
      draft.render = render === '2D' ? '3D' : '2D';
    });
  };
  const icon = render === '2D' ? <Graph3D /> : <Graph2D />;
  return (
    <Tooltip title={title} placement="left">
      <Button onClick={handleSwitch} icon={icon} type="text"></Button>
    </Tooltip>
  );
};

export default SwitchEngine;
