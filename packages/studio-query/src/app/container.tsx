import * as React from 'react';

interface ContainerProps {
  sidebar: React.ReactNode;
  content: React.ReactNode;
  footer?: React.ReactNode;
  collapse: boolean;
}

const SideWidth = 300;
const CollapsedWidth = 50;

const Container: React.FunctionComponent<ContainerProps> = props => {
  const { sidebar, content, footer, collapse } = props;

  return (
    <div
      style={{
        boxSizing: 'border-box',
        width: '100%',
        transition: 'all 0.3s ease',
        height: '100%',
        margin: 'auto',
        display: 'flex',
        flexShrink: 0,
      }}
    >
      <div
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
            background: '#fff',
            borderRadius: '12px',
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
      <div
        style={{
          width: collapse ? `${CollapsedWidth}px` : `${SideWidth}px`,
          transition: 'all 0.3s ease',
          boxSizing: 'border-box',
          overflow: 'hidden',
          border: '1px solid #ddd',
        }}
      >
        {sidebar}
      </div>
    </div>
  );
};

export default Container;
