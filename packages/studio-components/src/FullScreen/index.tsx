import * as React from 'react';
import { Button } from 'antd';
import { FullscreenOutlined, FullscreenExitOutlined } from '@ant-design/icons';
interface IFullScreenProps {
  containerRef: React.RefObject<HTMLElement | null>;
}

const FullScreen: React.FunctionComponent<IFullScreenProps> = props => {
  const { containerRef } = props;
  const [isFullScreen, setIsFullScreen] = React.useState(false);
  const icon = isFullScreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />;
  const handleClick = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
      setIsFullScreen(false);
    } else {
      if (containerRef.current) {
        containerRef.current.requestFullscreen();
        setIsFullScreen(true);
      }
    }
  };

  return (
    <div>
      <Button icon={icon} onClick={handleClick} type="text" />
    </div>
  );
};

export default FullScreen;
