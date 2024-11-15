import * as React from 'react';

interface IDemoHomeProps {}

const DemoHome: React.FunctionComponent<IDemoHomeProps> = props => {
  return (
    <div
      style={{
        height: '100vh',
        textAlign: 'center',
        background: '#fafafa',
      }}
    >
      GraphScope Portal
    </div>
  );
};

export default DemoHome;
