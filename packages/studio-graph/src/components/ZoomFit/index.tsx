import * as React from 'react';
import { Button } from 'antd';
import { useContext } from '../../hooks/useContext';
import { Icons } from '@graphscope/studio-components';

export interface IZoomFitProps {}

const ZoomFit: React.FunctionComponent<IZoomFitProps> = props => {
  const { updateStore, store } = useContext();
  const { graph } = store;
  const handleClick = () => {
    graph?.zoomToFit(1000);
  };
  React.useEffect(() => {
    setTimeout(() => {
      handleClick();
    }, 200);
  }, []);

  return <Button onClick={handleClick} icon={<Icons.ZoomFit />} type="text"></Button>;
};

export default ZoomFit;
