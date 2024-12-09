import React, { useRef, useState } from 'react';
import {
  Section,
  FullScreen,
  useCustomToken,
  StudioProvier,
  SegmentedTabs,
  Icons,
} from '@graphscope/studio-components';
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
  LayoutSwitch,
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

const Explore: React.FunctionComponent<ExploreProps> = props => {
  const { id } = props;
  const [services, setServices] = useState(props.services || getDefaultServices());

  const onQuery = async () => {};

  const { buttonBackground } = useCustomToken();

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
            autoResize={false}
            leftSideStyle={{
              width: '380px',
              padding: '0px 12px',
              boxShadow: 'rgba(0, 0, 0, 0.19) 0px 4px 12px',
              overflow: 'scroll',
              background: token.colorBgContainer,
            }}
            // rightSideStyle={{
            //   width: '360px',
            //   padding: '12px 12px 12px 18px',
            //   boxShadow: 'rgba(0, 0, 0, 0.19) 0px 4px 12px',
            //   overflowY: 'scroll',
            // }}
            defaultCollapsed={{
              leftSide: false,
              rightSide: true,
            }}
          >
            {/* <Prepare data={data} schema={schema} graphId={graphId} /> */}
            <Canvas />
            <BasicInteraction />
            <ClearStatatus />
            <FetchGraph />
            <Placeholder />
            <Loading />
            <Next />
            <PropertiesPanel />

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
