import React from 'react';
import { Panel, PanelGroup } from 'react-resizable-panels';

import ResizeHandle from './ResizeHandle';

interface IResizablePanelsProps {
  leftSide?: React.ReactNode;
  middleSide?: React.ReactNode;
  rightSide?: React.ReactNode;
}
const styles: Record<string, React.CSSProperties> = {
  Container: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  BottomRow: { flex: '1 1 auto' },
  Panel: { display: 'flex', flexDirection: 'row' },
  PanelContent: {
    height: '100%',
    width: '100%',
    borderRadius: '0.5rem',
  },
};
const ResizablePanels: React.FC<IResizablePanelsProps> = props => {
  const { leftSide, middleSide, rightSide } = props;
  return (
    <div style={styles.Container}>
      <div style={styles.BottomRow}>
        <PanelGroup autoSaveId="example" direction="horizontal">
          {leftSide && (
            <>
              <Panel style={styles.Panel} collapsible={true} defaultSize={20} order={1}>
                <div style={styles.PanelContent}>{leftSide}</div>
              </Panel>
              <ResizeHandle />
            </>
          )}
          <Panel style={styles.Panel} collapsible={true} order={2}>
            <div style={styles.PanelContent}>{middleSide}</div>
          </Panel>

          {rightSide && (
            <>
              <ResizeHandle />
              <Panel style={styles.Panel} collapsible={true} defaultSize={20} order={3}>
                <div style={styles.PanelContent}>{rightSide}</div>
              </Panel>
            </>
          )}
        </PanelGroup>
      </div>
    </div>
  );
};

export default ResizablePanels;
