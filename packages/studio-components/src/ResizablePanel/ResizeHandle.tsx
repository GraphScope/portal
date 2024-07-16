import React from 'react';
import { PanelResizeHandle } from 'react-resizable-panels';

const styles: Record<string, React.CSSProperties> = {
  ResizeHandleOuter: {
    flex: '0 0 1.5em',
    position: 'relative',
    outline: 'none',
    transform: 'rotate(90deg)',
    backgroundColor: 'transparent',
  },
  ResizeHandleInner: {
    position: 'absolute',
    top: '0.25em',
    bottom: '0.25em',
    left: '0.25em',
    right: '0.25em',
    borderRadius: '0.25em',
    backgroundColor: 'transparent',
    transition: 'background-color 0.2s linear',
  },
  Icon: {
    width: '1em',
    height: '1em',
    position: 'absolute',
    left: 'calc(50% - 0.5rem)',
    top: 'calc(50% - 0.5rem)',
  },
};
export default function ResizeHandle({ className = '', id }: { className?: string; id?: string }) {
  return (
    <PanelResizeHandle style={styles.ResizeHandleOuter} id={id}>
      <div style={styles.ResizeHandleInner}>
        <svg style={styles.Icon} viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M8,18H11V15H2V13H22V15H13V18H16L12,22L8,18M12,2L8,6H11V9H2V11H22V9H13V6H16L12,2Z"
          />
        </svg>
      </div>
    </PanelResizeHandle>
  );
}
