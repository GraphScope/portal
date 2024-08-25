import React, { ReactNode } from 'react';

interface QuickStartProps {
  title: string;
  svgSrc: ReactNode;
}
export const QuickStartItem: React.FC<QuickStartProps> = ({ title, svgSrc }) => {
  return (
    <div style={{ border: '1px solid #E3E3E3', borderRadius: '5px', padding: '0.8rem' }}>
      {title}
      <div
        style={{
          height: '8rem',
          backgroundColor: '#F0F0F0',
          marginTop: '0.8rem',
          borderRadius: '2px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {svgSrc}
      </div>
    </div>
  );
};
