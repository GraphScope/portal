import * as React from 'react';
import { Button, TooltipProps, Tooltip } from 'antd';
import { FormattedMessage } from 'react-intl';
import { ForceGraphInstance, useContext } from '../../';
import { Icons, useStudioProvier } from '@graphscope/studio-components';

export interface IZoomFitProps {
  title?: TooltipProps['title'];
  placement?: TooltipProps['placement'];
}

const ZoomFit: React.FunctionComponent<IZoomFitProps> = props => {
  const { title = 'Zoom to fitview', placement = 'left' } = props;
  const { store } = useContext();
  const { graph } = store;

  const handleClick = () => {
    if (graph) {
      const { nodes } = graph.graphData();
      const isSingleNode = nodes.length === 1;
      if (isSingleNode) {
        (graph as ForceGraphInstance).centerAt(0, 0);
        (graph as ForceGraphInstance).zoom(6, 600);
      } else {
        graph.zoomToFit(600);
      }
    }
  };

  return (
    <Tooltip title={<FormattedMessage id={`${title}`} />} placement={placement}>
      <Button onClick={handleClick} icon={<Icons.ZoomFit />} type="text"></Button>
    </Tooltip>
  );
};

export default ZoomFit;
