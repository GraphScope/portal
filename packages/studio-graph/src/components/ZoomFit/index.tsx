import * as React from 'react';
import { Button } from 'antd';
import { useContext } from '../../hooks/useContext';
import { Icons } from '@graphscope/studio-components';

export interface IZoomFitProps {}

const ZoomFit: React.FunctionComponent<IZoomFitProps> = props => {
  const { store } = useContext();
  const { graph, data } = store;
  const handleClick = () => {
    graph?.zoomToFit(1000);
    if (data && data.nodes && data.nodes[0]) {
      console.log('data', data);
    }
  };
  React.useEffect(() => {
    setTimeout(() => {
      handleClick();
    }, 200);
  }, []);

  return <Button onClick={handleClick} icon={<Icons.ZoomFit />} type="text"></Button>;
};

export default ZoomFit;
