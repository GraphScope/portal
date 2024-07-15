import React from 'react';
import { Panel, PanelGroup } from 'react-resizable-panels';

import ResizeHandle from './ResizeHandle';
//@ts-ignore
import styles from './styles.module.css';
interface IResizablePanelsProps {
  leftSide?: React.ReactNode;
  middleSide?: React.ReactNode;
  rightSide?: React.ReactNode;
}
const ResizablePanels: React.FC<IResizablePanelsProps> = props => {
  const { leftSide, middleSide, rightSide } = props;
  return (
    <div className={styles.Container}>
      <div className={styles.BottomRow}>
        <PanelGroup autoSaveId="example" direction="horizontal">
          {leftSide && (
            <>
              <Panel className={styles.Panel} collapsible={true} defaultSize={20} order={1}>
                <div className={styles.PanelContent}>{leftSide}</div>
              </Panel>
              <ResizeHandle />
            </>
          )}
          <Panel className={styles.Panel} collapsible={true} order={2}>
            <div className={styles.PanelContent}>{middleSide}</div>
          </Panel>

          {rightSide && (
            <>
              <ResizeHandle />
              <Panel className={styles.Panel} collapsible={true} defaultSize={20} order={3}>
                <div className={styles.PanelContent}>{rightSide}</div>
              </Panel>
            </>
          )}
        </PanelGroup>
      </div>
    </div>
  );
};

export default ResizablePanels;
