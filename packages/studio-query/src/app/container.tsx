import * as React from 'react';

interface ContainerProps {
  sidebar: React.ReactNode;
  content: React.ReactNode;
  footer?: React.ReactNode;
  collapse: boolean | undefined;
  displaySidebarPosition: 'right' | 'left';
  enableAbsolutePosition: boolean;
}

const SideWidth = 300;
const CollapsedWidth = 50;

const Container: React.FunctionComponent<ContainerProps> = props => {
  const { sidebar, content, footer, collapse, displaySidebarPosition = 'left', enableAbsolutePosition } = props;
  const positionStyle: React.CSSProperties = enableAbsolutePosition
    ? {
        position: 'absolute',
        top: '0px',
      }
    : {
        position: 'relative',
      };
  const SidebarNode = (
    <div
      style={{
        width: collapse ? `${CollapsedWidth}px` : `${SideWidth}px`,
        transition: 'all 0.3s ease',
        boxSizing: 'border-box',
        overflow: 'hidden',
        borderLeft: displaySidebarPosition === 'left' ? 'none' : '1px solid #ddd',
        borderRight: displaySidebarPosition === 'right' ? 'none' : '1px solid #ddd',
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
        ...positionStyle,
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
