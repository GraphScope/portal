import React from 'react';
import { QuickStart } from './QuickStart';
import { Canvas } from './Canvas';

export const DrawPattern = () => {
  return (
    <div id="draw-pattern-wrapper" style={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'row' }}>
      <div
        id="quick-start-wrapper"
        style={{
          height: '100%',
          width: '40%',
          boxSizing: 'border-box',
          borderRight: '1px solid #E3E3E3',
        }}
      >
        <QuickStart></QuickStart>
      </div>
      <div id="canvas-wrapper" style={{ height: '100%', width: '60%', backgroundColor: '#E6F4FF' }}>
        <Canvas></Canvas>
      </div>
    </div>
  );
};
