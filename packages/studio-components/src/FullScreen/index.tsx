import * as React from 'react';
import { Button, TooltipProps, Tooltip } from 'antd';
import { FullscreenOutlined, FullscreenExitOutlined } from '@ant-design/icons';
interface IFullScreenProps {
  title?: TooltipProps['title'];
  placement?: TooltipProps['placement'];
  containerRef: React.RefObject<HTMLElement | null>;
}

const FullScreen: React.FunctionComponent<IFullScreenProps> = props => {
  const { containerRef, title = 'Fullscreen', placement = 'left' } = props;
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
    <Tooltip title={title} placement={placement}>
      <Button icon={icon} onClick={handleClick} type="text" />
    </Tooltip>
  );
};

export default FullScreen;
