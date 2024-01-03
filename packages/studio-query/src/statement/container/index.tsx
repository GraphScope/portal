import * as React from 'react';

interface ContainerProps {
  children: React.ReactNode;
}

const Container: React.FunctionComponent<ContainerProps> = props => {
  const { children } = props;
  return (
    <div
      style={{
        flex: 1,
        border: '1px solid #ddd',
        margin: '12px',
        padding: '8px',
        background: '#fff',
        borderRadius: '8px',
      }}
    >
      {children}
    </div>
  );
};

export default Container;
