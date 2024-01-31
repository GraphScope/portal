import * as React from 'react';

interface ContainerProps {
  sidebar: React.ReactNode;
  content: React.ReactNode;
  footer?: React.ReactNode;
  collapse: boolean;
  displaySidebarPosition: 'right' | 'left';
}

const SideWidth = 300;
const CollapsedWidth = 50;

const Container: React.FunctionComponent<ContainerProps> = props => {
  const { sidebar, content, footer, collapse, displaySidebarPosition = 'left' } = props;
  const SidebarNode = (
    <div
      style={{
        width: collapse ? `${CollapsedWidth}px` : `${SideWidth}px`,
        transition: 'all 0.3s ease',
        boxSizing: 'border-box',
        overflow: 'hidden',
        border: '1px solid #ddd',
        borderTop: 'none',
        borderBottom: 'none',
        flexBasis: collapse ? `${CollapsedWidth}px` : `${SideWidth}px`,
        flexShrink: 0,
      }}
    >
      {sidebar}
    </div>
  );

  return (
    <div
      style={{
        boxSizing: 'border-box',
        width: '100%',
        transition: 'all 0.3s ease',
        height: '100%',
        margin: 'auto',
        display: 'flex',
        flexWrap: 'nowrap',
        overflow: 'hidden',
      }}
    >
      {displaySidebarPosition === 'left' && SidebarNode}
      <div
        style={{
          flex: 1,
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
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
      {displaySidebarPosition === 'right' && SidebarNode}
    </div>
  );
};

export default Container;
