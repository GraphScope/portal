import React, { useRef } from 'react';

import { Button } from 'antd';

import { MultipleInstance, Section, useSection, Icons, FullScreen } from '@graphscope/studio-components';
import {
  Toolbar,
  SwitchEngine,
  PropertiesPanel,
  Canvas,
  ZoomFit,
  ClearStatatus,
  RunCluster,
  BasicInteraction,
} from '@graphscope/studio-graph';

import { FetchGraph, Searchbar, PaperList, PaperInfo } from './components';

interface QueryGraphProps {}

const ToogleLeftButton = () => {
  const { toggleLeftSide } = useSection();
  return (
    <div>
      <Button icon={<Icons.Sidebar />} onClick={() => toggleLeftSide()} type="text" />
    </div>
  );
};
const ToogleRightButton = () => {
  const { toggleRightSide } = useSection();
  return (
    <div>
      <Button icon={<Icons.Sidebar revert />} onClick={() => toggleRightSide()} type="text" />
    </div>
  );
};

const PaperReading: React.FunctionComponent<QueryGraphProps> = props => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  return (
    <MultipleInstance>
      <div
        style={{
          background: '#fff',
          borderRadius: '8px',
          position: 'absolute',
          top: '0px',
          left: '0px',
          right: '0px',
          bottom: '0px',
        }}
        ref={containerRef}
      >
        <Section
          splitBorder
          leftSide={<PaperList />}
          rightSide={<PaperInfo />}
          autoResize={false}
          rightSideStyle={{
            width: '400px',
            boxShadow: 'rgba(0, 0, 0, 0.19) 0px 4px 12px',
          }}
          leftSideStyle={{
            width: '380px',
            boxShadow: 'rgba(0, 0, 0, 0.19) 0px 4px 12px',
          }}
          defaultCollapsed={{
            leftSide: false,
            rightSide: false,
          }}
        >
          <Toolbar
            direction="horizontal"
            style={{ position: 'absolute', top: '20px', right: '80px', left: '80px' }}
            noSpace
          >
            <Searchbar />
          </Toolbar>
          <Toolbar direction="horizontal" style={{ position: 'absolute', top: '20px', right: 'unset', left: '20px' }}>
            <ToogleLeftButton />
          </Toolbar>
          <Toolbar direction="horizontal" style={{ position: 'absolute', top: '20px', right: '20px', left: 'unset' }}>
            <ToogleRightButton />
          </Toolbar>

          <Canvas />
          <BasicInteraction />
          <FetchGraph />
          <ClearStatatus />

          <Toolbar style={{ position: 'absolute', top: '80px', right: '20px', left: 'unset' }}>
            <SwitchEngine />
            <ZoomFit />
            <RunCluster />
            <FullScreen containerRef={containerRef} />
          </Toolbar>
        </Section>
      </div>
    </MultipleInstance>
  );
};

export default PaperReading;
