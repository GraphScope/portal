import * as React from 'react';

interface ContainerProps {
  children: React.ReactNode;
}

const Container: React.FunctionComponent<ContainerProps> = props => {
  const { children } = props;
  return <div style={{ flex: 1, minHeight: '500px' }}>{children}</div>;
};

export default Container;
