import React, { useRef } from 'react';

import { Button, Divider } from 'antd';

import { MultipleInstance, Section, useSection, Icons, FullScreen, SegmentedTabs } from '@graphscope/studio-components';
import {
  Toolbar,
  SwitchEngine,
  PropertiesPanel,
  Canvas,
  ZoomFit,
  ClearStatatus,
  RunCluster,
  LoadCSV,
  StyleSetting,
  GraphProvider,
  Brush,
  Export,
  BasicInteraction,
  Loading,
  CurvatureLinks,
  ClearCanvas,
  DagreMode,
} from '@graphscope/studio-graph';

interface QueryGraphProps {
  id: string;
}

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
  const { id = 'online-paper-tools' } = props;
  const items = [
    {
      key: 'CSV',
      label: 'CSV',
      value: 'CSV',
      children: <LoadCSV />,
    },
    {
      key: 'Style',
      label: 'Style',
      value: 'Style',
      children: <StyleSetting />,
    },
  ];

  return (
    <GraphProvider id={id}>
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
          rightSide={null}
          leftSide={
            <PropertiesPanel>
              <SegmentedTabs items={items} block />
            </PropertiesPanel>
          }
          autoResize={false}
          rightSideStyle={{
            width: '350px',
          }}
          leftSideStyle={{
            width: '380px',
          }}
          defaultCollapsed={{
            leftSide: false,
            rightSide: true,
          }}
        >
          <Toolbar direction="horizontal" style={{ position: 'absolute', top: '20px', right: 'unset', left: '20px' }}>
            <ToogleLeftButton />
          </Toolbar>

          <Canvas />
          <BasicInteraction />
          <ClearStatatus />
          <Loading />

          <Toolbar style={{ position: 'absolute', top: '20px', right: '20px', left: 'unset' }}>
            <FullScreen containerRef={containerRef} />
            <ZoomFit />
            <Brush />

            <Divider style={{ margin: '0px' }} />
            <CurvatureLinks />
            <DagreMode />
            <SwitchEngine />
            <RunCluster />
            <Export />
            <ClearCanvas />
          </Toolbar>
        </Section>
      </div>
    </GraphProvider>
  );
};

export default PaperReading;
