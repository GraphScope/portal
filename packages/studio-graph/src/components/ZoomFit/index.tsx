import * as React from 'react';
import { Button, TooltipProps, Tooltip } from 'antd';
import { useContext } from '../../hooks/useContext';
import { Icons } from '@graphscope/studio-components';

export interface IZoomFitProps {
  title?: TooltipProps['title'];
  placement?: TooltipProps['placement'];
}

const ZoomFit: React.FunctionComponent<IZoomFitProps> = props => {
  const { title = 'Zoom to fitview', placement = 'left' } = props;
  const { store } = useContext();
  const { graph } = store;
  const handleClick = () => {
    graph?.zoomToFit(1000);
  };

  return (
    <Tooltip title={title} placement={placement}>
      <Button onClick={handleClick} icon={<Icons.ZoomFit />} type="text"></Button>
    </Tooltip>
  );
};

export default ZoomFit;
