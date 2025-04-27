import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';

/**
 * 可调整大小面板组件的属性接口
 */
export interface IResizablePanelProps {
  /** 左侧面板内容 */
  leftPanel?: React.ReactNode;
  /** 中间面板内容 */
  middlePanel?: React.ReactNode;
  /** 右侧面板内容 */
  rightPanel?: React.ReactNode;
  /** 左侧面板最小宽度百分比 */
  leftMinWidth?: number;
  /** 左侧面板最大宽度百分比 */
  leftMaxWidth?: number;
  /** 右侧面板最小宽度百分比 */
  rightMinWidth?: number;
  /** 右侧面板最大宽度百分比 */
  rightMaxWidth?: number;
  /** 自定义样式 */
  style?: React.CSSProperties;
  /** 自定义类名 */
  className?: string;
}

/**
 * 可调整大小面板组件
 *
 * 一个简单的可调整大小的面板组件，支持左侧、中间和右侧三个面板区域
 */
const ResizablePanel: React.FC<IResizablePanelProps> = ({
  leftPanel,
  middlePanel,
  rightPanel,
  leftMinWidth = 20,
  leftMaxWidth = 40,
  rightMinWidth = 20,
  rightMaxWidth = 40,
  style,
  className,
}) => {
  // 面板宽度状态
  const [panelState, setPanelState] = useState<{ leftWidth: number; rightWidth: number }>({
    leftWidth: 30,
    rightWidth: 30,
  });

  // 拖拽状态
  const [dragState, setDragState] = useState<{ isDraggingLeft: boolean; isDraggingRight: boolean }>({
    isDraggingLeft: false,
    isDraggingRight: false,
  });

  // 容器引用
  const containerRef = useRef<HTMLDivElement>(null);

  // 处理左侧拖拽
  const handleLeftDragStart = useCallback(() => {
    setDragState(prev => ({ ...prev, isDraggingLeft: true }));
  }, []);

  // 处理右侧拖拽
  const handleRightDragStart = useCallback(() => {
    setDragState(prev => ({ ...prev, isDraggingRight: true }));
  }, []);

  // 处理拖拽结束
  const handleDragEnd = useCallback(() => {
    setDragState({ isDraggingLeft: false, isDraggingRight: false });
  }, []);

  // 处理拖拽移动
  const handleDragMove = useCallback(
    (e: MouseEvent) => {
      if (!containerRef.current) return;

      const containerWidth = containerRef.current.offsetWidth;
      const containerRect = containerRef.current.getBoundingClientRect();

      if (dragState.isDraggingLeft) {
        // 计算左侧面板宽度百分比
        const newLeftWidth = ((e.clientX - containerRect.left) / containerWidth) * 100;

        // 限制在最小和最大宽度之间
        if (newLeftWidth >= leftMinWidth && newLeftWidth <= leftMaxWidth) {
          setPanelState(prev => ({ ...prev, leftWidth: newLeftWidth }));
        }
      }

      if (dragState.isDraggingRight) {
        // 计算右侧面板宽度百分比
        const newRightWidth = ((containerRect.right - e.clientX) / containerWidth) * 100;

        // 限制在最小和最大宽度之间
        if (newRightWidth >= rightMinWidth && newRightWidth <= rightMaxWidth) {
          setPanelState(prev => ({ ...prev, rightWidth: newRightWidth }));
        }
      }
    },
    [dragState, leftMinWidth, leftMaxWidth, rightMinWidth, rightMaxWidth],
  );

  // 添加和移除全局事件监听
  useEffect(() => {
    if (dragState.isDraggingLeft || dragState.isDraggingRight) {
      document.addEventListener('mousemove', handleDragMove);
      document.addEventListener('mouseup', handleDragEnd);
    }

    return () => {
      document.removeEventListener('mousemove', handleDragMove);
      document.removeEventListener('mouseup', handleDragEnd);
    };
  }, [dragState, handleDragMove, handleDragEnd]);

  // 计算中间面板宽度
  const middleWidth = useMemo(() => 100 - panelState.leftWidth - panelState.rightWidth, [panelState]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        display: 'flex',
        width: '100%',
        height: '100%',
        position: 'relative',
        ...style,
      }}
    >
      {/* 左侧面板 */}
      {leftPanel && <div style={{ width: `${panelState.leftWidth}%`, overflow: 'auto' }}>{leftPanel}</div>}

      {/* 左侧拖拽手柄 */}
      {leftPanel && (
        <div
          style={{
            width: '4px',
            cursor: 'col-resize',
            backgroundColor: dragState.isDraggingLeft ? '#1890ff' : 'transparent',
            transition: 'background-color 0.2s',
          }}
          onMouseDown={handleLeftDragStart}
        />
      )}

      {/* 中间面板 */}
      {middlePanel && <div style={{ width: `${middleWidth}%`, overflow: 'auto' }}>{middlePanel}</div>}

      {/* 右侧拖拽手柄 */}
      {rightPanel && (
        <div
          style={{
            width: '4px',
            cursor: 'col-resize',
            backgroundColor: dragState.isDraggingRight ? '#1890ff' : 'transparent',
            transition: 'background-color 0.2s',
          }}
          onMouseDown={handleRightDragStart}
        />
      )}

      {/* 右侧面板 */}
      {rightPanel && <div style={{ width: `${panelState.rightWidth}%`, overflow: 'auto' }}>{rightPanel}</div>}
    </div>
  );
};

// 导出组件
export { ResizablePanel };
export default ResizablePanel;
