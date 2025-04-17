import * as React from 'react';
import { Button, TooltipProps, Tooltip } from 'antd';
import { FormattedMessage } from 'react-intl';
import { FullscreenOutlined, FullscreenExitOutlined } from '@ant-design/icons';

/**
 * 全屏组件的属性接口
 */
interface IFullScreenProps {
  /** 提示文本，支持国际化 */
  title?: TooltipProps['title'];
  /** 提示框位置 */
  placement?: TooltipProps['placement'];
  /** 需要全屏显示的容器引用 */
  containerRef: React.RefObject<HTMLElement | null>;
  /** 自定义按钮样式类名 */
  className?: string;
  /** 自定义按钮样式 */
  style?: React.CSSProperties;
  /** 全屏状态变化回调 */
  onFullScreenChange?: (isFullScreen: boolean) => void;
}

/**
 * 全屏组件
 *
 * 提供一个按钮，点击后可以将指定容器切换为全屏模式
 */
const FullScreen: React.FunctionComponent<IFullScreenProps> = props => {
  const { containerRef, title = 'Fullscreen', placement = 'left', className, style, onFullScreenChange } = props;

  const [isFullScreen, setIsFullScreen] = React.useState(false);
  const icon = isFullScreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />;

  // 处理全屏切换
  const handleClick = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
      setIsFullScreen(false);
      onFullScreenChange?.(false);
    } else {
      if (containerRef.current) {
        containerRef.current.requestFullscreen();
        setIsFullScreen(true);
        onFullScreenChange?.(true);
      }
    }
  };

  // 监听全屏状态变化
  React.useEffect(() => {
    const handleFullScreenChange = () => {
      const newIsFullScreen = !!document.fullscreenElement;
      setIsFullScreen(newIsFullScreen);
      onFullScreenChange?.(newIsFullScreen);
    };

    document.addEventListener('fullscreenchange', handleFullScreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullScreenChange);
    };
  }, [onFullScreenChange]);

  return (
    <Tooltip title={<FormattedMessage id={`${title}`} />} placement={placement}>
      <Button icon={icon} onClick={handleClick} type="text" className={className} style={style} />
    </Tooltip>
  );
};

export default FullScreen;
