import * as React from 'react';

interface DetialProps {
  label: string;
}

const Detial: React.FunctionComponent<DetialProps> = props => {
  const { label } = props;
  return <div>{label}</div>;
};

export default Detial;
