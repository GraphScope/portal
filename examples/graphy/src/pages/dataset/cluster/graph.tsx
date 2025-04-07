import React, { useRef } from 'react';

import { Button } from 'antd';
import { FilterOutlined } from '@ant-design/icons';

import {
  Section,
  useSection,
  Icons,
  FullScreen,
  SegmentedTabs,
  ThemeProvider,
  LocaleProvider,
} from '@graphscope/studio-components';
import {
  Toolbar,
  SwitchEngine,
  PropertiesPanel,
  Canvas,
  StyleSetting,
  ZoomFit,
  ClearStatus,
  Loading,
  BasicInteraction,
  GraphProvider,
  locales,
} from '@graphscope/studio-graph';

import { Workflow, FetchGraph } from './components';

import { Divider } from 'antd';

interface QueryGraphProps {}

const ToogleButton = () => {
  const { toggleLeftSide } = useSection();
  return (
    <div>
      <Button icon={<Icons.Sidebar />} onClick={() => toggleLeftSide()} type="text" />
    </div>
  );
};

const ClusterGraph: React.FunctionComponent<QueryGraphProps> = props => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const workflows = [
    {
      key: 'Current extraction progress',
      label: 'Current extraction progress',
      icon: <FilterOutlined color="#000" />,
      children: <FetchGraph />,
    },
    // {
    //   key: 'Cluster',
    //   label: 'Cluster entity',
    //   icon: <Icons.Cluster />,
    //   children: <FetchCluster />,
    // },
    // {
    //   key: 'Filter cluster',
    //   label: 'Filter cluster',
    //   icon: <FilterOutlined color="#000" />,
    //   children: <FilterCluster />,
    // },
    // {
    //   key: 'Summarize',
    //   label: 'LLM Summarize',
    //   icon: <BookOutlined color="#000" />,
    //   children: <Summarize />,
    // },
  ];
  const items = [
    {
      key: 'Workflow',
      label: 'Workflow',
      value: 'Workflow',
      children: <Workflow items={workflows} type="timeline" />,
    },
    {
      key: 'Style',
      label: 'Style',
      value: 'Style',
      children: <StyleSetting />,
    },
  ];
  return (
    <div
      style={{
        background: '#fff',
        borderRadius: '8px',
        height: '100%',
        position: 'absolute',
        top: '0px',
        left: '0px',
        right: '0px',
        bottom: '0px',
      }}
      ref={containerRef}
    >
      <LocaleProvider locales={locales}>
        <ThemeProvider>
          <GraphProvider id="cluster-graph">
            <Section
              splitBorder
              rightSide={<SegmentedTabs items={items} block />}
              autoResize={false}
              rightSideStyle={{
                width: '350px',
              }}
              defaultCollapsed={{
                leftSide: true,
                rightSide: false,
              }}
            >
              <Canvas />
              <ClearStatus />

              <BasicInteraction />
              <PropertiesPanel />
              <Loading />
              <Toolbar style={{ position: 'absolute', top: '20px', right: '20px', left: 'unset' }}>
                <ToogleButton />
                <Divider style={{ margin: '0px' }} />
                <SwitchEngine />
                <ZoomFit />
                {/* <RunCluster /> */}
                <FullScreen containerRef={containerRef} />
              </Toolbar>
            </Section>
          </GraphProvider>
        </ThemeProvider>
      </LocaleProvider>
    </div>
  );
};

export default ClusterGraph;
