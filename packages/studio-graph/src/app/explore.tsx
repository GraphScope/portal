import * as React from 'react';
import { MultipleInstance, Section, SegmentedTabs } from '@graphscope/studio-components';
import Canvas from './canvas';
import { Toolbar, SwitchEngine, PropertiesPanel, LoadCSV } from '../components';

interface ExploreGraphProps {}

const ExploreGraph: React.FunctionComponent<ExploreGraphProps> = props => {
  const items = [
    {
      key: 'CSV',
      label: 'CSV',
      value: 'CSV',
      children: <LoadCSV />,
    },
    {
      key: 'Info',
      label: 'Info',
      value: 'Info',
      children: <PropertiesPanel />,
    },
  ];
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
          leftSide={<SegmentedTabs items={items} block />}
          rightSide={<PropertiesPanel />}
          autoResize={false}
          leftSideStyle={{
            width: '350px',
          }}
          defaultCollapsed={{
            leftSide: false,
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

export default ExploreGraph;
