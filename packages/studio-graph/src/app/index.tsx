import * as React from 'react';

import { MultipleInstance } from '@graphscope/studio-components';

import Sdk from './sdk';
interface StudioGraphProps {}

const StudioGraph: React.FunctionComponent<StudioGraphProps> = props => {
  return (
    <div
      style={{
        background: '#fff',
        height: '100%',
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        borderRadius: '8px',
      }}
    >
      <MultipleInstance>
        <Sdk />
        {/* <Section
          leftSide={<Side />}
          autoResize={false}
          leftSideStyle={{
            width: '350px',
          }}
          defaultCollapsed={{
            leftSide: false,
            rightSide: true,
          }}
        >
          <ToogleButton />
          <Canvas />
        </Section> */}
      </MultipleInstance>
    </div>
  );
};

export default StudioGraph;
