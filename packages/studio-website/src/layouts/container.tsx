import * as React from 'react';
import { useContext } from './useContext';

interface ContainerProps {
  sidebar: React.ReactNode;
  content: React.ReactNode;
  footer: React.ReactNode;
}

const SideWidth = 150;
const ContainerWidth = 1360;
const Padding = 24;
const CollapsedWidth = 60;
const Container: React.FunctionComponent<ContainerProps> = props => {
  const { sidebar, content, footer } = props;
  const { store } = useContext();
  const { collapse, mode } = store;
  return (
    <div
      className="gs-root"
      style={{
        // background: '#f5f7f9',
        background: mode === 'defaultAlgorithm' ? '#f5f7f9' : '#000',
        display: 'flex',
        alignItems: 'center',
        height: '100vh',
        boxSizing: 'border-box',
      }}
    >
      <div
        className="gs-container"
        style={{
          boxSizing: 'border-box',
          width: `${ContainerWidth}px`,
          transition: 'all 0.3s ease',
          height: '100%',
          margin: 'auto',
          display: 'flex',
          padding: '24px',
          flexShrink: 0,
          flexWrap: 'nowrap',
        }}
      >
        <div
          className="gs-sidebar"
          style={{
            width: collapse ? `${CollapsedWidth}px` : `${SideWidth}px`,
            transition: 'all 0.3s ease',
            boxSizing: 'border-box',
            overflow: 'hidden',
            flexWrap: 'nowrap',
            position: 'fixed',
            top: '24px',
            bottom: '0px',
          }}
        >
          {sidebar}
        </div>
        <div
          className="gs-main"
          style={{
            flex: 1,
            boxSizing: 'border-box',
            marginLeft: collapse ? '80px' : `${SideWidth + 24}px`,
            display: 'flex',
            flexDirection: 'column',
            // overflow: 'scroll',
            flexWrap: 'nowrap',
            transition: 'all 0.3s ease',
          }}
        >
          <div
            style={{
              boxSizing: 'border-box',
              flex: 1,
              background: mode === 'defaultAlgorithm' ? '#fff' : '#000',
              borderRadius: '12px',
              position: 'relative',
              overflowY: 'scroll',
            }}
            className="gs-content"
          >
            {content}
          </div>
          <div
            className="gs-footer"
            style={{
              padding: '6px 6px',
              fontSize: '12px',
              color: '#ddd',
            }}
          >
            {footer}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Container;
