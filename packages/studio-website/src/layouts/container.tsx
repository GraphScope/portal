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
  const { collapse } = store;
  return (
    <div
      className="gs-root"
      style={{
        background: '#f5f7f9',
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
          //   background: '#f5f7f9',
          display: 'flex',
          padding: '24px',
          // border: '1px solid #ddd',
          flexShrink: 0,
        }}
      >
        <div
          className="gs-sidebar"
          style={{
            width: collapse ? `${CollapsedWidth}px` : `${SideWidth}px`,
            transition: 'all 0.3s ease',
            boxSizing: 'border-box',
            // border: '1px solid #ddd',
          }}
        >
          {sidebar}
        </div>
        <div
          className="gs-main"
          style={{
            flex: 1,
            boxSizing: 'border-box',
            marginLeft: '24px',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div
            style={{
              boxSizing: 'border-box',
              flex: 1,
              overflowY: 'scroll',
              padding: '12px 24px',
              background: '#fff',
              borderRadius: '8px',
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
