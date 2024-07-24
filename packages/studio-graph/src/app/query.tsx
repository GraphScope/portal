import * as React from 'react';
import { MultipleInstance, Section, SegmentedTabs } from '@graphscope/studio-components';
import Canvas from './canvas';
import { Toolbar, SwitchEngine, PropertiesPanel } from '../components';

interface QueryGraphProps {}

const QueryGraph: React.FunctionComponent<QueryGraphProps> = props => {
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
        <Section
          splitBorder
          rightSide={<PropertiesPanel />}
          autoResize={false}
          leftSideStyle={{
            width: '350px',
          }}
          defaultCollapsed={{
            leftSide: true,
            rightSide: false,
          }}
        >
          <Canvas />
          <Toolbar>
            <SwitchEngine />
          </Toolbar>
        </Section>
      </MultipleInstance>
    </div>
  );
};

export default QueryGraph;
