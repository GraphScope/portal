import React from 'react';

export const JsonShow = (data, size = '12px', textIndent = '-8px') => (
  <>
    {Object.entries(data).map(([key, value]) => (
      <div
        style={{
          paddingLeft: '16px',
          overflowWrap: 'break-word',
          wordBreak: 'break-all',
          whiteSpace: 'pre-wrap',
        }}
        key={key}
      >
        <span style={{ color: '#F9822F', paddingLeft: size }}>"{key}" :</span>
        <span style={{ paddingLeft: '6px', textIndent }}>
          {typeof value === 'object' && value !== null ? (
            <>
              {'{'}
              {JsonShow(value, '24px', '16px')}
              {'}'}
            </>
          ) : (
            JSON.stringify(value, null, 2)
          )}
        </span>
      </div>
    ))}
  </>
);
