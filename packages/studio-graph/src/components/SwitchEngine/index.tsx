import * as React from 'react';
import { Button, TooltipProps, Tooltip } from 'antd';
import { FormattedMessage } from 'react-intl';
import { useContext } from '../../hooks/useContext';
import { Icons, useStudioProvier } from '@graphscope/studio-components';
const { Graph3D, Graph2D } = Icons;
export interface ISwitchEngineProps {
  title?: TooltipProps['title'];
  placement?: TooltipProps['placement'];
}

const SwitchEngine: React.FunctionComponent<ISwitchEngineProps> = props => {
  const { updateStore, store } = useContext();
  const { render } = store;
  const { title = 'Switch graph view dimensions', placement = 'left' } = props;
  const { isLight } = useStudioProvier();
  const color = !isLight ? '#ddd' : '#000';
  const handleSwitch = () => {
    updateStore(draft => {
      draft.render = render === '2D' ? '3D' : '2D';
    });
  };
  const icon = render === '2D' ? <Graph3D style={{ color }} /> : <Graph2D style={{ color }} />;
  return (
    <Tooltip title={<FormattedMessage id={`${title}`} />} placement="left">
      <Button onClick={handleSwitch} icon={icon} type="text"></Button>
    </Tooltip>
  );
};

export default SwitchEngine;
