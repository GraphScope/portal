import React, { useState, useRef, useEffect } from 'react';
import { LeftPanel } from './LeftPanel';
import { MainPanel } from './MainPanel';
import { RightPanel } from './RightPanel';
import { useStore } from '../store/useStore';

export const Layout: React.FC = () => {
  const { leftPanelWidth, rightPanelWidth, setLeftPanelWidth, setRightPanelWidth } = useStore();
  const [isDraggingLeft, setIsDraggingLeft] = useState(false);
  const [isDraggingRight, setIsDraggingRight] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (side: 'left' | 'right') => (e: React.MouseEvent) => {
    e.preventDefault();
    if (side === 'left') {
      setIsDraggingLeft(true);
    } else {
      setIsDraggingRight(true);
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const containerWidth = containerRect.width;

      if (isDraggingLeft) {
        const newWidth = Math.max(200, Math.min(500, e.clientX - containerRect.left));
        setLeftPanelWidth(newWidth);
      }

      if (isDraggingRight) {
        const newWidth = Math.max(200, Math.min(500, containerRect.right - e.clientX));
        setRightPanelWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsDraggingLeft(false);
      setIsDraggingRight(false);
    };

    if (isDraggingLeft || isDraggingRight) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDraggingLeft, isDraggingRight, setLeftPanelWidth, setRightPanelWidth]);

  return (
    <div
      ref={containerRef}
      className="h-screen flex bg-background"
      style={{ cursor: isDraggingLeft || isDraggingRight ? 'col-resize' : 'default' }}
    >
      {/* Left Panel */}
      <div style={{ width: leftPanelWidth, minWidth: 200, maxWidth: 500 }}>
        <LeftPanel />
      </div>

      {/* Left Resizer */}
      <div
        className="w-1 bg-gray-200 dark:bg-gray-700 hover:bg-primary/50 cursor-col-resize transition-colors"
        onMouseDown={handleMouseDown('left')}
      />

      {/* Main Panel */}
      <div className="flex-1 min-w-0">
        <MainPanel />
      </div>

      {/* Right Resizer */}
      <div
        className="w-1 bg-gray-200 dark:bg-gray-700 hover:bg-primary/50 cursor-col-resize transition-colors"
        onMouseDown={handleMouseDown('right')}
      />

      {/* Right Panel */}
      <div style={{ width: rightPanelWidth, minWidth: 200, maxWidth: 500 }}>
        <RightPanel />
      </div>
    </div>
  );
};
