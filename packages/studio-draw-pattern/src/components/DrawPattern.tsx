import React from 'react';
import { QuickStart } from './QuickStart';
import { Canvas } from './Canvas';
import { Section } from '@graphscope/studio-components';

export interface DrawPatternProps {}
export const DrawPattern: React.FC<DrawPatternProps> = props => {
  return (
    <Section
      splitBorder={true}
      leftSide={
        <div
          id="quick-start-wrapper"
          style={{
            height: '100%',
            width: '100%',
            boxSizing: 'border-box',
          }}
        >
          <QuickStart />
        </div>
      }
      children={
        <div id="canvas-wrapper" style={{ height: '100%', width: '100%', backgroundColor: '#E6F4FF' }}>
          <Canvas />
        </div>
      }
    />
  );
};
