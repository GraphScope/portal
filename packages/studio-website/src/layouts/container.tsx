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

const Container: React.FunctionComponent<ContainerProps> = props => {
  const { sidebar, content, footer } = props;
  const { store, updateStore } = useContext();
  const { collapse } = store;
  return (
    <div
      style={{
        background: '#f5f7f9',
        display: 'flex',
        alignItems: 'center',
        height: '100vh',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          boxSizing: 'border-box',
          width: `${ContainerWidth}px`,
          height: '100%',
          margin: 'auto',
          //   background: '#f5f7f9',
          display: 'flex',
          padding: '24px',
          border: '1px solid #ddd',
        }}
      >
        <div
          style={{
            width: collapse ? '80px' : `${SideWidth}px`,
            boxSizing: 'border-box',
            border: '1px solid #ddd',
          }}
        >
          {sidebar}
        </div>
        <div
          style={{
            flex: 1,
            boxSizing: 'border-box',
            background: '#fff',
            borderRadius: '8px',
            marginLeft: '24px',
            display: 'flex',
            flexDirection: 'column',
            border: '1px solid blue',
          }}
        >
          <div style={{ flex: 1 }}>{content}</div>

          <div
            style={{
              flexBasis: '40px',
              padding: '12px',
              fontSize: '12px',
              display: 'flex',
              justifyContent: 'space-between',
              justifyItems: 'center',
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
