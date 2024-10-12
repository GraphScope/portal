import * as React from 'react';
import { Button, TooltipProps, Tooltip } from 'antd';
import { FormattedMessage } from 'react-intl';
import { useContext } from '../../hooks/useContext';
import { Icons, useStudioProvier } from '@graphscope/studio-components';

export interface IZoomFitProps {
  title?: TooltipProps['title'];
  placement?: TooltipProps['placement'];
}

const ZoomFit: React.FunctionComponent<IZoomFitProps> = props => {
  const { title = 'Zoom to fitview', placement = 'left' } = props;
  const { store } = useContext();
  const { graph } = store;
  const { isLight } = useStudioProvier();
  const color = !isLight ? '#ddd' : '#000';
  const handleClick = () => {
    graph?.zoomToFit(1000);
  };

  return (
    <Tooltip title={<FormattedMessage id={`${title}`} />} placement={placement}>
      <Button onClick={handleClick} icon={<Icons.ZoomFit style={{ color }} />} type="text"></Button>
    </Tooltip>
  );
};

export default ZoomFit;
