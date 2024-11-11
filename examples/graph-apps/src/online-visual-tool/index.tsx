import React, { useRef } from 'react';
import { Button, Divider } from 'antd';

import {
  Section,
  useSection,
  Icons,
  FullScreen,
  SegmentedTabs,
  StudioProvier,
  Utils,
} from '@graphscope/studio-components';
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
  FixedMode,
  locales,
} from '@graphscope/studio-graph';

interface QueryGraphProps {
  id: string;
  style?: React.CSSProperties;
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

const OnlineVisualizer: React.FunctionComponent<QueryGraphProps> = props => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { id = 'online-paper-tools', style = {} } = props;
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
  let algorithm = 'defaultAlgorithm';
  if (Utils.storage.get('theme') === 'dark' || Utils.storage.get('algorithm') === 'darkAlgorithm') {
    algorithm = 'darkAlgorithm';
  }

  return (
    <StudioProvier locales={locales} algorithm={algorithm as 'darkAlgorithm' | 'defaultAlgorithm'}>
      <GraphProvider id={id}>
        <div
          style={{
            borderRadius: '8px',
            position: 'absolute',
            top: '0px',
            left: '0px',
            right: '0px',
            bottom: '0px',
            ...style,
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
              <FixedMode />
              <Divider style={{ margin: '0px' }} />
              <CurvatureLinks />
              <DagreMode />
              <SwitchEngine />
              <RunCluster />
              <Divider style={{ margin: '0px' }} />
              <Export />
              <ClearCanvas />
            </Toolbar>
          </Section>
        </div>
      </GraphProvider>
    </StudioProvier>
  );
};

export default OnlineVisualizer;
