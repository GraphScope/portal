import React, { useRef, useState } from 'react';
import { Section, FullScreen, useCustomToken, StudioProvier, SegmentedTabs } from '@graphscope/studio-components';
import {
  Toolbar,
  SwitchEngine,
  PropertiesPanel,
  Canvas,
  StyleSetting,
  //   Prepare,
  ZoomFit,
  ClearStatatus,
  RunCluster,
  ContextMenu,
  NeighborQuery,
  DeleteNode,
  CommonNeighbor,
  Brush,
  Loading,
  DeleteLeafNodes,
  Export,
  BasicInteraction,
  FixedMode,
  GraphProvider,
  locales,
  ClearCanvas,
  CurvatureLinks,
  DagreMode,
  Placeholder,
} from '@graphscope/studio-graph';

import { ToogleLeftButton, ToogleRightButton } from './components/ToggleButton';
import { Connection, FetchGraph, Searchbar, Statistics, ClusterAnalysis, Next } from './components';

import { Divider } from 'antd';
import { getDefaultServices } from './services';

interface ExploreProps {
  id?: string;
  services?: any;
}

const Explore: React.FunctionComponent<ExploreProps> = props => {
  const { id } = props;
  const [services, setServices] = useState(props.services || getDefaultServices());

  const onQuery = async () => {};

  const { buttonBackground } = useCustomToken();

  const containerRef = useRef<HTMLDivElement | null>(null);

  return (
    <div ref={containerRef} style={{ position: 'absolute', top: '0px', left: '0px', bottom: '0px', right: '0px' }}>
      <GraphProvider id={id} services={services}>
        <StudioProvier locales={locales}>
          <Section
            splitBorder
            rightSide={
              <PropertiesPanel>
                <Next />
              </PropertiesPanel>
            }
            leftSide={
              <SegmentedTabs
                block
                items={[
                  {
                    key: 'StyleSetting',
                    label: 'StyleSetting',
                    children: <StyleSetting />,
                  },
                  {
                    key: 'Statistics',
                    label: 'Statistics',
                    children: <Statistics />,
                  },
                  {
                    key: 'ClusterAnalysis',
                    label: 'ClusterAnalysis',
                    children: <ClusterAnalysis />,
                  },
                ]}
              ></SegmentedTabs>
            }
            autoResize={false}
            rightSideStyle={{
              width: '360px',
              padding: '12px 12px 12px 18px',
              boxShadow: 'rgba(0, 0, 0, 0.19) 0px 4px 12px',
              overflowY: 'scroll',
            }}
            defaultCollapsed={{
              leftSide: false,
              rightSide: false,
            }}
          >
            {/* <Prepare data={data} schema={schema} graphId={graphId} /> */}
            <Canvas />
            <BasicInteraction />
            <ClearStatatus />
            <FetchGraph />
            <Placeholder />
            <Loading />

            <ContextMenu>
              <NeighborQuery />
              <CommonNeighbor onQuery={onQuery} />
              <DeleteLeafNodes />
              <DeleteNode />
            </ContextMenu>
            <Toolbar
              direction="horizontal"
              style={{ position: 'absolute', top: '20px', left: '80px', width: 500 }}
              noSpace
            >
              <Searchbar />
            </Toolbar>
            <Toolbar
              style={{ position: 'absolute', top: '20px', left: '20px', right: 'unset', background: buttonBackground }}
            >
              {/* <Connection /> */}
              <Divider style={{ margin: '0px' }} />
              <ToogleLeftButton />
              <Divider style={{ margin: '0px' }} />
              <FullScreen containerRef={containerRef} />
              <ZoomFit />
              <Brush />
              <FixedMode />
              <CurvatureLinks />
              <DagreMode />
              <Divider style={{ margin: '0px' }} />
              <SwitchEngine />
              <RunCluster />
              <Export />
              <ClearCanvas />
            </Toolbar>
          </Section>
        </StudioProvier>
      </GraphProvider>
    </div>
  );
};

export default Explore;
