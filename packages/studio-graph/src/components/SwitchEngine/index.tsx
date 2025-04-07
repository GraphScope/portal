import * as React from 'react';
import { Button, TooltipProps, Tooltip, theme } from 'antd';
import { FormattedMessage } from 'react-intl';
import { useContext } from '../../';
import { Icons } from '@graphscope/studio-components';
const { Graph3D, Graph2D } = Icons;
export interface ISwitchEngineProps {
  title?: TooltipProps['title'];
  placement?: TooltipProps['placement'];
}

const SwitchEngine: React.FunctionComponent<ISwitchEngineProps> = props => {
  const { updateStore, store } = useContext();
  const { render } = store;
  const { token } = theme.useToken();
  const { title = 'Switch graph view dimensions', placement = 'left' } = props;

  const handleSwitch = () => {
    updateStore(draft => {
      draft.render = render === '2D' ? '3D' : '2D';
    });
  };
  const icon =
    render === '2D' ? (
      <Graph3D style={{ color: token.colorTextBase }} />
    ) : (
      <Graph2D style={{ color: token.colorTextBase }} />
    );
  return (
    <Tooltip title={<FormattedMessage id={`${title}`} />} placement="left">
      <Button onClick={handleSwitch} icon={icon} type="text"></Button>
    </Tooltip>
  );
};

export default SwitchEngine;
