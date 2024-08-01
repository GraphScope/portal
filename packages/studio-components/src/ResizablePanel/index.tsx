import React from 'react';
import { Panel, PanelGroup } from 'react-resizable-panels';
import ResizeHandle from './ResizeHandle';

interface IResizablePanelsProps {
  leftSide?: React.ReactNode;
  middleSide?: React.ReactNode;
  rightSide?: React.ReactNode;
  leftMinSize?: number;
  leftMaxSize?: number;
  rightMinSize?: number;
  rightMaxSize?: number;
}

const styles: Record<string, React.CSSProperties> = {
  Container: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  Panel: { display: 'flex', flexDirection: 'row' },
  PanelContent: {
    height: '100%',
    width: '100%',
    borderRadius: '0.5rem',
  },
};

const ResizablePanels: React.FC<IResizablePanelsProps> = ({
  leftSide,
  middleSide,
  rightSide,
  leftMinSize = 20,
  leftMaxSize = 40,
  rightMinSize = 20,
  rightMaxSize = 40,
}) => {
  const renderLeftPanel = () => (
    <Panel style={styles.Panel} collapsible={false} order={1} minSize={leftMinSize} maxSize={leftMaxSize}>
      <div style={styles.PanelContent}>{leftSide}</div>
    </Panel>
  );

  const renderRightPanel = () => (
    <Panel style={styles.Panel} collapsible={false} order={3} minSize={rightMinSize} maxSize={rightMaxSize}>
      <div style={styles.PanelContent}>{rightSide}</div>
    </Panel>
  );

  return (
    <div style={styles.Container}>
      <PanelGroup autoSaveId="example" direction="horizontal">
        {leftSide && [renderLeftPanel(), <ResizeHandle key="left-handle" />]}
        <Panel style={styles.Panel} collapsible={false} order={2}>
          <div style={styles.PanelContent}>{middleSide}</div>
        </Panel>
        {rightSide && [<ResizeHandle key="right-handle" />, renderRightPanel()]}
      </PanelGroup>
    </div>
  );
};

export default ResizablePanels;
