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
  LayoutSwitch,
  ZoomStatus,
  registerIcons,
  LayoutSetting,
} from '@graphscope/studio-graph';

import { ToogleLeftButton, ToogleRightButton } from './components/ToggleButton';
import {
  Connection,
  FetchGraph,
  Searchbar,
  Statistics,
  ClusterAnalysis,
  Next,
  Overview,
  FloatTabs,
  Placeholder,
  CypherQuery,
  Copilot,
  RunAI,
  FloatToolbar,
  Report,
} from './components';
import {
  BgColorsOutlined,
  BarChartOutlined,
  InfoCircleOutlined,
  TableOutlined,
  GroupOutlined,
  CodeOutlined,
  CodeTwoTone,
  TabletOutlined,
  BranchesOutlined,
  CopyrightOutlined,
  OpenAIOutlined,
  DeploymentUnitOutlined,
} from '@ant-design/icons';
import { Divider, Flex, theme, Segmented, Tabs, Typography } from 'antd';
import { getDefaultServices } from './services';
import TableView from './components/TableView';
import ExploreLocales from './locales';
import NextQuery from './components/NextQuery';
import FloatContainer from './components/FloatContainer';

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
        <StudioProvier
          locales={{
            'zh-CN': {
              ...locales['zh-CN'],
              ...ExploreLocales['zh-CN'],
            },
            'en-US': {
              ...locales['en-US'],
              ...ExploreLocales['en-US'],
            },
          }}
        >
          <Section
            splitBorder
            // rightSide={
            //   <SegmentedTabs
            //     queryKey="right"
            //     tableHeight={60}
            //     block
            //     items={[
            //       {
            //         key: 'Next',
            //         label: (
            //           <Flex vertical gap={0} align="center" style={{ paddingTop: '6px' }}>
            //             <BarChartOutlined style={{ fontSize: 17 }} />
            //             Next Query
            //           </Flex>
            //         ),
            //         children: <Next />,
            //       },
            //     ]}
            //   ></SegmentedTabs>
            // }
            autoResize={false}
            leftSideStyle={{
              width: '400px',
              boxShadow: token.boxShadow,
              marginRight: '0px',
              // borderRadius: token.borderRadius,
              overflow: 'scroll',
            }}
            rightSideStyle={{
              width: '360px',
              boxShadow: 'rgba(0, 0, 0, 0.19) 0px 4px 12px',
              overflowY: 'scroll',
            }}
            defaultCollapsed={{
              leftSide: true,
              rightSide: true,
            }}
          >
            <Canvas />
            <BasicInteraction />

            <FetchGraph />
            <Placeholder />
            <Loading />
            <PropertiesPanel style={{ right: '12px' }} />
            <FloatTabs
              searchbar={<Searchbar />}
              direction="vertical"
              items={[
                {
                  label: <Typography.Title level={3}>Next Query</Typography.Title>,
                  icon: <DeploymentUnitOutlined style={{ fontSize: 17 }} />,
                  children: <Next />,
                  key: 'NextQuery',
                },
                {
                  label: <Typography.Title level={3}>Statistics Analysis</Typography.Title>,
                  icon: <BarChartOutlined style={{ fontSize: 17 }} />,
                  children: (
                    <Flex vertical>
                      <Statistics />
                      <TableView />
                    </Flex>
                  ),
                  key: 'Statistics',
                },
                // {
                //   label: <Typography.Title level={3}>Table View</Typography.Title>,
                //   icon: <TableOutlined />,
                //   children: <TableView />,
                //   key: 'TableView',
                // },
                {
                  label: <Typography.Title level={3}>Cluster Analysis</Typography.Title>,
                  icon: <CopyrightOutlined />,
                  children: <ClusterAnalysis />,
                  key: 'ClusterAnalysis',
                },

                {
                  label: <Typography.Title level={3}>Cypher Query</Typography.Title>,
                  icon: <CodeOutlined />,
                  children: <CypherQuery />,
                  key: 'CypherQuery',
                },
                {
                  label: <Typography.Title level={3}>Report</Typography.Title>,
                  icon: <OpenAIOutlined />,
                  children: <Report />,
                  key: 'Report',
                },

                {
                  label: <Typography.Title level={3}>Style Setting</Typography.Title>,
                  icon: <BgColorsOutlined />,
                  children: <StyleSetting />,
                  key: 'StyleSetting',
                },
                {
                  label: <Typography.Title level={3}>Layout Setting</Typography.Title>,
                  icon: <BranchesOutlined />,
                  children: <LayoutSetting />,
                  key: 'LayoutSetting',
                },
              ]}
              tools={
                <>
                  <Connection />
                  {/* <Divider style={{ margin: '0px' }} />
                  <CurvatureLinks /> */}
                  <Divider style={{ margin: '0px' }} />
                  <SwitchEngine />
                  <RunCluster />
                  <Export />
                </>
              }
            ></FloatTabs>

            {/* <HoverMenu>
              <NeighborQuery />
              <CommonNeighbor  />
              <DeleteLeafNodes />
              <DeleteNode />
            </HoverMenu> */}

            <ContextMenu>
              {/* <RunAI /> */}
              <NextQuery />
              <NeighborQuery />
              {/* <CommonNeighbor /> */}
              <DeleteLeafNodes />
              <DeleteNode />
            </ContextMenu>
            <FloatContainer position="bottom">
              <ZoomStatus
                style={{
                  opacity: 0.5,
                }}
              />
            </FloatContainer>

            <FloatToolbar>
              {/* <ToogleRightButton /> */}
              {/* <Divider style={{ margin: '0px' }} /> */}
              <Brush />
              <FixedMode />
              <ZoomFit />
              <FullScreen containerRef={containerRef} />
              <Divider style={{ margin: '0px' }} />
              <ClearCanvas />
              <ClearStatus trigger="button" />
            </FloatToolbar>
          </Section>
        </StudioProvier>
      </GraphProvider>
    </div>
  );
};

export default Explore;
