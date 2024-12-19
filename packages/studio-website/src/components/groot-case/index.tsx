import * as React from 'react';

interface IGrootCaseProps {
  children: React.ReactNode;
}

const GrootCase: React.FunctionComponent<IGrootCaseProps> = props => {
  const { children } = props;
  return (
    <div
      style={{
        display: window.GS_ENGINE_TYPE === 'groot' ? 'display' : 'none',
      }}
    >
      {children}
    </div>
  );
};

export default GrootCase;
