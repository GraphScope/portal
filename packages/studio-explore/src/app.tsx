import React, { useRef, useState } from 'react';
import { Section, FullScreen, StudioProvier, SegmentedTabs, Icons } from '@graphscope/studio-components';
import {
  Toolbar,
  SwitchEngine,
  PropertiesPanel,
  Canvas,
  StyleSetting,
  //   Prepare,
  ZoomFit,
  ClearStatus,
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
  LayoutSwitch,
  ZoomStatus,
  registerIcons,
  HoverMenu,
} from '@graphscope/studio-graph';

import { ToogleLeftButton, ToogleRightButton } from './components/ToggleButton';
import { Connection, FetchGraph, Searchbar, Statistics, ClusterAnalysis, Next } from './components';
import { BgColorsOutlined, BarChartOutlined } from '@ant-design/icons';
import { Divider, Flex, theme } from 'antd';
import { getDefaultServices } from './services';

interface ExploreProps {
  id?: string;
  services?: any;
}
/** register graph icons */
registerIcons();
const Explore: React.FunctionComponent<ExploreProps> = props => {
  const { id } = props;
  const [services, setServices] = useState(props.services || getDefaultServices());

  const onQuery = async () => {};

  const containerRef = useRef<HTMLDivElement | null>(null);

  return (
    <div ref={containerRef} style={{ position: 'absolute', top: '0px', left: '0px', bottom: '0px', right: '0px' }}>
      <GraphProvider id={id} services={services}>
        <StudioProvier locales={locales}>
          <Section
            splitBorder
            leftSide={
              <SegmentedTabs
                queryKey="left"
                tableHeight={60}
                block
                items={[
                  {
                    key: 'StyleSetting',
                    label: (
                      <Flex vertical gap={0} align="center" style={{ paddingTop: '6px' }}>
                        <BgColorsOutlined style={{ fontSize: 17 }} />
                        StyleSetting
                      </Flex>
                    ),
                    children: <StyleSetting />,
                  },
                  {
                    key: 'Statistics',
                    label: (
                      <Flex vertical gap={0} align="center" style={{ paddingTop: '6px' }}>
                        <BarChartOutlined style={{ fontSize: 17 }} />
                        Statistics
                      </Flex>
                    ),
                    children: <Statistics />,
                  },
                  {
                    key: 'ClusterAnalysis',
                    label: (
                      <Flex vertical gap={0} align="center" style={{ paddingTop: '6px' }}>
                        <Icons.Cluster />
                        ClusterAnalysis
                      </Flex>
                    ),
                    children: <ClusterAnalysis />,
                  },
                ]}
              ></SegmentedTabs>
            }
            rightSide={
              <SegmentedTabs
                queryKey="right"
                tableHeight={60}
                block
                items={[
                  {
                    key: 'Next',
                    label: (
                      <Flex vertical gap={0} align="center" style={{ paddingTop: '6px' }}>
                        <BarChartOutlined style={{ fontSize: 17 }} />
                        Next
                      </Flex>
                    ),
                    children: <Next />,
                  },
                  {
                    key: 'AI Report',
                    label: (
                      <Flex vertical gap={0} align="center" style={{ paddingTop: '6px' }}>
                        <Icons.Cluster />
                        AI Report
                      </Flex>
                    ),
                    children: <ClusterAnalysis />,
                  },
                ]}
              ></SegmentedTabs>
            }
            autoResize={false}
            leftSideStyle={{
              width: '360px',
              boxShadow: 'rgba(0, 0, 0, 0.19) 0px 4px 12px',
              overflow: 'scroll',
            }}
            rightSideStyle={{
              width: '380px',
              boxShadow: 'rgba(0, 0, 0, 0.19) 0px 4px 12px',
              overflowY: 'scroll',
            }}
            defaultCollapsed={{
              leftSide: true,
              rightSide: false,
            }}
          >
            {/* <Prepare data={data} schema={schema} graphId={graphId} /> */}
            <Canvas />
            <BasicInteraction />
            <ClearStatus />
            <FetchGraph />
            <Placeholder />
            <Loading />

            <PropertiesPanel />

            <ZoomStatus />
            {/* <HoverMenu>
              <NeighborQuery />
              <CommonNeighbor  />
              <DeleteLeafNodes />
              <DeleteNode />
            </HoverMenu> */}

            <ContextMenu>
              <NeighborQuery />
              {/* <CommonNeighbor /> */}
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
            <Toolbar style={{ position: 'absolute', top: '20px', left: '20px', right: 'unset' }}>
              <Connection />
              <Divider style={{ margin: '0px' }} />
              <ToogleLeftButton />
              <Divider style={{ margin: '0px' }} />
              <FullScreen containerRef={containerRef} />
              <ZoomFit />
              <Brush />
              <FixedMode />
              <CurvatureLinks />
              <DagreMode />
              <LayoutSwitch />
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
