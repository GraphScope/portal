import * as React from 'react';

interface IToolbarProps {
  children: React.ReactNode;
}

const Toolbar: React.FunctionComponent<IToolbarProps> = props => {
  const { children } = props;
  return (
    <div
      style={{
        boxShadow:
          '0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05)',
        display: 'flex',
        flexDirection: 'column',
        position: 'absolute',
        top: '12px',
        left: '24px',
        zIndex: 999,
        padding: '6px 4px',
        borderRadius: '4px',
        gap: '6px',
      }}
    >
      {children}
    </div>
  );
};

export default Toolbar;
