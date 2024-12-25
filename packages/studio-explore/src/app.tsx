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
import { Connection, FetchGraph, Searchbar, Statistics, ClusterAnalysis, Next, Overview } from './components';
import { BgColorsOutlined, BarChartOutlined } from '@ant-design/icons';
import { Divider, Flex, theme, Segmented, Tabs } from 'antd';
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

  const containerRef = useRef<HTMLDivElement | null>(null);
  const { token } = theme.useToken();

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
                tabStyle={{
                  marginBottom: '0px',
                }}
                block
                items={[
                  {
                    key: 'Statistics',
                    label: (
                      <Flex vertical gap={0} align="center" style={{ paddingTop: '6px' }}>
                        <BarChartOutlined style={{ fontSize: 17 }} />
                        Statistics
                      </Flex>
                    ),
                    children: (
                      <Tabs
                        // queryKey="Statistics"
                        // block
                        indicator={{ size: origin => origin - 0, align: 'center' }}
                        items={[
                          {
                            key: 'current',
                            label: (
                              <Flex vertical gap={0} align="center">
                                Current Canvas
                              </Flex>
                            ),
                            children: <Statistics />,
                          },
                          {
                            key: 'global',
                            label: (
                              <Flex vertical gap={0} align="center">
                                Global
                              </Flex>
                            ),
                            children: <Overview />,
                          },
                        ]}
                      />
                    ),
                  },

                  {
                    key: 'Analysis',
                    label: (
                      <Flex vertical gap={0} align="center" style={{ paddingTop: '6px' }}>
                        <Icons.Cluster />
                        Analysis
                      </Flex>
                    ),
                    children: (
                      <SegmentedTabs
                        queryKey="analysis"
                        block
                        items={[
                          {
                            key: 'Style',
                            label: (
                              <Flex vertical gap={0} align="center">
                                Style
                              </Flex>
                            ),
                            children: <StyleSetting />,
                          },
                          {
                            key: 'Layout',
                            label: (
                              <Flex vertical gap={0} align="center">
                                Layout
                              </Flex>
                            ),
                            children: <StyleSetting />,
                          },
                          {
                            key: 'Cluster',
                            label: (
                              <Flex vertical gap={0} align="center">
                                Cluster
                              </Flex>
                            ),
                            children: <ClusterAnalysis />,
                          },
                        ]}
                      />
                    ),
                  },
                  {
                    key: 'StyleSetting',
                    label: (
                      <Flex vertical gap={0} align="center" style={{ paddingTop: '6px' }}>
                        <BgColorsOutlined style={{ fontSize: 17 }} />
                        Report
                      </Flex>
                    ),
                    children: <StyleSetting />,
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
              width: '400px',
              boxShadow: token.boxShadow,
              marginRight: '0px',
              // borderRadius: token.borderRadius,
              overflow: 'scroll',
            }}
            rightSideStyle={{
              width: '380px',
              boxShadow: 'rgba(0, 0, 0, 0.19) 0px 4px 12px',
              overflowY: 'scroll',
            }}
            defaultCollapsed={{
              leftSide: false,
              rightSide: true,
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
              style={{ position: 'absolute', top: '12px', left: '80px', width: 500 }}
              noSpace
            >
              <Searchbar />
            </Toolbar>
            <Toolbar style={{ position: 'absolute', top: '12px', left: '12px', right: 'unset' }}>
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
