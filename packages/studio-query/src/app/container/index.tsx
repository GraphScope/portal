import * as React from 'react';

interface ContainerProps {
  children: React.ReactNode;
  left: React.ReactNode;
}

const Container: React.FunctionComponent<ContainerProps> = props => {
  const { children, left } = props;
  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      <div style={{ width: '300px' }}>{left}</div>
      <div style={{ flex: 1 }}>{children}</div>
    </div>
  );
};

export default Container;
